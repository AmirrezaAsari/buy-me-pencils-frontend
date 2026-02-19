'use client';

import { useState, useEffect } from 'react';

const DEFAULT_SPEED_MS = 45;

export default function TypingText({
  text,
  speedMs = DEFAULT_SPEED_MS,
  className = '',
  cursor = true,
}: {
  text: string;
  speedMs?: number;
  className?: string;
  cursor?: boolean;
}) {
  const [display, setDisplay] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplay('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
        return;
      }
      setDisplay(text.slice(0, i + 1));
      i += 1;
    }, speedMs);
    return () => clearInterval(id);
  }, [text, speedMs]);

  return (
    <span className={className}>
      {display}
      {cursor && !done && <span className="animate-pulse" aria-hidden>|</span>}
    </span>
  );
}
