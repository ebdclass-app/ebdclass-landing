/* EBDClass — landing page. Sem dependências.
 *
 * Rastreamento: os eventos abaixo vão para window.dataLayer e, se existirem,
 * para umami.track(), gtag() ou plausible(). A análise é o Umami Cloud, que não
 * usa cookies (não exige aviso de cookies). Ele só é carregado quando
 * UMAMI_WEBSITE_ID está preenchido — veja o README, seção "Medição".
 *
 * Eventos: cta_click, login_click, whatsapp_click, play_store_click,
 *          plan_cycle_toggle, faq_open, section_view.
 */
(function () {
  'use strict';

  var w = window;
  var doc = document;
  w.dataLayer = w.dataLayer || [];

  // ID do site no Umami Cloud (cloud.umami.is > Settings > Websites). Vazio = não carrega nada.
  var UMAMI_WEBSITE_ID = 'c4eb020a-d33b-4696-b059-3e939a637ae1';
  var APP_SIGNUP = 'https://app.ebdclass.com.br/cadastro';
  var debug = /[?&]ebd_debug=1/.test(location.search);

  function track(name, params) {
    params = params || {};
    var payload = { event: name };
    for (var k in params) payload[k] = params[k];
    w.dataLayer.push(payload);
    try { if (w.umami && typeof w.umami.track === 'function') w.umami.track(name, params); } catch (e) {}
    try { if (typeof w.gtag === 'function') w.gtag('event', name, params); } catch (e) {}
    try { if (typeof w.plausible === 'function') w.plausible(name, { props: params }); } catch (e) {}
    if (debug && w.console) console.log('[ebd-track]', name, params);
  }
  w.ebdTrack = track;

  if (UMAMI_WEBSITE_ID) {
    var u = doc.createElement('script');
    u.defer = true;
    u.src = 'https://cloud.umami.is/script.js';
    u.setAttribute('data-website-id', UMAMI_WEBSITE_ID);
    u.setAttribute('data-domains', 'ebdclass.com.br'); // ignora localhost e prévias
    u.setAttribute('data-do-not-track', 'true');
    doc.head.appendChild(u);
  }

  function sectionOf(el) {
    var s = el.closest('[data-section]');
    return s ? s.getAttribute('data-section') : (el.closest('header') ? 'nav' : (el.closest('footer') ? 'footer' : ''));
  }

  /* ---------- Menu mobile ---------- */
  var nav = doc.querySelector('.nav');
  var burger = doc.querySelector('.burger');
  var menu = doc.getElementById('menu');
  function setMenu(open) {
    if (!burger || !menu) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('open', open);
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  }
  function onScroll() { if (nav) nav.classList.toggle('scrolled', w.scrollY > 8); }
  w.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Links para o cadastro: carrega UTMs e identifica o botão ---------- */
  var incoming = new URLSearchParams(location.search);
  var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var hasUtm = utmKeys.some(function (k) { return incoming.has(k); });
  doc.querySelectorAll('a[href^="' + APP_SIGNUP + '"]').forEach(function (a) {
    var url = new URL(a.href);
    if (hasUtm) {
      utmKeys.forEach(function (k) { if (incoming.has(k)) url.searchParams.set(k, incoming.get(k)); });
    } else {
      url.searchParams.set('utm_source', 'site');
      url.searchParams.set('utm_medium', 'landing');
      url.searchParams.set('utm_campaign', 'cadastro');
    }
    // utm_content identifica qual botão da página originou o cadastro
    if (!url.searchParams.has('utm_content') && a.dataset.cta) url.searchParams.set('utm_content', a.dataset.cta);
    a.href = url.toString();
  });

  /* ---------- Cliques ---------- */
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    if (a.dataset.cta) {
      var dest = a.getAttribute('href') || '';
      track('cta_click', {
        cta_id: a.dataset.cta,
        cta_text: (a.textContent || '').replace(/\s+/g, ' ').trim(),
        destination: dest.indexOf(APP_SIGNUP) === 0 ? 'signup' : 'anchor',
        section: sectionOf(a)
      });
    } else if (a.dataset.track) {
      track(a.dataset.track, { where: a.dataset.where || sectionOf(a) });
    }
  });

  /* ---------- Planos: mensal / anual ---------- */
  var cycleBtns = doc.querySelectorAll('.cycle button');
  var tiers = doc.querySelectorAll('.tier[data-m]');
  function setCycle(c) {
    cycleBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.cycle === c ? 'true' : 'false'); });
    tiers.forEach(function (t) {
      var price = c === 'anual' ? t.dataset.a : t.dataset.m;
      t.querySelector('.tier-price b').textContent = 'R$ ' + price;
      t.querySelector('.tier-price span').textContent = c === 'anual' ? '/ano' : '/mês';
      var sub = t.querySelector('.tier-sub');
      if (!sub.dataset.orig) sub.dataset.orig = sub.textContent;
      sub.textContent = c === 'anual' ? 'Equivale a R$ ' + t.dataset.m + ' por mês' : sub.dataset.orig;
    });
  }
  cycleBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.getAttribute('aria-pressed') === 'true') return;
      setCycle(b.dataset.cycle);
      track('plan_cycle_toggle', { cycle: b.dataset.cycle });
    });
  });

  /* ---------- FAQ ---------- */
  doc.querySelectorAll('.faq details').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) track('faq_open', { question: d.querySelector('summary').textContent.trim() });
    });
  });

  /* ---------- Entrada suave e visualização de seções ---------- */
  var reduced = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in w) {
    if (!reduced) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      doc.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
    } else {
      doc.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
    }
    var seen = {};
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var id = en.target.getAttribute('data-section');
        if (en.isIntersecting && !seen[id]) { seen[id] = 1; track('section_view', { section: id }); so.unobserve(en.target); }
      });
    }, { threshold: 0, rootMargin: '-45% 0px -45% 0px' }); // a seção cruza a faixa central da tela
    doc.querySelectorAll('[data-section]').forEach(function (el) { so.observe(el); });
  } else {
    doc.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
  }
})();
