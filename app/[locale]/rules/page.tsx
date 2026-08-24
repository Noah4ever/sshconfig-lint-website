import type { Metadata } from 'next';
import { ArrowUpRight, MonitorCheck, SquareTerminal } from 'lucide-react';
import { notFound } from 'next/navigation';
import { InfoPage } from '../../../components/InfoPage';
import { isLocale, locales, type Locale } from '../../../lib/i18n';
import { ruleDocs } from '../../../lib/rules';

const labels: Record<Locale, { browser: string; cli: string; intro: string; title: string }> = {
  en: { browser: 'Browser', cli: 'CLI', intro: 'Every SSH config diagnostic has a focused explanation, a marked example, and a practical fix.', title: 'SSH config linter rules and fixes' },
  de: { browser: 'Browser', cli: 'CLI', intro: 'Jede SSH-Config-Diagnose hat eine eigene Erklärung, ein markiertes Beispiel und eine konkrete Lösung.', title: 'SSH-Config-Linter: Regeln und Lösungen' },
  fr: { browser: 'Navigateur', cli: 'CLI', intro: 'Chaque diagnostic de configuration SSH dispose d’une explication, d’un exemple marqué et d’une correction concrète.', title: 'Règles et corrections du linter SSH' },
  es: { browser: 'Navegador', cli: 'CLI', intro: 'Cada diagnóstico de configuración SSH tiene una explicación, un ejemplo marcado y una solución práctica.', title: 'Reglas y soluciones del linter SSH' },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: `${labels[locale].title} | sshconfig-lint`,
    description: labels[locale].intro,
    alternates: {
      canonical: `/${locale}/rules`,
      languages: Object.fromEntries([
        ...locales.map((item) => [item, `/${item}/rules`]),
        ['x-default', '/en/rules'],
      ]),
    },
    openGraph: { title: labels[locale].title, description: labels[locale].intro, url: `/${locale}/rules`, images: [] },
    twitter: { title: labels[locale].title, description: labels[locale].intro, images: [] },
  };
}

export default async function RulesIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ui = labels[locale];
  return (
    <InfoPage locale={locale} title={ui.title}>
      <p className="rule-summary">{ui.intro}</p>
      <div className="rule-index">
        {ruleDocs.map((rule) => {
          const RuntimeIcon = rule.browser ? MonitorCheck : SquareTerminal;
          return (
            <a key={rule.code} href={`/${locale}/rules/${rule.slug}`}>
              <code>{rule.code}</code>
              <h2>{rule.text[locale].title}</h2>
              <span><RuntimeIcon aria-hidden="true" size={18} />{rule.browser ? ui.browser : ui.cli}</span>
              <ArrowUpRight className="rule-index-arrow" aria-hidden="true" size={22} />
            </a>
          );
        })}
      </div>
    </InfoPage>
  );
}
