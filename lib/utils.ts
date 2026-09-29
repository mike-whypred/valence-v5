import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(first: string, last?: string) {
  return `${first.charAt(0)}${last?.charAt(0) ?? ''}`.toUpperCase();
}

export function fitPercent(similarity: number) {
  return Math.round(Math.max(0, Math.min(1, similarity)) * 100);
}

/** Event times are shown in the event's own timezone, not the viewer's or the server's. */
export function formatEventDate(iso: string, timeZone = 'UTC') {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
    timeZoneName: 'short',
  }).format(new Date(iso));
}
