import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { locales } from '../lib/i18n';

export default async function Home() {
  const languageHeader = (await headers()).get('accept-language') ?? '';
  const preferences = languageHeader
    .split(',')
    .map((entry) => {
      const [tag, quality] = entry.trim().toLowerCase().split(';q=');
      return { tag: tag.split('-')[0], quality: quality ? Number(quality) : 1 };
    })
    .filter((entry) => Number.isFinite(entry.quality))
    .sort((a, b) => b.quality - a.quality);
  const preferred = preferences.find((entry) => locales.includes(entry.tag as (typeof locales)[number]));
  redirect(`/${preferred?.tag ?? 'en'}`);
}
