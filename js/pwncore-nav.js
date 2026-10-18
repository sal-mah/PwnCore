/* PwnCore motion kit v1: include once per page, before </body>
   <script src="pwncore-nav.js"></script>
   Does four things. No setup needed beyond the class names in pwncore-motion.css. */
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
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* 4. Custom Table Scrollbar & Drag-to-Scroll (eliminates native OS scrollbars & preserves custom square cursor) */
  function initTableScrollbars() {
    var wraps = document.querySelectorAll('.pc-table-wrap');
    wraps.forEach(function (wrap) {
      if (wrap._pcScrollInit) {
        if (wrap._pcUpdateThumb) wrap._pcUpdateThumb();
        return;
      }
      wrap._pcScrollInit = true;

      var sbar = document.createElement('div');
      sbar.className = 'pc-scrollbar';
      sbar.setAttribute('data-req', 'SHIFT /horizontal');
      sbar.setAttribute('aria-hidden', 'true');

      var track = document.createElement('div');
      track.className = 'pc-scrollbar-track';

      var thumb = document.createElement('div');
      thumb.className = 'pc-scrollbar-thumb';

      track.appendChild(thumb);
      sbar.appendChild(track);

      wrap.parentNode.insertBefore(sbar, wrap.nextSibling);

      function updateThumb() {
        var scrollWidth = wrap.scrollWidth;
        var clientWidth = wrap.clientWidth;
        if (scrollWidth <= clientWidth + 2) {
          sbar.style.display = 'none';
          return;
        }
        sbar.style.display = 'flex';
        var trackRect = track.getBoundingClientRect();
        var trackWidth = trackRect.width || track.clientWidth || 100;
        var thumbWidth = Math.max(48, Math.round((clientWidth / scrollWidth) * trackWidth));
        var maxScroll = scrollWidth - clientWidth;
        var maxLeft = trackWidth - thumbWidth;
        var scrollLeft = wrap.scrollLeft;
        var thumbLeft = maxScroll > 0 ? Math.round((scrollLeft / maxScroll) * maxLeft) : 0;
        thumb.style.width = thumbWidth + 'px';
        thumb.style.transform = 'translateX(' + thumbLeft + 'px)';
      }

      wrap._pcUpdateThumb = updateThumb;
      wrap.addEventListener('scroll', updateThumb, { passive: true });
      window.addEventListener('resize', updateThumb, { passive: true });
      setTimeout(updateThumb, 50);

      // Auto-update when table rows change (filters, searches)
      if (window.MutationObserver) {
        var observer = new MutationObserver(function () {
          updateThumb();
        });
        observer.observe(wrap, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'style', 'class'] });
      }

      // Dragging the scrollbar thumb
      var isDragging = false;
      var startX = 0;
      var startScrollLeft = 0;

      thumb.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        isDragging = true;
        thumb.classList.add('is-dragging');
        document.body.classList.add('pc-is-dragging');
        startX = e.clientX;
        startScrollLeft = wrap.scrollLeft;
      });

      track.addEventListener('mousedown', function (e) {
        if (e.target === thumb || e.button !== 0) return;
        e.preventDefault();
        var rect = track.getBoundingClientRect();
        var clickX = e.clientX - rect.left;
        var trackWidth = rect.width;
        var thumbWidth = thumb.offsetWidth;
        var maxScroll = wrap.scrollWidth - wrap.clientWidth;
        var maxLeft = trackWidth - thumbWidth;
        if (maxLeft <= 0) return;
        var targetLeft = Math.max(0, Math.min(clickX - (thumbWidth / 2), maxLeft));
        wrap.scrollLeft = (targetLeft / maxLeft) * maxScroll;
      });

      window.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        e.preventDefault();
        var deltaX = e.clientX - startX;
        var rect = track.getBoundingClientRect();
        var trackWidth = rect.width;
        var thumbWidth = thumb.offsetWidth;
        var maxScroll = wrap.scrollWidth - wrap.clientWidth;
        var maxLeft = trackWidth - thumbWidth;
        if (maxLeft <= 0) return;
        var scrollDelta = (deltaX / maxLeft) * maxScroll;
        wrap.scrollLeft = startScrollLeft + scrollDelta;
      });

      window.addEventListener('mouseup', function () {
        if (isDragging) {
          isDragging = false;
          thumb.classList.remove('is-dragging');
          document.body.classList.remove('pc-is-dragging');
        }
      });

      // Drag-to-scroll on the table itself
      var isTableDragging = false;
      var tableStartX = 0;
      var tableStartScroll = 0;

      wrap.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return;
        if (e.target.closest('a, button, input, select, textarea, [data-req]')) return;
        if (wrap.scrollWidth <= wrap.clientWidth) return;
        isTableDragging = true;
        tableStartX = e.clientX;
        tableStartScroll = wrap.scrollLeft;
        document.body.classList.add('pc-is-dragging');
        e.preventDefault();
      });

      window.addEventListener('mousemove', function (e) {
        if (!isTableDragging) return;
        e.preventDefault();
        var diffX = e.clientX - tableStartX;
        wrap.scrollLeft = tableStartScroll - diffX;
      });

      window.addEventListener('mouseup', function () {
        if (isTableDragging) {
          isTableDragging = false;
          document.body.classList.remove('pc-is-dragging');
        }
      });

      wrap.addEventListener('dragstart', function (e) {
        e.preventDefault();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTableScrollbars);
  } else {
    initTableScrollbars();
  }
  window.addEventListener('load', initTableScrollbars);
})();
