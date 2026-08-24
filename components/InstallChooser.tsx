'use client';

import { Boxes, Check, Clipboard, Command, Package } from 'lucide-react';
import { useState } from 'react';

const methods = [
  { id: 'homebrew', label: 'Homebrew', command: 'brew install Noah4ever/tap/sshconfig-lint', Icon: Command },
  { id: 'cargo', label: 'Cargo', command: 'cargo install sshconfig-lint', Icon: Package },
  { id: 'aur', label: 'AUR', command: 'yay -S sshconfig-lint-bin', Icon: Boxes },
] as const;

export function InstallChooser({ copyLabel, copiedLabel, groupLabel }: { copyLabel: string; copiedLabel: string; groupLabel: string }) {
  const [selected, setSelected] = useState<(typeof methods)[number]['id']>('homebrew');
  const [copied, setCopied] = useState(false);
  const method = methods.find((item) => item.id === selected) ?? methods[0];

  const copyCommand = async () => {
    await navigator.clipboard.writeText(method.command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="install-chooser">
      <div className="install-tabs" role="group" aria-label={groupLabel}>
        {methods.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={selected === id ? 'is-selected' : ''}
            type="button"
            aria-pressed={selected === id}
            onClick={() => { setSelected(id); setCopied(false); }}
          >
            <Icon aria-hidden="true" size={20} strokeWidth={2.2} />
            {label}
          </button>
        ))}
      </div>
      <div className="install-command" aria-live="polite">
        <code>{method.command}</code>
        <button type="button" onClick={() => void copyCommand()}>
          {copied ? <Check aria-hidden="true" size={20} /> : <Clipboard aria-hidden="true" size={20} />}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
    </div>
  );
}
