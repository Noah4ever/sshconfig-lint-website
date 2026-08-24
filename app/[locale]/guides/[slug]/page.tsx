import type { Metadata } from 'next';
import { ArrowRight, BookOpen, SquareTerminal } from 'lucide-react';
import { notFound } from 'next/navigation';
import { InfoPage } from '../../../../components/InfoPage';
import { guideBySlug, guides } from '../../../../lib/guides';
import { isLocale, locales, type Locale } from '../../../../lib/i18n';

const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sshconfig-lint.apps.thiering.org';
const labels: Record<Locale, { problem: string; steps: string; before: string; after: string; checker: string; cli: string; rule: string; all: string }> = {
  en: { problem: 'Why a valid config can still be wrong', steps: 'A reliable way to fix it', before: 'Problem', after: 'Corrected', checker: 'Check a config now', cli: 'Install the complete CLI', rule: 'Read the exact rule', all: 'All SSH config guides' },
  de: { problem: 'Warum eine gültige Config trotzdem falsch sein kann', steps: 'So behebst du es zuverlässig', before: 'Problem', after: 'Korrigiert', checker: 'Config jetzt prüfen', cli: 'Vollständige CLI installieren', rule: 'Genaue Regel lesen', all: 'Alle SSH-Config-Anleitungen' },
  fr: { problem: 'Pourquoi une configuration valide peut rester incorrecte', steps: 'Une correction fiable', before: 'Problème', after: 'Correction', checker: 'Vérifier une configuration', cli: 'Installer la CLI complète', rule: 'Lire la règle précise', all: 'Tous les guides SSH' },
  es: { problem: 'Por qué una configuración válida puede seguir mal', steps: 'Una forma fiable de corregirla', before: 'Problema', after: 'Corregido', checker: 'Comprobar una configuración', cli: 'Instalar la CLI completa', rule: 'Leer la regla exacta', all: 'Todas las guías SSH' },
};

function Example({ code, highlight }: { code: string; highlight?: string }) {
  const start = highlight ? code.indexOf(highlight) : -1;
  return <code>{start >= 0 && highlight ? <>{code.slice(0, start)}<mark>{highlight}</mark>{code.slice(start + highlight.length)}</> : code}</code>;
}

export function generateStaticParams() {
  return locales.flatMap((locale) => guides.map((guide) => ({ locale, slug: guide.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = guideBySlug(slug);
  if (!isLocale(locale) || !guide) return {};
  const text = guide.text[locale];
  return {
    title: `${text.title} | sshconfig-lint`,
    description: text.description,
    keywords: [text.title, 'SSH config linter', 'OpenSSH config checker', 'sshconfig-lint'],
    alternates: {
      canonical: `/${locale}/guides/${slug}`,
      languages: Object.fromEntries([...locales.map((item) => [item, `/${item}/guides/${slug}`]), ['x-default', `/en/guides/${slug}`]]),
    },
    openGraph: { type: 'article', title: text.title, description: text.description, url: `/${locale}/guides/${slug}`, images: [] },
    twitter: { title: text.title, description: text.description, images: [] },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const guide = guideBySlug(slug);
  if (!isLocale(locale) || !guide) notFound();
  const text = guide.text[locale];
  const ui = labels[locale];
  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'TechArticle', headline: text.title, description: text.description,
      inLanguage: locale, mainEntityOfPage: `${origin}/${locale}/guides/${slug}`,
      author: { '@type': 'Person', name: 'Noah Thiering', url: 'https://thiering.org' },
      about: ['OpenSSH', 'SSH client configuration', 'sshconfig-lint'],
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'sshconfig-lint', item: `${origin}/${locale}` },
        { '@type': 'ListItem', position: 2, name: ui.all, item: `${origin}/${locale}/guides` },
        { '@type': 'ListItem', position: 3, name: text.title, item: `${origin}/${locale}/guides/${slug}` },
      ],
    },
  ];
  return (
    <InfoPage eyebrow="sshconfig-lint / guide" locale={locale} title={text.title}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <a className="rule-back" href={`/${locale}/guides`}>← {ui.all}</a>
      <p className="rule-summary">{text.description}</p>
      <div className="guide-explanation">
        <section><h2>{ui.problem}</h2><p>{text.problem}</p></section>
        <section><h2>{ui.steps}</h2><ol>{text.fix.map((step) => <li key={step}>{step}</li>)}</ol></section>
      </div>
      <div className="rule-example-grid guide-examples">
        <figure className="code-sample code-sample-wrong"><figcaption>{ui.before}</figcaption><pre><Example code={text.bad} highlight={text.highlight} /></pre></figure>
        <figure className="code-sample code-sample-fixed"><figcaption>{ui.after}</figcaption><pre><Example code={text.good} /></pre></figure>
      </div>
      <nav className="guide-actions" aria-label={ui.all}>
        <a className="button" href={`/${locale}#playground`}>{ui.checker}<ArrowRight aria-hidden="true" size={20} /></a>
        <a href={`/${locale}#install`}><SquareTerminal aria-hidden="true" size={20} />{ui.cli}</a>
        {guide.ruleSlug && <a href={`/${locale}/rules/${guide.ruleSlug}`}><BookOpen aria-hidden="true" size={20} />{ui.rule}</a>}
      </nav>
    </InfoPage>
  );
}
