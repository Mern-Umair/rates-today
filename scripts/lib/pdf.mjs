// Reads the text out of a PDF (SBP and OGRA publish their rates as PDFs).
// Uses the same pdf.js library the browser build ships with, in its Node build.
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pdfjsPath = require.resolve("pdfjs-dist/legacy/build/pdf.mjs");

/**
 * Returns the text of every page, pages separated by a form feed and
 * text runs separated by " | ", which keeps table cells apart.
 */
export async function pdfText(bytes) {
  const pdfjs = await import(`file:///${pdfjsPath.replace(/\\/g, "/")}`);
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(bytes),
    isEvalSupported: false,
    disableFontFace: true,
    verbosity: 0,
  }).promise;
  const pages = [];
  for (let number = 1; number <= doc.numPages; number++) {
    const page = await doc.getPage(number);
    const content = await page.getTextContent();
    pages.push(
      content.items
        .map((item) => ("str" in item ? item.str : ""))
        .filter((text) => text.trim() !== "")
        .join(" | "),
    );
  }
  await doc.cleanup?.();
  return pages.join("\f");
}
