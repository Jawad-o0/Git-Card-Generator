import { useState, useRef, useCallback } from 'react';
import { computePersonality } from '../lib/computePersonality';

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function safeFetch(url, headers, signal, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, { headers, signal });
    if (res.ok) return res;
    if ((res.status === 403 || res.status === 429) && attempt < retries) {
      const retryAfter = parseInt(res.headers.get('Retry-After') || '10', 10);
      await new Promise(r => setTimeout(r, Math.min(retryAfter * 1000, 30_000) * 2 ** attempt));
      continue;
    }
    if (res.status === 404) throw new Error('User not found');
    if (res.status === 403 || res.status === 429)
      throw new Error('API rate limit exceeded. Provide a token or try later.');
    throw new Error(`GitHub API error: ${res.status}`);
  }
}

async function batchFetch(urls, headers, signal, concurrency = 5) {
  const results = [];
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = await Promise.all(
      urls.slice(i, i + concurrency).map(url =>
        fetch(url, { headers, signal })
          .then(r => (r.ok ? r.json() : {}))
          .catch(() => ({}))
      )
    );
    results.push(...batch);
  }
  return results;
}

// ─── Pinned repo scraping ─────────────────────────────────────────────────────
//
// GitHub's GraphQL API requires a token.
// Without one we scrape the public profile page via CORS proxies.
//
// Three proxies are tried in order — if all fail we return null
// and the UI will fall back to showing top repos by stars.

const CORS_PROXIES = [
  (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

/**
 * Parse pinned repo cards from a GitHub profile HTML string.
 * Returns an array of repo objects (may be empty).
 */
function parsePinnedFromHtml(html, username) {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  // The pinned container GitHub uses
  const container =
    doc.querySelector('.js-pinned-items-reorder-container') ||
    doc.querySelector('[data-testid="profile-pinned-items"]');

  if (!container) return [];

  const items = container.querySelectorAll('li');
  if (!items.length) return [];

  const pinned = [];

  items.forEach(li => {
    // ── Name ──
    // GitHub uses <span class="repo"> inside an <a>
    const anchor = li.querySelector('a[href*="/"]');
    const nameEl = li.querySelector('span.repo, .pinned-item-list-item-content a');
    const rawName = nameEl?.textContent?.trim() ?? anchor?.getAttribute('href')?.split('/').pop();
    if (!rawName) return;

    const name = rawName.trim();
    // Derive owner from the anchor href: "/owner/repo"
    const href = anchor?.getAttribute('href') ?? '';
    const parts = href.replace(/^\//, '').split('/');
    const owner = parts.length >= 2 ? parts[0] : username;

    // ── Description ──
    const descEl = li.querySelector('p.pinned-item-desc, p.color-fg-muted, .pinned-item-list-item-content p');
    const description = descEl?.textContent?.trim() || null;

    // ── Stars ──
    const starsEl = li.querySelector('a[href$="/stargazers"]');
    const stargazerCount = parseInt(starsEl?.textContent?.trim().replace(/[^0-9]/g, '') || '0', 10);

    // ── Forks ──
    const forksEl = li.querySelector('a[href$="/forks"], a[href*="/network"]');
    const forkCount = parseInt(forksEl?.textContent?.trim().replace(/[^0-9]/g, '') || '0', 10);

    // ── Language ──
    const langEl = li.querySelector('[itemprop="programmingLanguage"], .color-fg-muted span:not(:has(*))');
    const langName = langEl?.textContent?.trim() || null;

    pinned.push({
      name,
      description,
      stargazerCount,
      forkCount,
      url: `https://github.com/${owner}/${name}`,
      primaryLanguage: langName ? { name: langName } : null,
      _source: 'scraped',
    });
  });

  return pinned;
}

/**
 * Try to get HTML from a URL via multiple CORS proxies.
 * Returns the HTML string or null if every proxy fails.
 */
async function fetchViaProxy(targetUrl, signal) {
  for (const makeProxy of CORS_PROXIES) {
    try {
      const proxyUrl = makeProxy(targetUrl);
      const res = await fetch(proxyUrl, { signal });
      if (!res.ok) continue;

      // allorigins returns { contents: "..." }
      // codetabs and corsproxy return raw HTML directly
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        const html = json?.contents ?? json?.data ?? null;
        if (html && html.includes('js-pinned-items')) return html;
      } else {
        const html = await res.text();
        if (html && html.includes('js-pinned-items')) return html;
      }
    } catch {
      // try next proxy
    }
  }
  return null;
}

async function fetchPinnedRepos(username, headers, signal) {
  // ── GraphQL (token available — most reliable) ────────────────────────────
  if (headers.Authorization) {
    const query = `
      query {
        user(login: "${username}") {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                stargazerCount
                forkCount
                url
                primaryLanguage { name }
              }
            }
          }
        }
      }
    `;
    try {
      const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
        signal,
      });
      if (res.ok) {
        const data = await res.json();
        const nodes = data?.data?.user?.pinnedItems?.nodes ?? [];
        if (nodes.length > 0) return nodes;
        // Empty result from GraphQL — fall through to scrape
      }
    } catch { /* fall through */ }
  }

  // ── Scrape via CORS proxy (no token) ─────────────────────────────────────
  try {
    const profileUrl = `https://github.com/${encodeURIComponent(username)}`;
    const html = await fetchViaProxy(profileUrl, signal);
    if (!html) return null;

    const pinned = parsePinnedFromHtml(html, username);
    return pinned.length > 0 ? pinned : null;
  } catch {
    return null;
  }
}

