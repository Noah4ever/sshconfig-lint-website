import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SitePage } from '../../components/SitePage';
import { githubStars } from '../../lib/github-stars.generated';
import { copy, isLocale, locales } from '../../lib/i18n';

const descriptions = {
  en: 'Check an OpenSSH client configuration for duplicate hosts, unsafe options, weak algorithms, and ordering mistakes. Private and local in your browser.',
  de: 'Prüfe eine OpenSSH Client-Konfiguration auf doppelte Hosts, unsichere Optionen, schwache Algorithmen und problematische Reihenfolgen. Lokal im Browser.',
  fr: 'Vérifiez une configuration client OpenSSH pour repérer les hôtes dupliqués, options risquées, algorithmes faibles et problèmes d’ordre.',
  es: 'Comprueba una configuración cliente OpenSSH para detectar hosts duplicados, opciones inseguras, algoritmos débiles y problemas de orden.',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: `${copy[locale].title} | sshconfig-lint`,
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries([
        ...locales.map((item) => [item, `/${item}`]),
        ['x-default', '/en'],
      ]),
    },
    openGraph: { title: `sshconfig-lint | ${copy[locale].title}`, description: descriptions[locale], locale },
  };
}

export default async function LocalizedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SitePage locale={locale} stars={githubStars} />;
}
