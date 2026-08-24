import type { MetadataRoute } from 'next';
import { locales } from '../lib/i18n';
import { ruleDocs } from '../lib/rules';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sshconfig-lint.apps.thiering.org';
  return locales.flatMap((locale) => [
    { url: `${origin}/${locale}`, changeFrequency: 'monthly' as const, priority: 1 },
    { url: `${origin}/${locale}/privacy`, changeFrequency: 'yearly' as const, priority: 0.2 },
    { url: `${origin}/${locale}/rules`, changeFrequency: 'monthly' as const, priority: 0.75 },
    ...ruleDocs.map((rule) => ({
      url: `${origin}/${locale}/rules/${rule.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
  ]);
}
