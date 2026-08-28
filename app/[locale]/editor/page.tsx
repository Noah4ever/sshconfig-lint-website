import type { Metadata } from 'next';
import { Check, Download, ExternalLink, FileWarning, LockKeyhole, RefreshCw } from 'lucide-react';
import { notFound } from 'next/navigation';
import { InfoPage } from '../../../components/InfoPage';
import { isLocale, locales, type Locale } from '../../../lib/i18n';

const text: Record<Locale, { title: string; description: string; intro: string; features: string[]; install: string; command: string; privacy: string; workings: string; steps: string[]; marketplace: string; cli: string }> = {
  en: { title: 'SSH config linting in your editor', description: 'Get sshconfig-lint diagnostics in VS Code and every editor that supports the Language Server Protocol.', intro: 'The editor integration marks the exact line while you type and links every diagnostic to a focused explanation. It uses the same Rust rules as the CLI and CI.', features: ['Diagnostics on open, change, and save', 'Nested Include checks for saved files', 'Works offline after the verified binary is installed', 'No telemetry and no config uploads'], install: 'VS Code extension', command: 'Any LSP editor', privacy: 'The extension downloads one version-pinned binary from GitHub Releases, verifies SHA256, and stores it locally. Set sshconfigLint.binaryPath to use your own installation.', workings: 'How it works', steps: ['VS Code recognizes .ssh/config, ssh_config, and configured project patterns.', 'The extension starts sshconfig-lint lsp over standard input and output.', 'The Rust engine returns file, line, severity, rule code, hint, and documentation link.'], marketplace: 'Install from the VS Code Marketplace', cli: 'Install the CLI' },
  de: { title: 'SSH-Config-Prüfung direkt im Editor', description: 'Erhalte sshconfig-lint-Diagnosen in VS Code und jedem Editor mit Language Server Protocol.', intro: 'Die Editor-Integration markiert beim Schreiben die betroffene Zeile und verlinkt jede Diagnose mit einer konkreten Erklärung. Sie nutzt dieselben Rust-Regeln wie CLI und CI.', features: ['Diagnosen beim Öffnen, Ändern und Speichern', 'Verschachtelte Includes bei gespeicherten Dateien', 'Nach der geprüften Installation offline nutzbar', 'Keine Telemetrie und keine Config-Uploads'], install: 'VS-Code-Extension', command: 'Jeder LSP-Editor', privacy: 'Die Extension lädt eine versionsgebundene Binary aus GitHub Releases, prüft SHA256 und speichert sie lokal. Mit sshconfigLint.binaryPath nutzt du eine eigene Installation.', workings: 'So funktioniert es', steps: ['VS Code erkennt .ssh/config, ssh_config und zusätzliche Projektmuster.', 'Die Extension startet sshconfig-lint lsp über Standardein- und -ausgabe.', 'Die Rust-Engine liefert Datei, Zeile, Schweregrad, Rule-Code, Hinweis und Dokumentationslink.'], marketplace: 'Im VS Code Marketplace installieren', cli: 'CLI installieren' },
  fr: { title: 'Analyser SSH config dans l’éditeur', description: 'Recevez les diagnostics sshconfig-lint dans VS Code et tout éditeur compatible LSP.', intro: 'L’intégration marque la ligne pendant la saisie et relie chaque diagnostic à une explication. Les règles Rust sont identiques à la CLI et à la CI.', features: ['Diagnostic à l’ouverture, modification et sauvegarde', 'Include imbriqués pour les fichiers enregistrés', 'Fonctionne hors ligne après installation', 'Aucune télémétrie et aucun envoi'], install: 'Extension VS Code', command: 'Tout éditeur LSP', privacy: 'L’extension télécharge un binaire lié à sa version, vérifie SHA256 et le conserve localement. sshconfigLint.binaryPath permet une installation personnelle.', workings: 'Fonctionnement', steps: ['VS Code reconnaît .ssh/config, ssh_config et les motifs ajoutés.', 'L’extension lance sshconfig-lint lsp.', 'Le moteur renvoie fichier, ligne, gravité, code, conseil et documentation.'], marketplace: 'Installer depuis le Marketplace VS Code', cli: 'Installer la CLI' },
  es: { title: 'Analizar SSH config en el editor', description: 'Recibe diagnósticos de sshconfig-lint en VS Code y cualquier editor compatible con LSP.', intro: 'La integración marca la línea mientras escribes y enlaza cada diagnóstico con una explicación. Usa las mismas reglas Rust que CLI y CI.', features: ['Diagnósticos al abrir, cambiar y guardar', 'Include anidados en archivos guardados', 'Funciona sin conexión tras instalarse', 'Sin telemetría ni subidas'], install: 'Extensión de VS Code', command: 'Cualquier editor LSP', privacy: 'La extensión descarga un binario ligado a su versión, verifica SHA256 y lo guarda localmente. sshconfigLint.binaryPath permite usar una instalación propia.', workings: 'Cómo funciona', steps: ['VS Code reconoce .ssh/config, ssh_config y patrones añadidos.', 'La extensión inicia sshconfig-lint lsp.', 'El motor devuelve archivo, línea, gravedad, código, consejo y documentación.'], marketplace: 'Instalar desde VS Code Marketplace', cli: 'Instalar la CLI' },
};

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = text[locale];
  return {
    title: `${copy.title} | sshconfig-lint`, description: copy.description,
    alternates: { canonical: `/${locale}/editor`, languages: Object.fromEntries([...locales.map((item) => [item, `/${item}/editor`]), ['x-default', '/en/editor']]) },
    openGraph: { title: copy.title, description: copy.description, url: `/${locale}/editor`, images: [] },
    twitter: { title: copy.title, description: copy.description, images: [] },
  };
}

export default async function EditorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = text[locale];
  return (
    <InfoPage eyebrow="sshconfig-lint / editor" locale={locale} title={copy.title}>
      <p className="rule-summary">{copy.intro}</p>
      <div className="feature-list">{copy.features.map((feature, index) => {
        const Icon = [FileWarning, RefreshCw, Download, LockKeyhole][index];
        return <div key={feature}><Icon aria-hidden="true" size={24} /><span>{feature}</span></div>;
      })}</div>
      <section className="workflow-install-grid">
        <div><h2>{copy.install}</h2><pre><code>code --install-extension NoahThiering.sshconfig-lint</code></pre><a href="https://marketplace.visualstudio.com/items?itemName=NoahThiering.sshconfig-lint">{copy.marketplace}<ExternalLink aria-hidden="true" size={18} /></a></div>
        <div><h2>{copy.command}</h2><pre><code>sshconfig-lint lsp</code></pre><a href={`/${locale}#install`}>{copy.cli}<ExternalLink aria-hidden="true" size={18} /></a></div>
      </section>
      <section className="workflow-steps"><h2>{copy.workings}</h2><ol>{copy.steps.map((step) => <li key={step}><Check aria-hidden="true" size={21} />{step}</li>)}</ol><p>{copy.privacy}</p></section>
    </InfoPage>
  );
}
