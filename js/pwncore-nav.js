/* PwnCore motion kit v1: include once per page, before </body>
   <script src="pwncore-nav.js"></script>
   Does three things. No setup needed beyond the class names in pwncore-motion.css. */
(function () {
  var root = document.documentElement;
  root.classList.add('pc-js');

  /* 1. Mark the current page in every <nav class="pc-nav"> */
  var here = location.pathname.split('/').pop() || 'index.php';
  document.querySelectorAll('.pc-nav a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href.indexOf('#') !== -1) return; /* section links never count as current */
    var file = href.split('#')[0].split('?')[0].split('/').pop();
    if (file === here) a.setAttribute('aria-current', 'page');
  });

  /* 2. Loading bar when an internal link is clicked */
  var bar = document.createElement('div');
  bar.className = 'pc-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    var u = new URL(a.href, location.href);
    if (u.origin !== location.origin) return;
    if (u.pathname === location.pathname && u.search === location.search) return;
    bar.classList.add('is-running');
  });
  window.addEventListener('pageshow', function () { bar.classList.remove('is-running'); });

  /* 3. Fade elements in as they scroll into view: add data-pc-reveal */
  var items = document.querySelectorAll('[data-pc-reveal]');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(function (el) { io.observe(el); });
})();
