/* ============================================
   La Calebasse Québec — Scripts
   ============================================ */

(function () {
  'use strict';

  // --- Page Loader ---
  var loader = document.getElementById('loader');

  function hideLoader() {
    if (loader && !loader.classList.contains('loader--hidden')) {
      loader.classList.add('loader--hidden');
    }
  }

  // Hide on load or after 3s max (fallback for local files / slow iframes)
  window.addEventListener('load', function () {
    setTimeout(hideLoader, 800);
  });
  setTimeout(hideLoader, 3000);

  // --- Promo Banner ---
  var promoBanner = document.querySelector('.promo-banner');
  var promoClose = document.querySelector('.promo-banner__close');

  if (promoClose && promoBanner) {
    promoClose.addEventListener('click', function () {
      promoBanner.classList.add('promo-banner--hidden');
    });
  }

  // --- Mobile Navigation ---
  var navToggle = document.querySelector('.nav__toggle');
  var navMenu = document.querySelector('.nav__menu');
  var navLinks = document.querySelectorAll('.nav__link');

  function openNav() {
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Fermer le menu');
    navMenu.classList.add('nav__menu--open');
  }

  function closeNav() {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Ouvrir le menu');
    navMenu.classList.remove('nav__menu--open');
  }

  navToggle.addEventListener('click', function () {
    var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeNav();
    }
  });

  // --- Header scroll effect ---
  var header = document.getElementById('header');

  function onScroll() {
    var scrollY = window.scrollY;
    if (scrollY > 60) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Scroll to Top ---
  var scrollTopBtn = document.getElementById('scroll-top');

  function updateScrollTop() {
    if (window.scrollY > 600) {
      scrollTopBtn.classList.add('scroll-top--visible');
    } else {
      scrollTopBtn.classList.remove('scroll-top--visible');
    }
  }

  window.addEventListener('scroll', updateScrollTop, { passive: true });

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Menu Tabs ---
  var tabs = document.querySelectorAll('.menu__tab');
  var panels = document.querySelectorAll('.menu__panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('menu__tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(function (p) {
        p.classList.remove('menu__panel--active');
        p.setAttribute('hidden', '');
      });

      tab.classList.add('menu__tab--active');
      tab.setAttribute('aria-selected', 'true');
      var panelId = tab.getAttribute('aria-controls');
      var panel = document.getElementById(panelId);
      panel.classList.add('menu__panel--active');
      panel.removeAttribute('hidden');
    });

    tab.addEventListener('keydown', function (e) {
      var tabArray = Array.from(tabs);
      var index = tabArray.indexOf(tab);
      var newIndex = index;

      if (e.key === 'ArrowRight') {
        newIndex = (index + 1) % tabArray.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (index - 1 + tabArray.length) % tabArray.length;
      } else if (e.key === 'Home') {
        newIndex = 0;
      } else if (e.key === 'End') {
        newIndex = tabArray.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      tabArray[newIndex].click();
      tabArray[newIndex].focus();
    });
  });

  // --- Animated Stats Counter ---
  var statsNumbers = document.querySelectorAll('.stats__number');
  var statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    statsNumbers.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1500;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(eased * target);

        el.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    });
  }

  var statsSection = document.querySelector('.stats');
  if (statsSection) {
    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsSection);
  }

  // --- Scroll Reveal ---
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    var revealElements = document.querySelectorAll(
      '.about__grid, .service-card, .menu-item, .ambiance__card, .contact__detail, .contact__map, .specialty-card, .testimonial, .section-title, .section-eyebrow, .menu__cta'
    );

    revealElements.forEach(function (el) {
      el.classList.add('reveal');
      // Add directional variants for richer animation
      if (el.classList.contains('contact__map')) {
        el.classList.add('reveal--right');
      } else if (el.classList.contains('contact__detail')) {
        el.classList.add('reveal--left');
      } else if (el.classList.contains('service-card') || el.classList.contains('specialty-card') || el.classList.contains('ambiance__card')) {
        el.classList.add('reveal--scale');
      }
    });

    var staggerContainers = document.querySelectorAll(
      '.services__grid, .menu__grid, .ambiance__grid, .specialties__grid, .testimonials__grid'
    );
    staggerContainers.forEach(function (el) {
      el.classList.add('reveal-stagger');
    });

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            entry.target.classList.add('reveal-stagger--visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });

    staggerContainers.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // --- Active nav link highlight ---
  var sections = document.querySelectorAll('section[id]');

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('nav__link--active');
            }
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px',
    }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  // --- Scroll-Stop Video ---
  var videoBreak = document.querySelector('.video-break');
  var videoEl = document.querySelector('.video-break__media');

  if (videoBreak && videoEl) {
    var videoObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            videoBreak.classList.add('is-visible');
            videoEl.play().then(function () {
              videoEl.classList.add('is-playing');
            }).catch(function () {
              // Autoplay blocked — show poster frame via opacity
              videoEl.classList.add('is-playing');
            });
          } else {
            videoBreak.classList.remove('is-visible');
            videoEl.pause();
            videoEl.classList.remove('is-playing');
          }
        });
      },
      { threshold: 0.3 }
    );
    videoObserver.observe(videoBreak);
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
