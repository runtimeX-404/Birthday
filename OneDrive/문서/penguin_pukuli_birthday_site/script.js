// Penguin & Pukuli Birthday Website
// The in-page Customize editor lets you change content without editing code.
// You can also change DEFAULTS below for your permanent starting version.

const DEFAULTS = {
  nickname: "Penguin, my Pukuli",
  signature: "your person ♡",
  date: "28 October",
  finale: "May your birthday be full of gentle mornings, big reasons to smile, and dreams that come closer every day.",
  letterHeading: "To my Penguin, my Pukuli,",
  letterBody: `Happy birthday, my love.\n\nI hope this new chapter brings you gentle mornings, big reasons to smile, and the courage to chase every dream that lives in your heart.\n\nThank you for being you — for the little things you do, the warmth you bring, and the way you make even simple moments feel special. You deserve a world that is as kind and beautiful as your heart.\n\nWhatever this year holds, I hope you never forget how loved, appreciated, and wonderfully one-of-a-kind you are.`,
  color: "#d36f95",
  notes: [
    { title: "Open when you miss me", body: "Close your eyes for a second and remember that you matter so much to me. Sending you the biggest imaginary cuddle and a little kiss on the forehead. ♡" },
    { title: "Open when you feel low", body: "You don't have to be bright every single day. Rest, breathe, and take things one little step at a time. I'm always rooting for you, Penguin." },
    { title: "Open when you need a smile", body: "Official reminder: you are cute, loved, and very much stuck with someone who thinks you're pretty amazing. Pukuli supremacy. ♡" },
    { title: "Open on a random day", body: "No special occasion needed. I just wanted to remind you that having you in my life makes ordinary days feel a little more magical." },
    { title: "Open on your birthday", body: "Happy birthday, my Penguin! I hope today gives you a hundred tiny reasons to smile and at least one memory you want to keep forever." },
    { title: "A tiny promise", body: "I can't promise every day will be perfect, but I can promise to keep learning, listening, and appreciating the wonderful person you are." }
  ],
  photoCaptions: ["a moment to keep", "my favorite smile", "you + me"]
};

const clone = (value) => JSON.parse(JSON.stringify(value));
let state = clone(DEFAULTS);
let uploadedPhotos = [null, null, null];
let currentScreen = "home";

try {
  const saved = localStorage.getItem("penguinPukuliSiteSettings");
  if (saved) state = { ...clone(DEFAULTS), ...JSON.parse(saved) };
} catch (e) { /* local storage may be unavailable */ }

const screenIds = ["home", "story", "memories", "notes", "letter", "finale"];
const progress = document.getElementById("progress");
screenIds.forEach((id, index) => {
  const dot = document.createElement("button");
  dot.className = "progress-dot" + (index === 0 ? " active" : "");
  dot.type = "button";
  dot.title = `Go to section ${index + 1}`;
  dot.setAttribute("aria-label", `Go to section ${index + 1}`);
  dot.addEventListener("click", () => showScreen(id));
  progress.appendChild(dot);
  if (index < screenIds.length - 1) {
    const line = document.createElement("span");
    line.className = "progress-line";
    progress.appendChild(line);
  }
});

function showScreen(id) {
  currentScreen = id;
  document.querySelectorAll(".screen").forEach(s => {
    const active = s.id === id;
    s.classList.toggle("active", active);
    s.setAttribute("aria-hidden", String(!active));
  });
  [...progress.querySelectorAll(".progress-dot")].forEach((dot, i) => dot.classList.toggle("active", screenIds[i] === id));
  if (id === "letter") {
    document.getElementById("envelope").classList.remove("open");
    document.getElementById("letterContent").classList.remove("open");
  }
  if (id === "finale") makeConfetti();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => showScreen(b.dataset.go)));
document.querySelectorAll("[data-back]").forEach(b => b.addEventListener("click", () => showScreen(b.dataset.back)));
document.getElementById("replayButton").addEventListener("click", () => showScreen("home"));

function applySettings() {
  document.getElementById("heroNickname").textContent = state.nickname || DEFAULTS.nickname;
  document.querySelector(".tiny-label").textContent = `${state.date || DEFAULTS.date} · YOUR DAY`;
  document.getElementById("signatureName").textContent = state.signature || DEFAULTS.signature;
  document.getElementById("finaleMessage").textContent = state.finale || DEFAULTS.finale;
  document.getElementById("letterHeading").textContent = state.letterHeading || DEFAULTS.letterHeading;
  document.getElementById("letterBody").replaceChildren();
  (state.letterBody || "").split(/\n\s*\n/).filter(p => p.trim()).forEach(paragraph => {
    const p = document.createElement("p");
    p.textContent = paragraph.trim();
    document.getElementById("letterBody").appendChild(p);
  });
  document.documentElement.style.setProperty("--rose", state.color || DEFAULTS.color);
  document.documentElement.style.setProperty("--rose-dark", shadeColor(state.color || DEFAULTS.color, -18));
  renderNotes();
  document.querySelectorAll(".photo-caption").forEach((el, i) => el.textContent = state.photoCaptions?.[i] || DEFAULTS.photoCaptions[i]);
}
function shadeColor(hex, percent) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + percent));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + percent));
  const b = Math.max(0, Math.min(255, (n & 255) + percent));
  return `rgb(${r}, ${g}, ${b})`;
}

