'use client';

import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

type Props = {
  darkLabel: string;
  lightLabel: string;
};

export function ThemeToggle({ darkLabel, lightLabel }: Props) {
  const theme = useSyncExternalStore(
    (notify) => {
      window.addEventListener('sshconfig-lint-theme-change', notify);
      return () => window.removeEventListener('sshconfig-lint-theme-change', notify);
    },
    () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
    () => 'light' as Theme,
  );

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem('sshconfig-lint-theme', next);
    } catch {
      // The visual toggle still works when storage is disabled.
    }
    window.dispatchEvent(new Event('sshconfig-lint-theme-change'));
  };

  const label = theme === 'dark' ? lightLabel : darkLabel;

  return (
    <button className="theme-toggle" type="button" onClick={toggle} aria-label={label} title={label}>
      {theme === 'dark' ? <Sun aria-hidden="true" size={21} /> : <Moon aria-hidden="true" size={21} />}
    </button>
  );
}
