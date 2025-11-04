// Safe dynamic imports: try several pdfjs-dist paths, then pdf-parse fallback, plus mammoth
let pdfjsLib = null;
let pdfParse = null;
let mammoth = null;

async function loadParsers() {
  // Force pdf-parse if env var set
  if (process.env.FORCE_PDF_PARSE === "1") {
    const mod = await import("pdf-parse").catch(() => null);
    pdfParse = mod?.default ?? mod;
    if (pdfParse) console.log("FORCED: using pdf-parse fallback for PDF parsing.");
    else console.warn("FORCED: pdf-parse not installed.");
    // still try to load mammoth
    try {
      const m = await import("mammoth").catch(() => null);
      mammoth = m?.default ?? m;
      if (mammoth) console.log("mammoth available for DOCX parsing.");
    } catch (e) {
      mammoth = null;
    }
    return;
  }

  // Try a few known pdfjs-dist entry points (order matters)
  const pdfjsCandidates = [
    "pdfjs-dist/legacy/build/pdf.js",
    "pdfjs-dist/build/pdf.js",
    "pdfjs-dist/webpack"
  ];
  for (const p of pdfjsCandidates) {
    try {
      const mod = await import(p);
      pdfjsLib = mod?.default ?? mod;
      console.log(`Using ${p} for PDF parsing.`);
      break;
    } catch (e) {
      // continue to next candidate
    }
  }

  // If pdfjs not found, try pdf-parse (CJS) as fallback
  if (!pdfjsLib) {
    try {
      const mod = await import("pdf-parse").catch(() => null);
      pdfParse = mod?.default ?? mod;
      if (pdfParse) console.log("Using pdf-parse fallback for PDF parsing.");
    } catch (e) {
      pdfParse = null;
    }
  }

  // Try mammoth for docx
  try {
    const m = await import("mammoth").catch(() => null);
    mammoth = m?.default ?? m;
    if (mammoth) console.log("mammoth available for DOCX parsing.");
  } catch (e) {
    mammoth = null;
  }
}

await loadParsers();

export async function parseFileBuffer(file) {
const name = (file.originalname||"").toLowerCase();
try {
// PDF handling: prefer pdfjs-dist, fallback to pdf-parse
if (file.mimetype === "application/pdf" || name.endsWith(".pdf")) {
if (pdfjsLib && typeof pdfjsLib.getDocument === "function") {
const loadingTask = pdfjsLib.getDocument({ data: file.buffer });
const pdf = await loadingTask.promise;
let fullText = "";
for (let i = 1; i <= pdf.numPages; i++) {
const page = await pdf.getPage(i);
const content = await page.getTextContent();
const pageText = content.items.map(it => it.str || "").join(" ");
fullText += pageText + "\n\n";
}
try { if (typeof pdf.destroy === "function") await pdf.destroy(); } catch (_) {}
return fullText;
}
if (pdfParse) {
// pdf-parse accepts a Buffer and returns { text }
const data = await pdfParse(file.buffer);
return data?.text || "";
}
// Final fallback message
throw new Error("No PDF parser available. Install pdfjs-dist or pdf-parse.");
}
// DOCX handling via mammoth
if (
  file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
  name.endsWith(".docx") ||
  file.mimetype === "application/octet-stream"
) {
  if (!mammoth) throw new Error("DOCX parser not available (mammoth).");
  const result = await mammoth.extractRawText({ buffer: file.buffer });
  return result?.value || "";
}

// Default: try to decode as UTF-8 text
return file.buffer.toString("utf8");

} catch (err) {
console.error("parseFileBuffer error:", err);
throw err;
}
}
