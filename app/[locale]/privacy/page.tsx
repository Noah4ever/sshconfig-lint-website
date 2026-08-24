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
    title: `${copy[locale].privacy} | sshconfig-lint`,
    description: copy[locale].privacyBody[0],
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: Object.fromEntries([
        ...locales.map((item) => [item, `/${item}/privacy`]),
        ['x-default', '/en/privacy'],
      ]),
    },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const text = copy[locale];
  return (
    <InfoPage locale={locale} title={text.privacyTitle}>
      <div className="info-prose">{text.privacyBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <dl className="privacy-facts">
        {text.privacyFacts.map((fact) => <div key={fact.title}><dt>{fact.title}</dt><dd>{fact.text}</dd></div>)}
      </dl>
    </InfoPage>
  );
}
