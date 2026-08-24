import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sshconfig-lint.thiering.org';
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${origin}/sitemap.xml` };
}
