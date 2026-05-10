/**
 * computePersonality
 *
 * Derives a rich developer persona from GitHub API data.
 *
 * @param {object}      user       – /users/{login} response
 * @param {object[]}    repos      – /users/{login}/repos response
 * @param {object|null} langBytes  – aggregated language bytes (token-only)
 * @param {object[]|null} events   – /users/{login}/events/public response
 * @param {object[]|null} orgs     – /users/{login}/orgs response
 */
export function computePersonality(
  user,
  repos,
  langBytes = null,
  events = null,
  orgs = null
) {

  const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);

  let topLanguages = [];
  let dataAccuracy = 'repo-count';

  if (langBytes && Object.keys(langBytes).length > 0) {
    dataAccuracy = 'bytes';
    const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0);
    topLanguages = Object.entries(langBytes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, bytes]) => ({
        name,
        count: bytes,
        percentage: Math.round((bytes / totalBytes) * 100),
      }));
  } else {
    const langCount = {};
    repos.forEach(r => {
      const key = r.language || 'Other';
      langCount[key] = (langCount[key] || 0) + 1;
    });
    const total = Object.values(langCount).reduce((a, b) => a + b, 0);
    topLanguages = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100),
      }));
  }

  const created = new Date(user.created_at);
  const accountAge = Math.max(
    1,
    Math.floor((Date.now() - created) / (365.25 * 24 * 60 * 60 * 1000))
  );

  let activityProfile = null;

  if (Array.isArray(events) && events.length > 0) {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recent = events.filter(
      e => new Date(e.created_at).getTime() > thirtyDaysAgo
    );

    
    const typeCounts = {};
    recent.forEach(e => {
      typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
    });

    const pushCount = typeCounts['PushEvent'] || 0;
    const prCount = typeCounts['PullRequestEvent'] || 0;
    const reviewCount = typeCounts['PullRequestReviewEvent'] || 0;
    const issueCount = typeCounts['IssuesEvent'] || 0;
    const forkCount = typeCounts['ForkEvent'] || 0;
    const total = recent.length;

    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    recent.forEach(e => dayCounts[new Date(e.created_at).getDay()]++);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const mostActiveDay = dayNames[dayCounts.indexOf(Math.max(...dayCounts))];

    const lastEventDate = events[0]?.created_at
      ? new Date(events[0].created_at)
      : null;
    const hoursSinceLastEvent = lastEventDate
      ? Math.floor((Date.now() - lastEventDate.getTime()) / (1000 * 60 * 60))
      : null;

    const totalCommits = events
      .filter(e => e.type === 'PushEvent')
      .reduce((acc, e) => acc + (e.payload?.commits?.length || 0), 0);

    activityProfile = {
      totalEvents: total,
      pushCount,
      prCount,
      reviewCount,
      issueCount,
      forkCount,
      mostActiveDay,
      lastEventDate,
      hoursSinceLastEvent,
      totalCommits,
      
      pushPct: total ? Math.round((pushCount / total) * 100) : 0,
      prPct: total ? Math.round((prCount / total) * 100) : 0,
      reviewPct: total ? Math.round((reviewCount / total) * 100) : 0,
    };
  }

  const orgCount = Array.isArray(orgs) ? orgs.length : 0;

  const badges = [];

  if (user.followers > 5000) badges.push({ title: 'VISIONARY' });
  else if (user.followers > 1000) badges.push({ title: 'AUTHORITY' });
  else if (user.followers > 100) badges.push({ title: 'HIGH POTENTIAL' });

  if (user.public_repos > 50) badges.push({ title: 'INDUSTRIALIST' });
  else if (user.public_repos > 15) badges.push({ title: 'CORE CONTRIBUTOR' });

  if (totalStars > 5000) badges.push({ title: 'TITAN' });
  else if (totalStars > 500) badges.push({ title: 'ELITE' });

  if (accountAge > 10) badges.push({ title: 'FOUNDING MEMBER' });
  else if (accountAge > 5) badges.push({ title: 'SENIOR ENGINEER' });

  if (activityProfile) {
    if (activityProfile.totalCommits > 200) badges.push({ title: 'ON FIRE' });
    else if (activityProfile.totalCommits > 50) badges.push({ title: 'ACTIVE BUILDER' });

    if (activityProfile.reviewCount > 10) badges.push({ title: 'CODE REVIEWER' });
    if (activityProfile.prCount > 10) badges.push({ title: 'COLLABORATOR' });
  }

  if (orgCount > 5) badges.push({ title: 'NETWORKED' });
  else if (orgCount > 2) badges.push({ title: 'TEAM PLAYER' });

  let archetype = 'EXPLORER';
  if (totalStars > 1000 && user.followers > 500) archetype = 'LUMINARY';
  else if (user.public_repos > 40 && accountAge > 6) archetype = 'ARCHITECT';
  else if (accountAge > 8) archetype = 'VETERAN';
  else if (topLanguages.length > 2) archetype = 'POLYGLOT';
  else if (totalStars > 100) archetype = 'RISING STAR';

  return {
    badges: badges.length ? badges.slice(0, 4) : [{ title: 'PIONEER' }],
    archetype,
    totalStars,
    languages: topLanguages.length,
    topLanguages,
    totalRepos: user.public_repos,
    accountAge,
    dataAccuracy,
    activityProfile, 
    orgCount,        
  };
}
