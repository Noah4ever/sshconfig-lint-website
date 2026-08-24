import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { InfoPage } from '../../../components/InfoPage';
import { copy, isLocale, locales } from '../../../lib/i18n';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: `${copy[locale].legal} | sshconfig-lint`,
    description: copy[locale].legalIntro,
    alternates: {
      canonical: `/${locale}/legal`,
      languages: Object.fromEntries([
        ...locales.map((item) => [item, `/${item}/legal`]),
        ['x-default', '/en/legal'],
      ]),
    },
    robots: { index: true, follow: true },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const text = copy[locale];
  return (
    <InfoPage locale={locale} title={text.legalTitle}>
      <div className="info-prose">
        <h2>Noah Thiering</h2>
        <p>{text.legalIntro}</p>
        <p><a href="https://thiering.org">thiering.org</a></p>
      </div>
    </InfoPage>
  );
}
