/* ==========================================================================
   Scale Up Nano — admin dashboard logic

   Handles: login gate (Firebase Auth), generic CRUD for every collection
   in COLLECTIONS, image upload to Firebase Storage, per-activity custom
   form-field builder, viewing form submissions, and viewing join requests.
   ========================================================================== */

const els = {
  loginScreen: document.getElementById("login-screen"),
  dashboard: document.getElementById("dashboard"),
  loginForm: document.getElementById("login-form"),
  loginError: document.getElementById("login-error"),
  logoutBtn: document.getElementById("logout-btn"),
  tabs: document.getElementById("tabs"),
  panels: document.getElementById("panels")
};

/* ---------- Auth gate ---------- */
auth.onAuthStateChanged(function (user) {
  if (user) {
    els.loginScreen.style.display = "none";
    els.dashboard.style.display = "block";
    buildTabs();
  } else {
    els.loginScreen.style.display = "flex";
    els.dashboard.style.display = "none";
  }
});

els.loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  els.loginError.textContent = "";
  auth.signInWithEmailAndPassword(email, password).catch(function (err) {
    els.loginError.textContent = err.message;
  });
});

els.logoutBtn.addEventListener("click", function () {
  auth.signOut();
});

/* ---------- Tab scaffolding ---------- */
const TAB_ORDER = ["members", "projects", "activities", "opportunities", "links", "memories", "joinRequests"];
const TAB_LABELS = {
  members: "Members",
  projects: "Projects",
  activities: "Activities",
  opportunities: "Opportunities",
  links: "Links",
  memories: "Memories",
  joinRequests: "Join requests"
};

function buildTabs() {
  els.tabs.innerHTML = "";
  els.panels.innerHTML = "";
  TAB_ORDER.forEach(function (key, i) {
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (i === 0 ? " active" : "");
    btn.textContent = TAB_LABELS[key];
    btn.addEventListener("click", function () { switchTab(key); });
    els.tabs.appendChild(btn);

    const panel = document.createElement("div");
    panel.className = "tab-panel";
    panel.id = "panel-" + key;
    panel.style.display = i === 0 ? "block" : "none";
    els.panels.appendChild(panel);
  });
  switchTab(TAB_ORDER[0]);
}

function switchTab(key) {
  document.querySelectorAll(".tab-btn").forEach(function (b) {
    b.classList.toggle("active", b.textContent === TAB_LABELS[key]);
  });
  document.querySelectorAll(".tab-panel").forEach(function (p) {
    p.style.display = p.id === "panel-" + key ? "block" : "none";
  });
  const panel = document.getElementById("panel-" + key);
  if (panel.dataset.loaded) return;
  panel.dataset.loaded = "1";

  if (key === "joinRequests") {
    renderJoinRequests(panel);
  } else {
    renderCollectionPanel(key, panel);
  }
}

/* ---------- Generic collection CRUD ---------- */
function renderCollectionPanel(collectionKey, panel) {
  const schema = COLLECTIONS[collectionKey];

  panel.innerHTML =
    '<div class="panel-head"><h2>' + schema.label + '</h2></div>' +
    '<form class="entry-form" id="form-' + collectionKey + '"></form>' +
    '<div class="entry-list" id="list-' + collectionKey + '"></div>';

  buildEntryForm(collectionKey, schema, document.getElementById("form-" + collectionKey));
  loadEntries(collectionKey, schema);
}

function buildEntryForm(collectionKey, schema, formEl, existing, docId) {
  formEl.innerHTML = "";
  formEl.dataset.editingId = docId || "";

  schema.fields.forEach(function (field) {
    const wrap = document.createElement("div");
    wrap.className = "field-row";

    const label = document.createElement("label");
    label.textContent = field.label;
    wrap.appendChild(label);

    let input;
    if (field.type === "textarea") {
      input = document.createElement("textarea");
      input.rows = 3;
    } else if (field.type === "select") {
      input = document.createElement("select");
      field.options.forEach(function (opt) {
        const o = document.createElement("option");
        o.value = opt; o.textContent = opt;
        input.appendChild(o);
      });
    } else if (field.type === "image") {
      input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
    } else {
      input = document.createElement("input");
      input.type = field.type === "number" ? "number" : "text";
    }
    input.name = field.key;
    input.dataset.type = field.type;
    if (field.required) input.required = true;

    if (existing && field.type !== "image") {
      input.value = existing[field.key] != null ? existing[field.key] : (field.default || "");
    } else if (!existing && field.type !== "image" && field.default !== undefined) {
      input.value = field.default;
    }

    wrap.appendChild(input);

    if (field.type === "image" && existing && existing[field.key]) {
      const preview = document.createElement("img");
      preview.src = existing[field.key];
      preview.className = "current-photo";
      wrap.appendChild(preview);
    }

    formEl.appendChild(wrap);
  });

  /* Activities get an extra "custom form fields" builder */
  if (schema.hasForm) {
    formEl.appendChild(buildFormFieldsEditor(existing));
  }

  const actions = document.createElement("div");
  actions.className = "form-actions";
  const saveBtn = document.createElement("button");
  saveBtn.type = "submit";
  saveBtn.className = "btn btn-primary";
  saveBtn.textContent = docId ? "Save changes" : "Add";
  actions.appendChild(saveBtn);
  if (docId) {
    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "btn btn-ghost";
    cancelBtn.textContent = "Cancel edit";
    cancelBtn.addEventListener("click", function () {
      buildEntryForm(collectionKey, schema, formEl);
    });
    actions.appendChild(cancelBtn);
  }
  formEl.appendChild(actions);

  formEl.onsubmit = function (e) {
    e.preventDefault();
    submitEntry(collectionKey, schema, formEl);
  };
}

