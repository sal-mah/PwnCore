/* PwnCore cursor. Include once per page, after pwncore-nav.js, with css/pwncore-cursor.css.
   The label next to the dot shows the request a click would make:
     <a href="feed.html?category=web">   shows  GET /feed?category=web   (worked out from the link)
     data-req="POST /register"           shows exactly that text (use it on buttons and custom elements)
   Links to "#" and plain buttons show no label unless they have data-req. */
(function () {
  if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;
  var html = document.documentElement;
  html.classList.add('pc-cur');
  var el = document.createElement('div');
  el.id = 'pc-cursor';
  el.setAttribute('aria-hidden', 'true');
  el.setAttribute('data-hot', '0');
  el.setAttribute('data-hide', '0');
  el.innerHTML = '<i class="pc-dot"></i><span class="pc-tag"></span>';
  document.body.appendChild(el);
  var tag = el.querySelector('.pc-tag');

  function path(h) {
    return '/' + h.replace(/^(\.\/|\/)/, '').replace(/(^|\/)index(\.html|\.php)?(?=$|[?#])/, '$1').replace(/\.(html|php)(?=$|[?#])/, '').replace(/^\//, '');
  }
  function label(t) {
    var r = t.closest('[data-req]');
    if (r) return r.getAttribute('data-req');
    var a = t.closest('a[href]');
    if (a) {
      var h = a.getAttribute('href');
      if (!h || h.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(h)) return '';
      if (/^https?:\/\//i.test(h)) { try { return 'GET ' + new URL(h).host; } catch (e) { return ''; } }
      return 'GET ' + path(h);
    }
    var b = t.closest('button[type="submit"], input[type="submit"]');
    if (b && b.form) { var act = b.form.getAttribute('action') || ''; return 'POST ' + path(act); }
    return '';
  }

  document.addEventListener('mousemove', function (e) {
    el.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
    html.classList.add('pc-moved');
    var t = e.target;
    var isDraggingState = document.body.classList.contains('pc-is-dragging');
    var isInput = !isDraggingState && !!t.closest('input, textarea');
    el.setAttribute('data-hide', isInput ? '1' : '0');
    var isHot = !!t.closest('a[href], button, [role="button"], [data-req], summary, label, select, .pc-scrollbar, .pc-scrollbar-thumb, .pc-scrollbar-track');
    el.setAttribute('data-hot', (isHot || isDraggingState) ? '1' : '0');
    var txt = isDraggingState ? 'SHIFT /horizontal' : label(t);
    if (tag.textContent !== txt) tag.textContent = txt;
  });
  document.addEventListener('mouseleave', function () {
    if (!document.body.classList.contains('pc-is-dragging')) {
      html.classList.remove('pc-moved');
    }
  });
  document.addEventListener('mouseenter', function () {
    html.classList.add('pc-moved');
  });
  document.addEventListener('mousedown', function () { el.classList.add('press'); });
  document.addEventListener('mouseup', function () { el.classList.remove('press'); });
})();
