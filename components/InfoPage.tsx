import type { ReactNode } from 'react';
import { copy, type Locale } from '../lib/i18n';
import { ThemeToggle } from './ThemeToggle';

type Props = { children: ReactNode; locale: Locale; title: string };

export function InfoPage({ children, locale, title }: Props) {
  const text = copy[locale];
  return (
    <div lang={locale}>
      <a className="skip-link" href="#main-content">{text.skipToContent}</a>
      <header className="site-header">
        <a className="brand" href={`/${locale}`}>$ sshconfig-lint</a>
        <div className="header-actions">
          <a className="header-link" href={`/${locale}`}>{text.back}</a>
          <ThemeToggle darkLabel={text.darkMode} lightLabel={text.lightMode} />
        </div>
      </header>
      <main className="info-page" id="main-content" tabIndex={-1}>
        <p className="eyebrow">sshconfig-lint</p>
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
}
