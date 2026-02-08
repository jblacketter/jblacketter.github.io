/* ===================================================
   Greg Blacketter — Portfolio Showcase
   Data rendering + scroll animations + hero particles
   =================================================== */

(function () {
  'use strict';

  var DATA_URL = 'data/content.json';

  /* --- Fetch & Render --- */

  fetch(DATA_URL)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      renderMeta(data.meta);
      renderProjects(data.repos);
      renderFocus(data.currentFocus);
      renderDemo(data.video);
      initReveal();
      initParticles();
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
  }

  /* --- Projects --- */

  function renderProjects(repos) {
    var grid = document.getElementById('projects-grid');
    if (!grid || !repos) return;

    grid.innerHTML = repos.map(function (repo) {
      var tags = repo.tags.map(function (t) {
        return '<span class="tag">' + escapeHtml(t) + '</span>';
      }).join('');

      var impact = repo.impact
        ? '<p class="card__impact">' + escapeHtml(repo.impact) + '</p>'
        : '';

      var badge = repo.badge
        ? '<span class="card__badge">' + escapeHtml(repo.badge) + '</span>'
        : '';

      var titleHtml = '<h3 class="card__title">' + escapeHtml(repo.title) + badge + '</h3>';

      var imageHtml = repo.image
        ? '<div class="card__image"><img src="' + escapeAttr(repo.image) + '" alt="' + escapeAttr(repo.title) + ' illustration" loading="lazy"/></div>'
        : '';

      var link;
      if (repo.private || !repo.url) {
        link = '<span class="card__link card__link--disabled">Private repo</span>';
      } else {
        link =
          '<a class="card__link" href="' + escapeAttr(repo.url) + '" target="_blank" rel="noopener noreferrer">' +
            'View on GitHub ' +
            '<span class="card__link-arrow">&rarr;</span>' +
          '</a>';
      }

      return (
        '<article class="card reveal">' +
          imageHtml +
          titleHtml +
          '<p class="card__desc">' + escapeHtml(repo.description) + '</p>' +
          impact +
          '<div class="card__tags">' + tags + '</div>' +
          link +
        '</article>'
      );
    }).join('');
  }

  /* --- Current Focus --- */

  function renderFocus(items) {
    var grid = document.getElementById('focus-grid');
    if (!grid || !items) return;

    grid.innerHTML = items.map(function (item) {
      var statusLabel = item.status === 'active' ? 'Active' : item.status;
      return (
        '<article class="focus-card reveal">' +
          '<span class="focus-card__status">' + escapeHtml(statusLabel) + '</span>' +
          '<h3 class="focus-card__title">' + escapeHtml(item.title) + '</h3>' +
          '<p class="focus-card__desc">' + escapeHtml(item.description) + '</p>' +
        '</article>'
      );
    }).join('');
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
     Floating nodes connected by lines — AI/network theme
     =================================================== */

  function initParticles() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 65;
    var CONNECT_DIST = 140;
    var colors = ['#0fbcbf', '#e8a838', '#a78bfa', '#34d399', '#60a5fa', '#f472b6'];
    var animId;

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
            ctx.strokeStyle = 'rgba(15, 188, 191, ' + opacity + ')';
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
