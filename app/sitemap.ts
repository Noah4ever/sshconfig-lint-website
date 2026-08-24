import type { MetadataRoute } from 'next';
import { locales } from '../lib/i18n';
import { ruleDocs } from '../lib/rules';
import { guides } from '../lib/guides';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sshconfig-lint.apps.thiering.org';
  const languages = (path: string) => Object.fromEntries([
    ...locales.map((locale) => [locale, `${origin}/${locale}${path}`]),
    ['x-default', `${origin}/en${path}`],
  ]);
  const paths = [
    '',
    '/rules',
    ...ruleDocs.map((rule) => `/rules/${rule.slug}`),
    '/guides',
    ...guides.map((guide) => `/guides/${guide.slug}`),
    '/learn',
    '/learn/classroom',
    '/editor',
    '/ci',
    '/privacy',
    '/legal',
  ];

  return locales.flatMap((locale) => paths.map((path) => ({
    url: `${origin}/${locale}${path}`,
    alternates: { languages: languages(path) },
  })));
}
