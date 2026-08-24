'use client';

import {
  BookOpen, Copy, FileText, FolderOpen, Info, ListChecks,
  RotateCcw, SearchCheck, ShieldCheck, Trash2,
} from 'lucide-react';
import { useDeferredValue, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, KeyboardEvent, UIEvent } from 'react';
import type { Copy as CopyText, Locale } from '../lib/i18n';
import { interpolate } from '../lib/interpolate';
import type { Finding } from '../lib/lint';
import { lintConfig } from '../lib/lint';
import { ruleSlugByCode } from '../lib/rule-slugs';

const example = `# A config with a few hidden surprises
Host *
  ForwardAgent yes
  ServerAliveInterval 30
  ControlPath ~/.ssh/control-%h

Host github.com
  User git
  Ciphers aes256-gcm@openssh.com,3des-cbc

Host github.com
  User deploy
  User git`;

type Props = { copy: CopyText; locale: Locale };

const findingTarget = (finding: Finding) => String(
  finding.data.target ?? finding.data.algorithm ?? finding.data.pattern ?? finding.data.directive ?? '',
);

function HighlightedLine({ active, line, number }: { active: Finding | null; line: string; number: number }) {
  const isActive = active?.line === number;
  const target = isActive && active ? findingTarget(active) : '';
  const start = target ? line.toLowerCase().indexOf(target.toLowerCase()) : -1;

  return (
    <span className={`editor-line${isActive ? ' is-active' : ''}`} data-line={number}>
      {start >= 0 ? (
        <>{line.slice(0, start)}<mark>{line.slice(start, start + target.length)}</mark>{line.slice(start + target.length)}</>
      ) : line || ' '}
    </span>
  );
}

