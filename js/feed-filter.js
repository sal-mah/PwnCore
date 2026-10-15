/* Feed filters (Phase 1 prototype), all driven by the address:
     feed.html?q=xss&category=web&severity=critical&sort=cvss
   Values:  category = kernel|web|mobile|network|firmware|cloud
            severity = critical|high|medium|low      sort = newest|cvss
   In Phase 2 the PHP feed page reads the same $_GET values and filters in SQL.
   The links and values stay exactly the same, only this file goes away. */
(function () {
  var CAT = { kernel: 'Kernel', web: 'Web', mobile: 'Mobile', network: 'Network', firmware: 'Firmware', cloud: 'Cloud and API' };
  var SEV = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };
  var list = document.getElementById('feed-list');
  if (!list) return;
  var rows = [].slice.call(list.querySelectorAll('a.row'));
  rows.forEach(function (r) { r._txt = r.textContent.toLowerCase().replace(/\s+/g, ' '); });

  var p = new URLSearchParams(location.search);
  var st = {
    q: (p.get('q') || '').trim(),
    category: CAT[p.get('category')] ? p.get('category') : 'all',
    severity: SEV[p.get('severity')] ? p.get('severity') : 'all',
    sort: p.get('sort') === 'cvss' ? 'cvss' : 'newest'
  };
  function href(change) {
    var s = Object.assign({}, st, change), u = new URLSearchParams();
    if (s.q) u.set('q', s.q);
    if (s.category !== 'all') u.set('category', s.category);
    if (s.severity !== 'all') u.set('severity', s.severity);
    if (s.sort !== 'newest') u.set('sort', s.sort);
    var qs = u.toString();
    return 'feed.html' + (qs ? '?' + qs : '');
  }
  function ok(r, s) {
    return (!s.q || r._txt.indexOf(s.q.toLowerCase()) > -1) &&
      (s.category === 'all' || r.dataset.cat === s.category) &&
      (s.severity === 'all' || r.dataset.sev === s.severity);
  }
  function count(change) { var s = Object.assign({}, st, change); return rows.filter(function (r) { return ok(r, s); }).length; }

  document.querySelectorAll('[data-chip]').forEach(function (c) {
    var k = c.dataset.chip; c.href = href({ category: k }); c.querySelector('i').textContent = count({ category: k });
    if (k === st.category) c.setAttribute('aria-current', 'true');
  });
  document.querySelectorAll('[data-sev-chip]').forEach(function (c) {
    var k = c.dataset.sevChip; c.href = href({ severity: k }); c.querySelector('i').textContent = count({ severity: k });
    if (k === st.severity) c.setAttribute('aria-current', 'true');
  });
  document.querySelectorAll('[data-sort-chip]').forEach(function (c) {
    var k = c.dataset.sortChip; c.href = href({ sort: k });
    if (k === st.sort) c.setAttribute('aria-current', 'true');
  });

  var order = rows.slice().sort(function (a, b) {
    if (st.sort === 'cvss') return parseFloat(b.dataset.cvss) - parseFloat(a.dataset.cvss);
    return a.dataset.date < b.dataset.date ? 1 : a.dataset.date > b.dataset.date ? -1 : 0;
  });
  var shown = 0;
  order.forEach(function (r) { list.appendChild(r); var s = ok(r, st); r.hidden = !s; if (s) shown++; });

  var parts = [];
  if (st.category !== 'all') parts.push(CAT[st.category]);
  if (st.severity !== 'all') parts.push(SEV[st.severity]);
  if (st.q) parts.push('“' + st.q + '”');
  document.getElementById('feed-status').textContent =
    shown + (shown === 1 ? ' report' : ' reports') + (parts.length ? ' · ' + parts.join(' · ') : '') + (st.sort === 'cvss' ? ' · highest CVSS first' : '');
  document.getElementById('feed-empty').hidden = shown !== 0;
  list.hidden = shown === 0;
  document.title = st.category !== 'all' ? CAT[st.category] + ' reports | PwnCore' : 'PwnCore Feed';
})();
