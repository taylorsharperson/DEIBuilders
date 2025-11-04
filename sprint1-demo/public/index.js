const form = document.getElementById("uploadForm");
const statusEl = document.getElementById("status");
const skillsEl = document.getElementById("skills");
const eduEl = document.getElementById("education");
const yearsEl = document.getElementById("years");
const expEl = document.getElementById("experienceList");
const contactEl = document.getElementById("contactInfo");
const summaryEl = document.getElementById("summary");
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");
const recsList = document.getElementById("recsList");

function showTab(id) {
  tabContents.forEach(c => { c.hidden = c.id !== id; });
  tabs.forEach(t => t.classList.toggle("active", t.dataset.target === id));
}
tabs.forEach(t => { t.addEventListener("click", () => showTab(t.dataset.target)); });

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  skillsEl.innerHTML = "";
  eduEl.innerHTML = "";
  yearsEl.textContent = "0";
  expEl.innerHTML = "";
  contactEl.innerHTML = "No contact info detected.";
  summaryEl.innerHTML = "No summary detected.";
  recsList.innerHTML = "";
  statusEl.textContent = "Uploading and analyzing…";
  showTab("analysisTab");

  const file = document.getElementById("file").files[0];
  if (!file) { statusEl.textContent = "Please choose a file."; return; }

  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await fetch("/api/resume/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) {
      statusEl.textContent = data?.error || "Upload failed.";
      return;
    }
    const analysis = data.analysis || {};

    // Contact
    const contact = analysis.contact || {};
    const parts = [];
    if (contact.email) parts.push(`✉️ ${contact.email}`);
    if (contact.phone) parts.push(`📞 ${contact.phone}`);
    if (contact.location) parts.push(`📍 ${contact.location}`);
    if (contact.linkedin) parts.push(`🔗 <a href="${contact.linkedin}" target="_blank" rel="noopener">${contact.linkedin}</a>`);
    if (contact.github) parts.push(`🐙 <a href="${contact.github}" target="_blank" rel="noopener">${contact.github}</a>`);
    contactEl.innerHTML = parts.length ? parts.join("&nbsp;&nbsp;•&nbsp;&nbsp;") : "No contact info detected.";

    // Summary
    summaryEl.textContent = analysis.summary || "No summary detected.";

    // Skills
    (analysis.skills || []).forEach(skill => {
      const li = document.createElement("li");
      li.textContent = skill;
      skillsEl.appendChild(li);
    });

    // Education
    (analysis.education || []).forEach(ed => {
      const li = document.createElement("li");
      li.textContent = ed;
      eduEl.appendChild(li);
    });

    // Years
    yearsEl.textContent = analysis.yearsExperience ?? 0;

    // Experience (detailed)
    const exp = analysis.experience || [];
    if (exp.length === 0) {
      expEl.textContent = "No labelled experience entries found.";
    } else {
      expEl.innerHTML = "";
      const ul = document.createElement("ul");
      // keep existing styling by not adding/removing IDs or JS-used classes
      exp.forEach(item => {
        const li = document.createElement("li");
        // create the same rec-card content inside the list item
        const wrapper = document.createElement("div");
        wrapper.className = "rec-card";

        const top = document.createElement("div");
        top.className = "rec-top";

        const title = document.createElement("div");
        title.className = "rec-title";
        title.textContent = item.title || item.raw || "";

        const right = document.createElement("div");
        right.style.textAlign = "right";

        const comp = document.createElement("div");
        comp.className = "rec-company";
        comp.textContent = item.company || "";

        const date = document.createElement("div");
        date.className = "small";
        date.textContent = item.date || "";

        right.appendChild(comp);
        right.appendChild(date);

        top.appendChild(title);
        top.appendChild(right);

        const raw = document.createElement("div");
        raw.className = "small";
        raw.textContent = item.raw;

        wrapper.appendChild(top);
        wrapper.appendChild(raw);
        li.appendChild(wrapper);
        ul.appendChild(li);
      });
      expEl.appendChild(ul);
    }

    // Recommendations
    const recs = data.recommendations || [];
    recsList.innerHTML = "";
    if (recs.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No recommendations found.";
      recsList.appendChild(p);
    } else {
      // Render recommendations as a list where each item contains the existing card
  const ul = document.createElement("ul");

      for (const r of recs) {
  const li = document.createElement("li");

        const card = document.createElement("div");
        card.className = "rec-card";

        const top = document.createElement("div");
        top.className = "rec-top";

        const title = document.createElement("div");
        title.className = "rec-title";
        title.textContent = r.title;
        top.appendChild(title);

        const score = document.createElement("div");
        score.className = "rec-score";
        if (typeof r.score === "number") score.textContent = `${Math.round(r.score * 100)}% match`;
        top.appendChild(score);

        card.appendChild(top);

        const company = document.createElement("div");
        company.className = "rec-company";
        company.textContent = r.company || "";
        card.appendChild(company);

        if (r.reason) {
          const reason = document.createElement("div");
          reason.className = "rec-reason";
          reason.textContent = r.reason;
          card.appendChild(reason);
        }

        if (r.link) {
          const a = document.createElement("a");
          a.href = r.link;
          a.target = "_blank";
          a.rel = "noopener";
          a.className = "rec-link";
          a.textContent = "View";
          card.appendChild(a);
        }

        li.appendChild(card);
        ul.appendChild(li);
      }

      recsList.appendChild(ul);
    }

    statusEl.textContent = "Analysis complete.";
    showTab("recsTab");
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Unexpected error. Check server logs.";
  }
});
