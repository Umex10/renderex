import { getRandomHexColor } from "@/utils/color/getRandomHexColor"

describe("HexColor Regex Test", () => {
  it("should return a valid hex color string", () => {
    const color = getRandomHexColor();
    
    // Regex explanation:
    // ^        -> Start of the string
    // #        -> Must start with '#'
    // [0-9a-f] -> Allowed characters (0-9 and a-f)
    // {6}      -> Exactly 6 times
    // $        -> End of the string
    expect(color).toMatch(/^#[0-9a-f]{6}$/);
  });
});