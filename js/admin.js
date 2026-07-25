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
const TAB_ORDER = ["members", "projects", "events", "opportunities", "links", "memories", "memorySubmissions", "joinRequests"];
const TAB_LABELS = {
  members: "Members",
  projects: "Projects",
  events: "Events",
  opportunities: "Opportunities",
  links: "Links",
  memories: "Memories",
  memorySubmissions: "Memory submissions",
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
  } else if (key === "memorySubmissions") {
    renderMemorySubmissions(panel);
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
      if (field.placeholder) input.placeholder = field.placeholder;
    } else if (field.type === "select") {
      input = document.createElement("select");
      field.options.forEach(function (opt) {
        const o = document.createElement("option");
        o.value = opt; o.textContent = opt;
        input.appendChild(o);
      });
    } else if (field.type === "pills") {
      input = buildPillPicker(field, existing);
    } else if (field.type === "image") {
      input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
    } else if (field.type === "checkbox") {
      input = document.createElement("input");
      input.type = "checkbox";
      input.style.width = "auto";
    } else if (field.type === "datetime") {
      input = document.createElement("input");
      input.type = "datetime-local";
    } else if (field.type === "date") {
      input = document.createElement("input");
      input.type = "date";
    } else if (field.type === "time") {
      input = document.createElement("input");
      input.type = "time";
    } else {
      input = document.createElement("input");
      input.type = field.type === "number" ? "number" : "text";
      if (field.placeholder) input.placeholder = field.placeholder;
    }
    input.name = field.key;
    input.dataset.type = field.type;
    if (field.required && field.type !== "pills") input.required = true;

    if (field.type === "pills") {
      // value handling lives inside buildPillPicker via a hidden input
    } else if (existing && field.type === "checkbox") {
      input.checked = !!existing[field.key];
    } else if (existing && field.type !== "image") {
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

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn btn-ghost btn-small danger";
      removeBtn.textContent = "Remove photo";
      removeBtn.style.marginTop = "8px";
      removeBtn.style.display = "block";
      removeBtn.addEventListener("click", async function () {
        if (!confirm("Remove this photo? Save the form after to make it permanent.")) return;
        preview.remove();
        removeBtn.remove();
        formEl.dataset["clear_" + field.key] = "1";
      });
      wrap.appendChild(removeBtn);
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

function buildPillPicker(field, existing) {
  const wrap = document.createElement("div");
  wrap.className = "pill-picker";
  const hidden = document.createElement("input");
  hidden.type = "hidden";
  hidden.name = field.key;
  const current = (existing && existing[field.key]) || field.default || (field.options[0] && field.options[0].value) || "";
  hidden.value = current;

  field.options.forEach(function (opt) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pill-option" + (opt.value === current ? " active" : "");
    btn.textContent = (opt.icon ? opt.icon + " " : "") + opt.value;
    btn.addEventListener("click", function () {
      hidden.value = opt.value;
      wrap.querySelectorAll(".pill-option").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
    });
    wrap.appendChild(btn);
  });

  wrap.appendChild(hidden);
  return wrap;
}

