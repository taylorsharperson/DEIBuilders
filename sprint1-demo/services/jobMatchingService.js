export async function aiGenerateRecommendations(text="", skills=[], education=[], years=0){
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
