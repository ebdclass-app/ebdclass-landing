/* EBD Class — landing page. Sem dependências.
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
  // ID do Pixel da Meta (Meta Business > Gerenciador de Eventos > Fontes de dados). Só números.
  // Vazio = não carrega nada. Antes de preencher, veja "Pixel da Meta" no README (cookies e Política).
  var META_PIXEL_ID = '1123546126807480';
  var APP_SIGNUP = 'https://app.ebdclass.com.br/cadastro';
  var debug = /[?&]ebd_debug=1/.test(location.search);

  function track(name, params) {
    params = params || {};
    var payload = { event: name };
    for (var k in params) payload[k] = params[k];
    w.dataLayer.push(payload);
    try { if (w.umami && typeof w.umami.track === 'function') w.umami.track(name, params); } catch (e) {}
    try { metaTrack(name, params); } catch (e) {}
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

  /* ---------- Cookies e Pixel da Meta ----------
   * O Pixel só carrega depois de o visitante clicar em "Aceitar" no aviso. A escolha
   * fica no cookie ebd_cookies (sim/nao), do domínio ebdclass.com.br, e vale também
   * para o app (lib/consentimento-cookies.ts no ebdclass-app). Sem META_PIXEL_ID não
   * há aviso, nem cookie, nem link "Cookies" no rodapé. */
  var PIXEL_ON = /^\d{5,20}$/.test(META_PIXEL_ID);
  var COOKIE_ESCOLHA = 'ebd_cookies';

  function lerEscolha() {
    var m = doc.cookie.match(new RegExp('(?:^|;\\s*)' + COOKIE_ESCOLHA + '=(sim|nao)(?:;|$)'));
    return m ? m[1] : '';
  }
  function gravarEscolha(v) {
    var c = COOKIE_ESCOLHA + '=' + v + '; Max-Age=15552000; Path=/; SameSite=Lax'; // 180 dias
    if (location.protocol === 'https:') c += '; Secure';
    if (/(^|\.)ebdclass\.com\.br$/.test(location.hostname)) c += '; Domain=.ebdclass.com.br';
    try { doc.cookie = c; } catch (e) {}
  }
  function apagarCookiesDaMeta() {
    ['_fbp', '_fbc'].forEach(function (n) {
      doc.cookie = n + '=; Max-Age=0; Path=/';
      if (/(^|\.)ebdclass\.com\.br$/.test(location.hostname)) doc.cookie = n + '=; Max-Age=0; Path=/; Domain=.ebdclass.com.br';
    });
  }

  function carregarPixel() {
    // Código padrão do Pixel da Meta. A visita (PageView) é registrada ao carregar.
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(w, doc, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    w.fbq('init', META_PIXEL_ID);
    w.fbq('track', 'PageView');
  }

  function mostrarAviso() {
    if (doc.getElementById('aviso-cookies')) return;
    var box = doc.createElement('div');
    box.id = 'aviso-cookies';
    box.className = 'cookie';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Aviso de cookies');
    box.innerHTML =
      '<p>Usamos cookies para medir quais anúncios trazem visitas ao EBD Class. ' +
      'É opcional: o sistema funciona igual sem eles. <a href="privacidade.html#cookies">Saiba mais</a></p>' +
      '<div class="cookie-btns">' +
      '<button type="button" class="btn btn-outline btn-sm" data-escolha="nao">Prefiro não</button>' +
      '<button type="button" class="btn btn-primary btn-sm" data-escolha="sim">OK, aceito</button>' +
      '</div>';
    box.addEventListener('click', function (ev) {
      var b = ev.target.closest('button[data-escolha]');
      if (!b) return;
      var anterior = lerEscolha();
      var v = b.getAttribute('data-escolha');
      gravarEscolha(v);
      box.remove();
      if (v === 'sim') {
        if (typeof w.fbq !== 'function') carregarPixel();
      } else if (anterior === 'sim' || typeof w.fbq === 'function') {
        // Revogou depois de ter aceitado: apaga os cookies da Meta e recarrega sem o Pixel.
        apagarCookiesDaMeta();
        location.reload();
      }
    });
    doc.body.appendChild(box);
  }

  if (PIXEL_ON) {
    if (lerEscolha() === 'sim') carregarPixel();
    else if (lerEscolha() === '') mostrarAviso();
    var prefs = doc.getElementById('cookie-prefs');
    if (prefs) {
      prefs.hidden = false;
      prefs.addEventListener('click', function (ev) { ev.preventDefault(); mostrarAviso(); });
    }
  }

  // Só dois eventos vão à Meta: o clique no WhatsApp (Contact) e o clique em
  // "teste grátis" (evento próprio, para montar público de remarketing).
  // O cadastro em si é registrado dentro do app (CompleteRegistration).
  function metaTrack(name, params) {
    if (typeof w.fbq !== 'function') return;
    if (name === 'whatsapp_click') w.fbq('track', 'Contact');
    else if (name === 'cta_click' && params.destination === 'signup') w.fbq('trackCustom', 'CtaSignupClick', { section: params.section || '' });
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
  // Demonstração: no celular, carrossel de arrastar com pontos; no computador, abas ao lado de uma tela por vez.
  // (Não chamar a variável de "track": ela apagaria a função track() acima e quebraria os eventos.)
  var demoTrack = doc.getElementById('demo-track');
  var demoNav = doc.getElementById('demo-nav');
  var demoBox = doc.getElementById('demo');
  var tabsBox = doc.getElementById('demo-tabs');
  if (demoTrack && demoBox && tabsBox) {
    var telas = demoTrack.querySelectorAll('.feat');
    var abas = [];
    function abrirTela(i, foco) {
      telas.forEach(function (t, k) { t.classList.toggle('is-on', k === i); });
      abas.forEach(function (a, k) { a.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      if (foco) abas[i].focus();
    }
    telas.forEach(function (tela, i) {
      var b = doc.createElement('button');
      b.type = 'button';
      var tag = doc.createElement('small');
      tag.textContent = tela.querySelector('.feat-tag').textContent;
      var titulo = doc.createElement('b');
      titulo.textContent = tela.querySelector('h3').textContent;
      b.appendChild(tag);
      b.appendChild(titulo);
      b.addEventListener('click', function () {
        abrirTela(i);
        track('demo_tab', { screen: titulo.textContent });
      });
      b.addEventListener('keydown', function (e) {
        var n = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (!n) return;
        e.preventDefault();
        abrirTela((i + n + telas.length) % telas.length, true);
      });
      tabsBox.appendChild(b);
      abas.push(b);
    });
    tabsBox.hidden = false;
    demoBox.classList.add('tabs-on');
    abrirTela(0);
  }
  if (demoTrack && demoNav) {
    var cards = demoTrack.querySelectorAll('.feat');
    var dotsBox = demoNav.querySelector('.demo-dots');
    var dots = [];
    cards.forEach(function (card, i) {
      var b = doc.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Tela ' + (i + 1) + ' de ' + cards.length + ': ' + card.querySelector('h3').textContent);
      b.addEventListener('click', function () { demoTrack.scrollTo({ left: card.offsetLeft - demoTrack.offsetLeft - parseFloat(getComputedStyle(demoTrack).scrollPaddingLeft || 0), behavior: 'smooth' }); });
      dotsBox.appendChild(b);
      dots.push(b);
    });
    var atual = -1;
    function marcar() {
      var passo = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
      var i = Math.max(0, Math.min(cards.length - 1, Math.round(demoTrack.scrollLeft / passo)));
      if (i === atual) return;
      atual = i;
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    }
    demoTrack.addEventListener('scroll', marcar, { passive: true });
    demoNav.hidden = false;
    marcar();
  }

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
