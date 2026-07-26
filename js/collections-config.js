/* ==========================================================================
   Scale Up Nano — collection schema

   One shared definition of every Firestore collection this site uses,
   so admin.js (the dashboard) and render-public.js (the public pages)
   stay in sync automatically. Add a field here and it shows up in the
   admin form and can be rendered on the public side too.
   ========================================================================== */

const TRACK_OPTIONS = [
  { value: "Science", icon: "🧪" },
  { value: "Robotics", icon: "🤖" },
  { value: "Code", icon: "💻" },
  { value: "Health", icon: "❤️" }
];

/* ==========================================================================
   Editable site copy — powers the admin "Texts" tab.

   Each entry's `key` is the dot-path into the I18N dictionary in
   js/i18n.js (the built-in defaults). Admin edits are saved as overrides
   in Firestore (settings/texts) and layered on top of those defaults at
   runtime — nothing here is deleted or hardcoded away, so if a category
   is never touched it just keeps using the built-in copy.
   ========================================================================== */
const TEXT_SCHEMA = {
  navFooter: {
    label: "Navigation & Footer",
    fields: [
      { key: "nav.home", label: "Nav: Home" },
      { key: "nav.events", label: "Nav: Events" },
      { key: "nav.projects", label: "Nav: Projects" },
      { key: "nav.members", label: "Nav: Members" },
      { key: "nav.opportunities", label: "Nav: Opportunities" },
      { key: "nav.links", label: "Nav: Links" },
      { key: "nav.memories", label: "Nav: Memories" },
      { key: "nav.join", label: "Nav: Join" },
      { key: "footer.fine", label: "Footer fine print" }
    ]
  },
  home: {
    label: "Home",
    fields: [
      { key: "home.eyebrow", label: "Hero eyebrow" },
      { key: "home.title_html", label: "Hero title (HTML — keep <br> and <span> tags)", type: "textarea" },
      { key: "home.lead", label: "Hero subtitle", type: "textarea" },
      { key: "home.cta1", label: "Hero button 1" },
      { key: "home.cta2", label: "Hero button 2" },
      { key: "home.labsEyebrow", label: "\"What we do\" eyebrow" },
      { key: "home.labsTitle", label: "\"What we do\" title" },
      { key: "home.labsDesc", label: "\"What we do\" description", type: "textarea" },
      { key: "home.lab1Title", label: "Card 1 (Nanoscience) title" },
      { key: "home.lab1Desc", label: "Card 1 (Nanoscience) description", type: "textarea" },
      { key: "home.lab2Title", label: "Card 2 (Robotics) title" },
      { key: "home.lab2Desc", label: "Card 2 (Robotics) description", type: "textarea" },
      { key: "home.lab3Title", label: "Card 3 (Code) title" },
      { key: "home.lab3Desc", label: "Card 3 (Code) description", type: "textarea" },
      { key: "home.lab4Title", label: "Card 4 (Health) title" },
      { key: "home.lab4Desc", label: "Card 4 (Health) description", type: "textarea" },
      { key: "home.lab5Title", label: "Card 5 (Events) title" },
      { key: "home.lab5Desc", label: "Card 5 (Events) description", type: "textarea" },
      { key: "home.lab6Title", label: "Card 6 (Community) title" },
      { key: "home.lab6Desc", label: "Card 6 (Community) description", type: "textarea" },
      { key: "home.statsEyebrow", label: "Stats eyebrow" },
      { key: "home.statsTitle", label: "Stats title" },
      { key: "home.statMembers", label: "Stat label: members" },
      { key: "home.statEvents", label: "Stat label: events" },
      { key: "home.statProjects", label: "Stat label: projects" },
      { key: "home.nextEyebrow", label: "Next-up eyebrow" },
      { key: "home.nextTitle", label: "Next-up title" },
      { key: "home.ctaTitle", label: "Bottom CTA title" },
      { key: "home.ctaDesc", label: "Bottom CTA description", type: "textarea" },
      { key: "home.ctaBtn", label: "Bottom CTA button" }
    ]
  },
  events: {
    label: "Events",
    fields: [
      { key: "events.eyebrow", label: "Page eyebrow" },
      { key: "events.title", label: "Page title" },
      { key: "events.lead", label: "Page subtitle", type: "textarea" },
      { key: "eventsFormat.eyebrow", label: "Format section eyebrow" },
      { key: "eventsFormat.title", label: "Format section title" },
      { key: "eventsFormat.talk", label: "Card: Talk label" },
      { key: "eventsFormat.talkTime", label: "Card: Talk duration" },
      { key: "eventsFormat.talkDesc", label: "Card: Talk description", type: "textarea" },
      { key: "eventsFormat.workshop", label: "Card: Workshop label" },
      { key: "eventsFormat.workshopTime", label: "Card: Workshop tag" },
      { key: "eventsFormat.workshopDesc", label: "Card: Workshop description", type: "textarea" },
      { key: "eventsFormat.openLab", label: "Card: Open Lab label" },
      { key: "eventsFormat.openLabTime", label: "Card: Open Lab tag" },
      { key: "eventsFormat.openLabDesc", label: "Card: Open Lab description", type: "textarea" }
    ]
  },
  projects: {
    label: "Projects",
    fields: [
      { key: "projects.eyebrow", label: "Page eyebrow" },
      { key: "projects.title", label: "Page title" },
      { key: "projects.lead", label: "Page subtitle", type: "textarea" }
    ]
  },
  members: {
    label: "Members",
    fields: [
      { key: "members.eyebrow", label: "Page eyebrow" },
      { key: "members.title", label: "Page title" },
      { key: "members.lead", label: "Page subtitle", type: "textarea" }
    ]
  },
  opportunities: {
    label: "Opportunities",
    fields: [
      { key: "opportunities.eyebrow", label: "Page eyebrow" },
      { key: "opportunities.title", label: "Page title" },
      { key: "opportunities.lead", label: "Page subtitle", type: "textarea" }
    ]
  },
  links: {
    label: "Links",
    fields: [
      { key: "links.eyebrow", label: "Page eyebrow" },
      { key: "links.title", label: "Page title" },
      { key: "links.scan", label: "\"Scan to follow\" label" }
    ]
  },
  memories: {
    label: "Memories",
    fields: [
      { key: "memories.eyebrow", label: "Page eyebrow" },
      { key: "memories.title", label: "Page title" },
      { key: "memories.lead", label: "Page subtitle", type: "textarea" }
    ]
  },
  join: {
    label: "Join",
    fields: [
      { key: "join.eyebrow", label: "Page eyebrow" },
      { key: "join.title", label: "Page title" },
      { key: "join.lead", label: "Page subtitle", type: "textarea" },
      { key: "joinForm.cta", label: "Discord button" },
      { key: "joinForm.name", label: "Field label: name" },
      { key: "joinForm.email", label: "Field label: email" },
      { key: "joinForm.track", label: "Field label: track" },
      { key: "joinForm.notSure", label: "Track option: not sure" },
      { key: "joinForm.note", label: "Field label: note" },
      { key: "joinForm.submit", label: "Submit button" }
    ]
  },
  common: {
    label: "Loading & empty states",
    fields: [
      { key: "common.loading", label: "Loading text" },
      { key: "common.noEvents", label: "No events message" },
      { key: "common.noProjects", label: "No projects message" },
      { key: "common.noMembers", label: "No members message" },
      { key: "common.noOpportunities", label: "No opportunities message" },
      { key: "common.noLinks", label: "No links message" },
      { key: "common.noMemories", label: "No memories message" }
    ]
  }
};