function renderNotes() {
  const grid = document.getElementById("noteGrid");
  grid.replaceChildren();
  (state.notes || []).forEach((note, i) => {
    const card = document.createElement("article");
    card.className = "note-card";
    const mark = document.createElement("span"); mark.className = "note-mark"; mark.textContent = ["♡", "✿", "☾", "✧", "✦", "❀"][i % 6];
    const title = document.createElement("h3"); title.textContent = note.title;
    const body = document.createElement("p"); body.textContent = note.body.length > 80 ? note.body.slice(0, 80) + "…" : note.body;
    const button = document.createElement("button"); button.type = "button"; button.textContent = "Open this note →";
    button.addEventListener("click", () => {
      document.getElementById("openedNoteTitle").textContent = note.title;
      document.getElementById("openedNoteBody").textContent = note.body;
      document.getElementById("noteBackdrop").hidden = false;
    });
    card.append(mark, title, body, button); grid.appendChild(card);
  });
}
document.getElementById("closeNote").addEventListener("click", () => document.getElementById("noteBackdrop").hidden = true);
document.getElementById("noteOkay").addEventListener("click", () => document.getElementById("noteBackdrop").hidden = true);
document.getElementById("noteBackdrop").addEventListener("click", e => { if (e.target.id === "noteBackdrop") e.currentTarget.hidden = true; });

document.getElementById("envelope").addEventListener("click", () => {
  document.getElementById("envelope").classList.add("open");
  document.getElementById("letterContent").classList.add("open");
});

document.querySelectorAll("[data-photo]").forEach(input => input.addEventListener("change", event => {
  const file = event.target.files?.[0];
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = () => setPhoto(Number(input.dataset.photo), reader.result);
  reader.readAsDataURL(file);
}));
function setPhoto(index, dataUrl) {
  uploadedPhotos[index] = dataUrl;
  const card = document.querySelectorAll(".photo-card")[index];
  const img = card.querySelector("img");
  img.src = dataUrl; img.hidden = false;
  card.querySelector(".photo-placeholder").style.opacity = "0";
  renderPhotoEditor();
}

