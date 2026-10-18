/* Admin API keys page (Phase 1 prototype). Admin view only. Keys are created by their owners on the
   Researcher API Keys page (Person 2). Full secrets are never shown or stored (SEC-14): only a masked identifier.
   An Admin may revoke a key (SEC-15). Revoking adds an audit entry and a security event (NFR-AUD-01, NFR-AUD-08).
   Address: admin-api-keys.html?status=active&perm=reports:read&find=text&key=KEY-0011 */
(function () {
  var P = window.PCSEC; if (!P) return;
  var STATUS = [['all', 'All'], ['active', 'Active'], ['revoked', 'Revoked'], ['expired', 'Expired']];
  var PERMS = [['all', 'All'], ['feed:read', 'feed:read'], ['reports:read', 'reports:read'], ['reports:write', 'reports:write'], ['reports:review', 'reports:review']];
  var Q = P.query({
    status: { allowed: STATUS.map(function (x) { return x[0]; }), def: 'all' },
    perm: { allowed: PERMS.map(function (x) { return x[0]; }), def: 'all' },
    find: { text: true },
    key: { pattern: /^KEY-\d{4}$/ }
  });
  var st = Q.st, sel = st.key, confirming = '', noteBox = document.getElementById('f-note');
  var NAME = { active: 'Active', revoked: 'Revoked', expired: 'Expired' };

  function ok(k, s) {
    if (s.status !== 'all' && k.status !== s.status) return false;
    if (s.perm !== 'all' && k.perms.indexOf(s.perm) < 0) return false;
    if (s.find) {
      var hay = [k.id, k.ident, k.owner, k.name, k.perms.join(' '), k.status].join(' ').toLowerCase();
      if (hay.indexOf(s.find.toLowerCase()) < 0) return false;
    }
    return true;
  }
  function label(list, v) { return list.filter(function (x) { return x[0] === v; })[0][1]; }

  function render() {
    var all = P.keys();
    function count(change) { var s = Object.assign({}, st, change); return all.filter(function (k) { return ok(k, s); }).length; }
    function chips(id, list, key) {
      P.fillChips(document.getElementById(id), list.map(function (x) {
        var c = {}; c[key] = x[0];
        return { label: x[1], href: Q.href(c), current: st[key] === x[0], count: count(c) };
      }));
    }
    chips('f-status-chips', STATUS, 'status'); chips('f-perm', PERMS, 'perm');

    var rows = all.filter(function (k) { return ok(k, st); });
    var parts = [];
    if (st.status !== 'all') parts.push(label(STATUS, st.status));
    if (st.perm !== 'all') parts.push(st.perm);
    if (st.find) parts.push('\u201C' + st.find + '\u201D');
    document.getElementById('f-status').textContent = rows.length + (rows.length === 1 ? ' key' : ' keys') + (parts.length ? ' \u00B7 ' + parts.join(' \u00B7 ') : '') + ' \u00B7 secrets are never shown';

    var list = P.clear(document.getElementById('f-list')), empty = document.getElementById('f-empty');
    if (!sel && rows.length) sel = rows[0].id;
    if (rows.length) {
      var lg = P.h('div'); lg.style.cssText = 'display:flex;flex-wrap:wrap;column-gap:20px;padding:10px 8px;border-bottom:1px solid var(--line)';
      [['KEY ID', '120px'], ['MASKED KEY', '150px'], ['NAME', ''], ['OWNER', '110px'], ['PERMISSIONS', '200px'], ['STATUS', '80px'], ['CREATED', '88px']].forEach(function (c) {
        var s = P.h('span', 'eyebrow', c[0]); s.style.flex = c[1] ? '0 0 ' + c[1] : '1 1 200px'; lg.appendChild(s);
      });
      list.appendChild(lg);
    }
    rows.forEach(function (k) {
      var a = P.h('a', 'row'); a.href = Q.href({ key: k.id });
      if (k.id === sel) { a.setAttribute('aria-current', 'true'); a.style.background = 'var(--surface)'; }
      a.appendChild(P.h('span', 'id', k.id));
      var m = P.h('span', 'id', k.ident); m.style.flexBasis = '150px'; a.appendChild(m);
      a.appendChild(P.h('span', 'ttl', k.name));
      a.appendChild(P.h('span', 'by', k.owner));
      var p = P.h('span', 'id', k.perms.join(', ')); p.style.flexBasis = '200px'; a.appendChild(p);
      var s = P.h('span', 'cat', NAME[k.status]); if (k.status === 'active') s.style.color = 'var(--white)'; a.appendChild(s);
      a.appendChild(P.h('span', 'dt', k.created));
      list.appendChild(a);
    });
    list.hidden = rows.length === 0; empty.hidden = rows.length !== 0;
    document.getElementById('f-clear').href = Q.page;
    detail(all);
  }

  function row(tl, text, time, cls) { var r = P.h('div', cls || ''); r.appendChild(P.h('i')); r.appendChild(P.h('span', '', text)); r.appendChild(P.h('time', '', time)); tl.appendChild(r); }

  function detail(all) {
    var box = P.clear(document.getElementById('f-detail')), k = all.filter(function (x) { return x.id === sel; })[0];
    document.getElementById('f-detail-intro').textContent = k ? 'Details of ' + k.id + '. Only the masked identifier is stored for display. An Admin can revoke an active key.' : 'Select a key in the list to see its details.';
    if (!k) return;
    var card = P.h('div', 'card'); card.style.maxWidth = '720px';
    var top = P.h('div', 'top');
    var id = P.h('span', 'mono', k.id + ' \u00B7 ' + k.ident); id.style.cssText = 'font-size:13px;color:var(--muted)';
    top.appendChild(id); top.appendChild(P.h('span', 'eyebrow', NAME[k.status])); card.appendChild(top);
    card.appendChild(P.h('h3', '', k.name));
    var meta = P.h('div', 'meta'); var o = P.h('span', '', 'Owner ' + k.owner + ' \u00B7 ' + k.role); o.style.cssText = 'font-size:13px;color:var(--muted)'; meta.appendChild(o);
    var pm = P.h('span', 'mono', k.perms.join(' \u00B7 ')); pm.style.cssText = 'font-size:12px;color:var(--body)'; meta.appendChild(pm); card.appendChild(meta);
    var tl = P.h('div', 'tl');
    row(tl, 'Created', k.created);
    row(tl, 'Expires', k.expires, k.status === 'expired' ? 'hl' : '');
    if (k.status === 'revoked') row(tl, 'Revoked by ' + k.revokedBy, k.revokedAt.slice(0, 19), 'hl');
    card.appendChild(tl);
    card.appendChild(P.h('p', 'status mono', 'The full key is shown to its owner once, at creation, and only a hash is stored (SEC-14). It cannot be shown here.'));
    var btns = P.h('div', 'btns');
    if (k.status === 'active' && confirming !== k.id) {
      var r = P.h('a', 'btn red sm', 'Revoke key'); r.href = '#'; r.setAttribute('data-req', 'POST /admin/api-keys/' + k.id + '/revoke');
      r.addEventListener('click', function (e) { e.preventDefault(); confirming = k.id; render(); });
      btns.appendChild(r);
    } else if (k.status === 'active') {
      card.appendChild(P.h('p', '', 'Revoke ' + k.id + '? Apps that use this key stop working at once. This cannot be undone.'));
      var c = P.h('a', 'btn red sm', 'Confirm revoke'); c.href = '#'; c.setAttribute('data-req', 'POST /admin/api-keys/' + k.id + '/revoke');
      c.addEventListener('click', function (e) {
        e.preventDefault(); var ev = P.revokeKey(k.id); confirming = ''; render();
        noteBox.textContent = k.id + ' revoked. An API_KEY_REVOKE entry and the security event ' + ev + ' were added (sample data, this browser only).';
      });
      var x = P.h('a', 'btn line sm', 'Cancel'); x.href = '#'; x.setAttribute('data-req', 'CANCEL');
      x.addEventListener('click', function (e) { e.preventDefault(); confirming = ''; render(); });
      btns.appendChild(c); btns.appendChild(x);
    } else {
      card.appendChild(P.h('p', '', k.status === 'revoked' ? 'This key is already revoked.' : 'This key has expired and no longer works. There is nothing to revoke.'));
    }
    var v = P.h('a', 'btn line sm', 'View in audit log'); v.href = 'audit-log.html?find=' + k.id; btns.appendChild(v);
    card.appendChild(btns); box.appendChild(card);
  }

  P.searchForm(document.getElementById('f-form'), document.getElementById('f-find'), Q, 'find');
  render();
})();
