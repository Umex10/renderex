
/**
 * Sanitizes a string for safe use as a filename by removing characters that are
 * commonly invalid on major filesystems.
 *
 * @param name - The raw filename.
 * @returns A sanitized filename (trimmed and with invalid characters removed).
 */
export function sanitize(name: string) {

  const sanitized = name.replace(/[<>:"/\\|?*]+/g, "").
  replace(/\s+/g, " ")
  .trim()

  return sanitized || "unnamed_file";
}