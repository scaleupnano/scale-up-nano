/* ==========================================================================
   Scale Up Nano — shared behaviour (public pages)
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

  /* Join form — writes to Firestore's joinRequests collection.
     Results are visible only from admin.html (Join requests tab). */
  var joinForm = document.querySelector('#join-form');
  if (joinForm) {
    joinForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var status = document.querySelector('#join-status');
      var submitBtn = joinForm.querySelector('button[type="submit"]');
      var data = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        track: document.querySelector('#track').value,
        note: document.querySelector('#note').value,
        submittedAt: Date.now()
      };
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting…';
      try {
        await db.collection('joinRequests').add(data);
        joinForm.reset();
        status.textContent = "Thanks, " + data.name.split(' ')[0] + " — we've got your submission and will follow up.";
        status.style.color = 'var(--cyan)';
      } catch (err) {
        status.textContent = "Couldn't submit: " + err.message;
      }
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    });
  }
});
