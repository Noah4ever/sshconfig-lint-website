'use client';

import { BookOpen, Github, Languages, ListChecks, Menu, MonitorCheck, SquareTerminal, TerminalSquare, Workflow, X } from 'lucide-react';
import { useRef } from 'react';
import { locales, type Locale } from '../lib/i18n';

type MobileNavigationProps = {
  labels: {
    checker: string;
    cli: string;
    github: string;
    language: string;
    languages: Record<Locale, string>;
    learn: string;
    menu: string;
    rules: string;
    editor: string;
    ci: string;
    guides: string;
  };
  locale: Locale;
};

const repository = 'https://github.com/Noah4ever/sshconfig-lint';

export function MobileNavigation({ labels, locale }: MobileNavigationProps) {
  const menu = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => menu.current?.removeAttribute('open');

  return (
    <details
      className="mobile-menu"
      ref={menu}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          closeMenu();
          menu.current?.querySelector('summary')?.focus();
        }
      }}
    >
      <summary aria-label={labels.menu}>
        <Menu className="mobile-menu-open" aria-hidden="true" size={27} />
        <X className="mobile-menu-close" aria-hidden="true" size={27} />
      </summary>
      <div className="mobile-menu-panel">
        <nav className="mobile-menu-links" aria-label={labels.menu}>
          <a href={`/${locale}#playground`} onClick={closeMenu}><TerminalSquare aria-hidden="true" size={22} />{labels.checker}</a>
          <a href={`/${locale}/learn`} onClick={closeMenu}><BookOpen aria-hidden="true" size={22} />{labels.learn}</a>
          <a href={`/${locale}/rules`} onClick={closeMenu}><ListChecks aria-hidden="true" size={22} />{labels.rules}</a>
          <a href={`/${locale}/guides`} onClick={closeMenu}><BookOpen aria-hidden="true" size={22} />{labels.guides}</a>
          <a href={`/${locale}/editor`} onClick={closeMenu}><MonitorCheck aria-hidden="true" size={22} />{labels.editor}</a>
          <a href={`/${locale}/ci`} onClick={closeMenu}><Workflow aria-hidden="true" size={22} />{labels.ci}</a>
          <a href={`/${locale}#install`} onClick={closeMenu}><SquareTerminal aria-hidden="true" size={22} />{labels.cli}</a>
          <a href={repository} rel="noreferrer" onClick={closeMenu}><Github aria-hidden="true" size={22} />{labels.github}</a>
        </nav>
        <div className="mobile-menu-languages" role="group" aria-label={labels.language}>
          <Languages aria-hidden="true" size={21} />
          {locales.map((option) => (
            <a
              key={option}
              href={`/${option}`}
              hrefLang={option}
              lang={option}
              aria-current={option === locale ? 'page' : undefined}
              aria-label={labels.languages[option]}
              onClick={closeMenu}
            >
              {option.toUpperCase()}
            </a>
          ))}
        </div>
      </div>
    </details>
  );
}
