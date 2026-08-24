import type { Metadata } from 'next';
import { ArrowUpRight, MonitorCheck, SquareTerminal } from 'lucide-react';
import { notFound } from 'next/navigation';
import { InfoPage } from '../../../components/InfoPage';
import { isLocale, locales, type Locale } from '../../../lib/i18n';
import { ruleDocs } from '../../../lib/rules';

const labels: Record<Locale, { browser: string; cli: string; intro: string; title: string }> = {
  en: { browser: 'Browser', cli: 'CLI', intro: 'Every diagnostic code has a focused explanation, a small example, and a practical fix.', title: 'All sshconfig-lint rules' },
  de: { browser: 'Browser', cli: 'CLI', intro: 'Jeder Diagnose-Code hat eine eigene Erklärung, ein kurzes Beispiel und eine konkrete Lösung.', title: 'Alle sshconfig-lint-Regeln' },
  fr: { browser: 'Navigateur', cli: 'CLI', intro: 'Chaque code dispose d’une explication, d’un exemple et d’une correction concrète.', title: 'Toutes les règles sshconfig-lint' },
  es: { browser: 'Navegador', cli: 'CLI', intro: 'Cada código tiene una explicación, un ejemplo y una solución práctica.', title: 'Todas las reglas de sshconfig-lint' },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: `${labels[locale].title} | sshconfig-lint`, description: labels[locale].intro };
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
