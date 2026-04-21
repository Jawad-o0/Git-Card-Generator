import { useState, useRef, useCallback } from 'react';
import { computePersonality } from '../lib/computePersonality';
export function useGitHubData() {
  const [userData, setUserData] = useState(null);
  const [personality, setPersonality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const cache = useRef({});
  const fetchGitHubData = useCallback(async (username, onAnnounce, token = '') => {
    const key = username.trim().toLowerCase();
    if (!key) {
      setError('Please enter a username');
      onAnnounce?.('Error: Please enter a username');
      return;
    }
    if (cache.current[key]) {
      const cached = cache.current[key];
      setUserData(cached.user);
      setPersonality(cached.personality);
      setError('');
      onAnnounce?.(`Loaded cached profile for ${cached.user.login}`);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const userRes = await fetch(`https://api.github.com/users/${key}`, { headers });
      if (!userRes.ok) {
        if (userRes.status === 404) throw new Error('User not found');
        if (userRes.status === 403 || userRes.status === 429) throw new Error('API Rate limit exceeded. Provide a token or try later.');
        throw new Error(`GitHub API error: ${userRes.status}`);
      }
      const user = await userRes.json();
      const reposRes = await fetch(
        `https://api.github.com/users/${key}/repos?per_page=100&sort=updated`,
        { headers }
      );
      if (!reposRes.ok) {
        if (reposRes.status === 403 || reposRes.status === 429) throw new Error('API Rate limit exceeded. Provide a token or try later.');
        throw new Error('Failed to fetch repositories');
      }
      const repos = await reposRes.json();
      let langBytes = null;
      if (token) {
        try {
          const top30 = repos.slice(0, 30);
          const langResults = await Promise.all(
            top30.map(repo =>
              fetch(`https://api.github.com/repos/${repo.full_name}/languages`, { headers })
                .then(r => (r.ok ? r.json() : {}))
                .catch(() => ({}))
            )
          );
          const aggregated = {};
          langResults.forEach(repoLangs => {
            Object.entries(repoLangs).forEach(([lang, bytes]) => {
              aggregated[lang] = (aggregated[lang] || 0) + bytes;
            });
          });
          if (Object.keys(aggregated).length > 0) langBytes = aggregated;
        } catch {
        }
      }
      const personalityData = computePersonality(user, repos, langBytes);
      setUserData(user);
      setPersonality(personalityData);
      cache.current[key] = { user, personality: personalityData };
      onAnnounce?.(`Successfully loaded profile for ${user.login}`);
    } catch (err) {
      setError(err.message);
      onAnnounce?.(`Error: ${err.message}`);
      setUserData(null);
      setPersonality(null);
    } finally {
      setLoading(false);
    }
  }, []);
  return { userData, personality, loading, error, fetchGitHubData };
}
