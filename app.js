/* AdLift homepage — vanilla JS port of the Claude Design (.dc.html) component.
   Reproduces: theme/font panel (persisted), mega menu, hero chat typing,
   service accordion, process steps, case-study carousel, FAQ, teardown form. */
(function () {
  'use strict';

  var STORE_KEY = 'adlift-homepage-theme';

  var THEMES = [
    { label: 'Orange · Ivory · Ink',  v: { sup: '#2E2E2E', sup2: '#4A4A4A', sup2Ink: '#3A3A3A', onSup2: '#FFFFF7' }, sw: ['#D6682A', '#FFFFF7', '#4A4A4A'] },
    { label: 'Orange · Ivory · Sky',  v: { sup: '#17577F', sup2: '#2A97D6', sup2Ink: '#17577F', onSup2: '#FFFFF7' }, sw: ['#D6682A', '#FFFFF7', '#2A97D6'] },
    { label: 'Orange · Ivory · Teal', v: { sup: '#0F5F55', sup2: '#2AD6BF', sup2Ink: '#0F6F62', onSup2: '#10221F' }, sw: ['#D6682A', '#FFFFF7', '#2AD6BF'] },
    { label: 'All colours',           v: { sup: '#2A41D6', sup2: '#2AD6BF', sup2Ink: '#13876F', onSup2: '#10221F' }, sw: ['#D6682A', '#000080', '#2A97D6', '#2AD6BF', '#2A41D6'] }
  ];

  var FONTS = [
    { label: 'Rethink Sans + Spectral', v: ["'Rethink Sans',sans-serif", "'Spectral',serif"] },
    { label: 'Instrument Sans + Geist', v: ["'Instrument Sans',sans-serif", "'Geist',sans-serif"] },
    { label: 'Sintony + Poppins',       v: ["'Sintony',sans-serif", "'Poppins',sans-serif"] },
    { label: 'Philosopher + Mulish',    v: ["'Philosopher',serif", "'Mulish',sans-serif"] },
    { label: 'Arvo + Lato',             v: ["'Arvo',serif", "'Lato',sans-serif"] },
    { label: 'Quicksand',               v: ["'Quicksand',sans-serif", "'Quicksand',sans-serif"] }
  ];

  var Q = [
    'Does ChatGPT mention my brand?',
    'What is GEO?',
    'How is AEO different from SEO?',
    'Do you work in the US?'
  ];
  var A = [
    'We can check. A teardown shows where assistants cite you and where competitors win instead.',
    'Generative Engine Optimisation: getting your brand cited inside AI-generated answers.',
    'SEO earns rankings. AEO earns the direct answer in answer boxes and assistants.',
    'Yes. AdLift works with global brands across the US and India.'
  ];

  var SV = [
    { n: '01', title: 'SEO', full: 'Search Engine Optimisation',     short: 'Rank where people still search.',           body: 'Technical, content and authority work that keeps you ranking on Google.', tags: ['Technical SEO', 'Content', 'Links', 'Local'], viz: 'ranking visual' },
    { n: '02', title: 'AEO', full: 'Answer Engine Optimisation',     short: 'Get quoted in answer boxes and assistants.', body: 'Structure content so answer boxes and voice assistants quote you directly.', tags: ['Schema', 'FAQ content', 'Featured snippets'], viz: 'answer-box visual' },
    { n: '03', title: 'GEO', full: 'Generative Engine Optimisation', short: 'Get cited by generative engines.',           body: 'Earn citations in ChatGPT, Gemini, Perplexity and AI Overviews.', tags: ['AI citations', 'Entity building', 'Monitoring'], viz: 'AI citation visual' }
  ];

  var ST = [
    { n: '1', t: 'Audit',    d: 'Where you show up today, in search and in AI.' },
    { n: '2', t: 'Strategy', d: 'One plan across SEO, AEO and GEO.' },
    { n: '3', t: 'Build',    d: 'Content, technical fixes and authority.' },
    { n: '4', t: 'Measure',  d: 'Rankings, answer share and citations.' }
  ];

  var CS = [
    { tag: 'US · SaaS',     t: 'Client name · headline result' },
    { tag: 'India · Retail', t: 'Client name · headline result' },
    { tag: 'US · Fintech',  t: 'Client name · headline result' }
  ];

  var FQ = [
    { q: 'What is the difference between SEO, AEO and GEO?', a: 'SEO targets search rankings, AEO targets direct answers, GEO targets citations in AI-generated responses.' },
    { q: 'How long until we see results?',                  a: 'Answer to be supplied by AdLift.' },
    { q: 'Which markets do you cover?',                     a: 'Global brands across the US and India.' },
    { q: 'What does a teardown include?',                   a: 'Answer to be supplied by AdLift.' }
  ];

  var POST_TAGS = ['GEO', 'AEO', 'SEO'];
  var MEGA_DOTS = ['#D6682A', 'var(--sup2)', 'var(--sup)'];

  // ----- state -----
  var state = { theme: 3, font: 5, panelOpen: true, sv: 0, step: 0, cs: 0, fq: 0 };
  try {
    var saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (saved) { state.theme = saved.theme != null ? saved.theme : 3; state.font = saved.font != null ? saved.font : 5; }
  } catch (e) {}

  var $ = function (id) { return document.getElementById(id); };
  var el = function (tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  function applyThemeFont() {
    var r = document.documentElement.style;
    var t = THEMES[state.theme].v, f = FONTS[state.font].v;
    Object.keys(t).forEach(function (k) { r.setProperty('--' + k, t[k]); });
    r.setProperty('--fh', f[0]);
    r.setProperty('--fb', f[1]);
  }

  function persist() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ theme: state.theme, font: state.font })); } catch (e) {}
  }

  // ----- theme & font panel -----
  function renderPanel() {
    var themeWrap = $('themeOpts');
    themeWrap.innerHTML = '';
    THEMES.forEach(function (x, i) {
      var btn = el('button', 'panel-opt' + (state.theme === i ? ' active' : ''));
      btn.type = 'button';
      var sw = el('span', 'panel-sw');
      x.sw.forEach(function (c) { var s = el('span'); s.style.background = c; sw.appendChild(s); });
      btn.appendChild(sw);
      btn.appendChild(document.createTextNode(x.label));
      btn.addEventListener('click', function () { state.theme = i; applyThemeFont(); persist(); renderPanel(); });
      themeWrap.appendChild(btn);
    });

    var fontWrap = $('fontOpts');
    fontWrap.innerHTML = '';
    FONTS.forEach(function (x, i) {
      var btn = el('button', 'panel-opt' + (state.font === i ? ' active' : ''), x.label);
      btn.type = 'button';
      btn.style.fontFamily = x.v[0];
      btn.addEventListener('click', function () { state.font = i; applyThemeFont(); persist(); renderPanel(); });
      fontWrap.appendChild(btn);
    });
  }

  function setupPanel() {
    var panel = $('panel'), arrow = $('panelArrow');
    function sync() { panel.hidden = !state.panelOpen; arrow.textContent = state.panelOpen ? '▴' : '▾'; }
    $('panelToggle').addEventListener('click', function () { state.panelOpen = !state.panelOpen; sync(); });
    sync();
    renderPanel();
  }

  // ----- mega menu -----
  function setupMega() {
    var wrap = $('megaWrap'), menu = $('megaMenu'), grid = $('megaGrid');
    SV.forEach(function (m, i) {
      var a = el('a', 'mega-item');
      a.href = '#services';
      var dot = el('span', 'dot-sq'); dot.style.background = MEGA_DOTS[i];
      a.appendChild(dot);
      a.appendChild(el('span', 'mega-title', m.title));
      a.appendChild(el('span', 'mega-short', m.short));
      grid.appendChild(a);
    });
    wrap.addEventListener('mouseenter', function () { menu.hidden = false; });
    wrap.addEventListener('mouseleave', function () { menu.hidden = true; });
  }

  // ----- hero chat typing -----
  var typeTimer = null;
  function typeAnswer() {
    clearInterval(typeTimer);
    var typed = 0;
    var ans = A[state.chatQ];
    var typedEl = $('chatTyped'), caret = $('chatCaret'), sources = $('chatSources');
    typedEl.textContent = '';
    caret.style.display = '';
    sources.hidden = true;
    typeTimer = setInterval(function () {
      if (typed >= ans.length) {
        clearInterval(typeTimer);
        caret.style.display = 'none';
        sources.hidden = false;
        return;
      }
      typed = Math.min(ans.length, typed + 2);
      typedEl.textContent = ans.slice(0, typed);
    }, 22);
  }

  function setupChat() {
    state.chatQ = 0;
    $('chatQ').textContent = Q[state.chatQ];
    var chips = $('chatChips');
    Q.forEach(function (q, i) {
      var btn = el('button', 'chip' + (state.chatQ === i ? ' active' : ''), q);
      btn.type = 'button';
      btn.addEventListener('click', function () {
        state.chatQ = i;
        $('chatQ').textContent = Q[i];
        [].forEach.call(chips.children, function (c, ci) { c.classList.toggle('active', ci === i); });
        typeAnswer();
      });
      chips.appendChild(btn);
    });
    $('chatReplay').addEventListener('click', typeAnswer);
    typeAnswer();
  }

  // ----- services accordion -----
  function renderServices() {
    var list = $('svcList');
    list.innerHTML = '';
    SV.forEach(function (s, i) {
      var open = state.sv === i;
      var card = el('div', 'svc' + (open ? ' open' : ''));

      var head = el('button', 'svc-head'); head.type = 'button';
      head.appendChild(el('span', 'svc-n', s.n));
      var titles = el('span', 'svc-titles');
      titles.appendChild(el('span', 'svc-title', s.title));
      titles.appendChild(el('span', 'svc-full', s.full));
      head.appendChild(titles);
      head.appendChild(el('span', 'svc-icon', '+'));
      head.addEventListener('click', function () { state.sv = open ? -1 : i; renderServices(); });
      card.appendChild(head);

      var body = el('div', 'svc-body');
      body.hidden = !open;
      var left = el('div');
      left.appendChild(el('p', null, s.body));
      var tags = el('div', 'svc-tags');
      s.tags.forEach(function (t) { tags.appendChild(el('span', 'svc-tag', t)); });
      left.appendChild(tags);
      body.appendChild(left);
      body.appendChild(el('div', 'svc-viz', s.viz));
      card.appendChild(body);

      list.appendChild(card);
    });
  }

  // ----- process steps -----
  function renderSteps() {
    var grid = $('stepsGrid');
    grid.innerHTML = '';
    ST.forEach(function (p, i) {
      var active = state.step === i;
      var box = el('div', 'step' + (active ? ' active' : ''));
      box.appendChild(el('div', 'step-num', p.n));
      box.appendChild(el('div', 'step-t', p.t));
      box.appendChild(el('div', 'step-d', p.d));
      box.addEventListener('mouseenter', function () { if (state.step !== i) { state.step = i; renderSteps(); } });
      grid.appendChild(box);
    });
  }

  // ----- case study carousel -----
  function renderCase() {
    var c = CS[state.cs];
    $('csImg').textContent = 'case study image · ' + c.tag;
    $('csTag').textContent = c.tag;
    $('csTitle').textContent = c.t;
    var dots = $('csDots');
    dots.innerHTML = '';
    CS.forEach(function (_, i) {
      var b = el('button', 'work-dot' + (state.cs === i ? ' active' : ''));
      b.type = 'button';
      b.setAttribute('aria-label', 'Case study ' + (i + 1));
      b.addEventListener('click', function () { state.cs = i; renderCase(); });
      dots.appendChild(b);
    });
  }

  function setupCase() {
    $('csPrev').addEventListener('click', function () { state.cs = (state.cs + CS.length - 1) % CS.length; renderCase(); });
    $('csNext').addEventListener('click', function () { state.cs = (state.cs + 1) % CS.length; renderCase(); });
    renderCase();
  }

  // ----- insights -----
  function renderPosts() {
    var grid = $('postsGrid');
    POST_TAGS.forEach(function (tag, i) {
      var a = el('a', 'post'); a.href = '#insights';
      a.appendChild(el('div', 'post-img', 'article image'));
      var meta = el('div', 'post-meta');
      var tagSpan = el('span', 'post-tag', tag);
      tagSpan.style.color = ['var(--sup)', 'var(--sup2Ink)', '#B4531C'][i];
      meta.appendChild(tagSpan);
      meta.appendChild(el('span', 'post-read', '5 min read'));
      a.appendChild(meta);
      a.appendChild(el('div', 'post-title', 'Article headline'));
      grid.appendChild(a);
    });
  }

  // ----- FAQ -----
  function renderFaq() {
    var list = $('faqList');
    list.innerHTML = '';
    FQ.forEach(function (f, i) {
      var open = state.fq === i;
      var item = el('div', 'faq-item' + (open ? ' open' : ''));
      var q = el('button', 'faq-q'); q.type = 'button';
      q.appendChild(el('span', null, f.q));
      q.appendChild(el('span', 'faq-icon', '+'));
      q.addEventListener('click', function () { state.fq = open ? -1 : i; renderFaq(); });
      item.appendChild(q);
      var a = el('p', 'faq-a', f.a);
      a.hidden = !open;
      item.appendChild(a);
      list.appendChild(item);
    });
  }

  // ----- teardown form -----
  function setupTeardown() {
    var form = $('teardownForm'), note = $('teardownNote'), sent = $('teardownSent'),
        input = $('domainInput'), sentDomain = $('sentDomain');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      sentDomain.textContent = input.value.trim() || 'your domain';
      form.hidden = true; note.hidden = true; sent.hidden = false;
    });
    $('teardownReset').addEventListener('click', function () {
      input.value = '';
      form.hidden = false; note.hidden = false; sent.hidden = true;
      input.focus();
    });
  }

  // ----- init -----
  applyThemeFont();
  setupPanel();
  setupMega();
  setupChat();
  renderServices();
  renderSteps();
  setupCase();
  renderPosts();
  renderFaq();
  setupTeardown();
})();
