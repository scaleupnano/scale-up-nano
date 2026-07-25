# Scale Up Nano — Website (with real admin dashboard)

A full static site for the Scale Up Nano school scientific club, backed by
Firebase so you get a real admin dashboard — persistent edits, photo
uploads, per-activity forms with private results, and a memories page —
without touching GitHub for routine updates.

## What's in this version

- **Public site**: Home, Events, Projects, Members, Opportunities,
  Links, Memories, Join — all pulling live content from Firestore.
- **`admin.html`**: a password-protected dashboard where you add/edit/delete
  everything, upload photos, set an activity's status (Upcoming / Done /
  Delayed / Cancelled), attach a custom sign-up or feedback form to any
  activity, and view that activity's submissions — visible only to you.
- **Join requests**: the Join page's form now saves to Firestore instead of
  going nowhere; you view submissions from the admin dashboard.

Nothing here needs a rebuild or redeploy to update content — only actual
code/design changes need a new GitHub commit.

---

## Part 1 — Firebase setup (do this once)

You said you already have a Firebase project from before — if it's a fresh
one, these are the exact steps either way.

### 1. Create/open your project
Go to [console.firebase.google.com](https://console.firebase.google.com) →
create a project (or open your existing one).

### 2. Register a Web App
- In your project, click the **</>** (web) icon to add a web app
- Give it any nickname (e.g. "Scale Up Nano site")
- You do **not** need Firebase Hosting — you're hosting on GitHub Pages
- After registering, Firebase shows a `firebaseConfig` object — copy it

### 3. Paste your config into the site
Open **`js/firebase-init.js`** and replace the placeholder values with the
real ones from step 2:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

### 4. Enable Firestore
- Left sidebar → **Build → Firestore Database → Create database**
- Choose **Production mode** (we're supplying our own rules below)
- Pick any region close to you

### 5. Enable Storage
- Left sidebar → **Build → Storage → Get started**
- Same production-mode choice, same region

### 6. Enable Authentication (this is what protects your admin page)
- Left sidebar → **Build → Authentication → Get started**
- Under **Sign-in method**, enable **Email/Password**
- Go to the **Users** tab → **Add user** → enter the email + password
  *you personally* will use to log into `admin.html`. This is your only
  admin account — anyone without this email/password cannot get in.

### 7. Set the security rules
- **Firestore Database → Rules tab** → replace the contents with everything
  in `firestore.rules` (included in this zip) → **Publish**
- **Storage → Rules tab** → replace the contents with everything in
  `storage.rules` (included in this zip) → **Publish**

These rules mean: anyone can *view* your site's content and photos, anyone
can *submit* a join request or activity form, but only you (signed in)
can add/edit/delete anything or read submitted forms.

### 8. Add your GitHub Pages domain to the allowed list
- **Authentication → Settings → Authorized domains → Add domain**
- Add `scaleupnano.github.io` (your Pages domain)

---

## Part 2 — Push to GitHub

Replace everything in your `scaleupnano/scale-up-nano` repo with the
contents of this zip (delete the old files first, or just overwrite —
either works since the filenames are mostly the same, plus a few new ones:
`admin.html`, `memories.html`, `firestore.rules`, `storage.rules`, and new
files under `js/`).

Make sure `.nojekyll` (from before) is still in the repo root — if you
deleted it during the overwrite, recreate that empty file.

Settings → Pages should already be correctly configured from last time
(`main` branch, root folder) — no changes needed there.

---

## Part 3 — Using the admin dashboard

1. Visit `https://scaleupnano.github.io/scale-up-nano/admin.html`
2. Sign in with the email/password you created in Part 1, step 6
3. Use the tabs across the top: **Members, Projects, Events & formulas,
   Opportunities, Links, Memories, Memory submissions, Join requests**

For each of the first six tabs: fill out the form at the top to add a new
entry (photos upload directly — just pick a file), and existing entries
list below with **Edit** and **Delete** buttons.

### Events — track, status, and the formula (form) builder
- **Track** is a fixed picker — Science / Robotics / Code / Health — click
  one to select it.
- **Status** is also a picker — Scheduled / Delayed / Event ended.
  This single field controls the sign-up form automatically:
  - **Scheduled** → the form is live and visitors can fill it in
  - **Delayed** → the form hides and a small **yellow dot** appears before
    the event's name in both admin and the public page
  - **Event ended** → the form hides and a small **red dot** appears
    before the name instead
- Below the normal fields is the **"Formula"** builder — three buttons let
  you add a **Text question**, a **Multiple choice** question (type each
  choice into its own box, click **+ add option** for more), or a
  **Photo upload** question. Each question has its own **required**
  checkbox and a 🗑 to remove it.
- Once saved, that form appears live on the public Events page under that
  event's card — but only while its status is Scheduled.
- Back in admin, click **View submissions** on that event to see every
  response, including a **"View file →"** link for any photo-upload
  answers — none of this is visible anywhere on the public site.

### Join requests
Anyone who submits the Join page's form shows up here — name, email,
which track they're interested in, and their note. Delete once handled.

---

## A few honest notes

- **This is a genuine password-gated admin page**, not a cosmetic one —
  only the email/password you created in Firebase Authentication can sign
  in and make changes.
- Firebase's free tier (Spark plan) comfortably covers a club site like
  this — you won't hit billing unless traffic gets very large.
- If you ever forget your admin password, reset it from Firebase Console →
  Authentication → Users → (your user) → Reset password, or just delete
  and re-add the user.
- Photo uploads go to Firebase Storage and are public URLs (anyone with the
  link can view the image) — normal for a public club site, just don't
  upload anything sensitive.
