/*! Fixs.Arts Welcome Widget · Model1 v1.1.0 · Vanilla JS, tanpa dependensi */
(function (w) {
  'use strict';
  var G = 'FixsArtsWelcome', d = w.document, TAG = '[' + G + '] ';
  if (w[G] && w[G].version) return;                          // script dimuat dua kali: abaikan
  var queue = Array.isArray(w[G]) ? w[G] : [];               // dukungan pemanggilan async: FixsArtsWelcome.push([...])
  var FONT = 'Inter,"Segoe UI",Roboto,system-ui,-apple-system,sans-serif';

  /* ===== 1. DEFAULT & PRESET ===== */
  var DEFAULTS = {
    theme: 'dark',
    title: 'Welcome!', subtitle: '', description: 'Welcome to our website.', info: '',
    align: 'center',
    closeButton: true, closeOnOverlay: true, closeOnEsc: true, lockScroll: true,
    autoOpen: true, delay: 300, once: false, storageKey: 'fxw-seen',
    zIndex: 2147483000, container: null, fontFamily: '', onOpen: null, onClose: null,
    size: { width: 460, height: 'auto' },
    shape: 'rounded', radius: 24, padding: 32, gap: 14, opacity: 1,
    show: { image: true, subtitle: true, title: true, description: true, info: true, buttons: true },
    text: {
      title: { size: 34, color: '', weight: 700 },
      subtitle: { size: 12, color: '', weight: 600 },
      description: { size: 15.5, color: '', weight: 400 },
      info: { size: 13, color: '', weight: 400 }
    },
    colors: { background: '#0b0b10', text: '#f5f5f7', muted: '#a1a1b0', accent: '#7c5cff', accent2: '#2f7bff', border: '#ffffff', overlay: '#000000' },
    gradient: { enabled: false, from: '#2f7bff', to: '#7c5cff', angle: 135 },
    backgroundImage: { src: '', size: 'cover', position: 'center', dim: 0.45 },
    image: { src: '', alt: '', height: 0, radius: 16, fit: 'cover', posX: 50, posY: 50, zoom: 1, width: 100, align: 'center', order: 'top', bleed: false },   // height 0 = otomatis (rasio asli)
    buttons: [], buttonsAlign: 'center',
    effects: {
      overlay: { enabled: true, opacity: 0.6 },
      blur: { enabled: false, amount: 6 },          // blur layar penuh berat di web yang banyak animasi: default mati
      glass: { enabled: false, blur: 18, opacity: 0.12 },
      animation: { type: 'scale', duration: 350 },
      shadow: { enabled: true, color: '#000000', blur: 60, opacity: 0.5 },
      glow: { enabled: false, color: '#7c5cff', size: 40 },
      border: { enabled: true, width: 1, opacity: 0.12, style: 'solid' }
    },
    audio: { src: '', autoplay: true, volume: 0.6, muted: false, loop: false, controls: true },
    credit: { enabled: true, text: 'Powered by Fixs.Arts', href: '', color: '#8b8b9c', size: 11, position: 'center' }
  };
  var PRESETS = {
    dark: {},
    light: { colors: { background: '#ffffff', text: '#0b0b10', muted: '#5f6270', border: '#0b0b10', overlay: '#0b0b10' }, effects: { shadow: { opacity: 0.25 }, border: { opacity: 0.14 } }, credit: { color: '#7b7b8a' } },
    glass: { colors: { background: '#ffffff', text: '#ffffff', muted: '#dcdce8', border: '#ffffff' }, effects: { glass: { enabled: true }, overlay: { opacity: 0.45 }, border: { opacity: 0.3 } }, credit: { color: '#d0d0dc' } },
    neon: { colors: { background: '#07070d' }, gradient: { enabled: true, from: '#0b1a3d', to: '#2a0f4a' }, effects: { glow: { enabled: true, color: '#6a5cff', size: 48 }, border: { opacity: 0.35 } } },
    minimal: { shape: 'custom', radius: 6, colors: { background: '#fafafa', text: '#111111', muted: '#666666', border: '#111111', overlay: '#111111' }, effects: { animation: { type: 'fade' }, shadow: { enabled: false }, blur: { enabled: false }, border: { opacity: 0.18 } }, credit: { color: '#888888' } }
  };

  /* ===== 2. UTIL & VALIDASI ===== */
  function isO(v) { if (!v || typeof v !== 'object' || Array.isArray(v)) return false; var p = Object.getPrototypeOf(v); return p === Object.prototype || p === null; }   // objek biasa saja (elemen DOM tidak digabung)
  function merge(a, b) {
    var o = {}, k;
    for (k in a) o[k] = isO(a[k]) ? merge(a[k], {}) : a[k];
    for (k in b) { if (b[k] === undefined) continue; o[k] = isO(b[k]) ? merge(isO(o[k]) ? o[k] : {}, b[k]) : b[k]; }
    return o;
  }
  function warn(m) { if (w.console && console.warn) console.warn(TAG + m); }
  function pick(v, list, def, n) { if (list.indexOf(v) > -1) return v; if (v != null && n) warn('nilai "' + n + '" tidak valid, dipakai "' + def + '"'); return def; }
  function num(v, def, min, max, n) { var x = parseFloat(v); if (isNaN(x)) { if (v != null && n) warn('"' + n + '" harus angka'); return def; } return Math.min(max, Math.max(min, x)); }
  function col(v, def, n) {
    if (typeof v === 'string' && /^(#[0-9a-f]{3,8}|(rgba?|hsla?)\([\d\s.,%\/-]+\)|[a-z]+)$/i.test(v.trim())) return v.trim();
    if (v != null && n) warn('warna "' + n + '" tidak valid'); return def;
  }
  function url(v, n) {
    if (v == null || v === '') return '';
    v = String(v).trim();
    if (/^(javascript|vbscript|data:text)/i.test(v)) { warn('URL "' + n + '" ditolak'); return ''; }
    return v;
  }
  function cssUrl(v) { return 'url("' + v.replace(/[\s"'()\\]/g, function (c) { return '%' + c.charCodeAt(0).toString(16); }) + '")'; }
  function rgba(c, a) {
    var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c);
    if (!m) return c; var h = m[1];
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4), 16) + ',' + a + ')';
  }

  function fix(c) {
    var o = {}, k, DC = DEFAULTS.colors;
    o.theme = pick(c.theme, Object.keys(PRESETS), 'dark', 'theme');
    ['title', 'subtitle', 'description', 'info', 'fontFamily', 'storageKey'].forEach(function (x) { o[x] = c[x] == null ? '' : String(c[x]); });
    o.align = pick(c.align, ['left', 'center', 'right'], 'center', 'align');
    ['closeButton', 'closeOnOverlay', 'closeOnEsc', 'lockScroll', 'autoOpen'].forEach(function (x) { o[x] = !!c[x]; });
    o.delay = num(c.delay, 300, 0, 60000, 'delay');
    o.once = c.once === 'session' || c.once === 'forever' ? c.once : false;
    o.zIndex = num(c.zIndex, 2147483000, 0, 2147483647, 'zIndex');
    o.container = c.container || null;
    o.onOpen = typeof c.onOpen === 'function' ? c.onOpen : null;
    o.onClose = typeof c.onClose === 'function' ? c.onClose : null;
    var s = c.size || {};
    o.size = { width: num(s.width, 460, 240, 1400, 'size.width'), height: (s.height == null || s.height === 'auto') ? 'auto' : num(s.height, 'auto', 120, 1600, 'size.height') };
    o.shape = pick(c.shape, ['rectangle', 'rounded', 'pill', 'custom'], 'rounded', 'shape');
    o.radius = num(c.radius, 24, 0, 200, 'radius');
    o.padding = num(c.padding, 32, 0, 120, 'padding'); o.gap = num(c.gap, 14, 0, 60, 'gap'); o.opacity = num(c.opacity, 1, 0, 1, 'opacity');
    o.colors = {}; for (k in DC) o.colors[k] = col((c.colors || {})[k], DC[k], 'colors.' + k);
    var g = c.gradient || {};
    o.gradient = { enabled: !!g.enabled, from: col(g.from, '#2f7bff'), to: col(g.to, '#7c5cff'), angle: num(g.angle, 135, 0, 360) };
    var b = c.backgroundImage || {};
    o.backgroundImage = { src: url(b.src, 'backgroundImage.src'), size: pick(b.size, ['cover', 'contain'], 'cover'), position: /^[a-z0-9 %.-]+$/i.test(b.position || '') ? b.position : 'center', dim: num(b.dim, 0.45, 0, 1) };
    var im = c.image || {};
    o.image = {
      src: url(im.src, 'image.src'), alt: String(im.alt || ''), height: num(im.height, 0, 0, 800, 'image.height'), radius: num(im.radius, 16, 0, 80), fit: pick(im.fit, ['cover', 'contain'], 'cover'),
      posX: num(im.posX, 50, 0, 100), posY: num(im.posY, 50, 0, 100), zoom: num(im.zoom, 1, 1, 4), width: num(im.width, 100, 20, 100),
      align: pick(im.align, ['left', 'center', 'right'], 'center'), order: pick(im.order, ['top', 'bottom'], 'top'), bleed: !!im.bleed
    };
    var sw = c.show || {}, tx0 = c.text || {}, DT = DEFAULTS.text;
    o.show = {}; ['image', 'subtitle', 'title', 'description', 'info', 'buttons'].forEach(function (k) { o.show[k] = sw[k] !== false; });
    o.text = {};
    Object.keys(DT).forEach(function (k) {
      var t = tx0[k] || {};
      o.text[k] = { size: num(t.size, DT[k].size, 8, 96, 'text.' + k + '.size'), color: t.color ? col(t.color, '', 'text.' + k + '.color') : '', weight: num(t.weight, DT[k].weight, 100, 900) };
    });
    o.buttonsAlign = pick(c.buttonsAlign, ['left', 'center', 'right'], 'center', 'buttonsAlign');
    o.buttons = (Array.isArray(c.buttons) ? c.buttons : []).slice(0, 4).map(function (x) {
      x = x || {};
      return {
        label: String(x.label || 'Button'), href: url(x.href, 'button.href'), target: pick(x.target, ['_self', '_blank'], '_self'),
        color: col(x.color, o.colors.accent), textColor: col(x.textColor, '#ffffff'),
        variant: pick(x.variant, ['solid', 'outline', 'ghost', 'gradient'], 'solid'), size: pick(x.size, ['sm', 'md', 'lg'], 'md'),
        radius: num(x.radius, o.shape === 'pill' ? 999 : 12, 0, 999), close: !!x.close, onClick: typeof x.onClick === 'function' ? x.onClick : null
      };
    });
    var e = c.effects || {}, E = {};
    var ov = e.overlay || {}, bl = e.blur || {}, gl = e.glass || {}, an = e.animation || {}, sh = e.shadow || {}, gw = e.glow || {}, bd = e.border || {};
    E.overlay = { enabled: !!ov.enabled, opacity: num(ov.opacity, 0.6, 0, 1) };
    E.blur = { enabled: !!bl.enabled, amount: num(bl.amount, 6, 0, 40) };
    E.glass = { enabled: !!gl.enabled, blur: num(gl.blur, 18, 0, 60), opacity: num(gl.opacity, 0.12, 0, 1) };
    E.animation = { type: pick(an.type, ['fade', 'scale', 'slide-up', 'slide-down', 'slide-left', 'none'], 'scale', 'effects.animation.type'), duration: num(an.duration, 350, 0, 3000) };
    E.shadow = { enabled: !!sh.enabled, color: col(sh.color, '#000000'), blur: num(sh.blur, 60, 0, 200), opacity: num(sh.opacity, 0.5, 0, 1) };
    E.glow = { enabled: !!gw.enabled, color: col(gw.color, '#7c5cff'), size: num(gw.size, 40, 0, 200) };
    E.border = { enabled: !!bd.enabled, width: num(bd.width, 1, 0, 12), opacity: num(bd.opacity, 0.12, 0, 1), style: pick(bd.style, ['solid', 'dashed', 'dotted'], 'solid') };
    o.effects = E;
    var a = c.audio || {};
    o.audio = { src: url(a.src, 'audio.src'), autoplay: !!a.autoplay, volume: num(a.volume, 0.6, 0, 1), muted: !!a.muted, loop: !!a.loop, controls: !!a.controls };
    var cr = c.credit || {};
    o.credit = { enabled: !!cr.enabled, text: String(cr.text == null ? 'Powered by Fixs.Arts' : cr.text), href: url(cr.href, 'credit.href'), color: col(cr.color, '#8b8b9c'), size: num(cr.size, 11, 8, 24), position: pick(cr.position, ['left', 'center', 'right'], 'center') };
    return o;
  }
  function resolve(user) {
    var t = PRESETS[user.theme] ? user.theme : 'dark';
    return fix(merge(merge(DEFAULTS, PRESETS[t]), user));
  }

  /* ===== 3. CSS (terisolasi di Shadow DOM, prefix .fxw) ===== */
  var CSS = [
    '.ov,.ov *{box-sizing:border-box;margin:0;padding:0}',
    '.ov{position:absolute;inset:0;display:none;align-items:center;justify-content:center;padding:16px;pointer-events:auto;container-type:inline-size;font-family:var(--ff);-webkit-font-smoothing:antialiased;opacity:0;transition:opacity var(--d) ease}',
    '.ov.show{display:flex}.ov.in{opacity:1}',
    '.ovb{position:absolute;inset:0;background:var(--ov);-webkit-backdrop-filter:blur(var(--bl));backdrop-filter:blur(var(--bl))}',
    '.md{position:relative;display:flex;flex-direction:column;width:min(var(--w),100%);height:var(--h);max-height:100%;color:var(--tx);border-radius:var(--r);outline:none;transition:opacity var(--d) cubic-bezier(.2,.8,.2,1),transform var(--d) cubic-bezier(.2,.8,.2,1)}',
    '.a-fade .md{opacity:0}.a-scale .md{opacity:0;transform:scale(.92)}.a-slide-up .md{opacity:0;transform:translateY(32px)}.a-slide-down .md{opacity:0;transform:translateY(-32px)}.a-slide-left .md{opacity:0;transform:translateX(48px)}',
    '.in .md{opacity:1;transform:none}',
    '.bgl{position:absolute;inset:0;border-radius:inherit;overflow:hidden;opacity:var(--op);background:var(--bgc)}',
    '.bgi,.bgd{position:absolute;inset:0}',
    '.ct{position:relative;flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:var(--g);padding:var(--p);text-align:var(--al);align-items:var(--ai);border-radius:inherit;scrollbar-width:thin}',
    '.pill .ct{padding-left:calc(var(--p)*1.7);padding-right:calc(var(--p)*1.7)}',
    '.x{position:absolute;top:14px;right:14px;z-index:2;width:34px;height:34px;display:grid;place-items:center;border:0;border-radius:50%;cursor:pointer;color:inherit;background:rgba(127,127,127,.2);transition:background .2s,transform .2s}',
    '.x:hover{background:rgba(127,127,127,.38);transform:rotate(90deg)}',
    '.im{width:var(--iw);align-self:var(--ia);height:var(--ih);flex:none;border-radius:var(--ir);overflow:hidden;background:rgba(127,127,127,.12)}',
    '.im img{display:block;width:100%;height:100%;object-fit:var(--fit)}.im.auto{height:auto}.im.auto img{height:auto}.im.bleed{width:calc(100% + var(--p)*2);align-self:stretch;margin:calc(var(--p)*-1) calc(var(--p)*-1) 0;border-radius:0}',
    '.sb{letter-spacing:.16em;text-transform:uppercase;color:var(--ac)}',
    '.tt{line-height:1.15;letter-spacing:-.02em;overflow-wrap:anywhere}',
    '.ds{line-height:1.65;color:var(--mu);white-space:pre-line}',
    '.inf{line-height:1.55;color:var(--mu);opacity:.85;white-space:pre-line}',
    '.bts{display:flex;flex-wrap:wrap;gap:10px;width:100%;justify-content:var(--bj);margin-top:4px}',
    '.bt{font:inherit;font-weight:600;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;border:1.5px solid transparent;transition:transform .15s,filter .15s,background .15s}',
    '.bt:hover{transform:translateY(-1px);filter:brightness(1.1)}.bt:active{transform:none}',
    '.bt.z-sm{padding:8px 16px;font-size:13px}.bt.z-md{padding:11px 22px;font-size:14.5px}.bt.z-lg{padding:14px 30px;font-size:16px}',
    '.bt.solid{background:var(--bc);color:var(--bt)}.bt.outline{border-color:var(--bc);color:var(--bc);background:transparent}',
    '.bt.ghost{background:rgba(127,127,127,.18);color:var(--tx)}.bt.gradient{background:linear-gradient(135deg,var(--ac),var(--ac2));color:var(--bt)}',
    '.au{display:none;align-items:center;gap:8px;padding:5px 12px 5px 5px;border-radius:999px;background:rgba(127,127,127,.16);font-size:12px;color:var(--mu)}',
    '.ab{width:28px;height:28px;flex:none;display:grid;place-items:center;border:0;border-radius:50%;cursor:pointer;color:var(--tx);background:rgba(127,127,127,.25)}',
    '.ab:hover{background:rgba(127,127,127,.4)}.au input{width:70px;accent-color:var(--ac)}',
    '.cr{margin-top:2px;font-size:var(--cs);color:var(--cc);text-decoration:none;align-self:var(--cp)}',
    'a.cr:hover{text-decoration:underline}',
    '.x:focus-visible,.bt:focus-visible,.ab:focus-visible,.cr:focus-visible{outline:2px solid var(--ac);outline-offset:2px}',
    '@container (max-width:520px){.ov{padding:10px}.ct{padding:calc(var(--p)*.8)}.bt{flex:1 1 auto}}',
    '@media (prefers-reduced-motion:reduce){.ov,.md{transition-duration:.01ms}}'
  ].join('');

  var SVG = 'http://www.w3.org/2000/svg';
  var ICON = { play: 'M8 5v14l11-7z', pause: 'M6 5h4v14H6zm8 0h4v14h-4z', vol: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z', mute: 'M3 9v6h4l5 5V4L7 9H3zm14 0l5 6m0-6l-5 6', x: 'M6 6l12 12M18 6L6 18' };
  function icon(name) {
    var s = d.createElementNS(SVG, 'svg'), p = d.createElementNS(SVG, 'path'), line = name === 'x' || name === 'mute';
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('width', '16'); s.setAttribute('height', '16'); s.setAttribute('aria-hidden', 'true');
    p.setAttribute('d', ICON[name]);
    if (name === 'x') { p.setAttribute('fill', 'none'); p.setAttribute('stroke', 'currentColor'); p.setAttribute('stroke-width', '2'); p.setAttribute('stroke-linecap', 'round'); }
    else p.setAttribute('fill', 'currentColor');
    if (name === 'mute') { p.setAttribute('stroke', 'currentColor'); p.setAttribute('stroke-width', '2'); p.setAttribute('stroke-linecap', 'round'); }
    s.appendChild(p); return s;
  }
  function el(tag, cls, parent, text) {
    var n = d.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text;
    if (parent) parent.appendChild(n); return n;
  }

  /* ===== 4. STATE ===== */
  var user = {}, cfg = resolve({}), alive = false, mounted = false, isOpen = false, wantOpen = false;
  var host, shadow, ov, md, ui = {}, closeT, lastFocus, prevOverflow, prevPos, contEl;
  var au = null, auSrc = '', blocked = false, userPaused = false;

  /* ===== 5. AUDIO (hanya aktif saat modal tampil, fallback jika autoplay diblokir) ===== */
  function audioSync() {
    var a = cfg.audio;
    if (!a.src) { audioKill(); return; }
    if (!au || auSrc !== a.src) {
      audioKill(); au = new w.Audio(); au.preload = 'auto'; au.src = a.src; auSrc = a.src; blocked = false; userPaused = false;
      ['play', 'pause', 'ended', 'volumechange'].forEach(function (ev) { au.addEventListener(ev, paintAudio); });
      if (isOpen && a.autoplay) audioPlay();
    }
    au.loop = a.loop; au.volume = a.volume; au.muted = a.muted;
  }
  function audioKill() { if (au) { try { au.pause(); } catch (e) {} au.removeAttribute('src'); au = null; auSrc = ''; } blocked = false; }
  function audioPlay() {
    if (!au) return;
    var p; try { p = au.play(); } catch (e) {}
    if (p && p.catch) p.catch(function () { blocked = true; paintAudio(); });   // autoplay diblokir: tampilkan tombol play
    else if (p) blocked = false;
  }
  function audioStop() { if (au) { try { au.pause(); au.currentTime = 0; } catch (e) {} } blocked = false; userPaused = false; paintAudio(); }
  function paintAudio() {
    if (!ui.bar) return;
    var on = au && !au.paused;
    ui.bar.style.display = (cfg.audio.src && (cfg.audio.controls || blocked)) ? 'flex' : 'none';
    ui.play.replaceChildren(icon(on ? 'pause' : 'play')); ui.play.setAttribute('aria-label', on ? 'Jeda audio' : 'Putar audio');
    ui.lbl.textContent = blocked && !on ? 'Ketuk untuk memutar suara' : 'Audio';
    ui.mute.replaceChildren(icon(au && au.muted ? 'mute' : 'vol')); ui.mute.setAttribute('aria-label', au && au.muted ? 'Aktifkan suara' : 'Matikan suara');
    if (au) ui.vol.value = au.volume;
  }

  /* ===== 6. RENDER ===== */
  function build() {
    var c = cfg, E = c.effects, C = c.colors, s, cls = 'ov a-' + E.animation.type + (c.shape === 'pill' ? ' pill' : '');
    if (ov) ov.remove();
    ov = el('div', cls, shadow); s = ov.style; ui = {};
    var set = function (k, v) { s.setProperty('--' + k, v); };
    set('ff', c.fontFamily || FONT); set('d', E.animation.type === 'none' ? '0ms' : E.animation.duration + 'ms');
    set('ov', E.overlay.enabled ? rgba(C.overlay, E.overlay.opacity) : 'transparent'); set('bl', (E.blur.enabled ? E.blur.amount : 0) + 'px');
    set('w', c.size.width + 'px'); set('h', c.size.height === 'auto' ? 'auto' : c.size.height + 'px');
    set('r', (c.shape === 'rectangle' ? 0 : c.shape === 'pill' ? 999 : c.radius) + 'px');
    set('p', c.padding + 'px'); set('g', c.gap + 'px'); set('op', c.opacity);
    set('tx', C.text); set('mu', C.muted); set('ac', C.accent); set('ac2', C.accent2);
    set('al', c.align); set('ai', { left: 'flex-start', center: 'center', right: 'flex-end' }[c.align]); set('bj', { left: 'flex-start', center: 'center', right: 'flex-end' }[c.buttonsAlign]);
    set('ih', c.image.height ? c.image.height + 'px' : 'auto'); set('ir', c.image.radius + 'px'); set('fit', c.image.fit); set('iw', c.image.width + '%'); set('ia', { left: 'flex-start', center: 'center', right: 'flex-end' }[c.image.align]);
    set('cs', c.credit.size + 'px'); set('cc', c.credit.color); set('cp', { left: 'flex-start', center: 'center', right: 'flex-end' }[c.credit.position]);
    var bg = C.background;
    if (E.glass.enabled) bg = rgba(C.background, E.glass.opacity);
    else if (c.gradient.enabled) bg = 'linear-gradient(' + c.gradient.angle + 'deg,' + c.gradient.from + ',' + c.gradient.to + ')';
    set('bgc', bg);

    var back = el('div', 'ovb', ov);
    back.addEventListener('click', function () { if (c.closeOnOverlay) close(); });
    md = el('div', 'md', ov); md.setAttribute('role', 'dialog'); md.setAttribute('aria-modal', 'true'); md.setAttribute('aria-labelledby', 'fxw-title'); md.tabIndex = -1;
    var sh = [];
    if (E.shadow.enabled) sh.push('0 24px ' + E.shadow.blur + 'px ' + rgba(E.shadow.color, E.shadow.opacity));
    if (E.glow.enabled) sh.push('0 0 ' + E.glow.size + 'px ' + rgba(E.glow.color, 0.55));
    md.style.boxShadow = sh.join(',') || 'none';
    md.style.border = E.border.enabled && E.border.width ? E.border.width + 'px ' + E.border.style + ' ' + rgba(C.border, E.border.opacity) : '0';

    var bgl = el('div', 'bgl', md);
    if (c.backgroundImage.src) {
      var bi = el('div', 'bgi', bgl);
      bi.style.backgroundImage = cssUrl(c.backgroundImage.src); bi.style.backgroundSize = c.backgroundImage.size; bi.style.backgroundPosition = c.backgroundImage.position;
      el('div', 'bgd', bgl).style.background = 'rgba(0,0,0,' + c.backgroundImage.dim + ')';
    }
    if (E.glass.enabled) { var gb = 'blur(' + E.glass.blur + 'px) saturate(1.5)'; bgl.style.backdropFilter = gb; bgl.style.webkitBackdropFilter = gb; }

    if (c.closeButton) {
      var x = el('button', 'x', md); x.type = 'button'; x.setAttribute('aria-label', 'Tutup'); x.appendChild(icon('x'));
      x.addEventListener('click', close);
    }
    var ct = el('div', 'ct', md), S = c.show, T = c.text, I = c.image;
    function addImage() {
      if (!S.image || !I.src) return;
      var fr = el('div', 'im' + (I.height ? '' : ' auto') + (I.bleed && I.order === 'top' ? ' bleed' : ''), ct), im = el('img', null, fr), pos = I.posX + '% ' + I.posY + '%';
      im.alt = I.alt; im.src = I.src; im.style.objectPosition = pos;
      if (I.zoom !== 1) { im.style.transform = 'scale(' + I.zoom + ')'; im.style.transformOrigin = pos; }
      im.addEventListener('error', function () { fr.style.display = 'none'; });
    }
    function addText(tag, cls, key, text) {
      if (!S[key] || !text) return null;
      var n = el(tag, cls, ct, text), st = T[key];
      n.style.fontSize = key === 'title' ? 'min(' + st.size + 'px,9.5cqw)' : st.size + 'px'; n.style.fontWeight = st.weight;
      if (st.color) n.style.color = st.color; return n;
    }
    if (I.order === 'top') addImage();
    addText('div', 'sb', 'subtitle', c.subtitle);
    var t = addText('h2', 'tt', 'title', c.title);
    if (t) t.id = 'fxw-title'; else { md.removeAttribute('aria-labelledby'); md.setAttribute('aria-label', 'Dialog'); }
    addText('p', 'ds', 'description', c.description); addText('p', 'inf', 'info', c.info);
    if (I.order !== 'top') addImage();
    if (S.buttons && c.buttons.length) {
      var row = el('div', 'bts', ct);
      c.buttons.forEach(function (b) {
        var n = b.href ? el('a', 'bt ' + b.variant + ' z-' + b.size, row, b.label) : el('button', 'bt ' + b.variant + ' z-' + b.size, row, b.label);
        if (b.href) { n.href = b.href; n.target = b.target; if (b.target === '_blank') n.rel = 'noopener noreferrer'; } else n.type = 'button';
        n.style.setProperty('--bc', b.color); n.style.setProperty('--bt', b.textColor); n.style.borderRadius = b.radius + 'px';
        n.addEventListener('click', function () { if (b.onClick) { try { b.onClick(api); } catch (e) { warn(e.message); } } if (b.close) close(); });
      });
    }
    if (c.audio.src) {
      ui.bar = el('div', 'au', ct);
      ui.play = el('button', 'ab', ui.bar); ui.play.type = 'button';
      ui.lbl = el('span', null, ui.bar);
      ui.mute = el('button', 'ab', ui.bar); ui.mute.type = 'button';
      ui.vol = el('input', null, ui.bar); ui.vol.type = 'range'; ui.vol.min = 0; ui.vol.max = 1; ui.vol.step = 0.05; ui.vol.setAttribute('aria-label', 'Volume');
      ui.play.addEventListener('click', function () {
        if (au && !au.paused) { userPaused = true; au.pause(); } else { userPaused = false; audioPlay(); }
      });
      ui.mute.addEventListener('click', function () { if (au) au.muted = !au.muted; });
      ui.vol.addEventListener('input', function () { if (au) { au.volume = +ui.vol.value; if (au.volume > 0) au.muted = false; } });
      ov.addEventListener('pointerdown', function () { if (isOpen && blocked && !userPaused) audioPlay(); }, { once: true });   // retry setelah interaksi pertama
    }
    if (c.credit.enabled && c.credit.text) {
      var cr = c.credit.href ? el('a', 'cr', ct, c.credit.text) : el('span', 'cr', ct, c.credit.text);
      if (c.credit.href) { cr.href = c.credit.href; cr.target = '_blank'; cr.rel = 'noopener noreferrer'; }
    }
    host.style.zIndex = c.zIndex;
    if (isOpen) ov.classList.add('show', 'in');
    paintAudio();
  }

  /* ===== 7. OPEN / CLOSE ===== */
  function seen() { try { return cfg.once && (cfg.once === 'session' ? w.sessionStorage : w.localStorage).getItem(cfg.storageKey) === '1'; } catch (e) { return false; } }
  function markSeen() { if (!cfg.once) return; try { (cfg.once === 'session' ? w.sessionStorage : w.localStorage).setItem(cfg.storageKey, '1'); } catch (e) {} }
  function onKey(e) {
    if (!isOpen) return;
    if (e.key === 'Escape' && cfg.closeOnEsc) { close(); return; }
    if (e.key !== 'Tab') return;
    var f = [].filter.call(md.querySelectorAll('button,a[href],input'), function (n) { return n.getClientRects().length; });
    if (!f.length) return;
    var i = f.indexOf(shadow.activeElement);
    if (e.shiftKey && i <= 0) { f[f.length - 1].focus(); e.preventDefault(); }
    else if (!e.shiftKey && i === f.length - 1) { f[0].focus(); e.preventDefault(); }
  }
  function open() {
    if (!alive) return api;
    if (!mounted) { wantOpen = true; return api; }
    if (isOpen) return api;
    clearTimeout(closeT); isOpen = true;
    lastFocus = d.activeElement;
    if (cfg.lockScroll && !contEl) { prevOverflow = d.documentElement.style.overflow; d.documentElement.style.overflow = 'hidden'; }
    ov.classList.add('show'); void ov.offsetWidth;
    w.requestAnimationFrame(function () { if (isOpen) { ov.classList.add('in'); md.focus({ preventScroll: true }); } });
    if (cfg.audio.src && cfg.audio.autoplay) { userPaused = false; audioPlay(); }
    markSeen(); paintAudio();
    if (cfg.onOpen) { try { cfg.onOpen(api); } catch (e) { warn(e.message); } }
    return api;
  }
  function close() {
    wantOpen = false;
    if (!isOpen) return api;
    isOpen = false; ov.classList.remove('in'); audioStop();
    if (cfg.lockScroll && !contEl) d.documentElement.style.overflow = prevOverflow || '';
    var o = ov; closeT = setTimeout(function () { if (!isOpen) o.classList.remove('show'); }, (cfg.effects.animation.type === 'none' ? 0 : cfg.effects.animation.duration) + 30);
    try { if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); } catch (e) {}
    if (cfg.onClose) { try { cfg.onClose(api); } catch (e) { warn(e.message); } }
    return api;
  }

  /* ===== 8. LIFECYCLE ===== */
  function whenReady(fn) { if (d.body) fn(); else d.addEventListener('DOMContentLoaded', fn, { once: true }); }
  function mount() {
    if (!alive || mounted) return;
    contEl = typeof cfg.container === 'string' ? d.querySelector(cfg.container) : cfg.container;
    if (contEl && !(contEl.nodeType === 1)) contEl = null;
    host = d.createElement('div'); host.id = 'fxw-host'; host.setAttribute('data-fixsarts-welcome', '');
    host.style.cssText = 'all:initial;position:' + (contEl ? 'absolute' : 'fixed') + ';inset:0;pointer-events:none;';
    shadow = host.attachShadow({ mode: 'open' });
    var st = d.createElement('style'); st.textContent = CSS; shadow.appendChild(st);
    var parent = contEl || d.body;
    if (contEl && w.getComputedStyle(contEl).position === 'static') { prevPos = contEl.style.position; contEl.style.position = 'relative'; }
    parent.appendChild(host);
    mounted = true; build(); audioSync();
    d.addEventListener('keydown', onKey, true);
    if (wantOpen || (cfg.autoOpen && !seen())) {
      if (wantOpen) open(); else setTimeout(function () { if (alive && !isOpen && !wantOpenCancelled) open(); }, cfg.delay);
    }
  }
  var wantOpenCancelled = false;

  function init(c) {
    c = isO(c) ? c : {};
    if (alive) { update(c); return api; }                    // cegah modal ganda: pemanggilan ulang hanya memperbarui
    alive = true; wantOpenCancelled = false; user = merge({}, c); cfg = resolve(user);
    whenReady(mount);
    return api;
  }
  function update(c, opts) {
    c = isO(c) ? c : {};
    user = opts && opts.replace ? merge({}, c) : merge(user, c);
    cfg = resolve(user);
    if (alive && mounted) { build(); audioSync(); }
    return api;
  }
  function destroy() {
    if (!alive) return api;
    wantOpenCancelled = true; clearTimeout(closeT);
    if (isOpen && cfg.lockScroll && !contEl) d.documentElement.style.overflow = prevOverflow || '';
    audioKill(); d.removeEventListener('keydown', onKey, true);
    if (host && host.parentNode) host.parentNode.removeChild(host);
    if (contEl && prevPos != null) { contEl.style.position = prevPos; prevPos = null; }
    alive = mounted = isOpen = wantOpen = false; host = shadow = ov = md = null; ui = {};
    return api;
  }

  var api = {
    version: '1.1.0',
    init: init, open: open, close: close, destroy: destroy, update: update,
    isOpen: function () { return isOpen; },
    getConfig: function () { return JSON.parse(JSON.stringify(cfg)); },
    getPreset: function (n) { return JSON.parse(JSON.stringify(resolve({ theme: n }))); },
    presets: Object.keys(PRESETS),
    push: function (cmd) { if (Array.isArray(cmd) && typeof api[cmd[0]] === 'function' && cmd[0] !== 'push') return api[cmd[0]].apply(api, cmd.slice(1)); }
  };
  w[G] = api;
  queue.forEach(function (cmd) { try { api.push(cmd); } catch (e) { warn(e.message); } });
})(window);
