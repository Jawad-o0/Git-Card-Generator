export function computePersonality(user, repos, langBytes = null) {
  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
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
        percentage: Math.round((bytes / totalBytes) * 100)
      }));
  } else {
    const langCount = {};
    repos.forEach(repo => {
      if (repo.language) langCount[repo.language] = (langCount[repo.language] || 0) + 1;
      else langCount['Other'] = (langCount['Other'] || 0) + 1;
    });
    const totalReposWithLang = Object.values(langCount).reduce((a, b) => a + b, 0);
    topLanguages = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalReposWithLang) * 100)
      }));
  }
  const created = new Date(user.created_at);
  const accountAge = Math.max(1, Math.floor((Date.now() - created) / (365.25 * 24 * 60 * 60 * 1000)));
  const badges = [];
  if (user.followers > 5000) badges.push({ title: 'Visionary', emoji: '👑' });
  else if (user.followers > 1000) badges.push({ title: 'Authority', emoji: '🌟' });
  else if (user.followers > 100) badges.push({ title: 'High Potential', emoji: '🌱' });
  if (user.public_repos > 50) badges.push({ title: 'Industrialist', emoji: '📦' });
  else if (user.public_repos > 15) badges.push({ title: 'Core Contributor', emoji: '🛠️' });
  if (totalStars > 5000) badges.push({ title: 'Titan', emoji: '⭐' });
  else if (totalStars > 500) badges.push({ title: 'Elite', emoji: '✨' });
  if (accountAge > 10) badges.push({ title: 'Founding Member', emoji: '🛡️' });
  else if (accountAge > 5) badges.push({ title: 'Senior Engineer', emoji: '🧭' });
  let archetype = 'Explorer';
  if (totalStars > 1000 && user.followers > 500) archetype = 'Luminary';
  else if (user.public_repos > 40 && accountAge > 6) archetype = 'Architect';
  else if (accountAge > 8) archetype = 'Veteran';
  else if (topLanguages.length > 2) archetype = 'Polyglot';
  else if (totalStars > 100) archetype = 'Rising Star';
  return {
    badges: badges.length ? badges.slice(0, 4) : [{ title: 'Pioneer', emoji: '🚀' }],
    archetype,
    totalStars,
    languages: topLanguages.length,
    topLanguages,
    totalRepos: user.public_repos,
    accountAge,
    dataAccuracy
  };
}
