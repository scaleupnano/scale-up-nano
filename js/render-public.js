/* ==========================================================================
   Scale Up Nano — public page rendering

   Each public page has a container with a data-render attribute
   (e.g. data-render="activities"). On load, this script fetches the
   matching Firestore collection and renders cards into it. If Firestore
   has nothing yet (or fails to load), a friendly empty-state is shown
   instead of a blank page.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-render]").forEach(function (container) {
    const kind = container.dataset.render;
    if (RENDERERS[kind]) RENDERERS[kind](container);
  });
});

const RENDERERS = {

  activities: async function (container) {
    container.innerHTML = "<p class='muted'>Loading…</p>";
    const snap = await safeGet("activities");
    if (!snap || snap.empty) {
      container.innerHTML = emptyState("No activities posted yet — check back soon.");
      return;
    }
    container.innerHTML = "";
    snap.forEach(function (doc) {
      const d = doc.data();
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML =
        (d.tag ? '<span class="tag">' + escapeHtml(d.tag) + '</span>' : '') +
        (d.status ? ' <span class="status-badge status-' + slug(d.status) + '">' + escapeHtml(d.status) + '</span>' : '') +
        '<h3>' + escapeHtml(d.title || "") + '</h3>' +
        '<p>' + escapeHtml(d.description || "") + '</p>' +
        '<div class="meta">' +
          (d.date ? '<span>📅 ' + escapeHtml(d.date) + '</span>' : '') +
          (d.time ? '<span>🕒 ' + escapeHtml(d.time) + '</span>' : '') +
          (d.location ? '<span>📍 ' + escapeHtml(d.location) + '</span>' : '') +
        '</div>';

      if (Array.isArray(d.formFields) && d.formFields.length) {
        card.appendChild(buildActivityForm(doc.id, d.formFields));
      }

      container.appendChild(card);
    });
  },

  projects: async function (container) {
    container.innerHTML = "<p class='muted'>Loading…</p>";
    const snap = await safeGet("projects");
    if (!snap || snap.empty) {
      container.innerHTML = emptyState("No projects posted yet.");
      return;
    }
    container.innerHTML = "";
    snap.forEach(function (doc) {
      const d = doc.data();
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML =
        (d.tag ? '<span class="tag">' + escapeHtml(d.tag) + '</span>' : '') +
        '<h3>' + escapeHtml(d.name || "") + '</h3>' +
        '<p>' + escapeHtml(d.description || "") + '</p>' +
        '<div class="meta">' +
          (d.lead ? '<span>👤 ' + escapeHtml(d.lead) + '</span>' : '') +
          (d.status ? '<span>● ' + escapeHtml(d.status) + '</span>' : '') +
        '</div>';
      container.appendChild(card);
    });
  },

  members: async function (container) {
    container.innerHTML = "<p class='muted'>Loading…</p>";
    const snap = await safeGet("members");
    if (!snap || snap.empty) {
      container.innerHTML = emptyState("No members listed yet.");
      return;
    }
    container.innerHTML = "";
    snap.forEach(function (doc) {
      const d = doc.data();
      const card = document.createElement("div");
      card.className = "card member-card";
      const avatar = d.photoURL
        ? '<img src="' + d.photoURL + '" class="avatar-photo" alt="' + escapeHtml(d.name || "") + '">'
        : '<div class="avatar">' + initials(d.name) + '</div>';
      card.innerHTML = avatar + '<h3>' + escapeHtml(d.name || "") + '</h3><p>' + escapeHtml(d.role || "") + '</p>';
      container.appendChild(card);
    });
  },

  opportunities: async function (container) {
    container.innerHTML = "<p class='muted'>Loading…</p>";
    const snap = await safeGet("opportunities");
    if (!snap || snap.empty) {
      container.innerHTML = emptyState("No opportunities posted yet.");
      return;
    }
    container.innerHTML = "";
    snap.forEach(function (doc) {
      const d = doc.data();
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML =
        (d.tag ? '<span class="tag">' + escapeHtml(d.tag) + '</span>' : '') +
        '<h3>' + escapeHtml(d.title || "") + '</h3>' +
        '<p>' + escapeHtml(d.description || "") + '</p>' +
        '<div class="meta">' +
          (d.org ? '<span>🏷 ' + escapeHtml(d.org) + '</span>' : '') +
          (d.deadline ? '<span>⏳ ' + escapeHtml(d.deadline) + '</span>' : '') +
        '</div>';
      container.appendChild(card);
    });
  },

  links: async function (container) {
    container.innerHTML = "<p class='muted'>Loading…</p>";
    const snap = await safeGet("links");
    if (!snap || snap.empty) {
      container.innerHTML = emptyState("No links added yet.");
      return;
    }
    container.innerHTML = "";
    snap.forEach(function (doc) {
      const d = doc.data();
      const a = document.createElement("a");
      a.className = "link-row";
      a.href = d.url || "#";
      a.target = "_blank";
      a.rel = "noopener";
      a.innerHTML = "<span>" + escapeHtml(d.label || "") + "</span><span class='arrow'>→</span>";
      container.appendChild(a);
    });
  },

  stats: async function (container) {
    const [members, activities, projects] = await Promise.all([
      safeCount("members"), safeCount("activities"), safeCount("projects")
    ]);
    const nums = container.querySelectorAll("[data-stat]");
    nums.forEach(function (el) {
      const key = el.dataset.stat;
      const val = key === "members" ? members : key === "activities" ? activities : projects;
      el.textContent = val;
    });
  },

  nextEvent: async function (container) {
    const snap = await safeGet("activities");
    if (!snap || snap.empty) {
      container.innerHTML = emptyState("No upcoming session posted yet — check the Activities page.");
      return;
    }
    const upcoming = snap.docs.map(function (d) { return d.data(); })
      .find(function (d) { return d.status === "Upcoming" || !d.status; }) || snap.docs[0].data();
    container.innerHTML =
      '<div class="card">' +
      (upcoming.tag ? '<span class="tag">' + escapeHtml(upcoming.tag) + '</span>' : '') +
      '<h3>' + escapeHtml(upcoming.title || "") + '</h3>' +
      '<p>' + escapeHtml(upcoming.description || "") + '</p>' +
      '<div class="meta">' +
        (upcoming.date ? '<span>📅 ' + escapeHtml(upcoming.date) + '</span>' : '') +
        (upcoming.time ? '<span>🕒 ' + escapeHtml(upcoming.time) + '</span>' : '') +
        (upcoming.location ? '<span>📍 ' + escapeHtml(upcoming.location) + '</span>' : '') +
      '</div></div>';
  },

  memories: async function (container) {
    container.innerHTML = "<p class='muted'>Loading…</p>";
    const snap = await safeGet("memories");
    if (!snap || snap.empty) {
      container.innerHTML = emptyState("No memories posted yet — this page fills up as the club runs events.");
      return;
    }
    container.innerHTML = "";
    snap.forEach(function (doc) {
      const d = doc.data();
      const card = document.createElement("div");
      card.className = "card memory-card";
      card.innerHTML =
        (d.photoURL ? '<img src="' + d.photoURL + '" class="memory-photo" alt="' + escapeHtml(d.title || "") + '">' : '') +
        '<h3>' + escapeHtml(d.title || "") + '</h3>' +
        (d.date ? '<div class="meta"><span>📅 ' + escapeHtml(d.date) + '</span></div>' : '') +
        '<p>' + escapeHtml(d.description || "") + '</p>';
      container.appendChild(card);
    });
  }
};

/* ---------- Per-activity sign-up / feedback form ---------- */
function buildActivityForm(activityId, formFields) {
  const wrap = document.createElement("form");
  wrap.className = "activity-form";
  wrap.innerHTML = "<div class='form-divider'></div>";

  formFields.forEach(function (f) {
    const row = document.createElement("div");
    row.className = "form-row-compact";
    const label = document.createElement("label");
    label.textContent = f.label;
    row.appendChild(label);

    let input;
    if (f.type === "textarea") {
      input = document.createElement("textarea");
      input.rows = 2;
    } else {
      input = document.createElement("input");
      input.type = f.type === "number" ? "number" : (f.type === "email" ? "email" : "text");
    }
    input.name = f.id;
    input.required = true;
    row.appendChild(input);
    wrap.appendChild(row);
  });

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "btn btn-primary btn-small";
  submitBtn.textContent = "Submit";
  wrap.appendChild(submitBtn);

  const status = document.createElement("p");
  status.className = "form-status muted small";
  wrap.appendChild(status);

  wrap.addEventListener("submit", async function (e) {
    e.preventDefault();
    const answers = {};
    formFields.forEach(function (f) {
      answers[f.label] = wrap.querySelector('[name="' + f.id + '"]').value;
    });
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";
    try {
      await db.collection("formSubmissions").add({
        activityId: activityId,
        answers: answers,
        submittedAt: Date.now()
      });
      wrap.innerHTML = "<p class='form-status'>Thanks — your response was recorded.</p>";
    } catch (err) {
      status.textContent = "Couldn't submit: " + err.message;
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    }
  });

  return wrap;
}

/* ---------- Helpers ---------- */
async function safeCount(collectionName) {
  try {
    const snap = await db.collection(collectionName).get();
    return snap.size;
  } catch (err) {
    return 0;
  }
}
async function safeGet(collectionName) {
  try {
    return await db.collection(collectionName).orderBy("order").get();
  } catch (err) {
    console.error("Couldn't load " + collectionName, err);
    return null;
  }
}
function emptyState(msg) {
  return "<div class='slot'>" + escapeHtml(msg) + "</div>";
}
function initials(name) {
  if (!name) return "?";
  return name.trim().split(/\s+/).map(function (p) { return p[0]; }).slice(0, 2).join("").toUpperCase();
}
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (m) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
  });
}
function slug(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
