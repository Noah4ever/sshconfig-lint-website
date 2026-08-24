import type { Metadata } from 'next';
import { Check, GitBranch, ShieldCheck, Workflow } from 'lucide-react';
import { notFound } from 'next/navigation';
import { InfoPage } from '../../../components/InfoPage';
import { isLocale, locales, type Locale } from '../../../lib/i18n';

const text: Record<Locale, { title: string; description: string; intro: string; action: string; precommit: string; sarif: string; facts: string[]; local: string }> = {
  en: { title: 'Lint SSH configs in CI and before commits', description: 'Use the official sshconfig-lint GitHub Action, pre-commit hook, and SARIF output without custom wrappers.', intro: 'Keep shared dotfiles and infrastructure configs reviewable. The same stable rule codes run on a laptop, in a commit hook, and on every pull request.', action: 'GitHub Action', precommit: 'Pre-Commit', sarif: 'SARIF for Code Scanning', facts: ['Inline annotations point to the exact file and line.', 'Release binaries are pinned and verified with SHA256.', 'Strict mode can make warnings block a change.'], local: 'Everything runs inside your workflow. Config contents are not sent to sshconfig-lint.' },
  de: { title: 'SSH Config in CI und vor Commits prüfen', description: 'Nutze die offizielle GitHub Action, Pre-Commit-Hooks und SARIF ohne eigene Wrapper.', intro: 'Halte gemeinsame Dotfiles und Infrastruktur-Configs nachvollziehbar. Dieselben stabilen Rule-Codes laufen lokal, im Commit-Hook und in jedem Pull Request.', action: 'GitHub Action', precommit: 'Pre-Commit', sarif: 'SARIF für Code Scanning', facts: ['Annotations zeigen direkt auf Datei und Zeile.', 'Release-Binaries sind versionsgebunden und mit SHA256 geprüft.', 'Strict Mode kann Warnungen blockieren.'], local: 'Alles läuft innerhalb deines Workflows. Config-Inhalte werden nicht an sshconfig-lint gesendet.' },
  fr: { title: 'Analyser SSH config en CI et avant les commits', description: 'Utilisez l’Action GitHub officielle, pre-commit et SARIF sans script personnel.', intro: 'Gardez les dotfiles et configurations partagées faciles à réviser. Les mêmes codes de règle fonctionnent localement et dans chaque pull request.', action: 'Action GitHub', precommit: 'Pre-Commit', sarif: 'SARIF pour Code Scanning', facts: ['Annotations sur le fichier et la ligne exacts.', 'Binaires liés à une version et vérifiés par SHA256.', 'Le mode strict peut bloquer les avertissements.'], local: 'Tout fonctionne dans votre workflow. La configuration n’est pas envoyée à sshconfig-lint.' },
  es: { title: 'Analizar SSH config en CI y antes de commits', description: 'Usa la Action oficial, pre-commit y SARIF sin scripts propios.', intro: 'Mantén revisables los dotfiles y configuraciones compartidas. Los mismos códigos estables funcionan localmente y en cada pull request.', action: 'GitHub Action', precommit: 'Pre-Commit', sarif: 'SARIF para Code Scanning', facts: ['Anotaciones en el archivo y línea exactos.', 'Binarios ligados a versión y verificados con SHA256.', 'El modo estricto puede bloquear avisos.'], local: 'Todo se ejecuta dentro de tu workflow. La configuración no se envía a sshconfig-lint.' },
};

const action = `- uses: actions/checkout@v4
- uses: Noah4ever/sshconfig-lint@v0.5.0
  with:
    paths: |
      .ssh/config
      infrastructure/ssh_config
    strict: true`;
const precommit = `repos:
  - repo: https://github.com/Noah4ever/sshconfig-lint
    rev: v0.5.0
    hooks:
      - id: sshconfig-lint-strict`;
const sarif = `sshconfig-lint .ssh/config --format sarif > sshconfig-lint.sarif`;

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = text[locale];
  return {
    title: `${copy.title} | sshconfig-lint`, description: copy.description,
    alternates: { canonical: `/${locale}/ci`, languages: Object.fromEntries([...locales.map((item) => [item, `/${item}/ci`]), ['x-default', '/en/ci']]) },
    openGraph: { title: copy.title, description: copy.description, url: `/${locale}/ci`, images: [] },
    twitter: { title: copy.title, description: copy.description, images: [] },
  };
}

export default async function CiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = text[locale];
  return (
    <InfoPage eyebrow="sshconfig-lint / workflow" locale={locale} title={copy.title}>
      <p className="rule-summary">{copy.intro}</p>
      <div className="ci-grid">
        <section><Workflow aria-hidden="true" size={28} /><h2>{copy.action}</h2><pre><code>{action}</code></pre></section>
        <section><GitBranch aria-hidden="true" size={28} /><h2>{copy.precommit}</h2><pre><code>{precommit}</code></pre></section>
        <section><ShieldCheck aria-hidden="true" size={28} /><h2>{copy.sarif}</h2><pre><code>{sarif}</code></pre></section>
      </div>
      <section className="workflow-steps"><ol>{copy.facts.map((fact) => <li key={fact}><Check aria-hidden="true" size={21} />{fact}</li>)}</ol><p>{copy.local}</p></section>
    </InfoPage>
  );
}
