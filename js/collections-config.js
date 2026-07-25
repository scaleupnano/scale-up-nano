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
