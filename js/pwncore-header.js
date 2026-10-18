/* PwnCore header, one source for every page.
   Page needs:  <header class="pc-header" id="pc-header"></header>  and this script before pwncore-nav.js.
   The page must also contain the shared SVG symbol sheet (the <svg> with #w4-radar).
   Phase 1 prototype: the role comes from the "Preview as" bar (remembered in localStorage).
   Phase 2: PHP prints the header for $_SESSION['role'] and this file plus the bar are removed. */
(function () {
  var host = document.getElementById('pc-header');
  if (!host) return;
  var ROLES = { visitor: 'Visitor', user: 'User', researcher: 'Researcher', admin: 'Admin' };
  var role = 'visitor';
  try {
    var asked = new URLSearchParams(location.search).get('role');
    if (ROLES[asked]) localStorage.setItem('pcRole', asked);
    role = localStorage.getItem('pcRole') || 'visitor';
  } catch (e) {}
  if (!ROLES[role]) role = 'visitor';

  /* Admin modules are strictly locked to Admin role */
  var pagePath = location.pathname.toLowerCase();
  var isAdminModule = (pagePath.indexOf('admin-') !== -1) && (pagePath.indexOf('admin-login') === -1);
  if (isAdminModule) {
    role = 'admin';
    try { localStorage.setItem('pcRole', 'admin'); } catch (e) {}
  }

  var PUBLIC = [['Feed', 'feed.html'], ['Categories', 'index.html#surfaces'], ['Leaderboard', 'index.html#ranks'], ['About', 'index.html#pipeline']];
  var WHO = {
    user: { handle: '@newcomer', tag: 'User', items: [['Profile', '#'], ['My badges', '#'], ['Settings', '#']] },
    researcher: { handle: '@nullbyte', tag: 'Bug Hunter', items: [['My reports', '#'], ['Profile and rank', '#'], ['My badges', '#'], ['Settings', '#']] },
    admin: { handle: '@admin', tag: 'Admin', items: [['Dashboard', 'admin-dashboard.html'], ['Review queue', 'admin-queue.html'], ['Verified', 'admin-verified.html'], ['Vendors', 'admin-vendors.html'], ['Published', 'admin-publish.html'], ['Users', 'admin-users.html'], ['Settings', '#']] }
  };

  var logo = '<a class="logo" href="index.html" aria-label="PwnCore home"><svg width="168" height="27" viewBox="0 -760 5100 820" role="img" aria-label="PwnCore"><use href="#w4-radar" x="0" y="-760" width="5100" height="820"></use></svg></a>';
  var links = PUBLIC.map(function (l) { return '<a href="' + l[1] + '">' + l[0] + '</a>'; }).join('');
  var q = '';
  try { q = new URLSearchParams(location.search).get('q') || ''; } catch (e) {}
  var search = '<form class="search" action="feed.html" method="get" role="search"><input id="pc-q" type="search" name="q" placeholder="Search reports" aria-label="Search reports" autocomplete="off"><kbd>/</kbd></form>';

  var right = '';
  if (role === 'visitor') {
    right = search + '<a class="login" href="#" data-req="GET /login">Log in</a><a class="btn red sm" href="#" data-req="POST /register">Register</a>';
  } else {
    var w = WHO[role];
    var menu = w.items.map(function (i) { return '<a href="' + i[1] + '">' + i[0] + '</a>'; }).join('') + '<a href="index.html" data-logout data-req="POST /logout">Log out</a>';
    var acct = '<div class="acct"><button class="acct-btn" type="button" aria-expanded="false" aria-haspopup="true" aria-controls="acct-menu"><span class="av">' + w.handle.charAt(1).toUpperCase() + '</span><span>' + w.handle + '</span><span class="rk">' + w.tag + '</span><svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button><div class="menu" id="acct-menu" hidden>' + menu + '</div></div>';
    if (role === 'researcher') right = search + '<a class="btn red sm" href="#" data-req="GET /reports/new">Submit a report</a>' + acct;
    else right = search + acct;
  }

  host.classList.toggle('admin', role === 'admin');
  host.innerHTML = '<div class="wrap">' + logo + '<nav class="pc-nav" aria-label="Main">' + links + '</nav><div class="head-right">' + right + '</div></div>';

  var input = document.getElementById('pc-q');
  if (input && q) input.value = q;

  var btn = host.querySelector('.acct-btn'), menuEl = host.querySelector('.menu');
  function closeMenu() { if (btn) { btn.setAttribute('aria-expanded', 'false'); menuEl.hidden = true; } }
  if (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open)); menuEl.hidden = open;
    });
    document.addEventListener('click', function (e) { if (!menuEl.contains(e.target)) closeMenu(); });
    host.querySelector('[data-logout]').addEventListener('click', function () { try { localStorage.setItem('pcRole', 'visitor'); } catch (e) {} });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenu(); return; }
    if (e.key === '/' && input && !/input|textarea|select/i.test(e.target.tagName)) { e.preventDefault(); input.focus(); }
  });

  /* PROTOTYPE ONLY: lets reviewers see each role's header. Delete in Phase 2. */
  var bar = document.createElement('div');
  bar.className = 'rolebar';
  bar.innerHTML = '<span>Preview as</span>' + Object.keys(ROLES).map(function (k) {
    var extra = '';
    if (isAdminModule && k !== 'admin') {
      extra = ' title="Admin console is locked to Admin role" style="opacity: 0.45; cursor: not-allowed;"';
    }
    return '<button type="button" data-role="' + k + '" aria-pressed="' + (k === role) + '"' + extra + '>' + ROLES[k] + '</button>';
  }).join('');
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('[data-role]');
    if (!b) return;
    if (isAdminModule && b.dataset.role !== 'admin') {
      // On admin pages, non-admin buttons do not take action, keeping the user on the admin page
      return;
    }
    try { localStorage.setItem('pcRole', b.dataset.role); } catch (x) {}
    location.reload();
  });
  document.body.appendChild(bar);
})();
