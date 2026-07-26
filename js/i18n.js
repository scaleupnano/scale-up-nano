/* ==========================================================================
   Scale Up Nano — language switcher logic
   (the I18N dictionary itself now lives in js/i18n-data.js, loaded first)
   ========================================================================== */


function applyLanguage(lang) {
  const dict = I18N[lang] || I18N.en;
  document.documentElement.lang = lang;
  document.documentElement.dir = dict.dir;
  localStorage.setItem("sun_lang", lang);

  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    const val = getPath(dict, el.dataset.i18n);
    if (val != null) el.textContent = val;
  });
  document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
    const val = getPath(dict, el.dataset.i18nHtml);
    if (val != null) el.innerHTML = val;
  });
  document.querySelectorAll(".lang-btn").forEach(function (b) {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
}

function getPath(obj, path) {
  return path.split(".").reduce(function (o, k) { return o && o[k] !== undefined ? o[k] : null; }, obj);
}

document.addEventListener("DOMContentLoaded", async function () {
  await applyTextOverrides();
  const saved = localStorage.getItem("sun_lang") || detectBrowserLanguage();
  applyLanguage(saved);
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { applyLanguage(btn.dataset.lang); });
  });
});

/* Admin's "Texts" tab saves overrides to settings/texts as
   { en: {"home.title_html": "...", ...}, fr: {...}, ar: {...} }.
   This layers those on top of the built-in I18N defaults — anything
   never edited in admin just keeps using the default copy. */
async function applyTextOverrides() {
  if (typeof db === "undefined") return;
  try {
    const doc = await db.collection("settings").doc("texts").get();
    if (!doc.exists) return;
    const overrides = doc.data() || {};
    Object.keys(overrides).forEach(function (lang) {
      if (!I18N[lang]) return;
      const flat = overrides[lang] || {};
      Object.keys(flat).forEach(function (path) {
        setPath(I18N[lang], path, flat[path]);
      });
    });
  } catch (err) {
    console.error("Couldn't load text overrides", err);
  }
}

function setPath(obj, path, value) {
  const parts = path.split(".");
  let node = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof node[parts[i]] !== "object" || node[parts[i]] === null) node[parts[i]] = {};
    node = node[parts[i]];
  }
  node[parts[parts.length - 1]] = value;
}

/* "Intelligent" default: on a visitor's first-ever visit (nothing saved
   yet), guess their language from the browser instead of always
   defaulting to English. Any explicit choice they make afterward is
   remembered and always wins over this guess. */
function detectBrowserLanguage() {
  const langs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || "en"];
  for (let i = 0; i < langs.length; i++) {
    const code = langs[i].toLowerCase();
    if (code.startsWith("ar")) return "ar";
    if (code.startsWith("fr")) return "fr";
    if (code.startsWith("en")) return "en";
  }
  return "en";
}
