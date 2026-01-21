import { sanitize } from "@/utils/download/sanitize";

describe("sanitize method", () => {

  it("should sanitze the filename correctly", () => {

    const invalidNames = [
      "invoice:2024_status?*final*.pdf",     // Windows forbidden characters
      "/usr/bin/config.sh",                  // Absolute paths (Linux/Unix)
      "<Untitled Project | Draft>",          // Web/HTML tags and pipe symbol
      "my\\document\\test.docx",             // Windows backslashes (path separators)
      "hello > world.txt",                   // Greater-than symbol
      "  space  between  words  ",           // Leading/trailing spaces and multiple internal spaces
      "report\t2024\nfinal.pdf",             // Tab (\t) and newline (\n) characters
      "what:is*this?.png",                   // Mix of multiple forbidden characters
      "double   space.txt",                  // Multiple internal spaces
      "trailing dots...",                    // Dots are allowed, but testing trim/regex behavior
      "!!! <script>alert(1)</script> !!!"    // XSS attempt / HTML tag injection
    ];

    const validNames = [
      "invoice2024_statusfinal.pdf",         // Cleaned filename
      "usrbinconfig.sh",                     // Slashes removed
      "Untitled Project Draft",              // Tags removed, double space collapsed to single
      "mydocumenttest.docx",                 // Backslashes removed
      "hello world.txt",                     // Brackets removed
      "space between words",                 // Trimmed edges, internal spaces collapsed
      "report 2024 final.pdf",               // Tab and newline converted to single spaces
      "whatisthis.png",                      // All forbidden symbols removed
      "double space.txt",                    // Triple space collapsed to single
      "trailing dots...",                    // Remains unchanged (dots are valid)
      "!!! scriptalert(1)script !!!"         // HTML tags neutralized
    ];

    invalidNames.forEach((name, index) => {
      const sanitized = sanitize(name);
      expect(sanitized).toBe(validNames[index]);
    })
  });

})