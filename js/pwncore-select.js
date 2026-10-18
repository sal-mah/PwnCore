/* PwnCore custom dropdown enhancer.
   Replaces native <select class="select"> with dark PwnCore DOM dropdowns.
   Prevents the browser's default OS blue highlight and native cursor conflicts. */
(function () {
  function initSelects() {
    var selects = document.querySelectorAll('select.select:not([data-enhanced])');
    selects.forEach(function (sel) {
      sel.setAttribute('data-enhanced', 'true');
      sel.style.display = 'none';

      var wrapper = document.createElement('div');
      wrapper.className = 'pc-select';

      var reqAttr = sel.getAttribute('data-req') || 'SELECT';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pc-select-btn';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('data-req', reqAttr);

      var selectedOpt = sel.options[sel.selectedIndex] || sel.options[0];
      var btnLabel = document.createElement('span');
      btnLabel.textContent = selectedOpt ? selectedOpt.textContent : '';

      var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('width', '10');
      icon.setAttribute('height', '6');
      icon.setAttribute('viewBox', '0 0 10 6');
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = '<path d="M1 1L5 5L9 1" stroke="#8f8f8f" stroke-width="1.5" fill="none"/>';

      btn.appendChild(btnLabel);
      btn.appendChild(icon);
      wrapper.appendChild(btn);

      var menu = document.createElement('div');
      menu.className = 'pc-select-menu';
      menu.hidden = true;

      Array.prototype.forEach.call(sel.options, function (opt, idx) {
        if (opt.disabled && !opt.value) return; // skip header placeholders
        var item = document.createElement('div');
        item.className = 'pc-select-opt' + (idx === sel.selectedIndex ? ' selected' : '');
        item.textContent = opt.textContent;
        item.setAttribute('data-val', opt.value || opt.textContent);
        item.setAttribute('data-req', reqAttr + ' /' + (opt.value || opt.textContent).toLowerCase().replace(/[^a-z0-9]+/g, '-'));

        item.addEventListener('click', function (e) {
          e.stopPropagation();
          sel.selectedIndex = idx;
          btnLabel.textContent = opt.textContent;
          menu.querySelectorAll('.pc-select-opt').forEach(function (o) { o.classList.remove('selected'); });
          item.classList.add('selected');
          closeMenu();
          var evt = new Event('change', { bubbles: true });
          sel.dispatchEvent(evt);
        });

        menu.appendChild(item);
      });

      wrapper.appendChild(menu);
      sel.parentNode.insertBefore(wrapper, sel.nextSibling);

      function syncFromNative() {
        var opt = sel.options[sel.selectedIndex] || sel.options[0];
        if (opt) {
          btnLabel.textContent = opt.textContent;
          menu.querySelectorAll('.pc-select-opt').forEach(function (o, idx) {
            if (idx === sel.selectedIndex) o.classList.add('selected');
            else o.classList.remove('selected');
          });
        }
      }
      sel._pcSyncSelect = syncFromNative;
      sel.addEventListener('change', syncFromNative);

      if (sel.form) {
        sel.form.addEventListener('reset', function () {
          setTimeout(syncFromNative, 20);
        });
      }

      function closeMenu() {
        btn.setAttribute('aria-expanded', 'false');
        wrapper.classList.remove('open');
        menu.hidden = true;
      }

      function openMenu() {
        // Close other open selects
        document.querySelectorAll('.pc-select.open').forEach(function (s) {
          if (s !== wrapper) {
            s.classList.remove('open');
            var m = s.querySelector('.pc-select-menu');
            if (m) m.hidden = true;
            var b = s.querySelector('.pc-select-btn');
            if (b) b.setAttribute('aria-expanded', 'false');
          }
        });
        btn.setAttribute('aria-expanded', 'true');
        wrapper.classList.add('open');
        menu.hidden = false;
      }

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        if (isOpen) closeMenu();
        else openMenu();
      });

      document.addEventListener('click', function (e) {
        if (!wrapper.contains(e.target)) closeMenu();
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSelects);
  } else {
    initSelects();
  }
})();
