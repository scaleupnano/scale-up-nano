/* ==========================================================================
   Scale Up Nano — language switcher (EN / FR / AR)

   Covers the site "chrome" that appears on every page: nav, footer, and
   each page's hero (title/lead) and primary buttons. Content typed into
   the admin dashboard (activities, members, project descriptions, etc.)
   is written by you in whichever language you choose and is NOT
   auto-translated — this only swaps the fixed interface text around it.

   Usage: any element that should change with the language gets
   data-i18n="key.path" (swaps textContent) or data-i18n-html="key.path"
   (swaps innerHTML, for the one case with an inline gradient span).
   ========================================================================== */

const I18N = {
  en: {
    dir: "ltr",
    nav: { home: "Home", events: "Events", projects: "Projects", members: "Members",
           opportunities: "Opportunities", links: "Links", memories: "Memories", join: "Join" },
    footer: { fine: "SCALE UP NANO · SCHOOL SCIENTIFIC CLUB · NSNN" },
    home: {
      eyebrow: "School Scientific Club · NSNN",
      title_html: "Every idea scales up<br>into <span class=\"gradient-text\">real discovery</span>.",
      lead: "Scale Up Nano is a student-run community exploring nanoscience, robotics, code, and health — built by students, for students who want to build something real before graduation.",
      cta1: "Join the club →", cta2: "See what we're building"
    },
    events: { eyebrow: "Events", title: "Sessions & workshops",
      lead: "Weekly meetups covering all four labs — talks, hands-on builds, and open lab hours where members work on their own projects side by side." },
    projects: { eyebrow: "Projects", title: "What we're building",
      lead: "Member-led projects across all four labs — some solo, some team builds carried across terms." },
    members: { eyebrow: "Members", title: "Who's in the club",
      lead: "Organizers, lab leads, and members — added and kept current from the admin dashboard." },
    opportunities: { eyebrow: "Opportunities", title: "Internships, competitions & grants",
      lead: "A running list of opportunities relevant to nanoscience, robotics, code, and health — curated by the club for its members." },
    links: { eyebrow: "Links", title: "Everywhere to find us" },
    memories: { eyebrow: "Memories", title: "Moments from the club",
      lead: "A running photo log of sessions, builds, and events — added by the team and by members." },
    join: { eyebrow: "Join", title: "Become a member",
      lead: "No prerequisite background needed — just fill this out, or jump straight into our Discord." }
  },

  fr: {
    dir: "ltr",
    nav: { home: "Accueil", events: "Événements", projects: "Projets", members: "Membres",
           opportunities: "Opportunités", links: "Liens", memories: "Souvenirs", join: "Rejoindre" },
    footer: { fine: "SCALE UP NANO · CLUB SCIENTIFIQUE SCOLAIRE · NSNN" },
    home: {
      eyebrow: "Club scientifique scolaire · NSNN",
      title_html: "Chaque idée grandit<br>jusqu'à devenir une <span class=\"gradient-text\">vraie découverte</span>.",
      lead: "Scale Up Nano est une communauté étudiante qui explore la nanoscience, la robotique, le code et la santé — créée par des étudiants, pour des étudiants qui veulent construire quelque chose de concret avant la fin de leurs études.",
      cta1: "Rejoindre le club →", cta2: "Voir ce que nous construisons"
    },
    events: { eyebrow: "Événements", title: "Séances et ateliers",
      lead: "Des rencontres hebdomadaires couvrant les quatre pôles — conférences, ateliers pratiques, et heures de labo ouvert où chacun avance sur son propre projet." },
    projects: { eyebrow: "Projets", title: "Ce que nous construisons",
      lead: "Des projets menés par les membres dans les quatre pôles — certains en solo, d'autres en équipe sur plusieurs trimestres." },
    members: { eyebrow: "Membres", title: "Qui fait partie du club",
      lead: "Organisateurs, responsables de pôle et membres — ajoutés et tenus à jour depuis le tableau de bord admin." },
    opportunities: { eyebrow: "Opportunités", title: "Stages, concours et bourses",
      lead: "Une liste continue d'opportunités liées à la nanoscience, la robotique, le code et la santé — sélectionnées par le club pour ses membres." },
    links: { eyebrow: "Liens", title: "Nous retrouver partout" },
    memories: { eyebrow: "Souvenirs", title: "Les moments du club",
      lead: "Un fil de photos des séances, projets et événements — ajoutées par l'équipe et par les membres." },
    join: { eyebrow: "Rejoindre", title: "Devenir membre",
      lead: "Aucun prérequis nécessaire — remplissez ce formulaire, ou rejoignez directement notre Discord." }
  },

  ar: {
    dir: "rtl",
    nav: { home: "الرئيسية", events: "الفعاليات", projects: "المشاريع", members: "الأعضاء",
           opportunities: "الفرص", links: "الروابط", memories: "الذكريات", join: "انضم" },
    footer: { fine: "سكيل أب نانو · نادٍ علمي مدرسي · NSNN" },
    home: {
      eyebrow: "نادٍ علمي مدرسي · NSNN",
      title_html: "كل فكرة تكبر<br>لتصبح <span class=\"gradient-text\">اكتشافًا حقيقيًا</span>.",
      lead: "سكيل أب نانو مجتمع طلابي يستكشف علم النانو والروبوتات والبرمجة والصحة — أسّسه طلاب من أجل طلاب يريدون بناء شيء حقيقي قبل التخرج.",
      cta1: "انضم إلى النادي ←", cta2: "شاهد ما نبنيه"
    },
    events: { eyebrow: "الفعاليات", title: "الجلسات وورش العمل",
      lead: "لقاءات أسبوعية تغطي المسارات الأربعة — محاضرات قصيرة، بناء عملي، وساعات مختبر مفتوحة يعمل فيها الأعضاء على مشاريعهم الخاصة." },
    projects: { eyebrow: "المشاريع", title: "ما الذي نبنيه",
      lead: "مشاريع يقودها الأعضاء عبر المسارات الأربعة — بعضها فردي وبعضها جماعي يمتد عبر فصول دراسية." },
    members: { eyebrow: "الأعضاء", title: "من في النادي",
      lead: "المنظمون وقادة المسارات والأعضاء — تتم إضافتهم وتحديثهم من لوحة التحكم." },
    opportunities: { eyebrow: "الفرص", title: "تدريبات ومسابقات ومنح",
      lead: "قائمة مستمرة بالفرص المتعلقة بعلم النانو والروبوتات والبرمجة والصحة — يختارها النادي لأعضائه." },
    links: { eyebrow: "الروابط", title: "تجدنا في كل مكان" },
    memories: { eyebrow: "الذكريات", title: "لحظات من النادي",
      lead: "سجل صور مستمر للجلسات والمشاريع والفعاليات — يضيفه الفريق والأعضاء." },
    join: { eyebrow: "انضم", title: "كن عضوًا",
      lead: "لا حاجة لخبرة مسبقة — فقط املأ هذا النموذج، أو انضم مباشرة إلى Discord الخاص بنا." }
  }
};

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

document.addEventListener("DOMContentLoaded", function () {
  const saved = localStorage.getItem("sun_lang") || "en";
  applyLanguage(saved);
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { applyLanguage(btn.dataset.lang); });
  });
});
