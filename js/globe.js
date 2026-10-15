/* PwnCore globe: drag to rotate. Plain JS + SVG, no libraries. */
(function () {
  var svg = document.getElementById('pc-globe');
  if (!svg) return;
    const P = [
      [[-168,66],[-162,70],[-156,71],[-141,70],[-128,70],[-115,68],[-95,72],[-85,69],[-82,66],[-94,60],[-93,57],[-85,55],[-80,52],[-79,58],[-77,62],[-70,60],[-65,60],[-62,57],[-56,52],[-60,47],[-66,45],[-70,43],[-70,41],[-74,40],[-76,37],[-76,35],[-81,31],[-80,26],[-81,25],[-83,29],[-85,30],[-89,30],[-94,29],[-97,26],[-97,22],[-95,19],[-91,19],[-90,21],[-87,21],[-88,16],[-84,15],[-83,10],[-80,8],[-78,8],[-80,7],[-83,8],[-86,11],[-88,13],[-92,15],[-96,16],[-101,18],[-105,20],[-106,23],[-109,26],[-113,31],[-115,32],[-117,32],[-120,34],[-122,37],[-124,41],[-124,47],[-127,51],[-131,55],[-137,58],[-145,60],[-152,59],[-158,57],[-164,55],[-160,59],[-165,62],[-166,64]],
      [[-73,78],[-60,82],[-30,83],[-20,80],[-20,72],[-24,69],[-40,65],[-44,60],[-50,62],[-54,67],[-58,75]],
      [[-80,73],[-68,70],[-62,66],[-72,63],[-80,65]],
      [[-77,8],[-72,12],[-63,11],[-55,6],[-50,1],[-44,-2],[-35,-5],[-35,-9],[-39,-15],[-41,-22],[-48,-26],[-53,-34],[-58,-38],[-62,-40],[-65,-45],[-67,-50],[-69,-53],[-72,-52],[-75,-47],[-73,-40],[-71,-30],[-70,-18],[-76,-14],[-81,-6],[-80,-1],[-78,3]],
      [[-9,37],[-9,43],[-1,44],[-4,48],[2,51],[8,54],[10,57],[12,55],[14,54],[21,55],[24,59],[30,60],[24,60],[22,63],[25,65],[21,65],[17,62],[19,59],[16,56],[12,56],[11,59],[5,59],[5,62],[11,65],[15,69],[22,70],[30,71],[40,68],[44,68],[60,69],[70,73],[80,73],[100,77],[112,74],[130,72],[142,72],[160,70],[170,70],[180,66],[170,60],[163,59],[160,54],[156,51],[155,57],[150,59],[143,59],[137,54],[141,52],[140,48],[135,43],[130,42],[129,37],[126,35],[126,38],[121,40],[122,37],[119,35],[121,31],[122,29],[119,25],[114,22],[110,21],[108,21],[106,18],[109,12],[105,9],[103,10],[100,13],[99,9],[103,2],[101,3],[98,8],[98,16],[94,17],[91,22],[87,21],[80,15],[78,9],[77,8],[73,16],[72,21],[68,23],[66,25],[57,26],[56,27],[52,28],[48,30],[50,26],[52,24],[56,25],[57,23],[59,22],[55,17],[52,16],[44,13],[43,16],[39,22],[35,28],[34,31],[36,36],[30,36],[27,37],[26,40],[24,38],[22,37],[21,40],[19,42],[16,41],[18,40],[16,38],[13,41],[10,44],[8,44],[3,43],[0,39],[-1,37],[-5,36]],
      [[-17,21],[-16,28],[-10,30],[-6,36],[10,37],[11,33],[20,31],[25,32],[32,31],[34,28],[37,22],[38,18],[43,12],[51,12],[48,5],[42,-1],[40,-10],[40,-15],[35,-20],[35,-25],[32,-29],[27,-34],[20,-35],[18,-32],[14,-23],[12,-17],[13,-9],[9,-1],[9,4],[5,6],[-4,5],[-8,4],[-13,8],[-17,14]],
      [[44,-25],[47,-25],[50,-15],[49,-12],[44,-17]],
      [[114,-22],[122,-18],[130,-12],[136,-12],[137,-16],[142,-11],[146,-19],[153,-26],[150,-37],[146,-39],[140,-38],[135,-35],[131,-31],[124,-33],[116,-35],[115,-30]],
      [[-5,50],[1,51],[2,53],[-2,56],[-2,58],[-5,59],[-6,56],[-3,54],[-5,52]],
      [[-10,52],[-6,52],[-6,55],[-10,54]],
      [[130,31],[132,34],[136,34],[140,36],[142,40],[141,45],[144,43],[140,41],[139,38],[135,36],[131,34]],
      [[95,5],[98,4],[106,-3],[104,-6],[100,-2]],
      [[109,2],[117,7],[119,1],[116,-4],[110,-3]],
      [[131,-1],[141,-3],[150,-10],[141,-9],[135,-4]],
      [[-24,65],[-14,66],[-14,64],[-22,63]],
      [[172,-34],[178,-38],[175,-42],[172,-41]],
      [[167,-46],[174,-41],[171,-44]],
      [[-85,22],[-74,20],[-78,22]]
    ];
    const W = [
      [[28,41],[28,45],[33,46],[38,47],[41,42],[36,41.5],[32,42]],
      [[47,45],[53,47],[54,41],[52,37],[49,38],[50,41]]
    ];

  function inside(poly, x, y) {
    var c = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  var dots = [], step = 3;
  for (var la = -87; la <= 87; la += step) {
    var k = Math.max(1, Math.cos(la * Math.PI / 180)), dl = step / k;
    for (var lo = -180; lo < 180; lo += dl) {
      var land = la < -72 || P.some(function (p) { return inside(p, lo, la); });
      if (land && !W.some(function (w) { return inside(w, lo, la); })) dots.push([lo, la]);
    }
  }
  var LOCS = [
    { place: 'Berlin, Germany', lat: 52.5, lon: 13.4, handle: 'nullbyte', reps: [['PWN-2026-0142', 'Heap overflow in Halcyon OS nf_tables set handling', 'critical', '9.8', '2026-09-28'], ['PWN-2026-0101', 'Local privilege escalation in Halcyon OS audio driver', 'high', '7.8', '2026-08-29']] },
    { place: 'São Paulo, Brazil', lat: -23.5, lon: -46.6, handle: 'tagsoup', reps: [['PWN-2026-0139', 'Stored XSS in Brightpath comment editor', 'medium', '6.1', '2026-09-25'], ['PWN-2026-0127', 'Authentication bypass in Brightpath SSO callback', 'critical', '9.1', '2026-09-17']] },
    { place: 'Mumbai, India', lat: 19.1, lon: 72.9, handle: 'dexdump', reps: [['PWN-2026-0131', 'Insecure deep link handling in Kestrel Chat for Android', 'high', '7.4', '2026-09-21']] },
    { place: 'Tokyo, Japan', lat: 35.7, lon: 139.7, handle: 'packetfox', reps: [['PWN-2026-0120', 'Command injection in Tessel RT-790 web admin', 'high', '8.8', '2026-09-12'], ['PWN-2026-0116', 'Verbose SMB banner reveals server version in Kestrel File Server', 'low', '3.7', '2026-09-09']] },
    { place: 'Cairo, Egypt', lat: 30.0, lon: 31.2, handle: 'zerod4y', reps: [['PWN-2026-0108', 'Overly permissive IAM role in Tessel Cloud starter template', 'medium', '6.5', '2026-09-03']] },
    { place: 'Lagos, Nigeria', lat: 6.5, lon: 3.4, handle: 'shellfish', reps: [['PWN-2026-0097', 'Path traversal in Kestrel File Server SMB share handling', 'high', '7.5', '2026-08-21']] },
    { place: 'Seoul, South Korea', lat: 37.6, lon: 127.0, handle: 'bitrot', reps: [['PWN-2026-0090', 'Use-after-free in Halcyon OS GPU driver', 'high', '7.8', '2026-08-14']] },
    { place: 'Toronto, Canada', lat: 43.7, lon: -79.4, handle: 'redpill', reps: [['PWN-2026-0084', 'Open redirect in Brightpath login', 'medium', '4.7', '2026-08-09']] }
  ];
  var R = 248, C = 300, D = Math.PI / 180;
  var el = function (id) { return document.getElementById(id); };
  var pGrid = el('g-grid'), p1 = el('g-land1'), p2 = el('g-land2'), p3 = el('g-land3'), pPins = el('g-pins'), card = el('globe-card'), view = el('g-view');
  var ticks = [];
  for (var a = 0; a < 360; a += 5) {
    var major = a % 30 === 0, r1 = R + 8, r2 = R + (major ? 22 : 14), s = Math.sin(a * D), c = Math.cos(a * D);
    ticks.push('M' + (C + r1 * s).toFixed(1) + ' ' + (C - r1 * c).toFixed(1) + 'L' + (C + r2 * s).toFixed(1) + ' ' + (C - r2 * c).toFixed(1));
  }
  el('g-ticks').setAttribute('d', ticks.join(''));

  var NS = 'http://www.w3.org/2000/svg';
  function svgEl(name, attrs) { var n = document.createElementNS(NS, name); for (var k in attrs) n.setAttribute(k, attrs[k]); return n; }
  var pins = LOCS.map(function (loc) {
    var n = loc.reps.length;
    var g = svgEl('g', { 'class': 'pin', tabindex: '0', role: 'button', 'data-req': 'GET /feed?q=@' + loc.handle,
      'aria-label': loc.place + ', researcher @' + loc.handle + ', ' + n + (n === 1 ? ' recent report' : ' recent reports') });
    g.appendChild(svgEl('rect', { 'class': 'hit', x: -16, y: -16, width: 32, height: 32 }));
    g.appendChild(svgEl('rect', { 'class': 'ring', x: -10, y: -10, width: 20, height: 20 }));
    g.appendChild(svgEl('rect', { 'class': 'mk', x: -3, y: -3, width: 6, height: 6 }));
    pPins.appendChild(g);
    var o = { loc: loc, g: g };
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPin(o, true); } });
    return o;
  });

  var selected = null, kbd = false, go = null;
  function h(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function sevBar(sev) {
    var k = { critical: 4, high: 3, medium: 2, low: 1 }[sev], b = h('span', 'sq');
    b.appendChild(h('span', sev === 'critical' ? 'crit' : 'on', '■'.repeat(k)));
    b.appendChild(h('span', 'off', '■'.repeat(4 - k)));
    return b;
  }
  function openPin(o, viaKeyboard) {
    selected = o; kbd = !!viaKeyboard;
    pins.forEach(function (x) { x.g.classList.toggle('sel', x === o); });
    card.textContent = '';
    var head = h('div', 'gc-head');
    head.appendChild(h('span', 'eyebrow', o.loc.place + ' · ' + Math.abs(o.loc.lat).toFixed(1) + (o.loc.lat >= 0 ? '°N ' : '°S ') + Math.abs(o.loc.lon).toFixed(1) + (o.loc.lon >= 0 ? '°E' : '°W')));
    var x = h('button', 'gc-x', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Close'); x.addEventListener('click', closeCard);
    head.appendChild(x); card.appendChild(head);
    card.appendChild(h('div', 'gc-who', '@' + o.loc.handle));
    o.loc.reps.forEach(function (r) {
      var row = h('div', 'gc-rep');
      row.appendChild(h('div', 't', r[1]));
      var m = h('div', 'm'); m.appendChild(h('span', '', r[0]));
      var sv = h('span', 'sev'); sv.appendChild(sevBar(r[2])); sv.appendChild(document.createTextNode('CVSS ' + r[3])); m.appendChild(sv);
      m.appendChild(h('span', '', r[4])); row.appendChild(m); card.appendChild(row);
    });
    var a = h('a', 'lnk', 'See reports from @' + o.loc.handle + ' →'); a.href = 'feed.html?q=%40' + o.loc.handle; card.appendChild(a);
    card.hidden = false;
    if (kbd) x.focus();
    var calmNow = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var toLat = Math.max(-60, Math.min(60, o.loc.lat));
    if (calmNow) { lon0 = o.loc.lon; lat0 = toLat; draw(); }
    else go = { t0: performance.now(), lon: lon0, lat: lat0, toLon: o.loc.lon, toLat: toLat };
  }
  function closeCard() {
    var was = selected; selected = null; go = null; card.hidden = true;
    pins.forEach(function (x) { x.g.classList.remove('sel'); });
    if (kbd && was) was.g.focus();
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && selected) closeCard(); });

  var lon0 = 28, lat0 = 24, drag = null;
  var f1 = function (n) { return n.toFixed(1); };
  function draw() {
    var sp = Math.sin(lat0 * D), cp = Math.cos(lat0 * D);
    function proj(lo, la) {
      var l = (lo - lon0) * D, f = la * D, cf = Math.cos(f), sf = Math.sin(f), cl = Math.cos(l);
      return { x: C + R * cf * Math.sin(l), y: C - R * (cp * sf - sp * cf * cl), z: sp * sf + cp * cf * cl };
    }
    var b1 = [], b2 = [], b3 = [], i, p;
    for (i = 0; i < dots.length; i++) {
      p = proj(dots[i][0], dots[i][1]);
      if (p.z <= 0.05) continue;
      (p.z < 0.3 ? b1 : p.z < 0.65 ? b2 : b3).push('M' + f1(p.x) + ' ' + f1(p.y) + 'h0');
    }
    var g = [];
    function line(pts) {
      var pen = false;
      pts.forEach(function (q) {
        var pp = proj(q[0], q[1]);
        if (pp.z > 0) { g.push((pen ? 'L' : 'M') + f1(pp.x) + ' ' + f1(pp.y)); pen = true; } else pen = false;
      });
    }
    [-60, -30, 0, 30, 60].forEach(function (la) { var pts = []; for (var lo = -180; lo <= 180; lo += 6) pts.push([lo, la]); line(pts); });
    for (var lo = -180; lo < 180; lo += 30) { var pts = []; for (var la2 = -84; la2 <= 84; la2 += 6) pts.push([lo, la2]); line(pts); }
    pins.forEach(function (o) {
      var q = proj(o.loc.lon, o.loc.lat);
      if (q.z <= 0.05) { o.g.setAttribute('visibility', 'hidden'); return; }
      o.g.setAttribute('visibility', 'visible');
      o.g.setAttribute('transform', 'translate(' + f1(q.x) + ' ' + f1(q.y) + ')');
    });
    pGrid.setAttribute('d', g.join(''));
    p1.setAttribute('d', b1.join('')); p2.setAttribute('d', b2.join('')); p3.setAttribute('d', b3.join(''));
    var ew = Math.abs(lon0).toFixed(1) + '\u00b0' + (lon0 >= 0 ? 'E' : 'W');
    var ns = Math.abs(lat0).toFixed(1) + '\u00b0' + (lat0 >= 0 ? 'N' : 'S');
    view.textContent = ew + ' ' + ns;
  }
  svg.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, y: e.clientY, moved: 0 }; go = null; try { svg.setPointerCapture(e.pointerId); } catch (x) {} });
  svg.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.moved += Math.abs(dx) + Math.abs(dy);
    lon0 = ((lon0 - dx * 0.4 + 540) % 360) - 180;
    lat0 = Math.max(-70, Math.min(70, lat0 + dy * 0.4));
    drag.x = e.clientX; drag.y = e.clientY;
    draw();
  });
  svg.addEventListener('pointerup', function (e) {
    var d = drag; drag = null;
    if (!d || d.moved > 5) return;
    var hit = null, list = document.elementsFromPoint(e.clientX, e.clientY);
    for (var i = 0; i < list.length && !hit; i++) { var pg = list[i].closest && list[i].closest('.pin'); if (pg) hit = pg; }
    var o = hit && pins.filter(function (x) { return x.g === hit; })[0];
    if (o) openPin(o, false); else if (selected) closeCard();
  });
  svg.addEventListener('pointercancel', function () { drag = null; });
  draw();
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var last = 0;
  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  (function tick(t) {
    if (go) {
      var k = Math.min(1, (t - go.t0) / 700), dl = ((go.toLon - go.lon + 540) % 360) - 180;
      lon0 = ((go.lon + dl * ease(k) + 540) % 360) - 180;
      lat0 = go.lat + (go.toLat - go.lat) * ease(k);
      draw();
      if (k >= 1) go = null;
    } else if (!calm && !drag && !selected && t - last > 50) {
      last = t; lon0 = ((lon0 + 0.3 + 540) % 360) - 180; draw();
    }
    requestAnimationFrame(tick);
  })(0);
})();
