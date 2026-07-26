/* ==========================================================================
   Scale Up Nano — translation dictionary (data only)

   Loaded on its own (before i18n.js) so admin.html can read these as
   the built-in defaults for the Texts tab, without pulling in the
   language-switcher logic that page doesn't need.
   ========================================================================== */

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
      cta1: "Join the club →", cta2: "See what we're building",
      labsEyebrow: "What we do", labsTitle: "Four labs, one club",
      labsDesc: "We split our work into four tracks so members can go deep on what interests them, then bring it back to the group.",
      lab1Title: "Matter at the smallest scale", lab1Desc: "Reading groups, guest talks, and lab visits covering nanomaterials, quantum effects, and where the field is heading.",
      lab2Title: "Hands-on builds", lab2Desc: "From first soldering iron to autonomous rigs — a build track for anyone who wants to make hardware do things.",
      lab3Title: "Software for the other three labs", lab3Desc: "Firmware, simulations, data pipelines, and the club's own internal tools — written by members, for members.",
      lab4Title: "Where nano meets biology", lab4Desc: "Drug delivery, diagnostics, biosensors — the applied side of nanoscience, with an eye on real-world impact.",
      lab5Title: "Weekly sessions", lab5Desc: "Short talks, workshops, and open lab hours — see the full schedule on the Events page.",
      lab6Title: "Open to all years", lab6Desc: "No prerequisite knowledge required to show up — just curiosity. Most of what we teach, we learned from each other.",
      statsEyebrow: "By the numbers", statsTitle: "A young club, moving fast",
      statMembers: "Active members", statEvents: "Events run so far", statProjects: "Projects in progress",
      nextEyebrow: "Next up", nextTitle: "Upcoming event",
      ctaTitle: "Ready to build something?", ctaDesc: "Sessions are open to every student — bring an idea, or come find one.", ctaBtn: "Join Scale Up Nano →"
    },
    common: {
      loading: "Loading…", noEvents: "No events posted yet — check back soon.", noProjects: "No projects posted yet.",
      noMembers: "No members listed yet.", noOpportunities: "No opportunities posted yet.", noLinks: "No links added yet.",
      noMemories: "No memories posted yet — this page fills up as the club runs events."
    },
    joinForm: {
      cta: "Join via Discord →", name: "Full name", email: "School email",
      track: "Which lab interests you most?", note: "Anything you want to build or learn?",
      submit: "Submit", notSure: "Not sure yet"
    },
    eventsFormat: {
      eyebrow: "Format", title: "What a typical week looks like",
      talk: "Talk", talkTime: "20–30 min", talkDesc: "A member or guest walks through one concept, paper, or project — kept short on purpose so there's time for questions.",
      workshop: "Workshop", workshopTime: "Hands-on", workshopDesc: "Bring a laptop or show up to the lab — we work through a build or exercise together, step by step.",
      openLab: "Open Lab", openLabTime: "Unstructured time", openLabDesc: "No agenda — just a room, equipment, and other members working on their own projects if you want feedback or company."
    },
    links: { eyebrow: "Links", title: "Everywhere to find us", scan: "Scan to follow" },
    events: { eyebrow: "Events", title: "Sessions & workshops",
      lead: "Weekly meetups covering all four labs — talks, hands-on builds, and open lab hours where members work on their own projects side by side." },
    projects: { eyebrow: "Projects", title: "What we're building",
      lead: "Member-led projects across all four labs — some solo, some team builds carried across terms." },
    members: { eyebrow: "Members", title: "Who's in the club",
      lead: "Organizers, lab leads, and members — added and kept current from the admin dashboard." },
    opportunities: { eyebrow: "Opportunities", title: "Internships, competitions & grants",
      lead: "A running list of opportunities relevant to nanoscience, robotics, code, and health — curated by the club for its members." },
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
      cta1: "Rejoindre le club →", cta2: "Voir ce que nous construisons",
      labsEyebrow: "Ce que nous faisons", labsTitle: "Quatre pôles, un seul club",
      labsDesc: "Nous répartissons notre travail en quatre pôles pour que chacun puisse approfondir ce qui l'intéresse, puis en faire profiter le groupe.",
      lab1Title: "La matière à la plus petite échelle", lab1Desc: "Groupes de lecture, conférences invitées et visites de labo sur les nanomatériaux, les effets quantiques et l'avenir du domaine.",
      lab2Title: "Constructions pratiques", lab2Desc: "Du premier fer à souder aux robots autonomes — un pôle pour quiconque veut faire fonctionner du matériel.",
      lab3Title: "Le logiciel des trois autres pôles", lab3Desc: "Firmware, simulations, traitement de données et outils internes du club — écrits par les membres, pour les membres.",
      lab4Title: "Là où le nano rencontre la biologie", lab4Desc: "Délivrance de médicaments, diagnostics, biocapteurs — le côté appliqué de la nanoscience, avec un impact réel en ligne de mire.",
      lab5Title: "Séances hebdomadaires", lab5Desc: "Conférences courtes, ateliers et heures de labo ouvert — voir le programme complet sur la page Événements.",
      lab6Title: "Ouvert à tous les niveaux", lab6Desc: "Aucune connaissance préalable requise — juste de la curiosité. La plupart de ce qu'on enseigne, on l'a appris entre nous.",
      statsEyebrow: "En chiffres", statsTitle: "Un jeune club qui avance vite",
      statMembers: "Membres actifs", statEvents: "Événements organisés", statProjects: "Projets en cours",
      nextEyebrow: "À venir", nextTitle: "Prochain événement",
      ctaTitle: "Prêt à construire quelque chose ?", ctaDesc: "Les séances sont ouvertes à tous les étudiants — apportez une idée, ou venez en trouver une.", ctaBtn: "Rejoindre Scale Up Nano →"
    },
    common: {
      loading: "Chargement…", noEvents: "Aucun événement publié pour l'instant — revenez bientôt.", noProjects: "Aucun projet publié pour l'instant.",
      noMembers: "Aucun membre listé pour l'instant.", noOpportunities: "Aucune opportunité publiée pour l'instant.", noLinks: "Aucun lien ajouté pour l'instant.",
      noMemories: "Aucun souvenir publié pour l'instant — cette page se remplit au fil des événements du club."
    },
    joinForm: {
      cta: "Rejoindre via Discord →", name: "Nom complet", email: "Email scolaire",
      track: "Quel pôle vous intéresse le plus ?", note: "Quelque chose que vous voulez construire ou apprendre ?",
      submit: "Envoyer", notSure: "Pas encore sûr"
    },
    eventsFormat: {
      eyebrow: "Format", title: "À quoi ressemble une semaine type",
      talk: "Conférence", talkTime: "20–30 min", talkDesc: "Un membre ou un invité présente un concept, un article ou un projet — volontairement court pour laisser du temps aux questions.",
      workshop: "Atelier", workshopTime: "Pratique", workshopDesc: "Apportez un ordinateur ou venez au labo — on avance ensemble sur une construction ou un exercice, étape par étape.",
      openLab: "Labo ouvert", openLabTime: "Temps libre", openLabDesc: "Aucun programme — juste une salle, du matériel, et d'autres membres qui travaillent sur leurs projets si vous voulez des retours ou de la compagnie."
    },
    events: { eyebrow: "Événements", title: "Séances et ateliers",
      lead: "Des rencontres hebdomadaires couvrant les quatre pôles — conférences, ateliers pratiques, et heures de labo ouvert où chacun avance sur son propre projet." },
    projects: { eyebrow: "Projets", title: "Ce que nous construisons",
      lead: "Des projets menés par les membres dans les quatre pôles — certains en solo, d'autres en équipe sur plusieurs trimestres." },
    members: { eyebrow: "Membres", title: "Qui fait partie du club",
      lead: "Organisateurs, responsables de pôle et membres — ajoutés et tenus à jour depuis le tableau de bord admin." },
    opportunities: { eyebrow: "Opportunités", title: "Stages, concours et bourses",
      lead: "Une liste continue d'opportunités liées à la nanoscience, la robotique, le code et la santé — sélectionnées par le club pour ses membres." },
    links: { eyebrow: "Liens", title: "Nous retrouver partout", scan: "Scannez pour nous suivre" },
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
      cta1: "انضم إلى النادي ←", cta2: "شاهد ما نبنيه",
      labsEyebrow: "ماذا نفعل", labsTitle: "أربعة مسارات، نادٍ واحد",
      labsDesc: "نقسّم عملنا إلى أربعة مسارات ليتعمق كل عضو فيما يهمه، ثم يشارك ذلك مع المجموعة.",
      lab1Title: "المادة عند أصغر مقياس", lab1Desc: "مجموعات قراءة ومحاضرات ضيوف وزيارات مخبرية حول المواد النانوية والتأثيرات الكمومية ووجهة المجال مستقبلًا.",
      lab2Title: "بناء عملي", lab2Desc: "من أول استخدام لمكواة اللحام إلى الأنظمة ذاتية الحركة — مسار لكل من يريد جعل الأجهزة تعمل فعليًا.",
      lab3Title: "برمجيات المسارات الثلاثة الأخرى", lab3Desc: "البرامج الثابتة والمحاكاة وخطوط معالجة البيانات وأدوات النادي الداخلية — يكتبها الأعضاء لأجل الأعضاء.",
      lab4Title: "حيث يلتقي النانو بالأحياء", lab4Desc: "توصيل الأدوية والتشخيص والمستشعرات الحيوية — الجانب التطبيقي لعلم النانو، بنظرة نحو أثر حقيقي.",
      lab5Title: "جلسات أسبوعية", lab5Desc: "محاضرات قصيرة وورش عمل وساعات مختبر مفتوحة — شاهد الجدول الكامل في صفحة الفعاليات.",
      lab6Title: "مفتوح لكل السنوات", lab6Desc: "لا حاجة لأي معرفة مسبقة للمشاركة — فقط الفضول. معظم ما نعلّمه تعلمناه من بعضنا البعض.",
      statsEyebrow: "بالأرقام", statsTitle: "نادٍ فتيّ يتحرك بسرعة",
      statMembers: "أعضاء نشطون", statEvents: "فعاليات أُقيمت", statProjects: "مشاريع قيد التنفيذ",
      nextEyebrow: "قريبًا", nextTitle: "الفعالية القادمة",
      ctaTitle: "جاهز لبناء شيء ما؟", ctaDesc: "الجلسات مفتوحة لكل طالب — أحضر فكرة، أو تعال لتجد واحدة.", ctaBtn: "انضم إلى سكيل أب نانو ←"
    },
    common: {
      loading: "جارٍ التحميل…", noEvents: "لا توجد فعاليات منشورة بعد — عد لاحقًا.", noProjects: "لا توجد مشاريع منشورة بعد.",
      noMembers: "لا يوجد أعضاء مدرجون بعد.", noOpportunities: "لا توجد فرص منشورة بعد.", noLinks: "لا توجد روابط مضافة بعد.",
      noMemories: "لا توجد ذكريات منشورة بعد — تمتلئ هذه الصفحة مع فعاليات النادي."
    },
    joinForm: {
      cta: "انضم عبر Discord ←", name: "الاسم الكامل", email: "البريد المدرسي",
      track: "أي مسار يهمك أكثر؟", note: "ما الذي تريد بناءه أو تعلمه؟",
      submit: "إرسال", notSure: "لست متأكدًا بعد"
    },
    eventsFormat: {
      eyebrow: "الصيغة", title: "كيف يبدو أسبوع عادي",
      talk: "محاضرة", talkTime: "20-30 دقيقة", talkDesc: "يقدّم عضو أو ضيف مفهومًا أو ورقة بحثية أو مشروعًا — قصيرة عمدًا ليبقى وقت للأسئلة.",
      workshop: "ورشة عمل", workshopTime: "عملي", workshopDesc: "أحضر حاسوبًا أو تعال إلى المختبر — نعمل معًا على بناء أو تمرين خطوة بخطوة.",
      openLab: "مختبر مفتوح", openLabTime: "وقت حر", openLabDesc: "لا جدول أعمال — فقط غرفة ومعدات وأعضاء آخرون يعملون على مشاريعهم الخاصة إن أردت رأيًا أو رفقة."
    },
    events: { eyebrow: "الفعاليات", title: "الجلسات وورش العمل",
      lead: "لقاءات أسبوعية تغطي المسارات الأربعة — محاضرات قصيرة، بناء عملي، وساعات مختبر مفتوحة يعمل فيها الأعضاء على مشاريعهم الخاصة." },
    projects: { eyebrow: "المشاريع", title: "ما الذي نبنيه",
      lead: "مشاريع يقودها الأعضاء عبر المسارات الأربعة — بعضها فردي وبعضها جماعي يمتد عبر فصول دراسية." },
    members: { eyebrow: "الأعضاء", title: "من في النادي",
      lead: "المنظمون وقادة المسارات والأعضاء — تتم إضافتهم وتحديثهم من لوحة التحكم." },
    opportunities: { eyebrow: "الفرص", title: "تدريبات ومسابقات ومنح",
      lead: "قائمة مستمرة بالفرص المتعلقة بعلم النانو والروبوتات والبرمجة والصحة — يختارها النادي لأعضائه." },
    links: { eyebrow: "الروابط", title: "تجدنا في كل مكان", scan: "امسح للمتابعة" },
    memories: { eyebrow: "الذكريات", title: "لحظات من النادي",
      lead: "سجل صور مستمر للجلسات والمشاريع والفعاليات — يضيفه الفريق والأعضاء." },
    join: { eyebrow: "انضم", title: "كن عضوًا",
      lead: "لا حاجة لخبرة مسبقة — فقط املأ هذا النموذج، أو انضم مباشرة إلى Discord الخاص بنا." }
  }
};
