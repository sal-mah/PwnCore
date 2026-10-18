/* Security events page (Phase 1 prototype). Events are picked out of the audit log (NFR-AUD-08).
   Address: security-events.html?status=open&type=lockout&level=high&find=text&event=EVT-0031 */
(function () {
  var P = window.PCSEC; if (!P) return;
  var STATUS = [['all', 'All'], ['open', 'Open'], ['reviewed', 'Reviewed']];
  var TYPES = [['all', 'All']].concat(Object.keys(P.TYPES).map(function (k) { return [k, P.TYPES[k]]; }));
  var LEVELS = [['all', 'All'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']];
  var LABEL = { high: 'High', medium: 'Medium', low: 'Low' };
  var Q = P.query({
    status: { allowed: ['all', 'open', 'reviewed'], def: 'all' },
    type: { allowed: TYPES.map(function (t) { return t[0]; }), def: 'all' },
    level: { allowed: ['all', 'high', 'medium', 'low'], def: 'all' },
    find: { text: true },
    event: { pattern: /^EVT-\d{4}$/ }
  });
  var st = Q.st, sel = st.event, noteBox = document.getElementById('f-note');

  function ok(e, s) {
    if (s.status !== 'all' && e.status !== s.status) return false;
    if (s.type !== 'all' && e.type !== s.type) return false;
    if (s.level !== 'all' && e.level !== s.level) return false;
    if (s.find) {
      var hay = [e.id, P.TYPES[e.type], e.title, e.who, e.ip, e.level, e.status].join(' ').toLowerCase();
      if (hay.indexOf(s.find.toLowerCase()) < 0) return false;
    }
    return true;
  }
  function label(list, v) { return list.filter(function (x) { return x[0] === v; })[0][1]; }

  function render() {
    var all = P.events();
    function count(change) { var s = Object.assign({}, st, change); return all.filter(function (e) { return ok(e, s); }).length; }
    function chips(id, list, key) {
      P.fillChips(document.getElementById(id), list.map(function (x) {
        var c = {}; c[key] = x[0];
        return { label: x[1], href: Q.href(c), current: st[key] === x[0], count: count(c) };
      }));
    }
    chips('f-status-chips', STATUS, 'status'); chips('f-type', TYPES, 'type'); chips('f-level', LEVELS, 'level');

    var rows = all.filter(function (e) { return ok(e, st); });
    var parts = [];
    if (st.status !== 'all') parts.push(label(STATUS, st.status));
    if (st.type !== 'all') parts.push(label(TYPES, st.type));
    if (st.level !== 'all') parts.push('Level ' + label(LEVELS, st.level));
    if (st.find) parts.push('\u201C' + st.find + '\u201D');
    document.getElementById('f-status').textContent = rows.length + (rows.length === 1 ? ' event' : ' events') + (parts.length ? ' \u00B7 ' + parts.join(' \u00B7 ') : '') + ' \u00B7 newest first';

    var list = P.clear(document.getElementById('f-list')), empty = document.getElementById('f-empty');
    if (!sel && rows.length) sel = rows[0].id;
    if (rows.length) {
      var lg = P.h('div'); lg.style.cssText = 'display:flex;flex-wrap:wrap;column-gap:20px;padding:10px 8px;border-bottom:1px solid var(--line)';
      [['ID', '120px'], ['LEVEL', '84px'], ['EVENT', ''], ['STATUS', '80px'], ['USER', '110px'], ['ENTRIES', '40px'], ['DATE', '88px']].forEach(function (c) {
        var s = P.h('span', 'eyebrow', c[0]); s.style.flex = c[1] ? '0 0 ' + c[1] : '1 1 280px'; lg.appendChild(s);
      });
      list.appendChild(lg);
    }
    rows.forEach(function (e) {
      var a = P.h('a', 'row'); a.href = Q.href({ event: e.id });
      if (e.id === sel) { a.setAttribute('aria-current', 'true'); a.style.background = 'var(--surface)'; }
      a.appendChild(P.h('span', 'id', e.id));
      a.appendChild(P.levelBar(e.level));
      var t = P.h('span', 'ttl', e.title + ' '); t.appendChild(P.h('span', 'mono', '\u00B7 ' + P.TYPES[e.type])); t.lastChild.style.cssText = 'font-size:12px;color:var(--muted)';
      a.appendChild(t);
      a.appendChild(P.h('span', 'cat', e.status === 'open' ? 'Open' : 'Reviewed'));
      a.appendChild(P.h('span', 'by', e.who));
      a.appendChild(P.h('span', 'cv', '\u00D7' + P.related(e.id).length));
      a.appendChild(P.h('span', 'dt', P.day(e.t)));
      list.appendChild(a);
    });
    list.hidden = rows.length === 0; empty.hidden = rows.length !== 0;
    document.getElementById('f-clear').href = Q.page;
    detail(all);
  }

  function detail(all) {
    var box = P.clear(document.getElementById('f-detail')), e = all.filter(function (x) { return x.id === sel; })[0];
    document.getElementById('f-detail-intro').textContent = e ? 'Details of ' + e.id + '. Admins can mark it reviewed or open the matching entries in the audit log.' : 'Select an event in the list to see its details.';
    if (!e) return;
    var card = P.h('div', 'card'); card.style.maxWidth = '720px';
    var top = P.h('div', 'top');
    var id = P.h('span', 'mono', e.id + ' \u00B7 ' + P.TYPES[e.type]); id.style.cssText = 'font-size:13px;color:var(--muted)';
    top.appendChild(id); top.appendChild(P.h('span', 'eyebrow', e.status === 'open' ? 'Open' : 'Reviewed')); card.appendChild(top);
    card.appendChild(P.h('h3', '', e.title));
    var meta = P.h('div', 'meta'), sv = P.h('span', 'sev'); sv.appendChild(P.levelBar(e.level)); sv.appendChild(document.createTextNode('Level ' + LABEL[e.level]));
    meta.appendChild(sv);
    var src = P.h('span', '', 'Source ' + e.ip + ' \u00B7 ' + e.who); src.style.cssText = 'font-size:13px;color:var(--muted)'; meta.appendChild(src); card.appendChild(meta);
    var tl = P.h('div', 'tl'), rel = P.related(e.id);
    rel.forEach(function (a, i) {
      var row = P.h('div', i === rel.length - 1 ? 'hl' : ''); row.appendChild(P.h('i'));
      row.appendChild(P.h('span', '', a.action + ' \u00B7 ' + a.target)); row.appendChild(P.h('time', '', P.fmt(a.t).slice(0, 10) + ' ' + P.clock(a.t)));
      tl.appendChild(row);
    });
    card.appendChild(tl);
    var btns = P.h('div', 'btns');
    if (e.status === 'open') {
      var m = P.h('a', 'btn red sm', 'Mark as reviewed'); m.href = '#'; m.setAttribute('data-req', 'POST /security-events/' + e.id + '/review');
      m.addEventListener('click', function (ev) {
        ev.preventDefault(); P.markReviewed(e.id); render();
        noteBox.textContent = e.id + ' marked as reviewed. Counts are updated. Sample state is kept in this browser only.';
      });
      btns.appendChild(m);
    }
    var v = P.h('a', 'btn line sm', 'View in audit log'); v.href = 'audit-log.html?ref=' + e.id; btns.appendChild(v);
    card.appendChild(btns); box.appendChild(card);
  }

  P.searchForm(document.getElementById('f-form'), document.getElementById('f-find'), Q, 'find');
  render();
})();
