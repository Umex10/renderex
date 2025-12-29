export const getRandomHexColor = (): string => {
  const randomChannel = () => Math.floor(Math.random() * 256); // 0-255
  const toHex = (n: number) => n.toString(16).padStart(2, "0"); // 0 → "00", 255 → "ff"

  const r = toHex(randomChannel());
  const g = toHex(randomChannel());
  const b = toHex(randomChannel());

  return `#${r}${g}${b}`;
};