export const DATE_LABELS = {
  JUST_NOW: "just now",
  MINUTE: "minute durated",
  MINUTES: "minutes durated",
  HOUR: "hour durated",
  HOURS: "hours durated",
  DAY: "day durated",
  DAYS: "days durated",
  WEEK: "week durated",
  WEEKS: "weeks durated",
  MONTH: "month durated",
  MONTHS: "months durated",
  YEAR: "year durated",
  YEARS: "years durated",
} as const;

export type DateLabelKey = keyof typeof DATE_LABELS;