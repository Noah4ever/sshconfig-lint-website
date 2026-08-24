'use client';

import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { interpolate } from '../lib/interpolate';

const repository = 'https://github.com/Noah4ever/sshconfig-lint';

type Props = {
  initialStars: number;
  label: string;
  locale: string;
};

export function GitHubStars({ initialStars, label, locale }: Props) {
  const [displayStars, setDisplayStars] = useState(initialStars);
  const [announcedStars, setAnnouncedStars] = useState(initialStars);

  useEffect(() => {
    const controller = new AbortController();
    let animationFrame = 0;

    async function refreshStars() {
      try {
        const response = await fetch('/api/github-stars', { signal: controller.signal });
        if (!response.ok) return;
        const payload: unknown = await response.json();
        const latestStars = typeof payload === 'object' && payload !== null && 'stars' in payload
          ? Number(payload.stars)
          : Number.NaN;
        if (!Number.isInteger(latestStars) || latestStars < 0 || latestStars === initialStars) return;

        if (latestStars < initialStars || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setDisplayStars(latestStars);
          setAnnouncedStars(latestStars);
          return;
        }

        const startedAt = performance.now();
        const duration = Math.min(1100, 600 + (latestStars - initialStars) * 45);
        const tick = (now: number) => {
          const progress = Math.min(1, (now - startedAt) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayStars(Math.min(latestStars, Math.floor(initialStars + (latestStars - initialStars) * eased)));
          if (progress < 1) animationFrame = requestAnimationFrame(tick);
          else setAnnouncedStars(latestStars);
        };
        animationFrame = requestAnimationFrame(tick);
      } catch {
        // The build-time count remains visible when GitHub is unavailable.
      }
    }

    void refreshStars();
    return () => {
      controller.abort();
      cancelAnimationFrame(animationFrame);
    };
  }, [initialStars]);

  const formattedStars = new Intl.NumberFormat(locale).format(displayStars);
  const visibleLabel = interpolate(label, { count: formattedStars });
  const accessibleLabel = interpolate(label, { count: new Intl.NumberFormat(locale).format(announcedStars) });

  return (
    <a className="star-count" href={`${repository}/stargazers`}>
      <Star aria-hidden="true" size={19} fill="currentColor" />
      <span aria-hidden="true" className="star-count-number">{visibleLabel}</span>
      <span className="sr-only" aria-live="polite">{accessibleLabel}</span>
    </a>
  );
}
