/** Offset in ms of `timeZone` from UTC at the given instant. */
function offsetAt(instant: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(instant));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return asUtc - instant;
}

/**
 * Converts a wall-clock time from an <input type="datetime-local"> ("2026-10-14T18:30")
 * in the given IANA timezone to a UTC ISO string.
 */
export function wallTimeToIso(local: string, timeZone: string) {
  const [date, time] = local.split('T');
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  // Two passes settle the offset across DST boundaries.
  let utc = guess - offsetAt(guess, timeZone);
  utc = guess - offsetAt(utc, timeZone);
  return new Date(utc).toISOString();
}

export function isTimeZone(tz: string) {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
