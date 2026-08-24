import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { InfoPage } from '../../../components/InfoPage';
import { guides } from '../../../lib/guides';
import { isLocale, locales, type Locale } from '../../../lib/i18n';

const labels: Record<Locale, { title: string; intro: string }> = {
  en: { title: 'Practical SSH config guides', intro: 'Short, tested answers for validating OpenSSH client configs and fixing the mistakes people search for most.' },
  de: { title: 'Praktische SSH-Config-Anleitungen', intro: 'Kurze, geprüfte Antworten zum Validieren von OpenSSH-Client-Konfigurationen und Beheben häufiger Fehler.' },
  fr: { title: 'Guides pratiques de configuration SSH', intro: 'Des réponses courtes pour valider une configuration OpenSSH et corriger les erreurs fréquentes.' },
  es: { title: 'Guías prácticas de configuración SSH', intro: 'Respuestas breves para validar una configuración OpenSSH y corregir errores frecuentes.' },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = labels[locale];
  return {
    title: `${copy.title} | sshconfig-lint`,
    description: copy.intro,
    alternates: {
      canonical: `/${locale}/guides`,
      languages: Object.fromEntries([...locales.map((item) => [item, `/${item}/guides`]), ['x-default', '/en/guides']]),
    },
    openGraph: { title: copy.title, description: copy.intro, url: `/${locale}/guides`, images: [] },
    twitter: { title: copy.title, description: copy.intro, images: [] },
  };
}

export default async function GuideIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = labels[locale];
  return (
    <InfoPage locale={locale} title={copy.title}>
      <p className="rule-summary">{copy.intro}</p>
      <div className="guide-index">
        {guides.map((guide, index) => (
          <a href={`/${locale}/guides/${guide.slug}`} key={guide.slug}>
            <span className="lesson-number" aria-hidden="true">0{index + 1}</span>
            <h2>{guide.text[locale].title}</h2>
            <p>{guide.text[locale].description}</p>
            <ArrowUpRight aria-hidden="true" size={22} />
          </a>
        ))}
      </div>
    </InfoPage>
  );
}
