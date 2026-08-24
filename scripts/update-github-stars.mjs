import { readFile, writeFile } from 'node:fs/promises';

const target = new URL('../lib/github-stars.generated.ts', import.meta.url);
const currentSource = await readFile(target, 'utf8');
const currentStars = Number(currentSource.match(/githubStars = (\d+)/)?.[1] ?? 16);

try {
  const response = await fetch('https://api.github.com/repos/Noah4ever/sshconfig-lint', {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'sshconfig-lint-web-build',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    signal: AbortSignal.timeout(3000),
  });

  if (response.ok) {
    const repository = await response.json();
    const stars = repository.stargazers_count;
    if (Number.isInteger(stars) && stars >= 0 && stars !== currentStars) {
      await writeFile(target, `// Updated automatically before each production build.\nexport const githubStars = ${stars};\n`);
    }
  }
} catch {
  // Keep the last verified value when GitHub is unavailable during a build.
}
