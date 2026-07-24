# Scale Up Nano — Website

A full static site for the Scale Up Nano school scientific club: Home, Activities,
Projects, Members, Opportunities, Links, and Join pages, sharing one stylesheet
and one script file.

## Structure

```
scale-up-nano/
├── index.html          Home
├── activities.html      Sessions & workshops
├── projects.html        Member projects
├── members.html         Organizers & lab leads
├── opportunities.html   Internships, competitions, grants
├── links.html           Link-in-bio style page
├── join.html            Join form + Discord CTA
├── css/style.css        Shared styles
├── js/script.js         Nav toggle, admin mode, join form handler
└── assets/               Logo images
```

## Filling in real content

Every bracketed field like `[ Session title ]` or `[ Name ]` is a placeholder.
The fastest way to fill them in:

1. Open the site in a browser and add `#aymen` to the end of the URL
   (e.g. `index.html#aymen`).
2. An **ADMIN MODE** badge appears and every bracketed field becomes clickable
   — click into one and type over it.
3. This only edits the page in your current browser tab; it is **not saved**
   anywhere, because this is a static site with no backend/database. Once a
   page looks right, open its `.html` file in a text editor and replace the
   matching placeholder text with what you typed, or just retype it directly
   in the file. Then re-upload/redeploy.

If you'd rather skip the in-browser step, just search each `.html` file for
text in `[ brackets ]` and replace it directly — it's plain HTML.

## Hooking up the Join form

`join.html` has a working form with name/email/track/note fields, but nothing
receives the submissions yet (`js/script.js` just shows a confirmation
message). To actually collect responses, pick one:

- A form backend like Formspree, Getform, or Google Forms embedded instead.
- A small serverless function that posts to a Discord webhook or a database.
- A Google Sheet via a simple Apps Script web app endpoint.

## Hosting

This is a plain static site — any static host works:

- **GitHub Pages**: push this folder to a repo, enable Pages on the `main`
  branch, done.
- **Netlify / Vercel**: drag-and-drop the folder onto their dashboard, or
  connect the repo for automatic deploys.
- **Any shared host / cPanel**: upload the contents of this folder to your
  site's public/www directory.

No build step, no dependencies to install — the two Google Fonts (`Space
Grotesk`, `Inter`) load from Google's CDN, so an internet connection is
needed for those, but the rest of the site works fully offline too.