function buildFormFieldsEditor(existing) {
  const box = document.createElement("div");
  box.className = "form-fields-editor";
  box.innerHTML = '<label>Formula (the form participants fill)</label>' +
    '<div class="ff-rows" id="ff-rows"></div>' +
    '<div class="ff-add-row">' +
      '<button type="button" class="btn btn-ghost btn-small" data-add-type="text">' + FORM_FIELD_TYPES.text.addLabel + '</button>' +
      '<button type="button" class="btn btn-ghost btn-small" data-add-type="multiple_choice">' + FORM_FIELD_TYPES.multiple_choice.addLabel + '</button>' +
      '<button type="button" class="btn btn-ghost btn-small" data-add-type="file">' + FORM_FIELD_TYPES.file.addLabel + '</button>' +
    '</div>';

  const rows = box.querySelector("#ff-rows");
  const existingFields = (existing && existing.formFields) || [];

  function addRow(field) {
    const type = field ? field.type : "text";
    const row = document.createElement("div");
    row.className = "ff-row";
    row.dataset.type = type;

    const header = document.createElement("div");
    header.className = "ff-row-header";
    header.innerHTML =
      '<input type="text" class="ff-label" placeholder="Question label" value="' +
        (field ? field.label.replace(/"/g, "&quot;") : "") + '">' +
      '<span class="ff-badge">' + FORM_FIELD_TYPES[type].badge + '</span>' +
      '<label class="ff-required"><input type="checkbox" class="ff-required-box"' + (field && field.required ? " checked" : "") + '> required</label>' +
      '<button type="button" class="btn btn-ghost btn-small ff-remove">🗑</button>';
    row.appendChild(header);
    header.querySelector(".ff-remove").addEventListener("click", function () { row.remove(); });

    if (type === "multiple_choice") {
      const optionsBox = document.createElement("div");
      optionsBox.className = "ff-options-box";
      row.appendChild(optionsBox);

      function addOption(value) {
        const optRow = document.createElement("div");
        optRow.className = "ff-option-row";
        optRow.innerHTML =
          '<input type="text" class="ff-option-input" placeholder="Option" value="' + (value ? value.replace(/"/g, "&quot;") : "") + '">' +
          '<button type="button" class="ff-option-remove">✕</button>';
        optRow.querySelector(".ff-option-remove").addEventListener("click", function () { optRow.remove(); });
        optionsBox.appendChild(optRow);
      }

      const existingOptions = (field && field.options) || [""];
      existingOptions.forEach(addOption);

      const addOptBtn = document.createElement("button");
      addOptBtn.type = "button";
      addOptBtn.className = "ff-add-option";
      addOptBtn.textContent = "+ add option";
      addOptBtn.addEventListener("click", function () { addOption(""); });
      row.appendChild(addOptBtn);
    }

    rows.appendChild(row);
  }

  existingFields.forEach(addRow);
  box.querySelectorAll("[data-add-type]").forEach(function (btn) {
    btn.addEventListener("click", function () { addRow({ type: btn.dataset.addType, label: "" }); });
  });
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
    if (!label) return;
    const type = row.dataset.type;
    const required = row.querySelector(".ff-required-box").checked;
    const field = { id: "q" + i, label: label, type: type, required: required };
    if (type === "multiple_choice") {
      field.options = Array.from(row.querySelectorAll(".ff-option-input"))
        .map(function (inp) { return inp.value.trim(); })
        .filter(Boolean);
    }
    fields.push(field);
  });
  return fields;
}

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

async function submitEntry(collectionKey, schema, formEl) {
  const data = {};
  const fileInputs = [];

  schema.fields.forEach(function (field) {
    const input = formEl.querySelector('[name="' + field.key + '"]');
    if (field.type === "image") {
      if (input.files && input.files[0]) {
        fileInputs.push({ key: field.key, file: input.files[0] });
      } else if (formEl.dataset["clear_" + field.key]) {
        data[field.key] = "";
      }
    } else if (field.type === "number") {
      data[field.key] = Number(input.value) || 0;
    } else if (field.type === "checkbox") {
      data[field.key] = input.checked;
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
      data[item.key] = await compressImageToDataURL(item.file, 900, 0.72);
    }

    if (docId) {
      await withTimeout(db.collection(collectionKey).doc(docId).update(data), "Saving");
    } else {
      await withTimeout(db.collection(collectionKey).add(data), "Saving");
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
    const snap = await withTimeout(db.collection(collectionKey).orderBy(schema.order || "order").get(), "Loading");
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
      const dot = data.status === "Scheduled" ? '<span class="status-dot dot-scheduled"></span>' :
                  data.status === "Delayed" ? '<span class="status-dot dot-delayed"></span>' :
                  data.status === "Event ended" ? '<span class="status-dot dot-ended"></span>' : '';
      row.innerHTML =
        '<div class="entry-info">' + dot + '<strong>' + escapeHtml(title) + '</strong>' +
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
        try {
          await withTimeout(db.collection(collectionKey).doc(doc.id).delete(), "Deleting");
          const panel = document.getElementById("panel-" + collectionKey);
          panel.dataset.loaded = "";
          renderCollectionPanel(collectionKey, panel);
        } catch (err) {
          alert("Couldn't delete: " + err.message);
        }
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

  let snap;
  try {
    snap = await withTimeout(db.collection("formSubmissions")
      .where("activityId", "==", activityId)
      .get(), "Loading");
  } catch (err) {
    modalBody.innerHTML = "<h2>Submissions — " + escapeHtml(activityTitle) + "</h2><p class='muted'>Couldn't load: " + escapeHtml(err.message) + "</p>";
    return;
  }

  if (snap.empty) {
    modalBody.innerHTML = "<h2>Submissions — " + escapeHtml(activityTitle) + "</h2><p class='muted'>No submissions yet.</p>";
    return;
  }

  let rows = "";
  snap.forEach(function (doc) {
    const d = doc.data();
    const answerLines = Object.keys(d.answers || {}).map(function (k) {
      const val = String(d.answers[k]);
      const display = /^https?:\/\//.test(val)
        ? '<a href="' + val + '" target="_blank" rel="noopener" style="color:var(--cyan);">View file →</a>'
        : /^data:image\//.test(val)
        ? '<a href="' + val + '" target="_blank" rel="noopener"><img src="' + val + '" style="max-width:160px; border-radius:8px; margin-top:6px; display:block;"></a>'
        : escapeHtml(val);
      return "<div><strong>" + escapeHtml(k) + ":</strong> " + display + "</div>";
    }).join("");
    rows += '<div class="submission-card">' + answerLines +
      '<div class="muted small">' + (d.submittedAt ? new Date(d.submittedAt).toLocaleString() : "") + '</div></div>';
  });

  modalBody.innerHTML = "<h2>Submissions — " + escapeHtml(activityTitle) + " (" + snap.size + ")</h2>" + rows;
}

document.getElementById("modal-close").addEventListener("click", function () {
  document.getElementById("modal").style.display = "none";
});

/* ---------- Memory submissions (review queue, admin-only) ---------- */
async function renderMemorySubmissions(panel) {
  panel.innerHTML = '<div class="panel-head"><h2>Memory submissions</h2>' +
    '<p class="muted">Approve to publish on the public Memories page, or reject to discard.</p></div>' +
    '<div id="mem-sub-list"><p class="muted">Loading…</p></div>';
  const listEl = document.getElementById("mem-sub-list");
  let snap;
  try {
    snap = await withTimeout(db.collection("memorySubmissions").orderBy("submittedAt", "desc").get(), "Loading");
  } catch (err) {
    listEl.innerHTML = "<p class='muted'>Couldn't load: " + escapeHtml(err.message) + "</p>";
    return;
  }
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
      '<div class="entry-info">' +
        (d.photoURL ? '<img src="' + d.photoURL + '" class="current-photo" style="margin-bottom:8px;">' : '') +
        '<div><strong>' + escapeHtml(d.title || "") + '</strong>' +
        (d.status === "pending" ? ' <span class="status-badge status-delayed">PENDING</span>' : '') +
        '</div><div class="muted small">' + escapeHtml(d.description || "") + '</div>' +
        '<div class="muted small">From: ' + escapeHtml(d.name || "Anonymous") + '</div>' +
      '</div><div class="entry-actions"></div>';

    const actions = row.querySelector(".entry-actions");

    const approveBtn = document.createElement("button");
    approveBtn.className = "btn btn-primary btn-small";
    approveBtn.textContent = "Approve → publish";
    approveBtn.addEventListener("click", async function () {
      try {
        await withTimeout(db.collection("memories").add({
          title: d.title, description: d.description, photoURL: d.photoURL || "",
          date: "", order: 0
        }), "Publishing");
        await withTimeout(db.collection("memorySubmissions").doc(doc.id).delete(), "Cleaning up");
        panel.dataset.loaded = "";
        renderMemorySubmissions(panel);
      } catch (err) {
        alert("Couldn't approve: " + err.message);
      }
    });
    actions.appendChild(approveBtn);

    const rejectBtn = document.createElement("button");
    rejectBtn.className = "btn btn-ghost btn-small danger";
    rejectBtn.textContent = "Reject";
    rejectBtn.addEventListener("click", async function () {
      if (!confirm("Discard this submission?")) return;
      try {
        await withTimeout(db.collection("memorySubmissions").doc(doc.id).delete(), "Deleting");
        panel.dataset.loaded = "";
        renderMemorySubmissions(panel);
      } catch (err) {
        alert("Couldn't reject: " + err.message);
      }
    });
    actions.appendChild(rejectBtn);

    listEl.appendChild(row);
  });
}

/* ---------- Join requests (admin-only view) ---------- */
async function renderJoinRequests(panel) {
  panel.innerHTML = '<div class="panel-head"><h2>Join requests</h2></div><div id="join-list"><p class="muted">Loading…</p></div>';
  const listEl = document.getElementById("join-list");
  let snap;
  try {
    snap = await withTimeout(db.collection("joinRequests").orderBy("submittedAt", "desc").get(), "Loading");
  } catch (err) {
    listEl.innerHTML = "<p class='muted'>Couldn't load: " + escapeHtml(err.message) + "</p>";
    return;
  }
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