export function Playground({ copy, locale }: Props) {
  const [source, setSource] = useState(example);
  const [status, setStatus] = useState('');
  const [dragging, setDragging] = useState(false);
  const [activeFinding, setActiveFinding] = useState<Finding | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLPreElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const deferredSource = useDeferredValue(source);
  const lines = useMemo(() => source.split('\n'), [source]);
  const result = useMemo(() => lintConfig(deferredSource), [deferredSource]);

  const selectLine = (line: number) => {
    const textarea = inputRef.current;
    if (!textarea) return;
    const rows = lines;
    const start = rows.slice(0, line - 1).join('\n').length + (line > 1 ? 1 : 0);
    textarea.focus();
    textarea.setSelectionRange(start, start + (rows[line - 1]?.length ?? 0));
  };

  const syncScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    if (!mirrorRef.current) return;
    mirrorRef.current.scrollTop = event.currentTarget.scrollTop;
    mirrorRef.current.scrollLeft = event.currentTarget.scrollLeft;
  };

  const check = () => {
    const message = copy.checkedMessages[Math.floor(Math.random() * copy.checkedMessages.length)];
    setStatus(message);
    document.querySelector('.result-pane')?.scrollIntoView({ block: 'nearest' });
  };

  const readFile = async (file?: File) => {
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setStatus('File is larger than 1 MB.');
      return;
    }
    setSource(await file.text());
    setStatus(file.name);
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    void readFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    void readFile(event.dataTransfer.files?.[0]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      check();
    }
  };

  const copyConfig = async () => {
    await navigator.clipboard.writeText(source);
    setStatus(copy.copied);
  };

  const countText = result.findings.length === 0
    ? source.trim() ? copy.cleanResult : copy.emptyResult
    : interpolate(copy.resultCount, { count: result.findings.length });

  return (
    <section className="terminal" id="playground" aria-label={copy.eyebrow}>
      <div className="terminal-bar">
        <span className="terminal-title">~/.ssh/config</span>
        <span className="terminal-state"><ShieldCheck aria-hidden="true" size={19} strokeWidth={2.3} />{copy.localCheck}</span>
      </div>
      <div className="terminal-grid">
        <div
          className={`editor-pane${dragging ? ' is-dragging' : ''}`}
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="pane-heading">
            <span className="pane-label"><FileText aria-hidden="true" size={19} />{copy.configLabel}</span>
            <span className="line-count">{lines.length} {copy.lines}</span>
          </div>
          <p className="config-helper" id="config-helper">{copy.configHelper}</p>
          <div className="editor-stack">
            <pre ref={mirrorRef} className="editor-mirror" aria-hidden="true">
              {lines.map((line, index) => <HighlightedLine key={index} active={activeFinding} line={line} number={index + 1} />)}
            </pre>
            <textarea
              ref={inputRef}
              className="config-input"
              id="config-input"
              aria-label={copy.configLabel}
              aria-describedby="config-helper browser-limit"
              placeholder={'Host github.com\n  User git\n  IdentityFile ~/.ssh/id_ed25519'}
              spellCheck={false}
              value={source}
              onChange={(event) => { setSource(event.target.value); setStatus(''); }}
              onKeyDown={handleKeyDown}
              onScroll={syncScroll}
            />
          </div>
          <input ref={fileRef} hidden type="file" accept=".conf,.config,text/plain" onChange={handleFile} />
          <div className="terminal-actions">
            <button className="button" type="button" onClick={check}><SearchCheck aria-hidden="true" size={20} />{copy.check}</button>
            <button className="button button-secondary" type="button" onClick={() => fileRef.current?.click()}><FolderOpen aria-hidden="true" size={20} />{copy.openFile}</button>
            <button className="icon-text-button" type="button" onClick={() => { setSource(example); setStatus(''); }}><RotateCcw aria-hidden="true" size={18} />{copy.loadExample}</button>
            <button className="icon-text-button" type="button" onClick={() => { setSource(''); setStatus(''); }}><Trash2 aria-hidden="true" size={18} />{copy.clear}</button>
            <button className="icon-text-button" type="button" onClick={() => void copyConfig()}><Copy aria-hidden="true" size={18} />{copy.copy}</button>
          </div>
          <div className="editor-status">
            <span>{copy.shortcut}</span>
            <span aria-live="polite">{status}</span>
          </div>
        </div>

        <div className="result-pane" role="region" aria-labelledby="result-heading">
          <span className="pane-label"><ListChecks aria-hidden="true" size={19} />{copy.resultLabel}</span>
          <h2 className="result-heading" id="result-heading" aria-live="polite" aria-atomic="true">{countText}</h2>
          {result.findings.length > 0 && (
            <ol className="finding-list">
              {result.findings.map((finding) => {
                const ruleSlug = ruleSlugByCode[finding.code];
                return (
                  <li
                    className="finding-shell"
                    key={`${finding.code}-${finding.line}-${finding.messageKey}`}
                    onMouseEnter={() => setActiveFinding(finding)}
                    onMouseLeave={() => setActiveFinding(null)}
                    onFocus={() => setActiveFinding(finding)}
                    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveFinding(null); }}
                  >
                    <button className={`finding finding-${finding.severity}`} type="button" onClick={() => selectLine(finding.line)}>
                      <strong>{copy.line} {finding.line} <span aria-hidden="true">/</span> {finding.code}</strong>
                      <span>{interpolate(copy.findingMessages[finding.messageKey], finding.data)}</span>
                      <small>{interpolate(copy.findingHints[finding.messageKey], finding.data)}</small>
                    </button>
                    {ruleSlug && <a className="finding-doc" href={`/${locale}/rules/${ruleSlug}`}><BookOpen aria-hidden="true" size={16} />{copy.learnRule}</a>}
                  </li>
                );
              })}
            </ol>
          )}
          <div className="browser-limit" id="browser-limit">
            <p><Info aria-hidden="true" size={18} />{copy.browserNotice}</p>
            {result.hasInclude && <p>{copy.includeNotice}</p>}
            {result.hasIdentityFile && <p>{copy.identityNotice}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
