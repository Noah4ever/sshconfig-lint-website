import type { Metadata } from 'next';
import { AlertTriangle, CircleX, Info, MonitorCheck, SquareTerminal } from 'lucide-react';
import { notFound } from 'next/navigation';
import { InfoPage } from '../../../../components/InfoPage';
import { isLocale, locales, type Locale } from '../../../../lib/i18n';
import { ruleBySlug, ruleDocs } from '../../../../lib/rules';

const labels: Record<Locale, {
  back: string; before: string; browser: string; cli: string; example: string; fix: string; fixed: string; info: string; warning: string; error: string; why: string;
}> = {
  en: { back: 'All checks', before: 'What is wrong', browser: 'Checked in the browser', cli: 'Checked by the CLI', example: 'Before and after', fix: 'How to fix it', fixed: 'Corrected configuration', info: 'info', warning: 'warning', error: 'error', why: 'Why it matters' },
  de: { back: 'Alle Prüfungen', before: 'Was falsch ist', browser: 'Wird im Browser geprüft', cli: 'Wird von der CLI geprüft', example: 'Vorher und nachher', fix: 'So behebst du es', fixed: 'Korrigierte Konfiguration', info: 'Info', warning: 'Warnung', error: 'Fehler', why: 'Warum das wichtig ist' },
  fr: { back: 'Tous les contrôles', before: 'Ce qui est incorrect', browser: 'Vérifié dans le navigateur', cli: 'Vérifié par la CLI', example: 'Avant et après', fix: 'Comment corriger', fixed: 'Configuration corrigée', info: 'info', warning: 'avertissement', error: 'erreur', why: 'Pourquoi c’est important' },
  es: { back: 'Todas las comprobaciones', before: 'Qué está mal', browser: 'Se comprueba en el navegador', cli: 'Se comprueba con la CLI', example: 'Antes y después', fix: 'Cómo corregirlo', fixed: 'Configuración corregida', info: 'info', warning: 'aviso', error: 'error', why: 'Por qué importa' },
};

function HighlightedExample({ code, highlights }: { code: string; highlights: Array<{ line: number; target: string }> }) {
  return code.split('\n').map((line, index) => {
    const number = index + 1;
    const highlight = highlights.find((item) => item.line === number);
    const start = highlight ? line.indexOf(highlight.target) : -1;
    return (
      <span className="rule-code-line" data-line={number} key={number}>
        {start >= 0 && highlight ? <>{line.slice(0, start)}<mark>{highlight.target}</mark>{line.slice(start + highlight.target.length)}</> : line || ' '}
      </span>
    );
  });
}

export function generateStaticParams() {
  return locales.flatMap((locale) => ruleDocs.map((rule) => ({ locale, slug: rule.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const rule = ruleBySlug(slug);
  if (!isLocale(locale) || !rule) return {};
  const text = rule.text[locale];
  return {
    title: `${rule.code}: ${text.title} | sshconfig-lint`,
    description: text.summary,
    alternates: {
      canonical: `/${locale}/rules/${slug}`,
      languages: Object.fromEntries([
        ...locales.map((item) => [item, `/${item}/rules/${slug}`]),
        ['x-default', `/en/rules/${slug}`],
      ]),
    },
    openGraph: { title: `${rule.code}: ${text.title}`, description: text.summary, images: [] },
    twitter: { title: `${rule.code}: ${text.title}`, description: text.summary, images: [] },
  };
}

export default async function RulePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const rule = ruleBySlug(slug);
  if (!isLocale(locale) || !rule) notFound();
  const text = rule.text[locale];
  const ui = labels[locale];
  const SeverityIcon = rule.severity === 'error' ? CircleX : rule.severity === 'warning' ? AlertTriangle : Info;
  const RuntimeIcon = rule.browser ? MonitorCheck : SquareTerminal;

  return (
    <InfoPage locale={locale} title={text.title}>
      <a className="rule-back" href={`/${locale}#checks`}>← {ui.back}</a>
      <div className="rule-meta">
        <span><SeverityIcon aria-hidden="true" size={19} strokeWidth={2.3} />{ui[rule.severity]}</span>
        <span><RuntimeIcon aria-hidden="true" size={19} strokeWidth={2.3} />{rule.browser ? ui.browser : ui.cli}</span>
        <code>{rule.code}</code>
      </div>
      <p className="rule-summary">{text.summary}</p>
      <div className="rule-explanation">
        <section><h2>{ui.why}</h2><p>{text.why}</p></section>
        <section><h2>{ui.fix}</h2><p>{text.fix}</p></section>
      </div>
      <section className="rule-example">
        <h2>{ui.example}</h2>
        <div className="rule-example-grid">
          <figure className="code-sample code-sample-wrong">
            <figcaption>{ui.before}</figcaption>
            <pre><code><HighlightedExample code={rule.example} highlights={rule.highlights} /></code></pre>
          </figure>
          <figure className="code-sample code-sample-fixed">
            <figcaption>{ui.fixed}</figcaption>
            <pre><code><HighlightedExample code={rule.fixedExample} highlights={[]} /></code></pre>
          </figure>
        </div>
      </section>
    </InfoPage>
  );
}
