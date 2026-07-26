/* ==========================================================================
   Scale Up Nano — public page rendering

   Each public page has a container with a data-render attribute
   (e.g. data-render="events"). On load, this script fetches the
   matching Firestore collection and renders cards into it. If Firestore
   has nothing yet (or fails to load), a friendly empty-state is shown
   instead of a blank page.
   ========================================================================== */

/* If a Firestore/Storage call hangs (bad network, misconfigured rules,
   blocked connection, etc.) this stops it from freezing the UI forever —
   after 15s it rejects with a clear message instead. */
function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(
          (label || "This request") + " timed out after 15s. Check your internet connection, " +
          "that Firebase Storage/Firestore rules were re-published, and the browser console (F12) for a more specific error."
        ));
      }, 15000);
    })
  ]);
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-render]").forEach(function (container) {
    const kind = container.dataset.render;
    if (RENDERERS[kind]) RENDERERS[kind](container);
  });
});

const RENDERERS = {

  events: async function (container) {
    container.innerHTML = "<p class='muted'>" + t('common.loading','Loading…') + "</p>";
    const snap = await safeGet("events");
    if (!snap || snap.empty) {
      container.innerHTML = emptyState(t("common.noEvents", "No events posted yet — check back soon."));
      return;
    }
    container.innerHTML = "";
    snap.forEach(function (doc) {
      const d = doc.data();
      const card = document.createElement("div");
      card.className = "card";
      const dot = d.status === "Scheduled" ? '<span class="status-dot dot-scheduled"></span>' :
                  d.status === "Delayed" ? '<span class="status-dot dot-delayed"></span>' :
                  d.status === "Event ended" ? '<span class="status-dot dot-ended"></span>' : '';
      card.innerHTML =
        (d.tag ? '<span class="tag">' + escapeHtml(d.tag) + '</span>' : '') +
        (d.status ? ' <span class="status-badge status-' + slug(d.status) + '">' + escapeHtml(d.status) + '</span>' : '') +
        '<h3>' + dot + escapeHtml(d.title || "") + '</h3>' +
        '<p>' + escapeHtml(d.description || "") + '</p>' +
        '<div class="meta">' +
          (d.date ? '<span>📅 ' + escapeHtml(d.date) + '</span>' : '') +
          (d.time ? '<span>🕒 ' + escapeHtml(d.time) + '</span>' : '') +
          (d.location ? '<span>📍 ' + escapeHtml(d.location) + '</span>' : '') +
        '</div>';

      if (Array.isArray(d.formFields) && d.formFields.length) {
        if (d.status === "Scheduled") {
          card.appendChild(buildActivityForm(doc.id, d.formFields));
        } else if (d.status === "Delayed") {
          const note = document.createElement("p");
          note.className = "form-status muted small";
          note.style.marginTop = "14px";
          note.textContent = "This event was delayed — the form will reopen once it's rescheduled.";
          card.appendChild(note);
        } else if (d.status === "Event ended") {
          const note = document.createElement("p");
          note.className = "form-status muted small";
          note.style.marginTop = "14px";
          note.textContent = "This event has ended — the form is now closed.";
          card.appendChild(note);
        }
      }

      container.appendChild(card);
    });
  },

  projects: async function (container) {
    container.innerHTML = "<p class='muted'>" + t('common.loading','Loading…') + "</p>";
    const snap = await safeGet("projects");
    if (!snap || snap.empty) {
      container.innerHTML = emptyState(t("common.noProjects", "No projects posted yet."));
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
    container.innerHTML = "<p class='muted'>" + t('common.loading','Loading…') + "</p>";
    const snap = await safeGet("members");
    if (!snap || snap.empty) {
      container.innerHTML = emptyState(t("common.noMembers", "No members listed yet."));
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
    container.innerHTML = "<p class='muted'>" + t('common.loading','Loading…') + "</p>";
    const snap = await safeGet("opportunities");
    if (!snap || snap.empty) {
      container.innerHTML = emptyState(t("common.noOpportunities", "No opportunities posted yet."));
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
    container.innerHTML = "<p class='muted'>" + t('common.loading','Loading…') + "</p>";
    const snap = await safeGet("links");
    if (!snap || snap.empty) {
      container.innerHTML = emptyState(t("common.noLinks", "No links added yet."));
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
    const [members, events, projects] = await Promise.all([
      safeCount("members"), safeCount("events"), safeCount("projects")
    ]);
    const nums = container.querySelectorAll("[data-stat]");
    nums.forEach(function (el) {
      const key = el.dataset.stat;
      const val = key === "members" ? members : key === "events" ? events : projects;
      el.textContent = val;
    });
  },

  nextEvent: async function (container) {
    const snap = await safeGet("events");
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

  qrCode: async function (container) {
    let imgSrc = typeof DEFAULT_QR_IMAGE !== "undefined" ? DEFAULT_QR_IMAGE : "";
    try {
      const doc = await db.collection("settings").doc("links").get();
      if (doc.exists && doc.data().qrCodeImage) imgSrc = doc.data().qrCodeImage;
    } catch (err) {
      console.error("Couldn't load QR code setting", err);
    }
    if (!imgSrc) { container.innerHTML = ""; return; }
    container.innerHTML =
      '<img src="' + imgSrc + '" alt="Scan to follow" style="width:170px; height:170px; border-radius:14px; border:1px solid var(--line); background:#fff; padding:10px; object-fit:contain;">';
  },

  memories: async function (container) {
    container.innerHTML = "<p class='muted'>" + t('common.loading','Loading…') + "</p>";
    const snap = await safeGet("memories");
    if (!snap || snap.empty) {
      container.innerHTML = emptyState(t("common.noMemories", "No memories posted yet — this page fills up as the club runs events."));
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
  },

  shareMemoryForm: function (container) {
    container.innerHTML =
      '<form id="memory-submit-form" class="card join-card" style="max-width:520px;">' +
        '<h3 style="margin-bottom:6px;">Share a memory</h3>' +
        '<p class="muted" style="margin-bottom:20px;">Add a photo and a line about a session or event — it\'ll show up here once approved.</p>' +
        '<div class="form-row-compact"><label>Your name (optional)</label><input type="text" id="mem-name"></div>' +
        '<div class="form-row-compact"><label>Title</label><input type="text" id="mem-title" required></div>' +
        '<div class="form-row-compact"><label>What happened?</label><textarea id="mem-desc" rows="3" required></textarea></div>' +
        '<div class="form-row-compact"><label>Photo (optional, under 5MB)</label><input type="file" id="mem-photo" accept="image/*"></div>' +
        '<button type="submit" class="btn btn-primary" style="margin-top:6px;">Submit for review</button>' +
        '<p id="mem-status" class="form-status muted small"></p>' +
      '</form>';

    document.getElementById("memory-submit-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      const status = document.getElementById("mem-status");
      const title = document.getElementById("mem-title").value.trim();
      const desc = document.getElementById("mem-desc").value.trim();
      const name = document.getElementById("mem-name").value.trim();
      const file = document.getElementById("mem-photo").files[0];

      btn.disabled = true;
      btn.textContent = "Submitting…";
      try {
        let photoURL = "";
        if (file) {
          photoURL = await compressImageToDataURL(file, 900, 0.7);
        }
        await withTimeout(db.collection("memorySubmissions").add({
          name: name, title: title, description: desc, photoURL: photoURL,
          status: "pending", submittedAt: Date.now()
        }), "Submitting");
        e.target.innerHTML = "<p class='form-status'>Thanks — your memory is in for review and will appear once approved.</p>";
      } catch (err) {
        status.textContent = "Couldn't submit: " + err.message;
        btn.disabled = false;
        btn.textContent = "Submit for review";
      }
    });
  }
};

/* ---------- Per-event sign-up / feedback form ---------- */
function buildActivityForm(eventId, formFields) {
  const wrap = document.createElement("form");
  wrap.className = "activity-form";
  wrap.innerHTML = "<div class='form-divider'></div>";

  formFields.forEach(function (f) {
    const row = document.createElement("div");
    row.className = "form-row-compact";
    const label = document.createElement("label");
    label.textContent = f.label;
    row.appendChild(label);

    if (f.type === "multiple_choice") {
      const optWrap = document.createElement("div");
      optWrap.className = "choice-group";
      (f.options || []).forEach(function (opt, i) {
        const optLabel = document.createElement("label");
        optLabel.className = "choice-option";
        optLabel.innerHTML =
          '<input type="radio" name="' + f.id + '" value="' + escapeHtml(opt) + '"' + (f.required ? " required" : "") + '> ' + escapeHtml(opt);
        optWrap.appendChild(optLabel);
      });
      row.appendChild(optWrap);
    } else if (f.type === "file") {
      const input = document.createElement("input");
      input.type = "file";
      input.name = f.id;
      input.dataset.fieldType = "file";
      if (f.required) input.required = true;
      row.appendChild(input);
    } else {
      const input = document.createElement("input");
      input.type = "text";
      input.name = f.id;
      if (f.required) input.required = true;
      row.appendChild(input);
    }

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
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";
    try {
      const answers = {};
      for (const f of formFields) {
        if (f.type === "multiple_choice") {
          const checked = wrap.querySelector('input[name="' + f.id + '"]:checked');
          answers[f.label] = checked ? checked.value : "";
        } else if (f.type === "file") {
          const fileInput = wrap.querySelector('[name="' + f.id + '"]');
          const file = fileInput.files[0];
          if (file) {
            answers[f.label] = await compressImageToDataURL(file, 700, 0.65);
          } else {
            answers[f.label] = "";
          }
        } else {
          answers[f.label] = wrap.querySelector('[name="' + f.id + '"]').value;
        }
      }
      await withTimeout(db.collection("formSubmissions").add({
        activityId: eventId,
        answers: answers,
        submittedAt: Date.now()
      }), "Submitting");
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
function t(key, fallback) {
  try {
    const lang = document.documentElement.lang || localStorage.getItem("sun_lang") || "en";
    const dict = (typeof I18N !== "undefined" && (I18N[lang] || I18N.en)) || null;
    if (!dict) return fallback;
    const val = key.split(".").reduce(function (o, k) { return o && o[k] !== undefined ? o[k] : null; }, dict);
    return val != null ? val : fallback;
  } catch (e) {
    return fallback;
  }
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
