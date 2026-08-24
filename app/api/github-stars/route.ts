import { githubStars } from '../../../lib/github-stars.generated';

export const revalidate = 300;

const cacheHeaders = {
  'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600',
};

export async function GET() {
  try {
    const response = await fetch('https://api.github.com/repos/Noah4ever/sshconfig-lint', {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'sshconfig-lint-web',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

    const repository: unknown = await response.json();
    const stars = typeof repository === 'object' && repository !== null && 'stargazers_count' in repository
      ? Number(repository.stargazers_count)
      : Number.NaN;
    if (!Number.isInteger(stars) || stars < 0) throw new Error('Invalid GitHub response');

    return Response.json({ stars }, { headers: cacheHeaders });
  } catch {
    return Response.json({ stars: githubStars }, { headers: cacheHeaders });
  }
}