function buildFormFieldsEditor(existing) {
  const box = document.createElement("div");
  box.className = "form-fields-editor";
  box.innerHTML = '<label>Sign-up / feedback form for this activity (optional)</label>' +
    '<div class="ff-rows" id="ff-rows"></div>' +
    '<button type="button" class="btn btn-ghost btn-small" id="ff-add">+ Add question</button>';

  const rows = box.querySelector("#ff-rows");
  const existingFields = (existing && existing.formFields) || [];

  function addRow(field) {
    const row = document.createElement("div");
    row.className = "ff-row";
    row.innerHTML =
      '<input type="text" class="ff-label" placeholder="Question label" value="' +
        (field ? field.label.replace(/"/g, "&quot;") : "") + '">' +
      '<select class="ff-type">' +
        FORM_FIELD_TYPES.map(function (t) {
          return '<option value="' + t + '"' + (field && field.type === t ? " selected" : "") + '>' + t + '</option>';
        }).join("") +
      '</select>' +
      '<button type="button" class="btn btn-ghost btn-small ff-remove">Remove</button>';
    row.querySelector(".ff-remove").addEventListener("click", function () { row.remove(); });
    rows.appendChild(row);
  }

  existingFields.forEach(addRow);
  box.querySelector("#ff-add").addEventListener("click", function () { addRow(); });
  box.dataset.role = "formFieldsEditor";
  return box;
}

function readFormFieldsEditor(formEl) {
  const box = formEl.querySelector('[data-role="formFieldsEditor"]');
  if (!box) return null;
  const rows = box.querySelectorAll(".ff-row");
  const fields = [];
  rows.forEach(function (row, i) {
    const label = row.querySelector(".ff-label").value.trim();
    const type = row.querySelector(".ff-type").value;
    if (label) fields.push({ id: "q" + i, label: label, type: type });
  });
  return fields;
}

async function submitEntry(collectionKey, schema, formEl) {
  const data = {};
  const fileInputs = [];

  schema.fields.forEach(function (field) {
    const input = formEl.querySelector('[name="' + field.key + '"]');
    if (field.type === "image") {
      if (input.files && input.files[0]) fileInputs.push({ key: field.key, file: input.files[0] });
    } else if (field.type === "number") {
      data[field.key] = Number(input.value) || 0;
    } else {
      data[field.key] = input.value;
    }
  });

  if (schema.hasForm) {
    data.formFields = readFormFieldsEditor(formEl);
  }

  const docId = formEl.dataset.editingId;
  const saveBtn = formEl.querySelector('button[type="submit"]');
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving…";

  try {
    for (const item of fileInputs) {
      const path = collectionKey + "/" + Date.now() + "_" + item.file.name;
      const ref = storage.ref(path);
      await ref.put(item.file);
      data[item.key] = await ref.getDownloadURL();
    }

    if (docId) {
      await db.collection(collectionKey).doc(docId).update(data);
    } else {
      await db.collection(collectionKey).add(data);
    }

    const panel = document.getElementById("panel-" + collectionKey);
    panel.dataset.loaded = "";
    renderCollectionPanel(collectionKey, panel);
  } catch (err) {
    alert("Couldn't save: " + err.message);
    saveBtn.disabled = false;
    saveBtn.textContent = docId ? "Save changes" : "Add";
  }
}

async function loadEntries(collectionKey, schema) {
  const listEl = document.getElementById("list-" + collectionKey);
  listEl.innerHTML = "<p class='muted'>Loading…</p>";
  try {
    const snap = await db.collection(collectionKey).orderBy(schema.order || "order").get();
    if (snap.empty) {
      listEl.innerHTML = "<p class='muted'>Nothing added yet.</p>";
      return;
    }
    listEl.innerHTML = "";
    snap.forEach(function (doc) {
      const data = doc.data();
      const row = document.createElement("div");
      row.className = "entry-row";

      const title = data.title || data.name || data.label || "(untitled)";
      row.innerHTML =
        '<div class="entry-info"><strong>' + escapeHtml(title) + '</strong>' +
        (data.status ? ' <span class="status-badge status-' + slug(data.status) + '">' + escapeHtml(data.status) + '</span>' : '') +
        '</div><div class="entry-actions"></div>';

      const actions = row.querySelector(".entry-actions");

      if (schema.hasForm) {
        const resultsBtn = document.createElement("button");
        resultsBtn.className = "btn btn-ghost btn-small";
        resultsBtn.textContent = "View submissions";
        resultsBtn.addEventListener("click", function () { showSubmissions(doc.id, title); });
        actions.appendChild(resultsBtn);
      }

      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-ghost btn-small";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", function () {
        const formEl = document.getElementById("form-" + collectionKey);
        buildEntryForm(collectionKey, schema, formEl, data, doc.id);
        formEl.scrollIntoView({ behavior: "smooth" });
      });
      actions.appendChild(editBtn);

      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-ghost btn-small danger";
      delBtn.textContent = "Delete";
      delBtn.addEventListener("click", async function () {
        if (!confirm("Delete \"" + title + "\"? This can't be undone.")) return;
        await db.collection(collectionKey).doc(doc.id).delete();
        const panel = document.getElementById("panel-" + collectionKey);
        panel.dataset.loaded = "";
        renderCollectionPanel(collectionKey, panel);
      });
      actions.appendChild(delBtn);

      listEl.appendChild(row);
    });
  } catch (err) {
    listEl.innerHTML = "<p class='muted'>Couldn't load: " + escapeHtml(err.message) + "</p>";
  }
}

/* ---------- Form submissions (per activity, admin-only view) ---------- */
async function showSubmissions(activityId, activityTitle) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  modal.style.display = "flex";
  modalBody.innerHTML = "<h2>Submissions — " + escapeHtml(activityTitle) + "</h2><p class='muted'>Loading…</p>";

  const snap = await db.collection("formSubmissions")
    .where("activityId", "==", activityId)
    .get();

  if (snap.empty) {
    modalBody.innerHTML = "<h2>Submissions — " + escapeHtml(activityTitle) + "</h2><p class='muted'>No submissions yet.</p>";
    return;
  }

  let rows = "";
  snap.forEach(function (doc) {
    const d = doc.data();
    const answerLines = Object.keys(d.answers || {}).map(function (k) {
      return "<div><strong>" + escapeHtml(k) + ":</strong> " + escapeHtml(String(d.answers[k])) + "</div>";
    }).join("");
    rows += '<div class="submission-card">' + answerLines +
      '<div class="muted small">' + (d.submittedAt ? new Date(d.submittedAt).toLocaleString() : "") + '</div></div>';
  });

  modalBody.innerHTML = "<h2>Submissions — " + escapeHtml(activityTitle) + " (" + snap.size + ")</h2>" + rows;
}

