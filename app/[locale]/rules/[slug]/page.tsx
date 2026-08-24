import type { Metadata } from 'next';
import { AlertTriangle, ArrowRight, CircleX, Info, MonitorCheck, SquareTerminal } from 'lucide-react';
import { notFound } from 'next/navigation';
import { InfoPage } from '../../../../components/InfoPage';
import { isLocale, locales, type Locale } from '../../../../lib/i18n';
import { ruleBySlug, ruleDocs } from '../../../../lib/rules';

const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sshconfig-lint.apps.thiering.org';

const labels: Record<Locale, {
  back: string; before: string; browser: string; cli: string; example: string; fix: string; fixed: string; info: string; warning: string; error: string; why: string; tryIt: string; install: string; editor: string;
}> = {
  en: { back: 'All checks', before: 'What is wrong', browser: 'Checked in the browser', cli: 'Checked by the CLI', example: 'Before and after', fix: 'How to fix it', fixed: 'Corrected configuration', info: 'info', warning: 'warning', error: 'error', why: 'Why it matters', tryIt: 'Check this in the playground', install: 'Install the CLI', editor: 'Use it in your editor' },
  de: { back: 'Alle Prüfungen', before: 'Was falsch ist', browser: 'Wird im Browser geprüft', cli: 'Wird von der CLI geprüft', example: 'Vorher und nachher', fix: 'So behebst du es', fixed: 'Korrigierte Konfiguration', info: 'Info', warning: 'Warnung', error: 'Fehler', why: 'Warum das wichtig ist', tryIt: 'Im Playground prüfen', install: 'CLI installieren', editor: 'Im Editor verwenden' },
  fr: { back: 'Tous les contrôles', before: 'Ce qui est incorrect', browser: 'Vérifié dans le navigateur', cli: 'Vérifié par la CLI', example: 'Avant et après', fix: 'Comment corriger', fixed: 'Configuration corrigée', info: 'info', warning: 'avertissement', error: 'erreur', why: 'Pourquoi c’est important', tryIt: 'Vérifier dans le playground', install: 'Installer la CLI', editor: 'Utiliser dans l’éditeur' },
  es: { back: 'Todas las comprobaciones', before: 'Qué está mal', browser: 'Se comprueba en el navegador', cli: 'Se comprueba con la CLI', example: 'Antes y después', fix: 'Cómo corregirlo', fixed: 'Configuración corregida', info: 'info', warning: 'aviso', error: 'error', why: 'Por qué importa', tryIt: 'Comprobar en el playground', install: 'Instalar la CLI', editor: 'Usar en el editor' },
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
    openGraph: { title: `${rule.code}: ${text.title}`, description: text.summary, url: `/${locale}/rules/${slug}`, images: [] },
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
  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'TechArticle', headline: `${rule.code}: ${text.title}`,
      description: text.summary, inLanguage: locale, mainEntityOfPage: `${origin}/${locale}/rules/${slug}`,
      author: { '@type': 'Person', name: 'Noah Thiering', url: 'https://thiering.org' },
      about: ['OpenSSH', rule.code, 'SSH client configuration'],
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'sshconfig-lint', item: `${origin}/${locale}` },
        { '@type': 'ListItem', position: 2, name: ui.back, item: `${origin}/${locale}/rules` },
        { '@type': 'ListItem', position: 3, name: text.title, item: `${origin}/${locale}/rules/${slug}` },
      ],
    },
  ];

  return (
    <InfoPage locale={locale} title={text.title}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <a className="rule-back" href={`/${locale}/rules`}>← {ui.back}</a>
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
      <nav className="guide-actions" aria-label={text.title}>
        <a className="button" href={`/${locale}#playground`}>{ui.tryIt}<ArrowRight aria-hidden="true" size={20} /></a>
        <a href={`/${locale}#install`}><SquareTerminal aria-hidden="true" size={20} />{ui.install}</a>
        <a href={`/${locale}/editor`}><MonitorCheck aria-hidden="true" size={20} />{ui.editor}</a>
      </nav>
    </InfoPage>
  );
}
