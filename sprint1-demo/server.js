import 'dotenv/config';
import express from "express";
import path from "path";
import multer from "multer";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { parseFileBuffer as parseFileBufferService } from "./services/resumeParserService.js";
import { aiGenerateRecommendations as aiGenerateRecommendationsService } from "./services/jobMatchingService.js";

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

// ESM-safe __filename/__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const uploadsDir = path.join(__dirname, "uploads");
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

// Helpers (kept compact)
function normalizeUnique(list) { return Array.from(new Set(list||[])).filter(Boolean).sort((a,b)=>a.localeCompare(b)); }
function toLines(text) { return (text||"").replace(/\r/g,"").split(/\n/).map(s=>s.trim()).filter(Boolean); }

function splitSections(text) {
  // Keep blank line separators so we can group experience blocks later.
  const lines = (text||"").replace(/\r/g,"").split(/\n/);
  const sections = {};
  let current = "header";
  sections[current] = [];

  for (const raw of lines) {
    const line = raw || ""; // preserve empty lines
    const trimmed = line.trim();
    const lower = trimmed.replace(/:$/g, "").toLowerCase();

    // Detect headings anywhere on the line (not strict equality)
    if (/\b(experience|work experience|professional experience|employment history|work history|relevant experience|professional background)\b/i.test(lower)) {
      current = "experience"; sections[current] = sections[current] || []; continue;
    }
    if (/\b(skills|technical skills|skills & technologies|skills and technologies|technical competencies)\b/i.test(lower)) {
      current = "skills"; sections[current] = sections[current] || []; continue;
    }
    if (/\b(education|academic background|education & training|academic qualifications)\b/i.test(lower)) {
      current = "education"; sections[current] = sections[current] || []; continue;
    }
    if (/\b(summary|professional summary|profile|objective)\b/i.test(lower)) {
      current = "summary"; sections[current] = sections[current] || []; continue;
    }

    sections[current] = sections[current] || [];
    // push original raw line to preserve spacing
    sections[current].push(line);
  }

  const out = {};
  for (const k of Object.keys(sections)) {
    // join preserving blank lines, then trim leading/trailing whitespace
    out[k] = sections[k].join("\n").trim();
  }
  return out;
}

function parseExperience(sectionText) {
  const entries = [];
  if (!sectionText) return entries;

  // Split into blocks separated by one or more blank lines
  const blocks = sectionText.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
  for (const b of blocks) {
    const item = { raw: b, title: null, company: null, date: null };
    const lines = b.split(/\n/).map(l => l.trim()).filter(Boolean);
    const first = lines[0] || '';

    // Try patterns: "Title - Company", "Title at Company", "Company — Title"
    let m = first.match(/^(.*?)\s+[\-–—]\s+(.*)$/);
    if (m) { item.title = m[1].trim(); item.company = m[2].trim(); }
    else if (/\bat\b/i.test(first)) {
      const parts = first.split(/\bat\b/i).map(s=>s.trim());
      item.title = parts[0]; item.company = parts[1] || null;
    } else {
      // heuristics: if first line contains a company-like token (Inc|LLC|Ltd|Corp) treat as company
      if (/\b(inc|llc|ltd|corp|company|co\.|technologies|solutions)\b/i.test(first)) {
        item.company = first;
        if (lines[1]) item.title = lines[1];
      } else {
        // otherwise assume first is a title
        item.title = first;
        if (lines[1]) {
          // second line often contains company or dates
          if (!/\b(19|20)\d{2}\b/.test(lines[1])) item.company = lines[1];
        }
      }
    }

    // Find date ranges in the block
    const years = b.match(/\b(19|20)\d{2}\b/g) || [];
    if (years.length >= 2) {
      item.date = `${years[0]} - ${years[years.length-1]}`;
    } else {
      const dateRange = b.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\b[\s\S]{0,40}?\b(?:Present|present|\d{4})/);
      if (dateRange) item.date = dateRange[0];
    }

    entries.push(item);
  }
  return entries;
}

