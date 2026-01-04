/**
 * Generates a random hex color in the format `#RRGGBB`.
 *
 * @returns A hex color string (e.g. `#3fa2ff`).
 */
export const getRandomHexColor = (): string => {
  /** @returns A random integer between 0 and 255 (inclusive). */
  const randomChannel = () => Math.floor(Math.random() * 256);

  /**
   * Converts a number to a two-digit lowercase hex string.
   * @param n - A number in the range 0-255.
   * @returns A two-character hex string (e.g. 0 -> `00`, 255 -> `ff`).
   */
  const toHex = (n: number) => n.toString(16).padStart(2, "0");

  const r = toHex(randomChannel());
  const g = toHex(randomChannel());
  const b = toHex(randomChannel());

  return `#${r}${g}${b}`;
};