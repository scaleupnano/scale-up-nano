/* ==========================================================================
   Scale Up Nano — collection schema

   One shared definition of every Firestore collection this site uses,
   so admin.js (the dashboard) and render-public.js (the public pages)
   stay in sync automatically. Add a field here and it shows up in the
   admin form and can be rendered on the public side too.
   ========================================================================== */

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

  activities: {
    label: "Activities",
    order: "order",
    hasForm: true,
    fields: [
      { key: "tag",   label: "Track", type: "text" },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "date",  label: "Date (DD/MM)", type: "text" },
      { key: "time",  label: "Time (HH:MM)", type: "text" },
      { key: "location", label: "Room / Hall", type: "text" },
      { key: "status", label: "Status", type: "select",
        options: ["Upcoming", "Done", "Delayed", "Cancelled"], default: "Upcoming" },
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

/* Field types used when building a custom form for an activity
   (attached to the activity doc as `formFields`, answered by visitors
   on the public activities page, results readable only from admin.html). */
const FORM_FIELD_TYPES = ["text", "textarea", "number", "email", "select"];