function extractContact(text){
  const contact={email:null,phone:null,location:null,linkedin:null,github:null};
  if(!text) return contact;
  const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i);
  const phone = text.match(/(\+?\d{1,3}[\s\-.\(]*)?(\(?\d{3}\)?[\s\-.\)]*)?\d{3}[\s\-.\)]*\d{4}/);
  const linkedin = text.match(/(https?:\/\/)?(www\.)?linkedin\.com\/[^\s,]+/i);
  const github = text.match(/(https?:\/\/)?(www\.)?github\.com\/[^\s,]+/i);
  contact.email = email?.[0] ?? null;
  contact.phone = phone?.[0]?.trim() ?? null;
  contact.linkedin = linkedin ? (linkedin[0].startsWith('http') ? linkedin[0] : `https://${linkedin[0]}`) : null;
  contact.github = github ? (github[0].startsWith('http') ? github[0] : `https://${github[0]}`) : null;
  const lines = toLines(text).slice(0,8);
  for (const l of lines) { if (/[A-Za-z]+,\s*[A-Za-z]{2,}/.test(l) && !/@/.test(l)) { contact.location = l; break; } }
  return contact;
}

function extractSkills(text, sections) {
  const keys = ["javascript","typescript","python","react","angular","vue","node","express","java","c#","c++","sql","postgres","mysql","mongodb","aws","azure","gcp","docker","kubernetes","html","css","sass","git","rest","graphql","tensorflow","pytorch","nlp","machine learning","data analysis","excel","power bi","figma","photoshop"];
  const found = new Set();

  // Prefer explicit skills section tokenization
  if (sections.skills) {
    const tokens = sections.skills.split(/[\n,;•·–—]/).map(s => s.trim()).filter(Boolean);
    for (const t of tokens) {
      const low = t.toLowerCase();
      for (const k of keys) {
        const safe = k.replace(/[#.+\-]/g, '\\$&');
        if (new RegExp(`\\b${safe}\\b`, `i`).test(low)) {
          found.add(k.split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1)).join(' '));
        }
      }
    }
  }

  // Fall back to scanning full text for keywords
  if (!found.size && text) {
    const hay = (text || "").toLowerCase();
    for (const k of keys) {
      if (hay.includes(k)) found.add(k.split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1)).join(' '));
    }
  }

  // If still empty, try to capture comma-separated tokens from the whole text (common resume style)
  if (!found.size && text) {
    const maybe = (text.match(/[A-Za-z+#\-\.]{2,}(?:\s+[A-Za-z+#\-\.]{2,})*(?:,|;)/g) || []).slice(0,40);
    for (const m of maybe) {
      const token = m.replace(/[,;]$/, '').trim();
      if (token.length < 40) found.add(token);
    }
  }

  return normalizeUnique(Array.from(found));
}

function extractYears(text){
  const m = (text||"").match(/(\d+)\s*(?:years|yrs)/i); if(m) return Number(m[1]);
  const years = (text||"").match(/\b(19|20)\d{2}\b/g)||[]; if(years.length>=2){ const first=parseInt(years[0],10), last=parseInt(years[years.length-1],10); if(!isNaN(first)&&!isNaN(last)&&last>=first) return Math.min(40,last-first); } return 0;
}

async function aiGenerateRecommendations(text="", skills=[], education=[], years=0){
  // Local fallback when no model/API keys are present: synthesize simple recommendations
  const hasModel = !!(process.env.GEMINI_API_URL && process.env.GEMINI_API_KEY);
  function localFallback() {
    const out = [];
    if (years <= 1) out.push({ title: "Junior Developer", company: "Various", link: "https://example.com", score: 0.92, reason: "Early-career fit." });
    if (skills && skills.length) {
      out.push({ title: `${skills[0]} Developer`, company: "Tech Co", link: "https://example.com", score: 0.78, reason: `Skill match: ${skills[0]}` });
      if (skills[1]) out.push({ title: `${skills[1]} Engineer`, company: "Startup X", link: "https://example.com", score: 0.72, reason: `Skill match: ${skills[1]}` });
    }
    if (out.length < 2) out.push({ title: "Community Programs & Training", company: "Local Partners", link: "https://example.com", score: 0.5, reason: "Explore training and upskilling opportunities." });
    return out.slice(0,6);
  }

  if (!hasModel) return localFallback();

  // Build a strict prompt that asks the model to return only JSON
  const snippet = (text || "").slice(0, 10000);
  const prompt = `You are an assistant that recommends jobs or programs given a resume.\n\nInput resume (delimited by triple backticks):\n\n\`\`\`\n${snippet}\n\`\`\`\n\nReturn a JSON array of objects. Each object must have: title (string), company (string or empty), link (string URL or empty), score (number between 0 and 1), reason (short string). Return ONLY the JSON array and nothing else.`;

  const payload = { input: { text: prompt } };
  // If a model id is provided, include it (some endpoints use it)
  if (process.env.GEMINI_MODEL) payload.model = process.env.GEMINI_MODEL;

  const url = process.env.GEMINI_API_URL;
  const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GEMINI_API_KEY}` };

  // Helper to clean candidate string
  function cleanCandidateString(s) {
    if (!s || typeof s !== 'string') return '';
    // remove markdown fences and backticks
    s = s.replace(/```\w*\n?/g, '').replace(/```/g, '');
    // Trim leading/trailing whitespace
    s = s.trim();
    return s;
  }

  // Try fetch with timeout and small retry logic
  const timeout = parseInt(process.env.GEMINI_TIMEOUT_MS || '10000', 10);
  const maxAttempts = parseInt(process.env.GEMINI_RETRIES || '2', 10);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const ac = new AbortController();
    const id = setTimeout(() => ac.abort(), timeout);
    try {
      const resp = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload), signal: ac.signal });
      clearTimeout(id);
      if (!resp.ok) {
        const txt = await resp.text().catch(()=>'<no body>');
        console.error(`Gemini API returned ${resp.status} (attempt ${attempt}):`, txt);
        // on 4xx don't retry
        if (resp.status >= 400 && resp.status < 500) break;
        continue;
      }

      const body = await resp.json().catch(async () => {
        const t = await resp.text().catch(()=>null); return { raw: t };
      });

      // Attempt to locate candidate JSON in several common fields
      let candidate = null;
      if (body && typeof body === 'object') {
        candidate = body?.outputs?.[0]?.content ?? body?.outputs?.[0]?.text ?? body?.text ?? body?.output_text ?? null;
      }
      if (!candidate && typeof body === 'string') candidate = body;
      if (!candidate && body && body.raw) candidate = body.raw;

      candidate = cleanCandidateString(candidate || '');

      // Try direct parse; if fails, try to extract JSON array substring
      let parsed = null;
      try {
        parsed = JSON.parse(candidate);
      } catch (e) {
        // try to extract JSON array substring
        const m = candidate.match(/\[([\s\S]*?)\]\s*$/);
        if (m) {
          try { parsed = JSON.parse(m[0]); } catch (e2) { parsed = null; }
        }
      }

      // Validate parsed result
      if (Array.isArray(parsed)) {
        // Ensure objects have minimal keys
        const safe = parsed.map(p => {
          if (!p || typeof p !== 'object') return null;
          return {
            title: String(p.title || p.name || p.role || '').trim(),
            company: String(p.company || p.org || '').trim(),
            link: String(p.link || p.url || '').trim(),
            score: typeof p.score === 'number' ? p.score : (p.match ? Number(p.match) : 0),
            reason: String(p.reason || p.explanation || '').trim()
          };
        }).filter(Boolean).slice(0,8);
        if (safe.length) return safe;
      }

      // If we reached here, parsing failed — log and retry if attempts remain
      console.error('Gemini response could not be parsed into recommendations (attempt', attempt, ')', candidate ? candidate.slice(0,200) : '<empty>');
    } catch (err) {
      if (err.name === 'AbortError') console.error('Gemini request timed out (attempt', attempt, ')');
      else console.error('Gemini request error (attempt', attempt, '):', err && err.message ? err.message : err);
    } finally {
      try { clearTimeout(id); } catch (e) {}
    }

    // backoff before next attempt
    await new Promise(r => setTimeout(r, attempt * 500));
  }

  // Last resort: return local fallback
  console.warn('Falling back to local recommendations after failed Gemini calls.');
  return localFallback();
}

async function parseFileBuffer(file) {
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

// Upload endpoint with logging
app.post("/api/resume/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("[upload] received", !!req.file, req.file?.mimetype, req.file?.size);
    if (!req.file) return res.status(400).json({ error: "No file received" });
    console.log("[upload] buffer bytes", req.file?.buffer?.length);
    const file = req.file;
    console.log("UPLOAD RECEIVED:", file ? { originalname: file.originalname, mimetype: file.mimetype, size: file.size } : null);
    const name = (file.originalname || "").toLowerCase();
    const isPdf = file.mimetype === "application/pdf" || name.endsWith(".pdf");
    const isDocx = file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || name.endsWith(".docx") || file.mimetype === "application/octet-stream";
    if (!isPdf && !isDocx) return res.status(400).json({ error: "Invalid file type. PDF or DOCX only." });
    if (file.size > 8 * 1024 * 1024) return res.status(400).json({ error: "File too large. Max 8 MB." });

    await fs.mkdir(uploadsDir, { recursive: true });
    const safeName = (file.originalname || "resume").replace(/\s+/g, "_").replace(/[^\w.\-]/g, "");
    const filename = `${Date.now()}-${safeName}`;
    const diskPath = path.join(uploadsDir, filename);
    await fs.writeFile(diskPath, file.buffer);
    console.log("Saved upload to:", diskPath);

    let text;
    try {
      console.log("[upload] calling parseFileBufferService");
      text = await parseFileBufferService(file);
      console.log("[upload] parse ok, text length:", text?.length);
      console.log("Parsed text length:", text ? text.length : 0);
      if (text) console.log("Parsed preview:", text.slice(0,300).replace(/\n/g," "));
    } catch (parseErr) {
      console.error("Failed to parse uploaded file:", parseErr);
      return res.status(500).json({ error: "Failed to parse uploaded file" });
    }

    const sections = splitSections(text);
    const contact = extractContact(text);
    const summary = (sections.summary || "").split("\n").slice(0,3).join(" ");
    const skills = extractSkills(text, sections);
    const yearsExperience = extractYears(text);
    // Populate experience entries from parsed sections
    const experience = parseExperience(sections.experience || "");

    // Simple education extraction: split education section into lines or look for degree keywords
    let education = [];
    if (sections.education) {
      education = sections.education.split(/\n/).map(s=>s.trim()).filter(Boolean).slice(0,8);
    } else {
      // fallback: find lines containing degree keywords
      const lines = toLines(text);
      education = lines.filter(l => /\b(Bachelor|B\.Sc|BA|Master|M\.Sc|MBA|PhD|Doctor|Associate)\b/i.test(l)).slice(0,6);
    }

    console.log("[upload] calling aiGenerateRecommendationsService");
    const recommendations = await aiGenerateRecommendationsService(text, skills, education, yearsExperience);
    console.log("[upload] recommend ok, count:", recommendations?.length ?? -1);

    res.json({ analysis: { contact, summary, skills, education, yearsExperience, experience }, recommendations });
  } catch (e) {
    console.error("UPLOAD HANDLER ERROR:", e && e.stack ? e.stack : e);
    res.status(500).json({ error: "Upload failed", detail: String(e?.message || e) });
  }
});

app.use("/uploads", express.static(uploadsDir));

(async () => {
  await fs.mkdir(uploadsDir, { recursive: true });
  app.listen(PORT, () => console.log(`Sprint1 demo running on http://localhost:${PORT}`));
})();