const TEXT_LANGUAGES = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "ar", label: "العربية" }
];

const COLLECTIONS = {

  members: {
    label: "Members",
    order: "order",
    fields: [
      { key: "name",   label: "Name",              type: "text",  required: true },
      { key: "role",   label: "Role",              type: "text" },
      { key: "photoURL", label: "Photo",           type: "image" },
      { key: "order",  label: "Display order",     type: "number", default: 0 }
    ]
  },

  projects: {
    label: "Projects",
    order: "order",
    fields: [
      { key: "tag",   label: "Track (e.g. Robotics)", type: "text" },
      { key: "name",  label: "Project name",          type: "text", required: true },
      { key: "description", label: "Description",     type: "textarea" },
      { key: "lead",  label: "Lead",                  type: "text" },
      { key: "status", label: "Status", type: "select",
        options: ["Idea", "Planning", "In progress", "Completed"] },
      { key: "order", label: "Display order",         type: "number", default: 0 }
    ]
  },

  events: {
    label: "Events & formulas",
    order: "order",
    hasForm: true,
    fields: [
      { key: "tag",   label: "Track", type: "pills", options: TRACK_OPTIONS, required: true },
      { key: "title", label: "Event title", type: "text", required: true, placeholder: "e.g. Building Our First Nanobot Model" },
      { key: "description", label: "What's it about", type: "textarea", placeholder: "Why members should show up" },
      { key: "date",  label: "Date", type: "date" },
      { key: "time",  label: "Time", type: "time" },
      { key: "location", label: "Location", type: "text", placeholder: "Room / hall" },
      { key: "status", label: "Status", type: "pills",
        options: [
          { value: "Scheduled", icon: "" },
          { value: "Delayed", icon: "" },
          { value: "Event ended", icon: "" }
        ], default: "Scheduled" },
      { key: "order", label: "Display order", type: "number", default: 0 }
    ]
  },

  opportunities: {
    label: "Opportunities",
    order: "order",
    fields: [
      { key: "tag", label: "Type (Internship / Competition / Grant)", type: "text" },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "org", label: "Organization", type: "text" },
      { key: "deadline", label: "Deadline", type: "text" },
      { key: "order", label: "Display order", type: "number", default: 0 }
    ]
  },

  links: {
    label: "Links",
    order: "order",
    fields: [
      { key: "label", label: "Label", type: "text", required: true },
      { key: "url",   label: "URL",   type: "text", required: true },
      { key: "order", label: "Display order", type: "number", default: 0 }
    ]
  },

  memories: {
    label: "Memories",
    order: "order",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "photoURL", label: "Photo", type: "image" },
      { key: "date", label: "Date", type: "text" },
      { key: "order", label: "Display order", type: "number", default: 0 }
    ]
  }
};

/* Question types for an event's sign-up/feedback form. Each has a short
   badge shown next to the question in admin, and a button label used to
   add one. */
const FORM_FIELD_TYPES = {
  text: { badge: "TEXT", addLabel: "+ Text question" },
  multiple_choice: { badge: "CHOICE", addLabel: "+ Multiple choice" },
  file: { badge: "FILE", addLabel: "+ Photo upload" }
};
