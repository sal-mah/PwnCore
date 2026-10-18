/* Audit log page (Phase 1 prototype). Read only: nothing on this page edits or deletes an entry (NFR-AUD-04).
   Filters live in the address, like the Feed: audit-log.html?period=7d&outcome=failure&action=login&find=text&ref=EVT-0031 */
(function () {
  var P = window.PCSEC; if (!P) return;
  var ACTIONS = [['all', 'All'], ['login', 'Login'], ['access_denied', 'Access denied'], ['role_change', 'Role change'], ['report', 'Report'], ['api_key', 'API key'], ['rate_limit', 'Rate limit'], ['other', 'Other']];
  var PERIODS = [['24h', '24 hours'], ['7d', '7 days'], ['30d', '30 days']];
  var OUTCOMES = [['all', 'All'], ['success', 'Success'], ['failure', 'Failure']];
  var Q = P.query({
    period: { allowed: ['24h', '7d', '30d'], def: '7d' },
    outcome: { allowed: ['all', 'success', 'failure'], def: 'all' },
    action: { allowed: ACTIONS.map(function (a) { return a[0]; }), def: 'all' },
    find: { text: true },
    ref: { pattern: /^EVT-\d{4}$/ }
  });
  var st = Q.st, all = P.audit();
  var GROUP = { LOGIN_SUCCESS: 'login', LOGIN_FAILURE: 'login', LOGIN_LOCKOUT: 'login', LOGOUT: 'login', ACCESS_DENIED: 'access_denied', ROLE_CHANGE: 'role_change', REPORT_SUBMIT: 'report', REPORT_STATUS: 'report', VENDOR_NOTIFY: 'report', REPORT_PUBLISH: 'report', API_KEY_CREATE: 'api_key', API_KEY_REVOKE: 'api_key', RATE_LIMIT: 'rate_limit' };
  var SPAN = { '24h': 86400000, '7d': 604800000, '30d': 2592000000 };
  function ok(e, s) {
    if (!s.ref && e.t < P.NOW - SPAN[s.period]) return false;
    if (s.outcome !== 'all' && e.outcome.toLowerCase() !== s.outcome) return false;
    if (s.action !== 'all' && (GROUP[e.action] || 'other') !== s.action) return false;
    if (s.ref && e.ev !== s.ref) return false;
    if (s.find) {
      var hay = [e.id, e.user, e.role, e.action, e.target, e.outcome, e.ip, e.ev].join(' ').toLowerCase();
      if (hay.indexOf(s.find.toLowerCase()) < 0) return false;
    }
    return true;
  }
  function count(change) { var s = Object.assign({}, st, change); return all.filter(function (e) { return ok(e, s); }).length; }
  function label(list, v) { return list.filter(function (x) { return x[0] === v; })[0][1]; }
  function chips(id, list, key) {
    P.fillChips(document.getElementById(id), list.map(function (x) {
      var c = {}; c[key] = x[0];
      return { label: x[1], href: Q.href(c), current: st[key] === x[0], count: count(c) };
    }));
  }

  var rows = all.filter(function (e) { return ok(e, st); });
  chips('f-period', PERIODS, 'period'); chips('f-outcome', OUTCOMES, 'outcome'); chips('f-action', ACTIONS, 'action');
  P.searchForm(document.getElementById('f-form'), document.getElementById('f-find'), Q, 'find');

  var refBox = document.getElementById('f-ref');
  if (st.ref) {
    var c = P.h('div', 'controls');
    c.appendChild(P.h('span', 'eyebrow', 'Showing entries linked to ' + st.ref + ' (period ignored)'));
    var l1 = P.h('a', 'lnk', 'Open this event \u2192'); l1.href = 'security-events.html?event=' + st.ref; c.appendChild(l1);
    var l2 = P.h('a', 'lnk', 'Show all entries \u2192'); l2.href = Q.href({ ref: '' }); c.appendChild(l2);
    refBox.appendChild(c); refBox.hidden = false;
  }

  var parts = [];
  if (!st.ref) parts.push('last ' + label(PERIODS, st.period));
  if (st.outcome !== 'all') parts.push(label(OUTCOMES, st.outcome));
  if (st.action !== 'all') parts.push(label(ACTIONS, st.action));
  if (st.find) parts.push('\u201C' + st.find + '\u201D');
  document.getElementById('f-status').textContent = rows.length + (rows.length === 1 ? ' entry' : ' entries') + ' \u00B7 ' + parts.join(' \u00B7 ') + ' \u00B7 newest first \u00B7 read only';

  var head = ['ID', 'TIME (UTC)', 'USER', 'ROLE', 'ACTION', 'TARGET', 'OUTCOME', 'SOURCE IP', 'EVENT'];
  var table = rows.map(function (e) { return [e.id, P.fmt(e.t), e.user, e.role, e.action, e.target, e.outcome, e.ip, e.ev || '-']; });
  var w = head.map(function (h, i) { return Math.max.apply(null, [h.length].concat(table.map(function (r) { return r[i].length; }))); });
  function line(r) { return r.map(function (v, i) { return v + new Array(w[i] - v.length + 1).join(' '); }).join('  ').replace(/\s+$/, ''); }
  var log = document.getElementById('f-log'), empty = document.getElementById('f-empty');
  log.textContent = [line(head)].concat(table.map(line)).join('\n');
  log.hidden = rows.length === 0; empty.hidden = rows.length !== 0;
  document.getElementById('f-clear').href = Q.page;
})();
