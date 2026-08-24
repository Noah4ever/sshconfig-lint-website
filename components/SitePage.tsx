import { ArrowUpRight, Github } from 'lucide-react';
import { GitHubStars } from './GitHubStars';
import { InstallChooser } from './InstallChooser';
import { Playground } from './Playground';
import { copy, locales, type Locale } from '../lib/i18n';
import { ruleByCode } from '../lib/rules';
import { ThemeToggle } from './ThemeToggle';

const repository = 'https://github.com/Noah4ever/sshconfig-lint';

export function SitePage({ locale, stars }: { locale: Locale; stars: number }) {
  const text = copy[locale];

  return (
    <div lang={locale}>
      <a className="skip-link" href="#top">{text.skipToContent}</a>
      <header className="site-header">
        <a className="brand" href={`/${locale}#top`} aria-label="sshconfig-lint home">$ sshconfig-lint</a>
        <nav className="site-nav" aria-label={text.primaryNavigation}>
          <a href="#playground">{text.nav.playground}</a>
          <a href="#checks">{text.nav.checks}</a>
          <a href="#cli">{text.nav.cli}</a>
          <a className="nav-with-icon" href={repository} rel="noreferrer"><Github aria-hidden="true" size={19} />{text.nav.github}</a>
          <ThemeToggle darkLabel={text.darkMode} lightLabel={text.lightMode} />
          <details className="language-menu">
            <summary aria-label={`${text.languageMenu}: ${text.languageName}`}>{locale.toUpperCase()}</summary>
            <div className="language-options">
              {locales.map((option) => (
                <a key={option} href={`/${option}`} hrefLang={option} aria-current={option === locale ? 'page' : undefined}>
                  {copy[option].languageName}
                </a>
              ))}
            </div>
          </details>
        </nav>
      </header>

      <main id="top" tabIndex={-1}>
        <section className="page-shell hero-section">
          <div className="hero-copy">
            <p className="eyebrow">{text.eyebrow}</p>
            <h1>{text.title}</h1>
            <p className="intro">{text.intro}</p>
            <div className="hero-notes">
              <p className="privacy-note">{text.privateNote}</p>
              <GitHubStars initialStars={stars} label={text.githubStars} locale={locale} />
            </div>
          </div>
          <Playground copy={text} locale={locale} />
        </section>

        <section className="content-section" id="checks">
          <div className="section-heading">
            <p className="eyebrow">{text.checksEyebrow}</p>
            <h2>{text.checksTitle}</h2>
            <p>{text.checksIntro}</p>
          </div>
          <div className="rule-grid">
            {text.rules.map((rule) => {
              const doc = ruleByCode(rule.code);
              return <a className="rule" href={`/${locale}/rules/${doc?.slug ?? ''}`} key={rule.code}>
                <code>{rule.code}</code>
                <ArrowUpRight className="rule-arrow" aria-hidden="true" size={23} strokeWidth={2.2} />
                <h3>{rule.title}</h3>
                <p>{rule.text}</p>
              </a>;
            })}
          </div>
          <a className="all-rules-link" href={`/${locale}/rules`}>{text.allRules}<ArrowUpRight aria-hidden="true" size={21} /></a>
        </section>

        <section className="cli-section" id="cli">
          <div className="content-section cli-inner">
            <div className="section-heading light-heading">
              <p className="eyebrow">{text.cliEyebrow}</p>
              <h2>{text.cliTitle}</h2>
              <p>{text.cliIntro}</p>
            </div>
            <div className="comparison">
              <div><h3>{text.browserColumn}</h3><ul>{text.browserItems.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div><h3>{text.cliColumn}</h3><ul>{text.cliItems.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </div>
            <div className="install-block">
              <div><h3>{text.installTitle}</h3><p>{text.installText}</p></div>
              <InstallChooser copyLabel={text.copyCommand} copiedLabel={text.copied} groupLabel={text.packageManagers} />
              <a className="button install-link" href={repository}><Github aria-hidden="true" size={20} />{text.githubCta}</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>{text.footerLine}</p>
        <nav aria-label={text.legalNavigation}>
          <a href={`/${locale}/privacy`}>{text.privacy}</a>
          <a href={`/${locale}/legal`}>{text.legal}</a>
          <a href={repository}>{text.source}</a>
        </nav>
      </footer>
    </div>
  );
}
