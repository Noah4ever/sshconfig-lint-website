import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SitePage } from '../../components/SitePage';
import { githubStars } from '../../lib/github-stars.generated';
import { isLocale, locales } from '../../lib/i18n';

const descriptions = {
  en: 'Free SSH config linter and OpenSSH checker. Find duplicate hosts, unsafe options, weak algorithms, and ordering mistakes locally in your browser.',
  de: 'Kostenloser SSH-Config-Linter und OpenSSH-Checker. Finde doppelte Hosts, unsichere Optionen, schwache Algorithmen und Reihenfolgefehler lokal im Browser.',
  fr: 'Linter de configuration SSH et vérificateur OpenSSH gratuit. Repérez les hôtes dupliqués, options risquées, algorithmes faibles et erreurs d’ordre.',
  es: 'Linter de configuración SSH y comprobador OpenSSH gratuito. Detecta hosts duplicados, opciones inseguras, algoritmos débiles y errores de orden.',
};

const titles = {
  en: 'SSH Config Linter and OpenSSH Checker | sshconfig-lint',
  de: 'SSH-Config-Linter und OpenSSH-Checker | sshconfig-lint',
  fr: 'Linter de configuration SSH et OpenSSH | sshconfig-lint',
  es: 'Linter de configuración SSH y OpenSSH | sshconfig-lint',
};

const openGraphLocales = { en: 'en_US', de: 'de_DE', fr: 'fr_FR', es: 'es_ES' };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries([
        ...locales.map((item) => [item, `/${item}`]),
        ['x-default', '/en'],
      ]),
    },
    openGraph: {
      type: 'website',
      siteName: 'sshconfig-lint',
      title: titles[locale],
      description: descriptions[locale],
      locale: openGraphLocales[locale],
      alternateLocale: locales.filter((item) => item !== locale).map((item) => openGraphLocales[item]),
      url: `/${locale}`,
      images: [{ url: '/og.png', width: 1200, height: 630, alt: 'sshconfig-lint browser checker' }],
    },
    twitter: { card: 'summary_large_image', title: titles[locale], description: descriptions[locale], images: ['/og.png'] },
  };
}

export default async function LocalizedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SitePage locale={locale} stars={githubStars} />;
}
