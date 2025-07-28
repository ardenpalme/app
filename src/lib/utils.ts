import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

/**
 * Formats a date that comes from the server as a UTC date string.
 * This prevents off-by-one-day errors caused by timezone differences
 * when a date like '2024-07-31' (UTC midnight) is displayed in a
 * timezone behind UTC (e.g., in the US).
 * @param dateInput The date string or Date object from the server.
 * @param formatStr The date-fns format string to apply.
 * @returns The correctly formatted date string for display.
 */
export const formatDisplayDate = (dateInput: string | Date, formatStr: string): string => {
  const date = new Date(dateInput)
  // getTimezoneOffset returns the difference in minutes between UTC and local time.
  // It's positive for timezones behind UTC (e.g., Americas) and negative for those ahead.
  // We add this offset to the UTC time to get the intended time in the local timezone's meridian.
  const userTimezoneOffset = date.getTimezoneOffset() * 60000
  const correctedDate = new Date(date.getTime() + userTimezoneOffset)
  return format(correctedDate, formatStr)
}

export const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

export const formatDuration = (seconds: number) => {
  const s = Math.floor(seconds)
  return `${s.toString().padStart(2, "0")}s`
}

export function getDateFromMinutes(minutes: number) {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set time to midnight
  now.setMinutes(minutes);
  return now;
}