const backdrop = document.getElementById("editorBackdrop");
document.getElementById("openEditor").addEventListener("click", openEditor);
document.getElementById("closeEditor").addEventListener("click", () => backdrop.hidden = true);
backdrop.addEventListener("click", e => { if (e.target === backdrop) backdrop.hidden = true; });
document.querySelectorAll(".editor-tab").forEach(tab => tab.addEventListener("click", () => {
  document.querySelectorAll(".editor-tab").forEach(t => t.classList.toggle("active", t === tab));
  document.querySelectorAll(".editor-panel").forEach(p => p.classList.toggle("active", p.id === tab.dataset.tab));
}));
function openEditor() {
  document.getElementById("editNickname").value = state.nickname;
  document.getElementById("editSignature").value = state.signature;
  document.getElementById("editDate").value = state.date;
  document.getElementById("editFinale").value = state.finale;
  document.getElementById("editColor").value = state.color || DEFAULTS.color;
  document.getElementById("editLetterHeading").value = state.letterHeading;
  document.getElementById("editLetterBody").value = state.letterBody;
  renderNotesEditor(); renderPhotoEditor();
  document.getElementById("saveStatus").textContent = "";
  backdrop.hidden = false;
}
function renderNotesEditor() {
  const container = document.getElementById("notesEditor"); container.replaceChildren();
  (state.notes || []).forEach((note, index) => {
    const wrapper = document.createElement("div"); wrapper.className = "note-editor-item";
    const remove = document.createElement("button"); remove.className = "remove-note"; remove.type = "button"; remove.textContent = "Remove";
    remove.addEventListener("click", () => { state.notes.splice(index, 1); renderNotesEditor(); });
    const titleLabel = document.createElement("label"); titleLabel.textContent = "Note title";
    const title = document.createElement("input"); title.value = note.title; title.maxLength = 100;
    title.addEventListener("input", () => state.notes[index].title = title.value);
    const bodyLabel = document.createElement("label"); bodyLabel.textContent = "Note message";
    const body = document.createElement("textarea"); body.rows = 3; body.value = note.body;
    body.addEventListener("input", () => state.notes[index].body = body.value);
    titleLabel.appendChild(title); bodyLabel.appendChild(body); wrapper.append(remove, titleLabel, bodyLabel); container.appendChild(wrapper);
  });
}
document.getElementById("addNote").addEventListener("click", () => {
  state.notes.push({ title: "A new little note", body: "Write a special message here…" }); renderNotesEditor();
});
function renderPhotoEditor() {
  const container = document.getElementById("photoEditor"); container.replaceChildren();
  const captions = state.photoCaptions || [...DEFAULTS.photoCaptions];
  state.photoCaptions = captions;
  captions.forEach((caption, i) => {
    const wrapper = document.createElement("div"); wrapper.className = "photo-editor-item";
    const img = document.createElement("img"); img.alt = `Photo ${i + 1} preview`;
    if (uploadedPhotos[i]) img.src = uploadedPhotos[i];
    const label = document.createElement("label"); label.textContent = `Photo ${i + 1} caption`;
    const input = document.createElement("input"); input.value = caption;
    input.addEventListener("input", () => { state.photoCaptions[i] = input.value; document.querySelectorAll(".photo-caption")[i].textContent = input.value; });
    const upload = document.createElement("input"); upload.type = "file"; upload.accept = "image/*"; upload.setAttribute("aria-label", `Choose photo ${i + 1}`);
    upload.addEventListener("change", e => {
      const file = e.target.files?.[0]; if (!file || !file.type.startsWith("image/")) return;
      const reader = new FileReader(); reader.onload = () => { setPhoto(i, reader.result); renderPhotoEditor(); }; reader.readAsDataURL(file);
    });
    label.append(input, upload); wrapper.append(img, label); container.appendChild(wrapper);
  });
}
document.getElementById("saveEdits").addEventListener("click", () => {
  state.nickname = document.getElementById("editNickname").value.trim() || DEFAULTS.nickname;
  state.signature = document.getElementById("editSignature").value.trim() || DEFAULTS.signature;
  state.date = document.getElementById("editDate").value.trim() || DEFAULTS.date;
  state.finale = document.getElementById("editFinale").value.trim() || DEFAULTS.finale;
  state.color = document.getElementById("editColor").value || DEFAULTS.color;
  state.letterHeading = document.getElementById("editLetterHeading").value.trim() || DEFAULTS.letterHeading;
  state.letterBody = document.getElementById("editLetterBody").value;
  applySettings();
  try {
    // Avoid storing big photos in localStorage; photo selections remain active until the page is refreshed.
    localStorage.setItem("penguinPukuliSiteSettings", JSON.stringify(state));
    document.getElementById("saveStatus").textContent = "Saved in this browser ♡";
  } catch (e) {
    document.getElementById("saveStatus").textContent = "Applied for this visit. Browser storage is full; please use smaller text/images.";
  }
});
document.getElementById("resetEdits").addEventListener("click", () => {
  state = clone(DEFAULTS); uploadedPhotos = [null, null, null];
  try { localStorage.removeItem("penguinPukuliSiteSettings"); } catch (e) {}
  applySettings();
  document.querySelectorAll(".photo-card").forEach(card => { card.querySelector("img").hidden = true; card.querySelector("img").removeAttribute("src"); card.querySelector(".photo-placeholder").style.opacity = "1"; });
  openEditor();
  document.getElementById("saveStatus").textContent = "Default text restored.";
});

const sparkleLayer = document.getElementById("sparkles");
for (let i = 0; i < 32; i++) {
  const s = document.createElement("span"); s.className = "sparkle"; s.textContent = ["✦", "✧", "·", "♡"][Math.floor(Math.random() * 4)];
  s.style.left = `${Math.random() * 100}%`; s.style.top = `${Math.random() * 100}%`; s.style.fontSize = `${8 + Math.random() * 13}px`;
  s.style.animationDelay = `${Math.random() * 4}s`; s.style.animationDuration = `${3 + Math.random() * 4}s`; sparkleLayer.appendChild(s);
}
function makeConfetti() {
  const box = document.getElementById("confetti"); if (box.dataset.ready) return; box.dataset.ready = "true";
  for (let i = 0; i < 48; i++) { const p = document.createElement("i"); p.className = "confetti-piece"; p.style.left = `${Math.random() * 100}%`; p.style.animationDelay = `${Math.random() * 4}s`; p.style.animationDuration = `${3 + Math.random() * 4}s`; box.appendChild(p); }
}
document.getElementById("musicButton").addEventListener("click", () => {
  const label = document.querySelector("#musicButton span");
  label.textContent = label.textContent === "sound off" ? "sound effects soon" : "sound off";
});
applySettings();
showScreen("home");