document.getElementById("modal-close").addEventListener("click", function () {
  document.getElementById("modal").style.display = "none";
});

/* ---------- Join requests (admin-only view) ---------- */
async function renderJoinRequests(panel) {
  panel.innerHTML = '<div class="panel-head"><h2>Join requests</h2></div><div id="join-list"><p class="muted">Loading…</p></div>';
  const listEl = document.getElementById("join-list");
  const snap = await db.collection("joinRequests").orderBy("submittedAt", "desc").get();
  if (snap.empty) {
    listEl.innerHTML = "<p class='muted'>No submissions yet.</p>";
    return;
  }
  listEl.innerHTML = "";
  snap.forEach(function (doc) {
    const d = doc.data();
    const row = document.createElement("div");
    row.className = "entry-row";
    row.innerHTML =
      '<div class="entry-info"><strong>' + escapeHtml(d.name || "") + '</strong> — ' + escapeHtml(d.email || "") +
      '<div class="muted small">' + escapeHtml(d.track || "") + (d.note ? " · " + escapeHtml(d.note) : "") + '</div></div>' +
      '<div class="entry-actions"></div>';
    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-ghost btn-small danger";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", async function () {
      await db.collection("joinRequests").doc(doc.id).delete();
      panel.dataset.loaded = "";
      renderJoinRequests(panel);
    });
    row.querySelector(".entry-actions").appendChild(delBtn);
    listEl.appendChild(row);
  });
}

/* ---------- Small helpers ---------- */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (m) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
  });
}
function slug(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
