import {format, parseISO} from 'date-fns';

export const toMillis = (timePeriod: string): number => Math.round(Number(timePeriod) / 1000000);

export function formatISODate(
  date: string | null | undefined,
  expectedFormatPattern?: string,
): string {
  if (!date) {
    return 'n/a';
  }

  try {
    const parsed = parseISO(date);

    return format(parsed, expectedFormatPattern ?? 'h:mm aaa');
  } catch (e) {
    return 'n/a';
  }
}
