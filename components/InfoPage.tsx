import type { ReactNode } from 'react';
import { copy, locales, type Locale } from '../lib/i18n';
import { MobileNavigation } from './MobileNavigation';
import { ThemeToggle } from './ThemeToggle';

type Props = { children: ReactNode; eyebrow?: string; locale: Locale; title: string };

export function InfoPage({ children, eyebrow = 'sshconfig-lint', locale, title }: Props) {
  const text = copy[locale];
  return (
    <div lang={locale}>
      <a className="skip-link" href="#main-content">{text.skipToContent}</a>
      <header className="site-header">
        <a className="brand" href={`/${locale}`}>$ sshconfig-lint</a>
        <div className="header-actions">
          <a className="header-link" href={`/${locale}`}>{text.back}</a>
          <ThemeToggle darkLabel={text.darkMode} lightLabel={text.lightMode} />
          <MobileNavigation
            locale={locale}
            labels={{
              checker: text.nav.playground,
              cli: text.nav.cli,
              github: text.nav.github,
              language: text.languageMenu,
              languages: Object.fromEntries(locales.map((option) => [option, copy[option].languageName])) as Record<Locale, string>,
              learn: text.nav.learn,
              menu: text.primaryNavigation,
              rules: text.nav.checks,
              editor: text.nav.editor,
              ci: text.nav.ci,
              guides: text.nav.guides,
            }}
          />
        </div>
      </header>
      <main className="info-page" id="main-content" tabIndex={-1}>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
}
