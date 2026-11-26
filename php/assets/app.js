/* MiniModa — تعاملات سبک سمت کلاینت (بدون هیچ وابستگی) */
(function () {
  'use strict';

  /* ── اسلایدر هیرو ─────────────────────────────── */
  var hero = document.getElementById('hero');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var index = 0, timer = null;
    var go = function (i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, j) { s.classList.toggle('is-active', j === index); });
      dots.forEach(function (d, j) { d.classList.toggle('is-active', j === index); });
    };
    var start = function () { stop(); timer = window.setInterval(function () { go(index + 1); }, 5500); };
    var stop = function () { if (timer) { window.clearInterval(timer); timer = null; } };
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    dots.forEach(function (d, j) { d.addEventListener('click', function () { go(j); start(); }); });
    var prev = hero.querySelector('[data-hero-prev]'), next = hero.querySelector('[data-hero-next]');
    if (prev) prev.addEventListener('click', function () { go(index - 1); start(); });
    if (next) next.addEventListener('click', function () { go(index + 1); start(); });
    start();
  }

  /* ── کشوی موبایل ──────────────────────────────── */
  var navToggle = document.getElementById('navToggle');
  var mainnav = document.getElementById('mainnav');
  if (navToggle && mainnav) {
    navToggle.addEventListener('click', function () { mainnav.classList.toggle('is-open'); });
    mainnav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { mainnav.classList.remove('is-open'); }
    });
  }

  /* ── تب‌های محصولات صفحه اصلی ─────────────────── */
  var tabsBar = document.querySelector('[data-tabs]');
  if (tabsBar) {
    var buttons = Array.prototype.slice.call(tabsBar.querySelectorAll('[data-tab-btn]'));
    var panels = Array.prototype.slice.call(tabsBar.querySelectorAll('[data-tab-panel]'));
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab-btn');
        buttons.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        panels.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-tab-panel') === target); });
      });
    });
  }

  /* ── دکمه‌های علاقه‌مندی (فرم مخفی POST) ───────── */
  document.querySelectorAll('[data-wishlist]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var id = btn.getAttribute('data-wishlist');
      var form = document.createElement('form');
      form.method = 'POST';
      form.action = 'wishlist.php';
      var csrf = document.querySelector('input[name="csrf"]');
      form.innerHTML = '<input type="hidden" name="action" value="toggle"><input type="hidden" name="id" value="' + id + '">' + (csrf ? csrf.outerHTML : '');
      document.body.appendChild(form);
      form.submit();
    });
  });

  /* ── Toastها ──────────────────────────────────── */
  var toasts = document.querySelectorAll('.toast');
  toasts.forEach(function (t) {
    window.setTimeout(function () { t.classList.add('toast-out'); }, 3400);
    t.addEventListener('animationend', function () { if (t.classList.contains('toast-out')) { t.remove(); } });
  });

  /* ── پاپ‌آپ قابل مدیریت ───────────────────── */
  document.querySelectorAll('.mm-popup').forEach(function (p) {
    var key = 'mm_popup_' + p.id, once = p.getAttribute('data-once') === '1';
    try { if (once && localStorage.getItem(key) === '1') return; } catch (e) {}
    window.setTimeout(function () { p.hidden = false; }, (parseInt(p.getAttribute('data-delay'), 10) || 0) * 1000);
    p.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', function () { p.hidden = true; try { localStorage.setItem(key, '1'); } catch (e) {} }); });
  });

  /* ── سایه سربرگ هنگام اسکرول ───────────────────── */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 20); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