async function fetchOrgs(username, headers, signal) {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/orgs`,
      { headers, signal }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGitHubData() {
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);      // ← exposed for fallback
  const [personality, setPersonality] = useState(null);
  const [events, setEvents] = useState(null);
  const [orgs, setOrgs] = useState(null);
  const [pinnedRepos, setPinnedRepos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cache = useRef({});
  const abortRef = useRef(null);

  const clearCache = useCallback((username) => {
    if (username) {
      const k = username.trim().toLowerCase();
      delete cache.current[`${k}:true`];
      delete cache.current[`${k}:false`];
    } else {
      cache.current = {};
    }
  }, []);

  const fetchGitHubData = useCallback(async (username, onAnnounce, token = '') => {
    const rawKey = username.trim().toLowerCase();
    const cacheKey = `${rawKey}:${!!token}`;

    if (!rawKey) {
      setError('Please enter a username');
      onAnnounce?.('Error: Please enter a username');
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const { signal } = controller;

    if (cache.current[cacheKey]) {
      const c = cache.current[cacheKey];
      setUserData(c.user);
      setRepos(c.repos);
      setPersonality(c.personality);
      setEvents(c.events);
      setOrgs(c.orgs);
      setPinnedRepos(c.pinnedRepos);
      setError('');
      onAnnounce?.(`Loaded cached profile for ${c.user.login}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // 1. Core user
      const userRes = await safeFetch(`https://api.github.com/users/${rawKey}`, headers, signal);
      const user = await userRes.json();

      // 2. Repos
      const reposRes = await safeFetch(
        `https://api.github.com/users/${rawKey}/repos?per_page=100&sort=updated`,
        headers, signal
      );
      const repos = await reposRes.json();

      // 3. Language bytes (token only, batched 5 at a time)
      let langBytes = null;
      if (token) {
        try {
          const langResults = await batchFetch(
            repos.slice(0, 30).map(r => `https://api.github.com/repos/${r.full_name}/languages`),
            headers, signal, 5
          );
          const aggregated = {};
          langResults.forEach(repoLangs =>
            Object.entries(repoLangs).forEach(([lang, bytes]) => {
              aggregated[lang] = (aggregated[lang] || 0) + bytes;
            })
          );
          if (Object.keys(aggregated).length > 0) langBytes = aggregated;
        } catch { /* non-critical */ }
      }

      // 4. Events
      let fetchedEvents = null;
      try {
        const eventsRes = await fetch(
          `https://api.github.com/users/${rawKey}/events/public?per_page=100`,
          { headers, signal }
        );
        if (eventsRes.ok) fetchedEvents = await eventsRes.json();
      } catch { /* non-critical */ }

      // 5. Orgs (public only — GitHub limitation)
      const fetchedOrgs = await fetchOrgs(rawKey, headers, signal);

      // 6. Pinned repos — GraphQL if token, scrape if not, null if both fail
      const fetchedPinned = await fetchPinnedRepos(rawKey, headers, signal);

      if (signal.aborted) return;

      const personalityData = computePersonality(user, repos, langBytes, fetchedEvents, fetchedOrgs);

      setUserData(user);
      setRepos(repos);
      setPersonality(personalityData);
      setEvents(fetchedEvents);
      setOrgs(fetchedOrgs);
      setPinnedRepos(fetchedPinned);
      setError('');

      cache.current[cacheKey] = {
        user, repos, personality: personalityData,
        events: fetchedEvents, orgs: fetchedOrgs, pinnedRepos: fetchedPinned,
      };

      onAnnounce?.(`Successfully loaded profile for ${user.login}`);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
      onAnnounce?.(`Error: ${err.message}`);
      setUserData(null);
      setRepos([]);
      setPersonality(null);
      setEvents(null);
      setOrgs(null);
      setPinnedRepos(null);
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);

  return {
    userData, repos, personality,
    events, orgs, pinnedRepos,
    loading, error,
    fetchGitHubData, clearCache,
  };
}
