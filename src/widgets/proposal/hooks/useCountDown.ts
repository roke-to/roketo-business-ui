import {differenceInMilliseconds, parseISO} from 'date-fns';
import {useEffect, useState} from 'react';
import useCountDown from 'react-countdown-hook';

function formatCountdown(seconds: number) {
  const d = Math.floor(seconds / (24 * 3600));
  const h = Math.floor((seconds - d * 24 * 3600) / 3600);
  const m = Math.floor((seconds - d * 24 * 3600 - h * 3600) / 60);
  const s = Math.floor(seconds - d * 24 * 3600 - h * 3600 - m * 60);

  let res = '';

  if (d > 0) {
    res += `${d}d `;
  }

  if (h > 0) {
    res += `${h}h `;
  }

  if (m > 0) {
    res += `${m}m `;
  }

  if (!res && s > 0 && s < 60) {
    res = 'less than a minute';
  }

  return res;
}

export function useCountdown(endsAt: string | number): string | null | undefined {
  // const endsAtFormatted = typeof endsAt === 'string' ? parseInt(endsAt, 10) : endsAt;
  const endsAtFormatted = typeof endsAt === 'string' ? parseISO(endsAt) : endsAt;

  const start = new Date().getTime();
  const [started, setStarted] = useState(false);

  const diff = differenceInMilliseconds(start, endsAtFormatted);

  const [timeLeft, actions] = useCountDown(diff, 1000 * 15);

  useEffect(() => {
    if (!started) {
      actions.start();
      setStarted(true);
    }

    return () => {
      actions.pause();
    };
  }, [started, actions]);

  if (!started) {
    return undefined;
  }

  return timeLeft > 0 ? formatCountdown(timeLeft / 1000) : null;
}
