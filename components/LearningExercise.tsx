'use client';

import { Check, RotateCcw, X } from 'lucide-react';
import { useState } from 'react';
import type { LearningQuizCopy } from '../lib/learning';

type Highlight = { line: number; target: string };

type Props = {
  brokenConfig: string;
  brokenLabel: string;
  fixedConfig: string;
  fixedLabel: string;
  highlights: Highlight[];
  quiz: LearningQuizCopy;
  solutionText: string;
  solutionTitle: string;
};

function CodeLines({ activeLine, code, highlights = [] }: { activeLine?: number; code: string; highlights?: Highlight[] }) {
  return code.split('\n').map((line, index) => {
    const lineNumber = index + 1;
    const highlight = highlights.find((item) => item.line === lineNumber);
    const start = highlight ? line.indexOf(highlight.target) : -1;
    return (
      <span className={`rule-code-line${lineNumber === activeLine ? ' is-question-active' : ''}`} data-line={lineNumber} key={lineNumber}>
        {highlight && start >= 0 ? <>{line.slice(0, start)}<mark>{highlight.target}</mark>{line.slice(start + highlight.target.length)}</> : line || ' '}
      </span>
    );
  });
}

const fill = (template: string, values: Record<string, string | number>) =>
  Object.entries(values).reduce((result, [key, value]) => result.replace(`{${key}}`, String(value)), template);

export function LearningExercise({ brokenConfig, brokenLabel, fixedConfig, fixedLabel, highlights, quiz, solutionText, solutionTitle }: Props) {
  const [answers, setAnswers] = useState<Array<number | null>>(() => quiz.questions.map(() => null));
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const correctCount = answers.reduce<number>((count, answer, index) => count + (answer === quiz.questions[index].correct ? 1 : 0), 0);
  const completed = correctCount === quiz.questions.length;
  const activeLine = activeQuestion === null ? undefined : quiz.questions[activeQuestion].line;
  const progressLabel = fill(quiz.progress, { correct: correctCount, total: quiz.questions.length });

  const answerQuestion = (questionIndex: number, optionIndex: number) => {
    setAnswers((current) => current.map((answer, index) => index === questionIndex ? optionIndex : answer));
    setActiveQuestion(questionIndex);
  };

  const reset = () => {
    setAnswers(quiz.questions.map(() => null));
    setActiveQuestion(null);
  };

  return (
    <div className="interactive-exercise">
      <div className="interactive-exercise-grid">
        <figure className="learning-code-sample code-sample-wrong interactive-config">
          <figcaption>{brokenLabel}</figcaption>
          <pre><code><CodeLines activeLine={activeLine} code={brokenConfig} highlights={highlights} /></code></pre>
        </figure>

        <div className="quiz-panel">
          <div className="quiz-progress">
            <strong aria-live="polite">{progressLabel}</strong>
            <progress aria-label={progressLabel} max={quiz.questions.length} value={correctCount} />
          </div>

          <div className="quiz-questions">
            {quiz.questions.map((question, questionIndex) => {
              const selected = answers[questionIndex];
              const isCorrect = selected === question.correct;
              return (
                <fieldset
                  className="quiz-question"
                  key={question.prompt}
                  onFocusCapture={() => setActiveQuestion(questionIndex)}
                  onMouseEnter={() => setActiveQuestion(questionIndex)}
                  onMouseLeave={() => setActiveQuestion(null)}
                >
                  <legend>
                    <span>{fill(quiz.questionLabel, { number: questionIndex + 1 })}</span>
                    {question.prompt}
                  </legend>
                  <div className="quiz-options">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selected === optionIndex;
                      return (
                        <label className={`quiz-option${isSelected ? isCorrect ? ' is-correct' : ' is-wrong' : ''}`} key={option}>
                          <input
                            checked={isSelected}
                            name={`ssh-learning-question-${questionIndex}`}
                            onChange={() => answerQuestion(questionIndex, optionIndex)}
                            type="radio"
                            value={optionIndex}
                          />
                          <span>{option}</span>
                          {isSelected && (isCorrect
                            ? <Check aria-hidden="true" size={21} strokeWidth={3} />
                            : <X aria-hidden="true" size={21} strokeWidth={3} />)}
                        </label>
                      );
                    })}
                  </div>
                  {selected !== null && (
                    <p className={`quiz-feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`} aria-live="polite">
                      <strong>{isCorrect ? quiz.correctLabel : quiz.wrongLabel}.</strong> {question.explanation}
                    </p>
                  )}
                </fieldset>
              );
            })}
          </div>
        </div>
      </div>

      {completed && (
        <section className="quiz-complete" aria-labelledby="quiz-complete-title">
          <div className="quiz-complete-heading">
            <div>
              <p className="eyebrow"><Check aria-hidden="true" size={20} />{quiz.completeTitle}</p>
              <h3 id="quiz-complete-title">{solutionTitle}</h3>
              <p>{quiz.completeText} {solutionText}</p>
            </div>
            <button className="quiz-reset" onClick={reset} type="button"><RotateCcw aria-hidden="true" size={19} />{quiz.reset}</button>
          </div>
          <figure className="learning-code-sample code-sample-fixed">
            <figcaption>{fixedLabel}</figcaption>
            <pre><code><CodeLines code={fixedConfig} /></code></pre>
          </figure>
        </section>
      )}
    </div>
  );
}
