/* ===================================================
   Theme picker + persistence, shared by both pages.
   The 3-line pre-paint bootstrap in each page's <head>
   applies the stored theme before this file loads.
   =================================================== */
(function () {
  'use strict';

  var THEMES = [
    { id: 'slate',    label: 'Slate' },
    { id: 'charcoal', label: 'Charcoal' },
    { id: 'mist',     label: 'Mist' },
    { id: 'paper',    label: 'Paper' },
    { id: 'crt',      label: 'CRT' }
  ];
  var DEFAULT_ID = 'slate';
  var STORAGE_KEY = 'gb-theme';

  function validTheme(id) {
    for (var i = 0; i < THEMES.length; i++) {
      if (THEMES[i].id === id) return id;
    }
    return DEFAULT_ID;
  }

  function storedTheme() {
    try {
      return validTheme(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      return DEFAULT_ID;
    }
  }

  function applyTheme(id) {
    id = validTheme(id);
    if (id === DEFAULT_ID) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', id);
    }
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) { /* storage unavailable */ }
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: id } }));
  }

  /* Swatch colors are read from each theme's own tokens so the picker
     previews stay accurate if palettes are retuned. */
  var SWATCH = {
    slate: '#3e5671', charcoal: '#202225', mist: '#e9edf2', paper: '#f6f2e8', crt: '#0a0e0a'
  };
  var SWATCH_DOT = {
    slate: '#0fbcbf', charcoal: '#4fd8da', mist: '#0a7c7f', paper: '#0d7377', crt: '#33ff66'
  };

  function render() {
    var current = storedTheme();
    var root = document.createElement('div');
    root.className = 'theme-picker';

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'theme-picker__toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.textContent = 'Theme';

    var panel = document.createElement('fieldset');
    panel.className = 'theme-picker__panel';
    var legend = document.createElement('legend');
    legend.className = 'theme-picker__legend';
    legend.textContent = 'Color scheme';
    panel.appendChild(legend);

    THEMES.forEach(function (t) {
      var label = document.createElement('label');
      label.className = 'theme-picker__option';

      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'gb-theme';
      input.value = t.id;
      input.checked = t.id === current;
      input.addEventListener('change', function () { applyTheme(t.id); });

      var swatch = document.createElement('span');
      swatch.className = 'theme-picker__swatch';
      swatch.style.background = SWATCH[t.id];
      swatch.style.boxShadow = 'inset 0 0 0 3px ' + SWATCH[t.id] + ', inset 0 0 0 6px ' + SWATCH_DOT[t.id];

      var name = document.createElement('span');
      name.className = 'theme-picker__name';
      name.textContent = t.label;

      label.appendChild(input);
      label.appendChild(swatch);
      label.appendChild(name);
      panel.appendChild(label);
    });

    toggle.addEventListener('click', function () {
      var open = root.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        var checked = panel.querySelector('input:checked');
        if (checked) checked.focus();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('open')) {
        root.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!root.contains(e.target) && root.classList.contains('open')) {
        root.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    root.appendChild(toggle);
    root.appendChild(panel);
    document.body.appendChild(root);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
