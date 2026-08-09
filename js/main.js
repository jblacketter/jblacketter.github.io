/* ===================================================
   Greg Blacketter · Portfolio Showcase
   Data rendering + scroll animations + hero particles
   Categorized grid with terminal aesthetic
   =================================================== */

(function () {
  'use strict';

  var DATA_URL = 'data/content.json';

  /* --- Grid Layout Map ---
     Defines explicit grid positions for the asymmetric 3-col × 8-row layout.
     Keys: "categoryId/repoName"
     Values: { gridColumn, gridRow }
  */
  var GRID_MAP = {
    // Category labels
    'label/dev-qa':           { gridColumn: '1 / 3', gridRow: '1' },
    'label/tools':            { gridColumn: '3',     gridRow: '1' },
    'label/fun':              { gridColumn: '1 / 3', gridRow: '4' },

    // Dev & QA (cols 1-2, rows 2-3) · Bugalizer wide as Aegis's companion
    'dev-qa/bugalizer':       { gridColumn: '1 / 3', gridRow: '2' },
    'dev-qa/squanch':         { gridColumn: '1',     gridRow: '3' },
    'dev-qa/engram':          { gridColumn: '2',     gridRow: '3' },

    // Tools (col 3, rows 2-4)
    'tools/tagteam':                   { gridColumn: '3', gridRow: '2' },
    'tools/liminal':                   { gridColumn: '3', gridRow: '3' },
    'tools/waylin':                    { gridColumn: '3', gridRow: '4 / 6' },

    // Fun (rows 5-6)
    'fun/botastrophic':    { gridColumn: '1 / 3', gridRow: '5' },
    'fun/benfords_law':    { gridColumn: '1 / 3', gridRow: '6' }
  };

  /* --- Fetch & Render --- */

  fetch(DATA_URL)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      renderMeta(data.meta);
      renderFocus(data.currentFocus);
      renderFeatured(data.featured);
      renderCategorizedProjects(data.categories);
      renderDemo(data.video);
      initReveal();
    })
    .catch(function (err) {
      console.error('Failed to load content:', err);
    });

  /* --- Meta --- */

  function renderMeta(meta) {
    if (!meta) return;
    var title = document.getElementById('hero-title');
    var tagline = document.getElementById('hero-tagline');
    var ghLink = document.getElementById('hero-github');
    if (title && meta.title) title.textContent = meta.title;
    if (tagline && meta.tagline) tagline.textContent = meta.tagline;
    if (ghLink && meta.github) ghLink.href = meta.github;

    renderAvailability(meta.availability);
    renderContact(meta.contact);
  }

  function renderAvailability(availability) {
    var el = document.getElementById('hero-availability');
    if (!el || !availability || !availability.items) return;
    var label = availability.label
      ? '<span class="availability__label">' + escapeHtml(availability.label) + ':</span>'
      : '';
    var items = availability.items.map(function (item) {
      return '<span class="availability__item">' + escapeHtml(item) + '</span>';
    }).join('<span class="availability__sep" aria-hidden="true">·</span>');
    el.innerHTML = label + '<span class="availability__items">' + items + '</span>';
  }

  function renderContact(contact) {
    if (!contact) return;
    var heading = document.getElementById('contact-heading');
    var sub = document.getElementById('contact-subheading');
    var links = document.getElementById('contact-links');
    if (heading && contact.heading) heading.textContent = contact.heading;
    if (sub && contact.subheading) sub.textContent = contact.subheading;
    if (links && contact.links) {
      links.innerHTML = contact.links.map(function (link) {
        var external = link.href.indexOf('http') === 0
          ? ' target="_blank" rel="noopener noreferrer"'
          : '';
        return (
          '<a class="contact-link" href="' + escapeAttr(link.href) + '"' + external + '>' +
            '<span class="contact-link__label">' + escapeHtml(link.label) + '</span>' +
            '<span class="contact-link__value">' + escapeHtml(link.value) + '</span>' +
            '<span class="contact-link__arrow" aria-hidden="true">&rarr;</span>' +
          '</a>'
        );
      }).join('');
    }
  }

  /* --- Current Focus --- */

  function renderFocus(items) {
    var grid = document.getElementById('focus-grid');
    if (!grid || !items) return;

    grid.innerHTML = items.map(function (item) {
      return (
        '<article class="focus-card reveal">' +
          '<h3 class="focus-card__title">' + escapeHtml(item.title) + '</h3>' +
          '<p class="focus-card__desc">' + escapeHtml(item.description) + '</p>' +
        '</article>'
      );
    }).join('');
  }

  /* --- Featured Aegis band --- */

  function renderFeatured(f) {
    var el = document.getElementById('featured-band');
    if (!el || !f) return;

    var tiers = (f.tiers || []).map(function (t) {
      return '<span class="featured__tier">' + escapeHtml(t) + '</span>';
    }).join('<span class="featured__tier-sep" aria-hidden="true">&rarr;</span>');

    var companion = f.companion
      ? '<a class="featured__companion" href="' + escapeAttr(f.companion.href) + '">' +
          '<span class="featured__companion-label">' + escapeHtml(f.companion.label) + '</span>' +
          '<span class="featured__companion-blurb">' + escapeHtml(f.companion.blurb) + '</span>' +
          '<span aria-hidden="true">&darr;</span>' +
        '</a>'
      : '';

    el.innerHTML =
      '<article class="featured reveal">' +
        '<div class="featured__body">' +
          '<p class="featured__eyebrow"><span aria-hidden="true">&gt;</span> ' + escapeHtml(f.eyebrow) + '</p>' +
          '<h2 class="featured__name">' + escapeHtml(f.name) + '</h2>' +
          '<p class="featured__tagline">' + escapeHtml(f.tagline) + '</p>' +
          '<p class="featured__desc">' + escapeHtml(f.description) + '</p>' +
          '<div class="featured__tiers" title="' + escapeAttr(f.tiersNote || '') + '">' + tiers + '</div>' +
          '<p class="featured__local"><span class="featured__local-dot" aria-hidden="true"></span>' + escapeHtml(f.localFirst) + '</p>' +
          '<p class="featured__status">' + escapeHtml(f.status) + '</p>' +
          '<div class="featured__ctas">' +
            '<a class="hero__cta hero__cta--primary" href="' + escapeAttr(f.detailUrl) + '">Explore Aegis <span aria-hidden="true">&rarr;</span></a>' +
            '<a class="hero__cta" href="' + escapeAttr(f.url) + '" target="_blank" rel="noopener noreferrer">View on GitHub</a>' +
          '</div>' +
          companion +
        '</div>' +
        '<div class="featured__art">' +
          '<img src="' + escapeAttr(f.image) + '" alt="Aegis scan console illustration" loading="lazy"/>' +
        '</div>' +
      '</article>';
  }

  /* --- Categorized Projects --- */

  function renderCategorizedProjects(categories) {
    var grid = document.getElementById('projects-layout');
    if (!grid || !categories) return;

    var html = '';
    var cardIndex = 0;

    categories.forEach(function (cat) {
      // Category label
      var labelKey = 'label/' + cat.id;
      var labelPos = GRID_MAP[labelKey] || {};
      var labelStyle = buildGridStyle(labelPos);

      html +=
        '<div class="category-label reveal" data-category="' + escapeAttr(cat.id) + '" style="' + labelStyle + '">' +
          '<span class="category-label__prompt">&gt;</span> ' +
          '<span class="category-label__text">' + escapeHtml(cat.label) + '</span>' +
          '<span class="category-label__cursor"></span>' +
          '<span class="category-label__line"></span>' +
        '</div>';

      // Repo cards
      cat.repos.forEach(function (repo) {
        var posKey = cat.id + '/' + repo.name;
        var pos = GRID_MAP[posKey] || {};
        var gridStyle = buildGridStyle(pos);

        var classes = 'card reveal';
        if (repo.featured) classes += ' card--featured';
        if (repo.wide) classes += ' card--wide';

        var delay = cardIndex * 0.07;

        // Window dots
        var windowDots =
          '<div class="card__window-dots">' +
            '<span class="card__window-dot"></span>' +
            '<span class="card__window-dot"></span>' +
            '<span class="card__window-dot"></span>' +
          '</div>';

        // Project name · big, uppercase (display name overrides repo slug)
        var displayName = repo.displayName || repo.name.replace(/[-_]/g, ' ');
        var slug = '<div class="card__name">' + escapeHtml(displayName) + '</div>';

        // Image
        var imageHtml = repo.image
          ? '<div class="card__image"><img src="' + escapeAttr(repo.image) + '" alt="' + escapeAttr(repo.title) + ' illustration" loading="lazy"/></div>'
          : '';

        // Tags
        var tags = repo.tags.map(function (t) {
          return '<span class="tag">' + escapeHtml(t) + '</span>';
        }).join('');

        // Impact
        var impact = repo.impact
          ? '<p class="card__impact">' + escapeHtml(repo.impact) + '</p>'
          : '';

        // Badge
        var badge = '';
        if (repo.badge) {
          var badgeClass = repo.badge === 'In Progress' ? 'card__badge badge--progress' : 'card__badge';
          badge = '<span class="' + badgeClass + '">' + escapeHtml(repo.badge) + '</span>';
        }

        var titleHtml = '<h3 class="card__title">' + escapeHtml(repo.title) + badge + '</h3>';

        var statusHtml = repo.status
          ? '<p class="card__status"><span class="card__status-dot" aria-hidden="true"></span>' + escapeHtml(repo.status) + '</p>'
          : '';

        // Link
        var link;
        if (repo.private) {
          link = '<span class="card__link card__link--disabled">Private repo</span>';
        } else if (!repo.url) {
          link = '<span class="card__link card__link--disabled">Coming soon</span>';
        } else {
          link =
            '<a class="card__link" href="' + escapeAttr(repo.url) + '" target="_blank" rel="noopener noreferrer">' +
              'View on GitHub ' +
              '<span class="card__link-arrow">&rarr;</span>' +
            '</a>';
        }

        html +=
          '<article class="' + classes + '" id="card-' + escapeAttr(repo.name) + '" data-category="' + escapeAttr(cat.id) + '" style="' + gridStyle + '; --reveal-delay: ' + delay.toFixed(2) + 's; --pulse-delay: ' + (cardIndex * 0.4).toFixed(1) + 's;">' +
            windowDots +
            imageHtml +
            slug +
            titleHtml +
            statusHtml +
            '<p class="card__desc">' + escapeHtml(repo.description) + '</p>' +
            impact +
            '<div class="card__tags">' + tags + '</div>' +
            link +
          '</article>';

        cardIndex++;
      });
    });

    grid.innerHTML = html;
  }

  /* --- Build inline grid style from position object --- */

  function buildGridStyle(pos) {
    var parts = [];
    if (pos.gridColumn) parts.push('grid-column: ' + pos.gridColumn);
    if (pos.gridRow) parts.push('grid-row: ' + pos.gridRow);
    return parts.join('; ');
  }

  /* --- Demo --- */

  function renderDemo(video) {
    if (!video) return;
    var text = document.getElementById('demo-text');
    if (text && video.placeholder) text.textContent = video.placeholder;
  }

  /* --- Scroll Reveal (IntersectionObserver) --- */

  function initReveal() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var els = document.querySelectorAll('.reveal');

    if (prefersReduced) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ===================================================
     Particle Network Animation (hero canvas)
     Floating nodes connected by lines · AI/network theme
     =================================================== */

  function initParticles() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 65;
    var CONNECT_DIST = 140;
    var colors = [];
    var linkRgb = '15, 188, 191';
    var animId;

    // Particle palette lives in the theme tokens; re-read on every theme change
    function readThemeColors() {
      var styles = getComputedStyle(document.documentElement);
      colors = [1, 2, 3, 4, 5, 6].map(function (n) {
        return styles.getPropertyValue('--particle-' + n).trim() || '#0fbcbf';
      });
      linkRgb = styles.getPropertyValue('--particle-link').trim() || '15, 188, 191';
    }

    document.addEventListener('themechange', function () {
      readThemeColors();
      particles.forEach(function (p, i) {
        p.color = colors[i % colors.length];
      });
    });

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    function createParticles() {
      particles = [];
      var rect = canvas.parentElement.getBoundingClientRect();
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 3.2 + 0.8,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.35
        });
      }
    }

    function draw() {
      var rect = canvas.parentElement.getBoundingClientRect();
      var w = rect.width;
      var h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Draw connections
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            var opacity = (1 - dist / CONNECT_DIST) * 0.22;
            ctx.strokeStyle = 'rgba(' + linkRgb + ', ' + opacity + ')';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw & update particles
      for (var k = 0; k < particles.length; k++) {
        var p = particles[k];

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      animId = requestAnimationFrame(draw);
    }

    readThemeColors();
    resize();
    createParticles();
    draw();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
        createParticles();
      }, 150);
    });

    // Pause when not visible
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        draw();
      }
    });
  }

  // Init particles on load
  initParticles();

  /* --- Helpers --- */

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

})();
