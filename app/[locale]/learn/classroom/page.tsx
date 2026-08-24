import type { Metadata } from 'next';
import { Printer } from 'lucide-react';
import { notFound } from 'next/navigation';
import { InfoPage } from '../../../../components/InfoPage';
import { isLocale, locales, type Locale } from '../../../../lib/i18n';
import { brokenExercise } from '../../../../lib/learning';

const text: Record<Locale, { title: string; intro: string; task: string; steps: string[]; print: string; checker: string }> = {
  en: { title: 'SSH config classroom worksheet', intro: 'A printable 20-minute exercise for learning how OpenSSH chooses settings and how to spot unsafe configuration.', task: 'Find and explain five mistakes', steps: ['Determine which User applies to school-server.', 'Find the setting that disables host-key protection.', 'Explain why the ControlPath can collide.', 'Identify the obsolete cipher.', 'Consolidate the duplicate Host block.'], print: 'Print this worksheet', checker: 'Check the correction in the browser' },
  de: { title: 'Arbeitsblatt: SSH Config', intro: 'Eine druckbare 20-Minuten-Aufgabe zur Auswertung von OpenSSH-Einstellungen und zum Erkennen unsicherer Konfiguration.', task: 'Finde und erkläre fünf Fehler', steps: ['Bestimme, welcher User für school-server gilt.', 'Finde die Einstellung, die den Host-Schlüssel-Schutz deaktiviert.', 'Erkläre, warum der ControlPath kollidieren kann.', 'Erkenne den veralteten Cipher.', 'Fasse den doppelten Host-Block zusammen.'], print: 'Arbeitsblatt drucken', checker: 'Korrektur im Browser prüfen' },
  fr: { title: 'Fiche de cours SSH config', intro: 'Un exercice imprimable de 20 minutes pour comprendre le choix des valeurs OpenSSH et repérer une configuration risquée.', task: 'Trouvez et expliquez cinq erreurs', steps: ['Déterminez quel User s’applique à school-server.', 'Trouvez le réglage qui désactive la protection des clés.', 'Expliquez la collision possible de ControlPath.', 'Identifiez le chiffrement obsolète.', 'Regroupez le bloc Host dupliqué.'], print: 'Imprimer cette fiche', checker: 'Vérifier la correction dans le navigateur' },
  es: { title: 'Hoja de clase sobre SSH config', intro: 'Un ejercicio imprimible de 20 minutos para entender cómo OpenSSH elige valores y detectar una configuración insegura.', task: 'Encuentra y explica cinco errores', steps: ['Determina qué User se aplica a school-server.', 'Encuentra el ajuste que desactiva la protección de claves.', 'Explica por qué puede colisionar ControlPath.', 'Identifica el cifrado obsoleto.', 'Combina el bloque Host duplicado.'], print: 'Imprimir esta hoja', checker: 'Comprobar la corrección en el navegador' },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: `${text[locale].title} | sshconfig-lint`,
    description: text[locale].intro,
    alternates: {
      canonical: `/${locale}/learn/classroom`,
      languages: Object.fromEntries([...locales.map((item) => [item, `/${item}/learn/classroom`]), ['x-default', '/en/learn/classroom']]),
    },
    openGraph: { title: text[locale].title, description: text[locale].intro, url: `/${locale}/learn/classroom`, images: [] },
    twitter: { title: text[locale].title, description: text[locale].intro, images: [] },
  };
}

export default async function ClassroomPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = text[locale];
  return (
    <InfoPage eyebrow="sshconfig-lint / classroom" locale={locale} title={copy.title}>
      <p className="learning-intro">{copy.intro}</p>
      <button className="button print-button" onClick={undefined} type="button" data-print-trigger><Printer aria-hidden="true" size={20} />{copy.print}</button>
      <section className="classroom-sheet">
        <h2>{copy.task}</h2>
        <ol>{copy.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <figure className="learning-code-sample code-sample-wrong">
          <figcaption>~/.ssh/config</figcaption>
          <pre><code>{brokenExercise}</code></pre>
        </figure>
        <div className="worksheet-notes" role="region" aria-label="Notes">{Array.from({ length: 8 }, (_, index) => <span key={index} />)}</div>
      </section>
      <a className="button" href={`/${locale}#playground`}>{copy.checker}</a>
      <script dangerouslySetInnerHTML={{ __html: `document.querySelector('[data-print-trigger]')?.addEventListener('click',function(){window.print()})` }} />
    </InfoPage>
  );
}
