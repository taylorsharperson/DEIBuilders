import React, { useState } from "react";

// Read API keys from environment for Create React App (REACT_APP_ prefix required)
// Keys must not be hardcoded. Access process.env safely so module evaluation cannot throw.
let GEMINI_API_KEY = '';
let JOBMATCH_API_KEY = '';
try {
  if (typeof process !== 'undefined' && process.env) {
    GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
    JOBMATCH_API_KEY = process.env.REACT_APP_JOBMATCH_API_KEY || '';
  }
} catch (err) {
  // Defensive: don't let env access crash the module
  console.warn('Unable to read environment variables for API keys:', err);
}

if (!GEMINI_API_KEY) console.warn('GEMINI API key (REACT_APP_GEMINI_API_KEY) is not set. Gemini parsing will fall back to heuristics.');
if (!JOBMATCH_API_KEY) console.warn('Job match API key (REACT_APP_JOBMATCH_API_KEY) is not set. Job matching will be disabled.');

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [matches, setMatches] = useState(null);
  const [matchesLoading, setMatchesLoading] = useState(false);

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff",
      fontFamily: "Inter, system-ui, sans-serif",
      color: "#111111",
      padding: "2rem",
    },
    card: {
      width: "min(560px, 94vw)",
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
      padding: "2.25rem",
      border: "1px solid #eef2f6",
    },
    title: {
      fontSize: "1.4rem",
      fontWeight: 700,
      margin: 0,
      color: "#111111",
    },
    subtitle: {
      marginTop: "0.5rem",
      fontSize: "0.95rem",
      color: "#6b7280",
    },
    form: {
      marginTop: "1.5rem",
      display: "grid",
      gap: "0.75rem",
    },
    helper: {
      fontSize: "0.85rem",
      color: "#9ca3af",
      marginTop: "0.25rem",
    },
    input: {
      display: "block",
    },
    button: {
      marginTop: "0.6rem",
      width: "100%",
      padding: "0.85rem 1rem",
      borderRadius: "12px",
      border: "none",
      background: "#f97316",
      color: "#ffffff",
      fontWeight: 700,
      cursor: "pointer",
      fontSize: "1rem",
      boxShadow: "0 8px 20px rgba(249,115,22,0.12)",
      transition: "transform 180ms ease, box-shadow 180ms ease",
    },
    muted: {
      color: "#6b7280",
      fontSize: "0.9rem",
    },
    resultCard: {
      marginTop: "1rem",
      padding: "1rem",
      borderRadius: "12px",
      border: "1px solid #eef2f6",
      background: "#fff",
      boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
    },
    sectionTitle: {
      margin: 0,
      fontSize: "1rem",
      fontWeight: 700,
      color: "#111",
    },
    successBadge: {
      display: "inline-block",
      padding: "0.25rem 0.5rem",
      background: "rgba(22,163,74,0.12)",
      color: "#16a34a",
      borderRadius: "999px",
      fontSize: "0.85rem",
      fontWeight: 700,
    },
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) setFile(f);
    else setFile(null);
    setResult(null);
  setMatches(null);
  setMatchesLoading(false);
  };

  // Normalize extracted resume text to help downstream parsing.
  // - Normalize unicode and common punctuation to ASCII equivalents
  // - Preserve bullet meaning by standardizing bullet characters to '•'
  // - Remove purely decorative separator lines (---, ***), but keep meaningful dashes
  // - Collapse excessive whitespace while preserving single-line breaks for bullets/sections
  // - Attempt to flatten simple multi-column blocks into left-then-right reading order
  const normalizeResumeText = (raw) => {
    if (!raw) return "";

    // Unicode normalization
    let s = raw.normalize("NFKC");

    // Replace common fancy quotes/dashes with ASCII equivalents
    s = s.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'");
    s = s.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"');
    s = s.replace(/[\u2013\u2014\u2212]/g, "-");
    s = s.replace(/[\u00A0\u2002\u2003\u2009\u200A]/g, " ");

    // Standardize bullet-like markers to a single bullet token
    s = s.replace(/[•◦·‣⁃◉○*\u2022\u2043\u2219]/g, "•");

    // Split into lines for block-level processing
    const rawLines = s.split(/\r?\n/);

    // Group consecutive non-empty lines into blocks (paragraphs/columns)
    const blocks = [];
    let current = [];
    for (const ln of rawLines) {
      const trimmed = ln.replace(/\u00AD/g, "").trim(); // remove soft-hyphen
      if (trimmed === "") {
        if (current.length) {
          blocks.push(current);
          current = [];
        } else {
          // preserve single blank line as delimiter
          blocks.push([]);
        }
      } else {
        current.push(ln);
      }
    }
    if (current.length) blocks.push(current);

    const processedBlocks = blocks.map((block) => {
      if (!block || block.length === 0) return "";

      // Heuristic: detect multi-column by checking for runs of 4+ spaces or tabs
      const colSplits = block.map((l) => l.split(/\s{4,}|\t/).map((c) => c.trim()));
      const columnsCount = colSplits.reduce((acc, parts) => Math.max(acc, parts.length), 1);

      // If most lines have >=2 columns, flatten columns left-to-right (top-to-bottom per column)
      const linesWithCols = colSplits.filter((p) => p.length >= 2).length;
      if (columnsCount >= 2 && linesWithCols / block.length >= 0.5) {
        const cols = Array.from({ length: columnsCount }, () => []);
        for (const parts of colSplits) {
          for (let i = 0; i < columnsCount; i++) {
            cols[i].push((parts[i] || "").replace(/\s{2,}/g, " ").trim());
          }
        }
        // Join columns left, then right, preserving intra-column order
        const flattened = cols.map((c) => c.filter(Boolean).join('\n')).filter(Boolean).join('\n\n');
        return flattened;
      }

      // Otherwise, process lines individually: remove decorative-only lines and normalize bullets
      const out = [];
      for (let l of block) {
        // Collapse multiple spaces/tabs to single space
        l = l.replace(/\t+/g, " ").replace(/ {2,}/g, " ");
        // Normalize bullets at line starts
        l = l.replace(/^\s*[-*•·◦⁃]+\s*/, '• ');
        // Remove lines that are purely decorative (e.g., ----- **** ) but keep short meaningful lines
        const stripped = l.replace(/[^A-Za-z0-9•'"()\[\]\-\/.,:;@%&\s]/g, "").trim();
        const onlyDecorative = /^[-=*_\.\s]{2,}$/.test(l.trim());
        if (onlyDecorative) continue;
        out.push(stripped);
      }

      return out.join('\n');
    });

    // Re-join blocks, using a blank line between blocks
    let rebuilt = processedBlocks.filter((b) => b !== null).join('\n\n');

    // Final whitespace normalization: collapse multiple blank lines to two, trim lines
    rebuilt = rebuilt
      .split('\n')
      .map((ln) => ln.replace(/[\t\u00A0]/g, ' ').replace(/ {2,}/g, ' ').trim())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Normalize casing: convert lines which are ALL CAPS to Title Case, but preserve
    // short acronyms (<=3 letters) and bullet lines that start with '•'
    const toTitle = (s) => s.split(/\s+/).map((w) => {
      if (!w) return w;
      // preserve acronyms like 'API', 'C++' (<=3 letters or containing non-letters)
      if (/^[A-Z0-9]{1,3}$/.test(w) || /[^A-Za-z0-9]/.test(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }).join(' ');

    const finalLines = rebuilt.split('\n').map((ln) => {
      const trimmed = ln.trim();
      if (!trimmed) return '';
      // preserve bullets
      if (trimmed.startsWith('•')) return '• ' + trimmed.replace(/^•\s*/, '').trim();
      // if the line is mostly uppercase letters and longer than 3 chars, title-case it
      const lettersOnly = trimmed.replace(/[^A-Za-z]+/g, '');
      if (lettersOnly.length > 3 && /^[A-Z\s0-9'"()\-\/.,:;]+$/.test(trimmed)) {
        return toTitle(trimmed);
      }
      return trimmed;
    });

    const final = finalLines.join('\n').normalize('NFKC');
    return final;
  };

  // Attempt to parse normalized resume text using the Gemini/Generative API.
  // Falls back to a local heuristic parser if the API key is missing or the call fails.
  const parseWithGemini = async (normalizedText) => {
  const apiKey = GEMINI_API_KEY;

    const makeStructured = (obj) => ({
      name: obj.name || "",
      email: obj.email || "",
      skills: Array.isArray(obj.skills) ? [...new Set(obj.skills.filter(Boolean).map((s) => s.trim()))] : [],
      education: obj.education || "",
      experience: obj.experience || "",
      rawText: normalizedText || "",
    });

    // Local heuristic fallback parser
    const fallbackParse = (text) => {
      const out = { name: "", email: "", skills: [], education: "", experience: "", rawText: text };

      if (!text) return out;

      // Email
      const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
      if (emailMatch) out.email = emailMatch[0];

      // Name: first line that looks like a person name (two words, letters, capitalized)
      const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
      for (const ln of lines.slice(0, 8)) {
        if (ln.includes('@')) continue;
        const words = ln.split(/\s+/);
        if (words.length >= 2 && words.length <= 4 && words.every((w) => /[A-Za-z'-]/.test(w))) {
          out.name = ln;
          break;
        }
      }

      // Skills: look for a 'skills' heading or bullets near top/middle
      const skillsBlock = text.match(/skills[:\s\-]*\n([\s\S]{0,400})/i);
      if (skillsBlock) {
        const candidate = skillsBlock[1].split(/\n/)[0];
        const items = candidate.split(/[;,|•\-\n]/).map((s) => s.trim()).filter(Boolean);
        out.skills = [...new Set(items.slice(0, 50))];
      } else {
        // collect bullets that look like skills
        const bullets = (text.match(/•\s*[^\n]{2,60}/g) || []).map((b) => b.replace(/^•\s*/, '').trim());
        if (bullets.length) {
          out.skills = [...new Set(bullets.slice(0, 50))];
        }
      }

      // Education: find lines mentioning University, College, B.S., M.S., BA, BS, PhD
      const eduMatch = text.match(/([A-Z][^\n]{0,80}\b(University|College|B\.S\.|BSc|B\.|M\.S\.|MSc|Bachelor|Master|PhD|Doctor)[^\n]{0,80})/i);
      if (eduMatch) out.education = eduMatch[0].trim();

      // Experience: try to summarize first 3-6 lines after experience-like headings
      const expMatch = text.match(/(experience|work experience|employment)[:\s\-]*\n([\s\S]{0,800})/i);
      if (expMatch) {
        const snippet = expMatch[2].split(/\n\n/)[0];
        out.experience = snippet.replace(/\n/g, ' ').slice(0, 800).trim();
      } else {
        // fallback: take first 400 characters from middle of document as summary
        const mid = Math.floor(text.length / 3);
        out.experience = text.slice(mid, mid + 400).replace(/\n/g, ' ').trim();
      }

      // final cleanup: trim strings
      out.name = (out.name || "").trim();
      out.email = (out.email || "").trim();
      out.education = (out.education || "").trim();
      out.experience = (out.experience || "").trim();

      return out;
    };

    if (!apiKey) {
      // No API key available; return heuristic parse
      return fallbackParse(normalizedText);
    }

    try {
      // Craft a concise instruction asking Gemini to return strict JSON
      const instruction = `Extract the following fields from the resume text that follows. Return ONLY a single JSON object with keys: name, email, skills, education, experience.\n- name: full name or empty string\n- email: primary email or empty string\n- skills: array of skill strings (deduplicated)\n- education: short education summary or empty string\n- experience: short experience summary or empty string\nBe conservative: do not hallucinate or invent details. If a field is not present, return an empty string or empty array.\n\nResume:\n${normalizedText}`;

      // Google Generative Language endpoint (best-effort). We include the API key as a query param.
      const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${encodeURIComponent(apiKey)}`;

      const body = {
        prompt: { text: instruction },
        temperature: 0.0,
        maxOutputTokens: 512,
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        // API error — fall back
        console.error('Gemini API error', res.status, await res.text());
        return fallbackParse(normalizedText);
      }

      const data = await res.json();

      // Extract textual content from several possible response shapes
      let content = '';
      if (data.candidates && data.candidates.length) content = data.candidates[0].content || '';
      else if (data.output && data.output[0] && data.output[0].content) content = data.output[0].content;
      else if (data.result && data.result.output) content = data.result.output;
      else if (data.text) content = data.text;
      else if (typeof data === 'string') content = data;

      // Try to find JSON object inside content
      let parsed = null;
      try {
        parsed = JSON.parse(content);
      } catch (e) {
        const m = content.match(/\{[\s\S]*\}/);
        if (m) {
          try {
            parsed = JSON.parse(m[0]);
          } catch (err) {
            parsed = null;
          }
        }
      }

      if (parsed && typeof parsed === 'object') {
        return makeStructured(parsed);
      }

      // If model didn't return strict JSON, attempt to extract via simple regex from content
      const simple = {};
      const emailMatch = content.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
      simple.email = emailMatch ? emailMatch[0] : '';
      const nameMatch = content.match(/"?name"?\s*[:=]\s*"?([^",\n}]+)/i);
      simple.name = nameMatch ? nameMatch[1].trim() : '';
      const skillsMatch = content.match(/"?skills"?\s*[:=]\s*\[([^\]]+)\]/i);
      if (skillsMatch) {
        simple.skills = skillsMatch[1].split(/[,\n]/).map((s) => s.replace(/["'\[\]]/g, '').trim()).filter(Boolean);
      } else {
        simple.skills = [];
      }
      const eduMatch = content.match(/"?education"?\s*[:=]\s*"?([^",\n}]+)/i);
      simple.education = eduMatch ? eduMatch[1].trim() : '';
      const expMatch = content.match(/"?experience"?\s*[:=]\s*"?([^\n}]+)"?/i);
      simple.experience = expMatch ? expMatch[1].trim() : '';

      return makeStructured(simple);
    } catch (err) {
      console.error('Gemini parse error:', err);
      return fallbackParse(normalizedText);
    }
  };

  // Validate and clean parsed resume object before setting state
  const cleanParsedResult = (parsed) => {
    if (!parsed || typeof parsed !== 'object') parsed = {};

    const out = {
      name: (parsed.name || '').trim(),
      email: (parsed.email || '').trim(),
      skills: Array.isArray(parsed.skills) ? parsed.skills.slice() : [],
      education: (parsed.education || '').trim(),
      experience: (parsed.experience || '').trim(),
      rawText: parsed.rawText || '',
    };

    // Validate email
    const email = out.email;
    const validEmail = typeof email === 'string' && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
    out.email = validEmail ? email : '';

    // Normalize and deduplicate skills: lowercase-display normalization
    const normalizeSkill = (s) => s.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035\u201C\u201D\u201E\u201F]/g, "'")
      .replace(/[\u2013\u2014\u2212]/g, '-')
      .replace(/[^\p{L}\p{N} \-+.#]/gu, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    const seen = new Set();
    const cleanedSkills = [];
    for (let s of out.skills) {
      if (!s || typeof s !== 'string') continue;
      const norm = normalizeSkill(s);
      const key = norm.toLowerCase();
      if (!key) continue;
      if (!seen.has(key)) {
        seen.add(key);
        // Keep display form with title-case-ish appearance
        const display = norm.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        cleanedSkills.push(display);
      }
    }
    out.skills = cleanedSkills;

    // Trim empty strings to safe fallbacks
    out.name = out.name || '';
    out.education = out.education || '';
    out.experience = out.experience || '';
    out.rawText = out.rawText || '';

    return out;
  };

  // Match jobs using JSearch (RapidAPI). Uses parsed.skills first, falls back to rawText.
  const matchJobsWithJSearch = async (parsed) => {
    try {
      setMatches(null);
      setMatchesLoading(true);

      const key = JOBMATCH_API_KEY;
      if (!key) {
        setMatches([]);
        setMatchesLoading(false);
        return;
      }

      const skills = Array.isArray(parsed.skills) ? parsed.skills.map((s) => s.toLowerCase()) : [];
      let query = '';
      if (skills.length) {
        // prefer skills, join with commas to hint the API
        query = skills.slice(0, 6).join(', ');
      } else if (parsed.rawText) {
        query = parsed.rawText.slice(0, 300).replace(/\s+/g, ' ');
      } else {
        query = 'software engineer';
      }

      const endpoint = 'https://jsearch.p.rapidapi.com/search';
      const params = new URLSearchParams({ query, num_pages: '1' });

      const resp = await fetch(`${endpoint}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': key,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
          Accept: 'application/json',
        },
      });

      if (!resp.ok) {
        console.error('JSearch API error', resp.status, await resp.text());
        setMatches([]);
        setMatchesLoading(false);
        return;
      }

      const jdata = await resp.json();
      const items = Array.isArray(jdata.data) ? jdata.data : (jdata.results || []);

      // Rank by partial skill matches: count occurrences of skill tokens in title+desc
      const scored = items.map((it) => {
        const title = (it.job_title || it.title || it.position_title || '').toString();
        const company = (it.employer_name || it.company_name || it.company || it.employer || '').toString();
        const desc = (it.job_description || it.description || it.snippet || '').toString();
        const combined = (title + ' ' + desc).toLowerCase();
        let score = 0;
        for (const sk of skills) {
          if (!sk) continue;
          // partial match: split skill tokens and test presence
          const parts = sk.split(/\s+/).filter(Boolean);
          for (const p of parts) {
            if (p.length < 2) continue;
            if (combined.includes(p)) score += 1;
          }
        }
        return { title: title || 'Job', company: company || 'Company', score };
      });

      scored.sort((a, b) => b.score - a.score);

      const mapped = scored.slice(0, 6).map((s) => ({ title: s.title, company: s.company, skill: (parsed.skills && parsed.skills[0]) || 'General' }));

      // Clean and dedupe matches before setting state
      const cleanedMatches = cleanMatches(mapped);
      setMatches(cleanedMatches);
      setMatchesLoading(false);
    } catch (err) {
      console.error('Job matching failed:', err);
      setMatches([]);
      setMatchesLoading(false);
    }
  };

  // Normalize and deduplicate match results to the UI-friendly shape {title, company, skill}
  const cleanMatches = (arr) => {
    if (!Array.isArray(arr)) return [];
    const seen = new Set();
    const out = [];
    for (const item of arr) {
      if (!item || typeof item !== 'object') continue;
      const title = (item.title || item.job_title || '').toString().trim();
      const company = (item.company || item.employer || item.employer_name || '').toString().trim();
      const skill = (item.skill || '').toString().trim() || 'General';

      if (!title && !company) continue;
      const key = `${title.toLowerCase()}|${company.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ title: title || 'Job', company: company || 'Company', skill });
      if (out.length >= 6) break;
    }
    return out;
  };

  const simulateParse = async () => {
    // Real extraction -> normalization -> semantic parse (Gemini or heuristic) -> clean -> optional job matching
    if (!file) return;

    setLoading(true);
    setResult(null);
    setMatches(null);
    setMatchesLoading(false);

    try {
      const name = (file.name || "").toLowerCase();
      const ext = name.split(".").pop();
      const arrayBuffer = await file.arrayBuffer();

      let extracted = "";

      if (ext === "pdf") {
        try {
          const pdfjs = await import("pdfjs-dist/legacy/build/pdf");
          try {
            const pdfWorker = await import("pdfjs-dist/legacy/build/pdf.worker.entry");
            if (pdfjs && pdfjs.GlobalWorkerOptions) pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
          } catch (e) {
            // continue without explicit worker
          }

          const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          const maxPages = pdf.numPages || 0;
          const texts = [];

          for (let i = 1; i <= maxPages; i++) {
            // eslint-disable-next-line no-await-in-loop
            const page = await pdf.getPage(i);
            // eslint-disable-next-line no-await-in-loop
            const content = await page.getTextContent();

            const items = (content.items || []).map((it) => {
              let x = 0, y = 0;
              try {
                const t = it.transform || [];
                if (Array.isArray(t) && t.length >= 6) {
                  x = t[4] || 0;
                  y = t[5] || 0;
                }
              } catch (e) {}
              return { str: it.str || '', x, y };
            });

            items.sort((a, b) => {
              if (Math.abs(b.y - a.y) > 2) return b.y - a.y;
              return a.x - b.x;
            });

            const pageText = items.map((it) => it.str).join(' ');
            texts.push(pageText);
          }

          extracted = texts.join("\n\n");
        } catch (err) {
          extracted = "";
          console.error("PDF extraction failed (pdfjs missing or error):", err);
        }
      } else if (ext === "docx") {
        try {
          const mammoth = await import("mammoth");
          const res = await mammoth.extractRawText({ arrayBuffer });
          extracted = (res && res.value) || "";
        } catch (err) {
          extracted = "";
          console.error("DOCX extraction failed (mammoth missing or error):", err);
        }
      } else if (ext === "doc") {
        // Best-effort: .doc is unsupported reliably client-side
        extracted = "";
        console.warn("Legacy .doc file detected — in-browser parsing is unreliable. Please upload a PDF or DOCX for best results.");
      } else {
        try {
          const decoder = new TextDecoder("utf-8");
          extracted = decoder.decode(arrayBuffer);
        } catch (err) {
          extracted = "";
          console.error("Unknown file type; failed to decode as text:", err);
        }
      }

      // Normalize extracted text
      const normalized = normalizeResumeText(extracted || "");

      // Guard: if extraction failed or text is extremely short, still show rawText but avoid LLM calls
      if (!normalized || normalized.length < 50) {
        const cleaned = cleanParsedResult({ name: '', email: '', skills: [], education: '', experience: '', rawText: normalized });
        setResult(cleaned);
        setMatches(null);
        setMatchesLoading(false);
        setLoading(false);
        return;
      }

      // Parse: try Gemini (if API key) otherwise fallback heuristic inside parseWithGemini
      const parsed = await parseWithGemini(normalized);
      const cleaned = cleanParsedResult(parsed || {});
      // Ensure rawText holds normalized extraction for UI visibility
      cleaned.rawText = normalized;
      setResult(cleaned);

      // Kick off job matching if API key present
      if (JOBMATCH_API_KEY) {
        await matchJobsWithJSearch(cleaned);
      } else {
        setMatches(null);
      }

    } catch (err) {
      console.error("Unexpected parse error:", err);
      setResult({ name: "", email: "", skills: [], education: "", experience: "", rawText: "" });
      setMatches(null);
    } finally {
      setLoading(false);
      setMatchesLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;
    simulateParse();
  };

  return (
    <div style={styles.page}>
      <style>{`
        div[role="main"] { transition: transform 220ms ease, box-shadow 220ms ease; }
        div[role="main"]:hover { transform: translateY(-4px); box-shadow: 0 16px 36px rgba(15,23,42,0.12); }

        .upload-button { transition: transform 180ms ease, box-shadow 180ms ease; }
        .upload-button:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(249,115,22,0.22); }

        @media (prefers-reduced-motion: reduce) { div[role="main"], .upload-button { transition: none !important; transform: none !important; } }
      `}</style>

      <main role="main" style={styles.card} aria-live="polite">
  <h1 style={styles.title}>Resume Upload (AI Powered)</h1>
  <p style={styles.subtitle}>Upload your resume for Gemini AI analysis (Demo)</p>

        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.muted} htmlFor="resume-input">
            Select a resume (PDF, DOC)
          </label>
          <input
            id="resume-input"
            aria-label="Resume file"
            style={styles.input}
            type="file"
            accept=".pdf,.doc"
            onChange={handleFileChange}
          />

          <div style={styles.helper}>This demo accepts PDF, DOC, and DOCX files only.</div>

          <button
            type="submit"
            className="upload-button"
            style={{ ...styles.button, opacity: file ? 1 : 0.6, cursor: file ? "pointer" : "not-allowed" }}
            disabled={!file || loading}
          >
            {loading ? "Analyzing…" : "Upload"}
          </button>
        </form>

        <div style={{ marginTop: "0.75rem", color: "#9ca3af", fontSize: "0.875rem" }}>
          This is a demo. No real resume data is stored.
        </div>

        {result && (
          <div style={styles.resultCard} aria-live="polite">
            <h3 style={styles.sectionTitle}>Gemini Parsed Output</h3>
            <div style={{ marginTop: "0.6rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Name</div>
                  <div style={{ fontWeight: 700 }}>{result.name}</div>
                </div>
                <div style={styles.successBadge}>Demo</div>
              </div>

              <div style={{ marginTop: "0.6rem" }}>
                <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Email</div>
                <div>{result.email}</div>
              </div>

              <div style={{ marginTop: "0.6rem" }}>
                <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Key Skills</div>
                <ul>
                  {result.skills.map((s, i) => (
                    <li key={i} style={{ color: "#374151" }}>{s}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: "0.6rem" }}>
                <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Education</div>
                <div>{result.education}</div>
              </div>

              <div style={{ marginTop: "0.6rem" }}>
                <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Experience Summary</div>
                <div>{result.experience}</div>
              </div>
            </div>
          </div>
        )}
        {/* Generated job matches section (demo) */}
        {result && (
          <div style={{ marginTop: "0.85rem" }}>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.45rem" }}>Generated by Gemini AI (Demo)</div>

            {matchesLoading && (
              <div style={{ ...styles.resultCard, padding: "0.85rem", textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: "#374151" }}>Gemini AI analyzing resume...</div>
              </div>
            )}

            {matches && (
              <div style={{ display: "grid", gap: "0.6rem", marginTop: "0.4rem" }}>
                {matches.map((m, idx) => (
                  <div key={idx} style={styles.resultCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>{m.skill || "Skill"}</div>
                        <div style={{ fontWeight: 700 }}>{m.title}</div>
                        <div style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "0.25rem" }}>{m.company}</div>
                      </div>
                      <div style={styles.successBadge}>Match</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
