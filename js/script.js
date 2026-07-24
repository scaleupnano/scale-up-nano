/* ==========================================================================
   Scale Up Nano — shared behaviour
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* Highlight the current page in the nav */
  var here = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var target = a.getAttribute('href');
    if (target === here || (here === '' && target === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* -----------------------------------------------------------------------
     Admin mode
     Append #aymen to any page's URL to unlock inline editing on the
     placeholder "slot" fields (activities, projects, members, links, etc).
     This is a front-end-only convenience for filling in real content
     before you publish — it does not authenticate anything on a server,
     since this is a static site with no backend. Edits are not saved
     automatically; copy the finished text back into the relevant .html
     file so it persists after you refresh or re-deploy.
     ----------------------------------------------------------------------- */
  function applyAdminState() {
    var isAdmin = window.location.hash.replace('#', '').toLowerCase() === 'aymen';
    document.body.classList.toggle('admin-on', isAdmin);
    document.querySelectorAll('[data-editable]').forEach(function (el) {
      el.setAttribute('contenteditable', isAdmin ? 'true' : 'false');
    });
  }
  window.addEventListener('hashchange', applyAdminState);
  applyAdminState();

  /* Simple join-form handler (no backend wired up — shows a confirmation
     state so the page feels complete; wire this to your form service or
     Discord webhook of choice when you're ready). */
  var joinForm = document.querySelector('#join-form');
  if (joinForm) {
    joinForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.querySelector('#join-status');
      if (status) {
        status.textContent = 'Thanks — this form isn\'t connected to anything yet. Wire it up to your email, a form service, or your Discord webhook to start receiving submissions.';
        status.style.color = 'var(--cyan)';
      }
    });
  }
});
