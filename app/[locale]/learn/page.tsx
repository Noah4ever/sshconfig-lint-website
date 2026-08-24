import type { Metadata } from 'next';
import { ArrowRight, BookOpen, Clock3, GraduationCap, ListChecks, Users } from 'lucide-react';
import { notFound } from 'next/navigation';
import { InfoPage } from '../../../components/InfoPage';
import { copy, isLocale, locales } from '../../../lib/i18n';
import { brokenExercise, exerciseHighlights, fixedExercise, learningCopy } from '../../../lib/learning';

const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sshconfig-lint.apps.thiering.org';

function CodeLines({ code, highlights = [] }: { code: string; highlights?: Array<{ line: number; target: string }> }) {
  return code.split('\n').map((line, index) => {
    const lineNumber = index + 1;
    const highlight = highlights.find((item) => item.line === lineNumber);
    const start = highlight ? line.indexOf(highlight.target) : -1;
    return (
      <span className="rule-code-line" data-line={lineNumber} key={lineNumber}>
        {highlight && start >= 0 ? <>{line.slice(0, start)}<mark>{highlight.target}</mark>{line.slice(start + highlight.target.length)}</> : line || ' '}
      </span>
    );
  });
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const text = learningCopy[locale];
  return {
    title: `${text.title} | sshconfig-lint`,
    description: text.description,
    keywords: ['learn SSH config', 'SSH config tutorial', 'OpenSSH lesson', 'SSH config exercise'],
    alternates: {
      canonical: `/${locale}/learn`,
      languages: Object.fromEntries([
        ...locales.map((item) => [item, `/${item}/learn`]),
        ['x-default', '/en/learn'],
      ]),
    },
    openGraph: { title: text.title, description: text.description, url: `/${locale}/learn`, images: [] },
    twitter: { title: text.title, description: text.description, images: [] },
  };
}

export default async function LearnPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const text = learningCopy[locale];
  const learningResource = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: text.title,
    description: text.description,
    url: `${origin}/${locale}/learn`,
    inLanguage: locale,
    timeRequired: 'PT15M',
    educationalLevel: 'Beginner',
    learningResourceType: ['Lesson', 'Exercise'],
    isAccessibleForFree: true,
    author: { '@type': 'Person', name: 'Noah Thiering', url: 'https://thiering.org' },
  };

  return (
    <InfoPage eyebrow={text.eyebrow} locale={locale} title={text.title}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResource).replace(/</g, '\\u003c') }} />
      <p className="learning-intro">{text.description}</p>
      <div className="learning-meta" aria-label={text.format}>
        <span><Clock3 aria-hidden="true" size={21} />{text.duration}</span>
        <span><GraduationCap aria-hidden="true" size={22} />{text.level}</span>
        <span><BookOpen aria-hidden="true" size={21} />{text.format}</span>
      </div>

      <section className="learning-section" aria-labelledby="lessons-title">
        <h2 id="lessons-title">{text.lessonsTitle}</h2>
        <div className="lesson-grid">
          {text.lessons.map((lesson, index) => (
            <article className="lesson-card" key={lesson.title}>
              <span className="lesson-number" aria-hidden="true">0{index + 1}</span>
              <h3>{lesson.title}</h3>
              <p>{lesson.text}</p>
              <pre className="lesson-code"><code>{lesson.example}</code></pre>
              <p className="lesson-takeaway"><strong>{text.takeawayLabel}:</strong> {lesson.takeaway}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="exercise-section" aria-labelledby="exercise-title">
        <div className="exercise-heading">
          <div>
            <p className="eyebrow">{text.exerciseEyebrow}</p>
            <h2 id="exercise-title">{text.exerciseTitle}</h2>
            <p>{text.exerciseIntro}</p>
          </div>
          <ListChecks aria-hidden="true" size={46} strokeWidth={1.8} />
        </div>
        <ol className="exercise-tasks">
          {text.tasks.map((task) => <li key={task}>{task}</li>)}
        </ol>
        <figure className="learning-code-sample code-sample-wrong">
          <figcaption>{text.brokenLabel}</figcaption>
          <pre><code><CodeLines code={brokenExercise} highlights={exerciseHighlights} /></code></pre>
        </figure>
        <details className="exercise-solution">
          <summary>{text.solutionLabel}</summary>
          <div className="solution-content">
            <h3>{text.solutionTitle}</h3>
            <p>{text.solutionText}</p>
            <figure className="learning-code-sample code-sample-fixed">
              <figcaption>{text.fixedLabel}</figcaption>
              <pre><code><CodeLines code={fixedExercise} /></code></pre>
            </figure>
          </div>
        </details>
      </section>

      <section className="teacher-section" aria-labelledby="teacher-title">
        <div>
          <p className="eyebrow"><Users aria-hidden="true" size={20} />{text.teacherTitle}</p>
          <h2 id="teacher-title">{text.teacherTitle}</h2>
          <p>{text.teacherText}</p>
        </div>
        <ol>
          {text.teacherSteps.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </section>

      <div className="learning-actions">
        <a className="button" href={`/${locale}#playground`}>{text.checkerCta}<ArrowRight aria-hidden="true" size={20} /></a>
        <a className="learning-rule-link" href={`/${locale}/rules`}>{text.rulesCta}<ArrowRight aria-hidden="true" size={20} /></a>
      </div>

      <nav className="learning-languages" aria-label={text.languageLabel}>
        {locales.map((item) => <a href={`/${item}/learn`} hrefLang={item} aria-current={item === locale ? 'page' : undefined} key={item}>{copy[item].languageName}</a>)}
      </nav>
    </InfoPage>
  );
}
