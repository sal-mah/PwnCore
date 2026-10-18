/* PwnCore security pages: shared sample data and helpers (Person 4).
   Phase 1 prototype. Everything below is SAMPLE data. There is no backend.
   Prototype state (reviewed events, revoked keys, new audit entries) is kept in this browser only
   (localStorage key "pcSecDemo") so the demo works across pages. It is not access control.
   Phase 2 replaces all of this with PHP and MySQL, and the server enforces roles (SEC-08). */
(function () {
  var P = window.PCSEC = {};
  var NOW = Date.UTC(2026, 9, 16, 10, 0, 0);   /* sample clock: 2026-10-16 10:00:00 UTC */
  var ADMIN_IP = '198.51.100.4';
  P.NOW = NOW;

  function p2(n) { return (n < 10 ? '0' : '') + n; }
  function p4(n) { return ('0000' + n).slice(-4); }
  function T(s) { var m = /^(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)$/.exec(s); return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]); }
  P.fmt = function (ms) { var d = new Date(ms); return d.getUTCFullYear() + '-' + p2(d.getUTCMonth() + 1) + '-' + p2(d.getUTCDate()) + ' ' + p2(d.getUTCHours()) + ':' + p2(d.getUTCMinutes()) + ':' + p2(d.getUTCSeconds()) + 'Z'; };
  P.day = function (ms) { return P.fmt(ms).slice(0, 10); };
  P.clock = function (ms) { return P.fmt(ms).slice(11, 19); };

  /* ---------- sample data ---------- */
  var AUD = [
    ['2026-10-16 09:41:07', '@admin', 'Admin', 'AUDIT_VIEW', 'audit-log', 'SUCCESS', ADMIN_IP, ''],
    ['2026-10-16 09:38:52', '@admin', 'Admin', 'REPORT_PUBLISH', 'PWN-2026-0142', 'SUCCESS', ADMIN_IP, ''],
    ['2026-10-16 09:30:15', '@admin', 'Admin', 'VENDOR_NOTIFY', 'PWN-2026-0151', 'SUCCESS', ADMIN_IP, ''],
    ['2026-10-16 08:57:44', '@dexdump', 'Researcher', 'ACCESS_DENIED', 'PWN-2026-0155', 'FAILURE', '203.0.113.27', 'EVT-0030'],
    ['2026-10-16 08:57:31', '@dexdump', 'Researcher', 'ACCESS_DENIED', 'PWN-2026-0154', 'FAILURE', '203.0.113.27', 'EVT-0030'],
    ['2026-10-16 08:31:09', '@tagsoup', 'Researcher', 'REPORT_SUBMIT', 'PWN-2026-0158', 'SUCCESS', '203.0.113.88', ''],
    ['2026-10-16 07:12:40', 'anonymous', 'Visitor', 'LOGIN_LOCKOUT', '@nullbyte', 'FAILURE', '192.0.2.51', 'EVT-0031'],
    ['2026-10-16 07:12:38', 'anonymous', 'Visitor', 'LOGIN_FAILURE', '@nullbyte', 'FAILURE', '192.0.2.51', 'EVT-0031'],
    ['2026-10-16 07:12:36', 'anonymous', 'Visitor', 'LOGIN_FAILURE', '@nullbyte', 'FAILURE', '192.0.2.51', 'EVT-0031'],
    ['2026-10-16 07:12:34', 'anonymous', 'Visitor', 'LOGIN_FAILURE', '@nullbyte', 'FAILURE', '192.0.2.51', 'EVT-0031'],
    ['2026-10-16 07:12:32', 'anonymous', 'Visitor', 'LOGIN_FAILURE', '@nullbyte', 'FAILURE', '192.0.2.51', 'EVT-0031'],
    ['2026-10-16 07:12:30', 'anonymous', 'Visitor', 'LOGIN_FAILURE', '@nullbyte', 'FAILURE', '192.0.2.51', 'EVT-0031'],
    ['2026-10-16 06:02:11', '@admin', 'Admin', 'API_KEY_REVOKE', 'KEY-0009', 'SUCCESS', ADMIN_IP, 'EVT-0025'],
    ['2026-10-15 16:20:03', '@admin', 'Admin', 'ROLE_CHANGE', '@newcomer', 'SUCCESS', ADMIN_IP, ''],
    ['2026-10-15 14:05:51', '@packetfox', 'Researcher', 'API_KEY_CREATE', 'KEY-0011', 'SUCCESS', '203.0.113.9', ''],
    ['2026-10-15 13:40:22', '@packetfox', 'Researcher', 'API_KEY_REVOKE', 'KEY-0006', 'SUCCESS', '203.0.113.9', 'EVT-0027'],
    ['2026-10-15 11:47:26', '@zerod4y', 'Researcher', 'RATE_LIMIT', 'POST /reports', 'FAILURE', '203.0.113.140', 'EVT-0029'],
    ['2026-10-15 11:47:22', '@zerod4y', 'Researcher', 'RATE_LIMIT', 'POST /reports', 'FAILURE', '203.0.113.140', 'EVT-0029'],
    ['2026-10-15 11:47:18', '@zerod4y', 'Researcher', 'RATE_LIMIT', 'POST /reports', 'FAILURE', '203.0.113.140', 'EVT-0029'],
    ['2026-10-15 11:47:14', '@zerod4y', 'Researcher', 'RATE_LIMIT', 'POST /reports', 'FAILURE', '203.0.113.140', 'EVT-0029'],
    ['2026-10-15 10:21:09', 'anonymous', 'Visitor', 'INPUT_REJECTED', 'GET /feed?q', 'FAILURE', '198.51.100.77', 'EVT-0028'],
    ['2026-10-15 10:21:04', 'anonymous', 'Visitor', 'INPUT_REJECTED', 'GET /feed?q', 'FAILURE', '198.51.100.77', 'EVT-0028'],
    ['2026-10-15 10:20:58', 'anonymous', 'Visitor', 'INPUT_REJECTED', 'GET /feed?q', 'FAILURE', '198.51.100.77', 'EVT-0028'],
    ['2026-10-15 09:18:30', '@tagsoup', 'Researcher', 'LOGIN_SUCCESS', '@tagsoup', 'SUCCESS', '203.0.113.88', ''],
    ['2026-10-14 17:02:44', '@admin', 'Admin', 'REPORT_STATUS', 'PWN-2026-0151', 'SUCCESS', ADMIN_IP, ''],
    ['2026-10-14 08:45:10', '@nullbyte', 'Researcher', 'LOGIN_SUCCESS', '@nullbyte', 'SUCCESS', '198.51.100.51', ''],
    ['2026-10-13 22:41:07', 'anonymous', 'Visitor', 'LOGIN_LOCKOUT', '@tagsoup', 'FAILURE', '192.0.2.99', 'EVT-0026'],
    ['2026-10-13 22:41:05', 'anonymous', 'Visitor', 'LOGIN_FAILURE', '@tagsoup', 'FAILURE', '192.0.2.99', 'EVT-0026'],
    ['2026-10-13 22:41:03', 'anonymous', 'Visitor', 'LOGIN_FAILURE', '@tagsoup', 'FAILURE', '192.0.2.99', 'EVT-0026'],
    ['2026-10-13 22:41:01', 'anonymous', 'Visitor', 'LOGIN_FAILURE', '@tagsoup', 'FAILURE', '192.0.2.99', 'EVT-0026'],
    ['2026-10-13 22:40:59', 'anonymous', 'Visitor', 'LOGIN_FAILURE', '@tagsoup', 'FAILURE', '192.0.2.99', 'EVT-0026'],
    ['2026-10-13 22:40:57', 'anonymous', 'Visitor', 'LOGIN_FAILURE', '@tagsoup', 'FAILURE', '192.0.2.99', 'EVT-0026'],
    ['2026-10-09 12:11:00', '@admin', 'Admin', 'ROLE_CHANGE', '@shellfish', 'SUCCESS', ADMIN_IP, ''],
    ['2026-10-02 15:30:12', '@tagsoup', 'Researcher', 'API_KEY_CREATE', 'KEY-0010', 'SUCCESS', '203.0.113.88', ''],
    ['2026-09-20 11:09:45', '@nullbyte', 'Researcher', 'API_KEY_CREATE', 'KEY-0009', 'SUCCESS', '198.51.100.51', ''],
    ['2026-09-17 09:00:31', '@admin', 'Admin', 'REPORT_PUBLISH', 'PWN-2026-0127', 'SUCCESS', ADMIN_IP, '']
  ];
  var baseAudit = AUD.map(function (r) { return { t: T(r[0]), user: r[1], role: r[2], action: r[3], target: r[4], outcome: r[5], ip: r[6], ev: r[7] }; })
    .sort(function (a, b) { return a.t - b.t; });
  baseAudit.forEach(function (e, i) { e.id = 'AUD-' + p4(100 + i); });

  var baseEvents = [
    { id: 'EVT-0031', type: 'lockout', level: 'high', title: 'Login blocked after 5 failed attempts on @nullbyte', who: 'anonymous', ip: '192.0.2.51', status: 'open', t: T('2026-10-16 07:12:40') },
    { id: 'EVT-0030', type: 'access_denied', level: 'medium', title: 'Repeated access denied on Reports owned by others', who: '@dexdump', ip: '203.0.113.27', status: 'open', t: T('2026-10-16 08:57:44') },
    { id: 'EVT-0029', type: 'rate_limit', level: 'low', title: 'Rate limit exceeded on Report submission', who: '@zerod4y', ip: '203.0.113.140', status: 'open', t: T('2026-10-15 11:47:26') },
    { id: 'EVT-0028', type: 'invalid_input', level: 'medium', title: 'Invalid input rejected in the Feed search parameter', who: 'anonymous', ip: '198.51.100.77', status: 'reviewed', t: T('2026-10-15 10:21:09') },
    { id: 'EVT-0027', type: 'api_key', level: 'low', title: 'API key KEY-0006 revoked by its owner', who: '@packetfox', ip: '203.0.113.9', status: 'reviewed', t: T('2026-10-15 13:40:22') },
    { id: 'EVT-0026', type: 'lockout', level: 'high', title: 'Login blocked after 5 failed attempts on @tagsoup', who: 'anonymous', ip: '192.0.2.99', status: 'open', t: T('2026-10-13 22:41:07') },
    { id: 'EVT-0025', type: 'api_key', level: 'low', title: 'API key KEY-0009 revoked by an Admin', who: '@admin', ip: ADMIN_IP, status: 'open', t: T('2026-10-16 06:02:11') }
  ];

  var baseKeys = [
    { id: 'KEY-0011', ident: 'pwc_********4f2a', owner: '@packetfox', role: 'Researcher', name: 'Recon script', perms: ['feed:read', 'reports:read'], created: '2026-10-15', expires: '2027-01-13', status: 'active' },
    { id: 'KEY-0010', ident: 'pwc_********b7c1', owner: '@tagsoup', role: 'Researcher', name: 'Report uploader', perms: ['reports:read', 'reports:write'], created: '2026-10-02', expires: '2027-01-01', status: 'active' },
    { id: 'KEY-0009', ident: 'pwc_********91de', owner: '@nullbyte', role: 'Researcher', name: 'Nightly sync', perms: ['reports:read', 'reports:write'], created: '2026-09-20', expires: '2026-12-19', status: 'revoked', revokedAt: '2026-10-16 06:02:11Z', revokedBy: '@admin (Admin)' },
    { id: 'KEY-0008', ident: 'pwc_********3a08', owner: '@dexdump', role: 'Researcher', name: 'Mobile test rig', perms: ['reports:read'], created: '2026-09-11', expires: '2026-12-10', status: 'active' },
    { id: 'KEY-0007', ident: 'pwc_********c55f', owner: '@zerod4y', role: 'Researcher', name: 'Feed monitor', perms: ['feed:read'], created: '2026-08-30', expires: '2026-10-01', status: 'active' },
    { id: 'KEY-0006', ident: 'pwc_********e2b4', owner: '@packetfox', role: 'Researcher', name: 'Old scanner', perms: ['reports:read'], created: '2026-08-14', expires: '2026-11-12', status: 'revoked', revokedAt: '2026-10-15 13:40:22Z', revokedBy: '@packetfox (owner)' },
    { id: 'KEY-0005', ident: 'pwc_********7d90', owner: '@shellfish', role: 'Researcher', name: 'Fuzzing harness', perms: ['reports:read', 'reports:write'], created: '2026-08-02', expires: '2026-10-31', status: 'active' },
    { id: 'KEY-0004', ident: 'pwc_********08fa', owner: '@bitrot', role: 'Researcher', name: 'Driver notes', perms: ['reports:read'], created: '2026-07-21', expires: '2026-09-19', status: 'active' },
    { id: 'KEY-0003', ident: 'pwc_********a6d3', owner: '@redpill', role: 'Researcher', name: 'Feed widget', perms: ['feed:read'], created: '2026-06-12', expires: '2026-12-09', status: 'active' },
    { id: 'KEY-0002', ident: 'pwc_********19e7', owner: '@admin', role: 'Admin', name: 'Review export', perms: ['reports:read', 'reports:review'], created: '2026-09-05', expires: '2027-03-04', status: 'active' }
  ];

  /* ---------- prototype state (browser only) ---------- */
  var KEY = 'pcSecDemo', S = { reviewed: {}, revoked: {}, audit: [], events: [] };
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var o = JSON.parse(raw);
      if (o && typeof o === 'object') {
        S.reviewed = o.reviewed && typeof o.reviewed === 'object' ? o.reviewed : {};
        S.revoked = o.revoked && typeof o.revoked === 'object' ? o.revoked : {};
        S.audit = Array.isArray(o.audit) ? o.audit : [];
        S.events = Array.isArray(o.events) ? o.events : [];
      }
    }
  } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  P.reset = function () { S = { reviewed: {}, revoked: {}, audit: [], events: [] }; try { localStorage.removeItem(KEY); } catch (e) {} };

  function newest(a, b) { return b.t - a.t || (a.id < b.id ? 1 : -1); }
  P.audit = function () { return baseAudit.concat(S.audit).sort(newest); };
  P.events = function () {
    return baseEvents.concat(S.events).map(function (e) { var c = Object.assign({}, e); if (S.reviewed[e.id]) c.status = 'reviewed'; return c; }).sort(newest);
  };
  P.related = function (evId) { return P.audit().filter(function (a) { return a.ev === evId; }).reverse(); };
  P.markReviewed = function (id) { S.reviewed[id] = true; save(); };
  P.keys = function () {
    var today = P.day(NOW);
    return baseKeys.map(function (b) {
      var k = Object.assign({}, b), r = S.revoked[b.id];
      if (r) { k.status = 'revoked'; k.revokedAt = r.at; k.revokedBy = r.by; }
      else if (b.status === 'active' && b.expires < today) k.status = 'expired';
      return k;
    });
  };
  /* Revoke: allowed for an Admin by SEC-15. Adds an API_KEY_REVOKE audit entry and a security event (NFR-AUD-01, NFR-AUD-08). */
  P.revokeKey = function (id) {
    var k = P.keys().filter(function (x) { return x.id === id; })[0];
    if (!k || k.status !== 'active') return '';
    var evId = 'EVT-' + p4(32 + S.events.length), n = S.audit.length;
    var e = { id: 'AUD-' + p4(100 + baseAudit.length + n), t: NOW + (n + 1) * 60000, user: '@admin', role: 'Admin', action: 'API_KEY_REVOKE', target: id, outcome: 'SUCCESS', ip: ADMIN_IP, ev: evId };
    S.audit.push(e);
    S.events.push({ id: evId, type: 'api_key', level: 'low', title: 'API key ' + id + ' revoked by an Admin', who: '@admin', ip: ADMIN_IP, status: 'open', t: e.t });
    S.revoked[id] = { at: P.fmt(e.t), by: '@admin (Admin)' };
    save();
    return evId;
  };

  /* ---------- helpers ---------- */
  P.TYPES = { lockout: 'Lockout', access_denied: 'Access denied', rate_limit: 'Rate limit', invalid_input: 'Invalid input', api_key: 'API key' };
  P.h = function (tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  P.levelBar = function (level) {
    var k = { high: 3, medium: 2, low: 1 }[level] || 1, b = P.h('span', 'sq');
    b.appendChild(P.h('span', 'on', '\u25A0'.repeat(k)));
    b.appendChild(P.h('span', 'off', '\u25A0'.repeat(4 - k)));
    return b;
  };
  P.clear = function (n) { while (n.firstChild) n.removeChild(n.firstChild); return n; };
  P.fillChips = function (nav, items) {
    P.clear(nav);
    items.forEach(function (it) {
      var a = P.h('a', 'chip'); a.href = it.href;
      if (it.current) a.setAttribute('aria-current', 'true');
      a.appendChild(P.h('span', '', it.label));
      if (it.count != null) a.appendChild(P.h('i', 'mono', String(it.count)));
      nav.appendChild(a);
    });
  };
  /* Reads the address like the Feed does. Unknown values fall back to the default (SEC-16, allow-list). */
  P.query = function (schema) {
    var page = location.pathname.split('/').pop() || 'index.html', sp, st = {}, keys = Object.keys(schema);
    try { sp = new URLSearchParams(location.search); } catch (e) { sp = new URLSearchParams(''); }
    function def(d) { return (d.text || d.pattern) ? '' : d.def; }
    keys.forEach(function (k) {
      var d = schema[k], v = sp.get(k);
      if (d.text) v = (v || '').trim().slice(0, 80);
      else if (d.pattern) v = v && d.pattern.test(v) ? v : '';
      else v = d.allowed.indexOf(v) > -1 ? v : d.def;
      st[k] = v;
    });
    function href(change) {
      var s = Object.assign({}, st, change || {}), u = new URLSearchParams();
      keys.forEach(function (k) { if (s[k] !== def(schema[k])) u.set(k, s[k]); });
      var qs = u.toString(); return page + (qs ? '?' + qs : '');
    }
    function carry(except) {
      var o = {}; keys.forEach(function (k) { if (k !== except && st[k] !== def(schema[k])) o[k] = st[k]; }); return o;
    }
    return { st: st, page: page, href: href, carry: carry };
  };
  P.searchForm = function (form, input, Q, key) {
    form.action = Q.page; input.value = Q.st[key];
    var c = Q.carry(key);
    Object.keys(c).forEach(function (k) { var i = P.h('input'); i.type = 'hidden'; i.name = k; i.value = c[k]; form.appendChild(i); });
  };
  P.role = function () {
    try { var r = localStorage.getItem('pcRole'); if (r === 'visitor' || r === 'user' || r === 'researcher' || r === 'admin') return r; } catch (e) {}
    return 'visitor';
  };

  /* Placeholder buttons, back links, role-based buttons and the reset link. */
  var role = P.role();
  [].forEach.call(document.querySelectorAll('[data-for]'), function (el) {
    if (el.getAttribute('data-for').split(' ').indexOf(role) < 0) el.style.display = 'none';
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : e.target.parentNode, a;
    if ((a = t.closest('[data-placeholder]'))) {
      e.preventDefault();
      var n = document.getElementById('ph-note'); if (n) n.textContent = a.getAttribute('data-placeholder');
      return;
    }
    if ((a = t.closest('[data-back]')) && history.length > 1) { e.preventDefault(); history.back(); return; }
    if ((a = t.closest('[data-reset]'))) { e.preventDefault(); P.reset(); location.reload(); }
  });
})();
