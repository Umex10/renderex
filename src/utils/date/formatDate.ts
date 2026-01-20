import { DATE_LABELS } from "../../../constants/dateFormats";

/**
 * Formats an ISO date string as a human-readable relative time.
 *
 * Examples: "just now", "3 minutes ago", "about 2 days ago".
 *
 * @param isoString - An ISO-8601 date string.
 * @returns A relative time string in English.
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();

  // Time difference in milliseconds
  const diffMs = now.getTime() - date.getTime();

  // Conversions
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  // Outputs
  const {
    JUST_NOW, MINUTE, MINUTES, HOUR, HOURS,
    DAY, DAYS, WEEK, WEEKS, MONTH, MONTHS,
    YEAR, YEARS
  } = DATE_LABELS;

  // Output logic
  if (diffSeconds < 60) return JUST_NOW;

  if (diffMinutes < 60) {
    return diffMinutes === 1
      ? `1 ${MINUTE}`
      : `${diffMinutes} ${MINUTES}`;
  }

  if (diffHours < 24) {
    const label = diffHours === 1 ? HOUR : HOURS;
    return `about ${diffHours} ${label}`;
  }

  if (diffDays < 7) {
    const label = diffDays === 1 ? DAY : DAYS;
    return `about ${diffDays} ${label}`;
  }

  if (diffWeeks < 4) {
    const label = diffWeeks === 1 ? WEEK : WEEKS;
    return `about ${diffWeeks} ${label}`;
  }

  if (diffMonths < 12) {
    const label = diffMonths === 1 ? MONTH : MONTHS;
    return `about ${diffMonths} ${label}`;
  }

  const label = diffYears === 1 ? YEAR : YEARS;
  return `about ${diffYears} ${label}`;

}