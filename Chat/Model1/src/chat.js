/* chat.js — widget controller + public API (window.FixsArtsChat) */
var instance = null;
var listeners = {};
var scriptEl = null;
try { scriptEl = document.currentScript; } catch (e) { /* ignore */ }

function emit(name, data) {
  (listeners[name] || []).slice().forEach(function (fn) {
    try { fn(data); } catch (e) { H.log(false, 'warn', 'listener for "' + name + '" threw: ' + e.message); }
  });
  try { window.dispatchEvent(new CustomEvent('fixsartschat:' + name, { detail: data })); } catch (e) { /* old browsers */ }
}

/* ============================================================ CSS builder */
function lum(c) {
  var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(c || '').trim());
  if (!m) return null;
  var h = m[1]; if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}
function pickTheme(c) {
  var th = C.THEMES[c.theme] || C.THEMES.dark;
  if (c.theme === 'custom' && c.appearance.background && !c.appearance.gradient.enabled) {
    var l = lum(c.appearance.background);
    if (l !== null && l > 0.62) th = C.THEMES.light;
  }
  return th;
}
function gradientCss(g) {
  if (g.css && /^(repeating-)?(linear|radial|conic)-gradient\([^;{}<>]*\)$/i.test(g.css.trim())) return g.css.trim();
  return 'linear-gradient(' + Math.round(g.angle) + 'deg,' + g.from + ',' + g.to + ')';
}
function round(n) { return Math.round(n); }
function boxShadow(strength, glow, glowColor) {
  var s = strength / 100, g = glow / 100, out = [];
  if (s > 0) out.push('0 ' + round(8 + s * 22) + 'px ' + round(24 + s * 56) + 'px -' + round(4 + s * 4) + 'px rgba(0,0,0,' + (0.18 + s * 0.5).toFixed(2) + ')');
  if (g > 0) out.push('0 0 ' + round(10 + g * 50) + 'px ' + H.alpha(glowColor, 0.25 + g * 0.5));
  return out.length ? out.join(',') : 'none';
}
function dropShadow(strength, glow, glowColor) {
  var s = strength / 100, g = glow / 100, f = [];
  if (s > 0) f.push('drop-shadow(0 ' + round(4 + s * 10) + 'px ' + round(8 + s * 20) + 'px rgba(0,0,0,' + (0.2 + s * 0.4).toFixed(2) + '))');
  if (g > 0) f.push('drop-shadow(0 0 ' + round(6 + g * 22) + 'px ' + H.alpha(glowColor, 0.35 + g * 0.45) + ')');
  return f.length ? f.join(' ') : 'none';
}
function px(n) { return round(n * 100) / 100 + 'px'; }

function buildCss(c) {
  var L = c.layout, ap = c.appearance, ty = c.typography, pr = c.profile, b = c.button, cr = c.credit, adv = c.advanced;
  var th = pickTheme(c), glass = ap.glass || c.theme === 'glass';
  var accent = ap.accent || th.accent, accent2 = ap.accent2 || th.accent2;
  var text = ty.color || th.text, muted = ty.mutedColor || th.muted, border = ap.borderColor || th.border;
  var bg = ap.gradient.enabled ? gradientCss(ap.gradient) : (ap.background || th.bg);
  var bgo = ap.opacity; if (glass && c.theme !== 'glass') bgo = Math.min(bgo, 0.62);
  var blur = ap.blur != null ? ap.blur : (glass ? Math.max(th.blur, 22) : th.blur);
  var light = th === C.THEMES.light;
  var panelGlowColor = ap.glowColor || accent, btnGlowColor = b.glowColor || accent;
  var as = H.shapeCss(pr.shape, pr.customRadius, '26%'), bs = H.shapeCss(b.shape, b.customRadius, '30%');
  var bgImg = H.safeImg(ap.backgroundImage);
  var isPill = b.shape === 'pill' && b.label;
  var bBg = b.gradient.enabled ? gradientCss(b.gradient) : (b.background || accent);
  var bi = H.shapeCss(b.imageShape === 'same' ? b.shape : b.imageShape, b.imageRadius || b.customRadius, '30%');
  var used = L.offsetY + b.size + L.panelOffset + 16;
  var v = {
    '--fx-z': L.zIndex, '--fx-ox': px(L.offsetX), '--fx-oy': px(L.offsetY), '--fx-pw': px(L.panelWidth),
    '--fx-ph': L.panelHeight > 0 ? px(L.panelHeight) : 'auto', '--fx-pad': px(L.padding), '--fx-gap': px(L.gap), '--fx-poff': px(L.panelOffset),
    '--fx-radius': px(ap.radius), '--fx-bg': bg, '--fx-bgo': bgo, '--fx-bf': blur > 0 ? 'blur(' + blur + 'px) saturate(1.5)' : 'none',
    '--fx-text': text, '--fx-muted': muted, '--fx-border': border, '--fx-bw': px(ap.borderWidth),
    '--fx-surface': th.surface, '--fx-surface2': th.surface2, '--fx-accent': accent, '--fx-accent2': accent2,
    '--fx-headbg': 'radial-gradient(120% 150% at 0% 0%,' + H.alpha(accent, light ? 0.14 : 0.24) + ',transparent 62%),radial-gradient(120% 150% at 100% 0%,' + H.alpha(accent2, light ? 0.12 : 0.2) + ',transparent 62%)',
    '--fx-shadow': (function () { var s = boxShadow(ap.shadow, ap.glow, panelGlowColor); return s; })(),
    '--fx-img': bgImg ? H.cssUrl(bgImg) : 'none', '--fx-imgo': ap.backgroundImageOpacity,
    '--fx-tipbg': light ? 'rgba(255,255,255,.94)' : 'rgba(18,18,26,.92)',
    '--fx-ff': H.fontStack(ty.fontFamily), '--fx-fs': px(ty.fontSize), '--fx-fw': ty.fontWeight, '--fx-ts': px(ty.titleSize), '--fx-tw': ty.titleWeight,
    '--fx-lh': ty.lineHeight, '--fx-ls': px(ty.letterSpacing), '--fx-align': ty.align,
    '--fx-asize': px(pr.size), '--fx-aradius': as.radius, '--fx-aclip': as.clip, '--fx-abw': pr.borderWidth > 0 ? px(pr.borderWidth) : '0px',
    '--fx-aborder': pr.borderWidth > 0 ? (pr.borderColor || 'linear-gradient(135deg,' + accent + ',' + accent2 + ')') : 'transparent',
    '--fx-afilter': dropShadow(pr.shadow, 0, accent), '--fx-afit': pr.fit,
    '--fx-bsize': px(b.size), '--fx-bradius': bs.radius, '--fx-bclip': bs.clip, '--fx-bbg': bBg, '--fx-bicon': b.iconColor,
    '--fx-bbw': b.borderWidth > 0 ? px(b.borderWidth) : '0px', '--fx-bborder': b.borderColor, '--fx-bpad': isPill ? px(b.size * 0.42) : '0px',
    '--fx-bicsz': px(b.size * b.iconSize / 100), '--fx-bo': b.opacity,
    '--fx-bfilter': dropShadow(b.shadow, b.glow, btnGlowColor),
    '--fx-bfilter-hover': dropShadow(Math.max(b.shadow, 50), Math.min(100, b.glow * 1.6 + 25), btnGlowColor),
    '--fx-bi-radius': bi.radius, '--fx-bi-clip': bi.clip, '--fx-bi-fit': b.imageFit, '--fx-bi-zoom': b.imageZoom, '--fx-bi-pos': b.imageX + '% ' + b.imageY + '%',
    '--fx-bi-pad': px(b.imagePadding), '--fx-bi-bg': b.imageBackground || 'transparent', '--fx-bi-op': b.imageOpacity,
    '--fx-bi-bw': px(b.imageBorderWidth), '--fx-bi-bc': b.imageBorderWidth > 0 ? b.imageBorderColor : 'transparent', '--fx-bi-size': px(b.size * b.imageSize / 100),
    '--fx-bstroke': b.iconStroke, '--fx-brot': b.iconRotate + 'deg',
    '--fx-azoom': pr.zoom, '--fx-apos': pr.posX + '% ' + pr.posY + '%', '--fx-abg': pr.background || th.surface2,
    '--fx-badge-bg': b.badge.color, '--fx-badge-fg': b.badge.textColor,
    '--fx-cs': px(cr.fontSize), '--fx-ca': cr.align, '--fx-cc': cr.color || muted
  };
  var css = ':host{', k;
  for (k in v) css += k + ':' + v[k] + ';';
  css += '}';
  css += '.fx-panel{max-height:calc(100vh - ' + used + 'px);max-height:calc(100dvh - ' + used + 'px);}';
  css += '@media(max-width:520px){:host{--fx-ox:' + px(Math.min(L.offsetX, 16)) + ';--fx-oy:' + px(Math.min(L.offsetY, 16)) + ';}';
  var usedM = Math.min(L.offsetY, 16) + b.size + L.panelOffset + 12;
  css += '.fx-panel{max-height:calc(100vh - ' + usedM + 'px);max-height:calc(100dvh - ' + usedM + 'px);}}';
  var d = adv.devices;
  if (!d.mobile) css += '@media(max-width:600px){.fx-root{display:none!important}}';
  if (!d.tablet) css += '@media(min-width:601px) and (max-width:1024px){.fx-root{display:none!important}}';
  if (!d.desktop) css += '@media(min-width:1025px){.fx-root{display:none!important}}';
  return css;
}

/* ============================================================ status */
var DAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
function zoned(tz) {
  try {
    var f = new Intl.DateTimeFormat('en-US', { timeZone: tz || undefined, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    var o = {}; f.formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    return { day: DAYS[o.weekday], minutes: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
  } catch (e) { var d = new Date(); return { day: d.getDay(), minutes: d.getHours() * 60 + d.getMinutes() }; }
}
function toMin(t) { var p = String(t).split(':'); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); }
function isOnline(c) {
  var s = c.status, h = c.hours;
  if (s.mode === 'online') return true;
  if (s.mode === 'offline') return false;
  var n = zoned(h.timezone);
  if (h.days.indexOf(n.day) < 0) return false;
  var st = toMin(h.start), en = toMin(h.end), m = n.minutes;
  if (st === en) return true;
  return st < en ? (m >= st && m < en) : (m >= st || m < en);
}

/* ============================================================ template */
function contactStyle(ct, i) {
  var s = ['--i:' + i], ic = H.isColor(ct.iconColor) ? ct.iconColor : (ct.__color && ct.__color !== 'currentColor' ? ct.__color : null);
  if (ic) s.push('--c-icon:' + ic);
  if (H.isColor(ct.iconBackground)) s.push('--c-ibg:' + ct.iconBackground);
  if (H.isColor(ct.background)) s.push('--c-bg:' + ct.background);
  if (H.isColor(ct.borderColor)) s.push('--c-border:' + ct.borderColor);
  return s.join(';');
}

function domSig(c) {
  var b = c.button, p = c.profile;
  return JSON.stringify([p.enabled, p.image, p.alt, p.name, p.position, c.status.showDot, c.welcome, c.hours.enabled, c.hours.label, c.hours.text,
    c.contacts, c.credit.enabled, c.credit.text, c.credit.url, c.credit.newTab, c.a11y, b.shape === 'pill', b.label, b.icon, b.customIcon, b.image,
    b.closeIcon, b.imageMode, b.badge.enabled, b.badge.text, b.tooltip.enabled, b.tooltip.text]);
}

/* contact buttons shown under the automatic reply (built from config.contacts — nothing hard-coded) */
function contactsHtml(w) {
  var a = w.cfg.a11y, label = w.cfg.welcome.contactsLabel;
  return (label ? '<div class="fx-label">' + H.esc(label) + '</div>' : '') + '<ul class="fx-list">' + w.contacts().map(function (ct, i) {
    var blank = ct.target === '_blank', sub = ct.description || ct.username || '';
    return '<li><a class="fx-contact" href="' + H.esc(ct.__url) + '" target="' + ct.target + '"' + (blank ? ' rel="noopener noreferrer"' : '') +
      ' data-act="contact" data-id="' + H.esc(ct.id) + '" data-hover="' + ct.hover + '" style="' + H.esc(contactStyle(ct, i)) + '">' +
      '<span class="fx-c-icon">' + P.iconHtml(ct) + '</span>' +
      '<span class="fx-c-text"><span class="fx-c-name">' + H.esc(ct.name) + (blank ? '<span class="fx-sr"> ' + H.esc(a.newTabLabel) + '</span>' : '') + '</span>' +
      (sub ? '<span class="fx-c-sub">' + H.esc(sub) + '</span>' : '') +
      (ct.welcomeMessage ? '<span class="fx-c-welcome">' + H.esc(ct.welcomeMessage) + '</span>' : '') + '</span>' +
      '<span class="fx-c-arrow">' + P.ui('arrow') + '</span></a></li>';
  }).join('') + '</ul>';
}
function rowHtml(w, m) {
  if (m.from === 'me') return '<div class="fx-row me"><div class="fx-bub">' + H.esc(m.text) + '</div></div>';
  return '<div class="fx-row bot"><div class="fx-bub">' + H.esc(m.text) + '</div></div>' + (m.contacts ? '<div class="fx-actions">' + contactsHtml(w) + '</div>' : '');
}
var TYPING = '<div class="fx-row bot fx-typing" aria-hidden="true"><div class="fx-bub"><i></i><i></i><i></i></div></div>';

function tpl(w) {
  var c = w.cfg, wl = c.welcome, pr = c.profile, a = c.a11y, cr = c.credit, b = c.button, h = '';

  /* ---- panel header */
  var av = '';
  if (pr.enabled) {
    var img = H.safeImg(pr.image);
    av = '<div class="fx-avwrap"><div class="fx-avatar"><div class="fx-avimg' + (img ? '' : ' is-fb') + '">' +
      (img ? '<img src="' + H.esc(img) + '" alt="' + H.esc(pr.alt) + '" decoding="async" referrerpolicy="no-referrer">' : '') +
      '<span class="fx-fb" aria-hidden="true">' + H.esc(H.initials(pr.name)) + '</span></div></div></div>';
  }
  var ctrl = '';
  if (wl.showMinimize) ctrl += '<button class="fx-ib" type="button" data-act="minimize" aria-label="' + H.esc(a.minimizeLabel) + '">' + P.ui('chevron-down') + '</button>';
  if (wl.showClose) ctrl += '<button class="fx-ib" type="button" data-act="close" aria-label="' + H.esc(a.closeLabel) + '">' + P.ui('close') + '</button>';
  var head = '<header class="fx-head" data-act="head" data-av="' + (pr.enabled ? pr.position : 'left') + '">' + av +
    '<div class="fx-id"><div class="fx-name">' + H.esc(pr.name) + '</div><div class="fx-status' + (c.status.showDot ? '' : ' no-dot') + '" data-status data-on="1" role="status"><i class="fx-dot"></i><span class="fx-sttext"></span></div></div>' +
    (ctrl ? '<div class="fx-ctrl">' + ctrl + '</div>' : '') + '</header>';

  /* ---- body: chat thread (welcome bubble + conversation so far) */
  var welcome = '';
  if (wl.title) welcome += '<strong>' + H.esc(wl.title) + '</strong>';
  [wl.message, wl.subtitle, wl.description].forEach(function (t) { if (t) welcome += '<span>' + H.esc(t) + '</span>'; });
  var body = '';
  if (c.hours.enabled && (c.hours.text || c.hours.label)) {
    body += '<div class="fx-hours">' + P.ui('clock', 1.8) + '<span>' + (c.hours.label ? '<b>' + H.esc(c.hours.label) + '</b>' + (c.hours.text ? ' · ' : '') : '') + H.esc(c.hours.text) + '</span></div>';
  }
  body += '<div class="fx-thread" role="log" aria-live="polite">' + (welcome ? '<div class="fx-row bot"><div class="fx-bub">' + welcome + '</div></div>' : '') +
    w.msgs.map(function (m) { return rowHtml(w, m); }).join('') + '</div>';

  /* ---- message form */
  var form = '<form class="fx-form" autocomplete="off"><input class="fx-input" type="text" name="fx-msg" maxlength="' + c.chat.maxLength + '" placeholder="' + H.esc(c.chat.placeholder) + '" aria-label="' + H.esc(c.chat.inputLabel) + '">' +
    '<button class="fx-send" type="submit" aria-label="' + H.esc(c.chat.sendLabel) + '" title="' + H.esc(c.chat.sendLabel) + '">' + P.ui('send', 2) + '</button></form>';

  /* ---- credit */
  var credit = '';
  if (cr.enabled && cr.text) {
    var cu = H.safeUrl(cr.url);
    credit = '<footer class="fx-credit">' + (cu ? '<a href="' + H.esc(cu) + '"' + (cr.newTab ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + H.esc(cr.text) + '</a>' : '<span>' + H.esc(cr.text) + '</span>') + '</footer>';
  }

  h += '<div class="fx-panel" id="' + w._pid + '" role="dialog" aria-label="' + H.esc(a.panelLabel) + '" tabindex="-1" hidden>' +
    '<div class="fx-layer"></div><div class="fx-img"></div><div class="fx-inner">' + head + '<div class="fx-body">' + body + '</div>' + form + credit + '</div></div>';

  /* ---- floating button */
  var src = b.image ? H.safeImg(b.image) : (b.icon === 'avatar' ? H.safeImg(pr.image) : ''), icon, fillLayer = '';
  var hasLabel = b.shape === 'pill' && !!b.label;
  if (src) {
    var box = '<span class="fx-imgbox"><span class="fx-imgin"><img src="' + H.esc(src) + '" alt="" decoding="async" referrerpolicy="no-referrer"></span></span>';
    if (b.imageMode === 'fill' && !hasLabel) { fillLayer = '<span class="fx-bimg">' + box + '</span>'; icon = ''; }   // photo covers the whole button
    else icon = box;                                                                                                // photo sits inside, like an icon
  }
  else if (b.icon === 'custom') icon = H.sanitizeSvg(b.customIcon) || P.ui('chat');
  else icon = P.builtin(b.icon);
  var label = b.shape === 'pill' && b.label ? '<span class="fx-blabel">' + H.esc(b.label) + '</span>' : '';
  h += '<div class="fx-dock">' +
    (b.tooltip.enabled && b.tooltip.text ? '<div class="fx-tip" role="tooltip">' + H.esc(b.tooltip.text) + '</div>' : '') +
    '<button class="fx-btn" type="button" data-act="toggle" aria-label="' + H.esc(a.buttonLabel) + '" aria-haspopup="dialog" aria-expanded="false" aria-controls="' + w._pid + '">' +
    '<span class="fx-bshape"><span class="fx-ring"></span><span class="fx-spin"></span><span class="fx-bface"><span class="fx-bfill">' + fillLayer +
    '<span class="fx-icos' + (src && !fillLayer ? ' is-img' : '') + '"><span class="fx-ico fx-ico-main">' + icon + '</span>' + (b.closeIcon ? '<span class="fx-ico fx-ico-x">' + P.ui('close', 2.2) + '</span>' : '') + '</span>' + label +
    '</span></span></span>' +
    (b.badge.enabled && b.badge.text ? '<span class="fx-badge' + (w._badgeSeen && b.badge.hideOnOpen ? ' is-hidden' : '') + '">' + H.esc(b.badge.text) + '</span>' : '') +
    '</button></div>';
  return h;
}

/* ============================================================ widget */
function Widget(cfg) {
  this.cfg = cfg;
  this.state = { open: false, min: false };
  this.mounted = false; this.destroyed = false;
  this._anims = []; this._tok = 0; this._timers = []; this._unbind = []; this._sig = ''; this._away = false; this._badgeSeen = false;
  this._pid = H.uid('fxp');
  this.msgs = [];                     // conversation so far (kept across live config updates)
}
var WP = Widget.prototype;

WP._later = function (fn, ms) { var t = setTimeout(fn, ms); this._timers.push(t); return t; };
WP._on = function (target, type, fn, opt) {
  target.addEventListener(type, fn, opt);
  this._unbind.push(function () { target.removeEventListener(type, fn, opt); });
};
WP.q = function (sel) { return this.sr.querySelector(sel); };
WP.contacts = function () {
  var list = this.cfg.contacts.map(function (c, i) { return P.normalize(c, i); }).filter(function (c) { return c.enabled && c.__url; });
  list.sort(function (a, b) { return (a.order - b.order) || (a.__index - b.__index); });
  return list;
};

WP.start = function () {
  var self = this, a = this.cfg.advanced;
  var go = function () {
    if (self.destroyed) return;
    H.onReady(function () { if (!self.destroyed && !self.mounted) { self.mount(); self.afterMount(); } });
  };
  var wait = function () { if (a.delay > 0) self._later(go, a.delay); else go(); };
  if (a.lazy === 'interaction') {
    var fired = false, evs = ['scroll', 'pointerdown', 'keydown', 'touchstart', 'mousemove'];
    var once = function () { if (fired) return; fired = true; evs.forEach(function (e) { window.removeEventListener(e, once, true); }); wait(); };
    evs.forEach(function (e) { window.addEventListener(e, once, { capture: true, passive: true }); });
    this._unbind.push(function () { evs.forEach(function (e) { window.removeEventListener(e, once, true); }); });
  } else if (a.lazy === 'idle') {
    var ric = window.requestIdleCallback || function (f) { return setTimeout(f, 250); };
    ric(wait, { timeout: 2500 });
  } else wait();
};

WP.mount = function () {
  if (this.mounted || this.destroyed) return;
  var self = this, id = this.cfg.advanced.id;
  var stale = document.getElementById(id);
  if (stale && stale.parentNode) stale.parentNode.removeChild(stale);      // never leave two widgets on the page
  var host = document.createElement('div');
  host.id = id; host.setAttribute('data-fixsarts-chat', '');
  var sr = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
  sr.innerHTML = '<style class="fx-base"></style><style class="fx-dyn"></style><style class="fx-custom"></style><div class="fx-root"></div>';
  sr.querySelector('.fx-base').textContent = CSS_TEXT;
  this.host = host; this.sr = sr; this.rootEl = sr.querySelector('.fx-root');
  (document.body || document.documentElement).appendChild(host);
  this.mounted = true;

  this._on(sr, 'click', function (e) { self.onClick(e); });
  this._on(sr, 'error', function (e) { self.onImgError(e); }, true);
  this._on(sr, 'submit', function (e) {
    e.preventDefault();
    var inp = self.el && self.el.input; if (!inp) return;
    var v = inp.value; inp.value = '';
    self.send(v); inp.focus({ preventScroll: true });
  });
  this._on(document, 'keydown', function (e) {
    if (e.key === 'Escape' && self.state.open && self.cfg.advanced.closeOnEsc) self.close();
  });
  this._on(document, 'pointerdown', function (e) {
    if (!self.state.open || !self.cfg.advanced.closeOnOutside) return;
    var path = e.composedPath ? e.composedPath() : [];
    if (path.indexOf(self.host) === -1) self.close({ focus: false });
  }, true);
  this._interval = setInterval(function () { self.syncStatus(); }, 30000);
  this.render();
};

WP.afterMount = function () {
  var self = this, a = this.cfg.advanced, ev = this.cfg.events;
  emit('ready', api);
  if (typeof ev.onReady === 'function') this.cb('onReady', api);
  var saved = a.remember ? H.store('fxchat:' + a.id) : null;
  if (saved === '1') this.open({ focus: false, instant: true });
  else if (a.autoOpen > 0 && saved !== '0') this._later(function () { if (!self.state.open) self.open({ focus: false }); }, a.autoOpen);
  var ta = this.cfg.button.tooltip.autoShow;
  if (ta > 0) this._later(function () {
    var tip = self.q('.fx-tip'); if (!tip || self.state.open) return;
    tip.classList.add('show'); self._later(function () { tip.classList.remove('show'); }, 5200);
  }, ta);
};

WP.cb = function (name, data) {
  var fn = this.cfg.events && this.cfg.events[name];
  if (typeof fn !== 'function') return undefined;
  try { return fn(data); } catch (e) { H.log(false, 'warn', name + ' callback threw: ' + e.message); }
};

/* ---- rendering ---- */
WP.render = function () {
  if (!this.mounted) return;
  var c = this.cfg, sig = domSig(c) + P.list().length;
  if (sig !== this._sig) {
    this._cancel();
    this._sig = sig;
    var oldIn = this.q('.fx-input'), typed = oldIn ? oldIn.value : '';
    this.rootEl.innerHTML = tpl(this);
    this.cache();
    if (typed) this.q('.fx-input').value = typed;
    this.scrollDown();
  }
  this.sr.querySelector('.fx-dyn').textContent = buildCss(c);
  this.sr.querySelector('.fx-custom').textContent = c.advanced.customCss || '';
  var r = this.rootEl, an = c.animation;
  r.setAttribute('data-h', c.layout.position); r.setAttribute('data-v', c.layout.vertical);
  r.setAttribute('data-idle', an.idle); r.setAttribute('data-bh', an.hover); r.setAttribute('data-click', an.click);
  if (an.stagger) r.setAttribute('data-stagger', ''); else r.removeAttribute('data-stagger');
  if (an.reducedMotion) r.setAttribute('data-rm', ''); else r.removeAttribute('data-rm');
  r.classList.toggle('has-x', !!c.button.closeIcon);
  this.host.style.display = c.enabled ? '' : 'none';
  if (this.host.id !== c.advanced.id) this.host.id = c.advanced.id;
  if (c.typography.loadFont) H.loadFont(c.typography.fontFamily);
  this.syncState();
};

WP.cache = function () {
  this.el = {
    panel: this.q('.fx-panel'), inner: this.q('.fx-inner'), btn: this.q('.fx-btn'), bshape: this.q('.fx-bshape'),
    badge: this.q('.fx-badge'), tip: this.q('.fx-tip'), minBtn: this.q('[data-act="minimize"]'), thread: this.q('.fx-thread'), body: this.q('.fx-body'), input: this.q('.fx-input')
  };
};

WP.syncState = function () {
  var s = this.state, el = this.el, a = this.cfg.a11y;
  if (!el) return;
  if (s.open) this.rootEl.setAttribute('data-open', ''); else this.rootEl.removeAttribute('data-open');
  if (this._away) this.rootEl.setAttribute('data-away', ''); else this.rootEl.removeAttribute('data-away');
  el.panel.hidden = !s.open;
  el.panel.classList.toggle('is-min', s.open && s.min);
  if (s.open) el.panel.setAttribute('data-settled', '');
  el.btn.setAttribute('aria-expanded', s.open ? 'true' : 'false');
  el.btn.setAttribute('aria-label', s.open && this.cfg.button.closeIcon ? a.closeButtonLabel : a.buttonLabel);
  el.btn.classList.toggle('is-away', s.open && this._away);
  if (el.badge) el.badge.classList.toggle('is-hidden', !!(this._badgeSeen && this.cfg.button.badge.hideOnOpen));
  this.syncMinBtn();
  this.syncStatus();
};

WP.syncMinBtn = function () {
  var m = this.el && this.el.minBtn, a = this.cfg.a11y;
  if (!m) return;
  m.setAttribute('aria-label', this.state.min ? a.restoreLabel : a.minimizeLabel);
  m.innerHTML = P.ui(this.state.min ? 'chevron-up' : 'chevron-down');
};

WP.syncStatus = function () {
  var el = this.sr && this.sr.querySelector('[data-status]');
  if (!el) return;
  var on = isOnline(this.cfg);
  el.setAttribute('data-on', on ? '1' : '0');
  el.querySelector('.fx-sttext').textContent = on ? this.cfg.status.onlineText : this.cfg.status.offlineText;
};

/* ---- animation plumbing ---- */
WP._cancel = function () {
  this._tok++;
  this._anims.forEach(function (a) { try { a.cancel(); } catch (e) { /* noop */ } });
  this._anims = [];
  if (this.el && this.el.panel) this.el.panel.classList.remove('morphing');
};

WP._run = function (type, dir, done) {
  var self = this, an = this.cfg.animation, p = this.el.panel, dur = an.duration;
  if (an.reducedMotion && H.reducedMotion()) dur = 0;
  if (type === 'none' || dur <= 0 || typeof p.animate !== 'function') { done(); return; }
  var anims;
  try {
    anims = A.play(type, { panel: p, inner: this.el.inner, btn: this.el.btn, shape: this.el.bshape, layout: this.cfg.layout, dur: dur, easing: an.easing, dir: dir, away: this._away });
  } catch (e) { H.log(false, 'warn', 'animation failed: ' + e.message); anims = []; }
  if (!anims.length) { done(); return; }
  this._anims = anims;
  var tok = this._tok, finished = false;
  var fin = function () {
    if (finished || tok !== self._tok) return;
    finished = true;
    anims.forEach(function (a) { try { a.cancel(); } catch (e) { /* noop */ } });
    self._anims = []; p.classList.remove('morphing');
    done();
  };
  anims[0].onfinish = fin;
  this._later(fin, dur * 1.3 + 250);        // safety net (background tabs throttle animations)
};

/* ---- public-ish behaviour ---- */
WP.open = function (o) {
  o = o || {};
  if (this.destroyed) return;
  if (!this.mounted) { this.mount(); this.afterMount(); if (this.state.open) return; }
  if (this.state.open) { if (this.state.min) this.restore(); return; }
  var self = this, an = this.cfg.animation, type = o.instant ? 'none' : an.open, p = this.el.panel;
  this._cancel();
  this.state.open = true; this.state.min = false;
  this._away = type === 'morph';
  p.hidden = false; p.removeAttribute('data-settled'); p.classList.remove('is-min');
  this.rootEl.setAttribute('data-open', '');
  if (this._away) this.rootEl.setAttribute('data-away', ''); else this.rootEl.removeAttribute('data-away');
  this.el.btn.setAttribute('aria-expanded', 'true');
  this.el.btn.setAttribute('aria-label', this.cfg.button.closeIcon ? this.cfg.a11y.closeButtonLabel : this.cfg.a11y.buttonLabel);
  this.el.btn.classList.toggle('is-away', this._away);
  this._badgeSeen = true;
  if (this.el.badge && this.cfg.button.badge.hideOnOpen) this.el.badge.classList.add('is-hidden');
  this.syncMinBtn(); this.syncStatus();
  this._persist();
  if (o.focus !== false) { try { (this.el.input || p).focus({ preventScroll: true }); } catch (e) { /* noop */ } }
  var tok = this._tok;
  this._run(type, 'in', function () {
    if (tok !== self._tok) return;
    self._later(function () { if (self.state.open && self.el) self.el.panel.setAttribute('data-settled', ''); }, 1100);
  });
  emit('open', {}); this.cb('onOpen', {});
};

WP.close = function (o) {
  o = o || {};
  if (!this.mounted || !this.state.open) return;
  var self = this, an = this.cfg.animation, type = an.close, p = this.el.panel, btn = this.el.btn;
  var active = this.sr.activeElement, hadFocus = !!(active && p.contains(active)) || o.focus === true;
  this._cancel();
  this.state.open = false; this._persist();
  var tok = this._tok;
  this.rootEl.removeAttribute('data-open');
  btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', this.cfg.a11y.buttonLabel);
  var dur = this.cfg.animation.duration;
  if (this._away && type === 'morph') this._later(function () { if (tok === self._tok) btn.classList.remove('is-away'); }, dur * 0.5);
  else if (!this._away) btn.classList.remove('is-away');
  this._run(type, 'out', function () {
    if (tok !== self._tok) return;
    p.hidden = true; p.classList.remove('is-min'); self.state.min = false;
    self._away = false; self.rootEl.removeAttribute('data-away'); btn.classList.remove('is-away');
    self.syncMinBtn();
    if (hadFocus && o.focus !== false) { try { btn.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
  });
  emit('close', {}); this.cb('onClose', {});
};

WP.toggle = function () { if (this.state.open) this.close({ focus: true }); else this.open(); };

WP._setMin = function (min) {
  if (!this.mounted || !this.state.open || this.state.min === min) return;
  var self = this, p = this.el.panel, an = this.cfg.animation, dur = an.duration;
  if (an.reducedMotion && H.reducedMotion()) dur = 0;
  this._cancel();
  p.setAttribute('data-settled', '');
  var h1 = p.offsetHeight, h2, a;
  this.state.min = min;
  if (min) {
    p.classList.add('is-min'); h2 = p.offsetHeight; p.classList.remove('is-min');
    a = dur > 0 ? A.height(p, h1, h2, Math.min(dur, 320), an.easing) : null;
    if (a) { this._anims = [a]; a.onfinish = function () { p.classList.add('is-min'); try { a.cancel(); } catch (e) { /* noop */ } self._anims = []; }; }
    else p.classList.add('is-min');
  } else {
    p.classList.remove('is-min'); h2 = p.offsetHeight;
    a = dur > 0 ? A.height(p, h1, h2, Math.min(dur, 320), an.easing) : null;
    if (a) { this._anims = [a]; a.onfinish = function () { try { a.cancel(); } catch (e) { /* noop */ } self._anims = []; }; }
  }
  this.syncMinBtn();
  emit('minimize', { minimized: min }); this.cb('onMinimize', { minimized: min });
};
WP.minimize = function () { this._setMin(true); };
WP.restore = function () { this._setMin(false); };

WP._persist = function () { if (this.cfg.advanced.remember) H.store('fxchat:' + this.cfg.advanced.id, this.state.open ? '1' : '0'); };

WP.update = function (input) {
  if (this.destroyed) return this;
  var r = C.resolve(this.cfg, input || {});
  r.warnings.forEach(function (w) { H.log(false, 'warn', w); });
  var wasEnabled = this.cfg.enabled;
  this.cfg = r.config;
  if (this.mounted) this.render();
  else if (this.cfg.enabled && !wasEnabled) this.start();
  return this;
};

WP.refresh = function () { this._sig = ''; this.render(); };

WP.destroy = function () {
  if (this.destroyed) return;
  this.destroyed = true;
  this._cancel();
  this._timers.forEach(clearTimeout); this._timers = [];
  if (this._interval) clearInterval(this._interval);
  this._unbind.forEach(function (fn) { try { fn(); } catch (e) { /* noop */ } });
  this._unbind = [];
  if (this.host && this.host.parentNode) this.host.parentNode.removeChild(this.host);
  this.mounted = false;
};

/* ---- the simulated conversation: one fixed reply, then the platform buttons ---- */
WP.scrollDown = function () { var b = this.el && this.el.body; if (b) b.scrollTop = b.scrollHeight; };
WP.send = function (text) {
  text = String(text == null ? '' : text).trim().slice(0, this.cfg.chat.maxLength);
  if (!text || !this.mounted || !this.el) return;
  var self = this, th = this.el.thread;
  this.msgs.forEach(function (m) { delete m.contacts; });                       // buttons only under the latest reply
  Array.prototype.forEach.call(th.querySelectorAll('.fx-actions'), function (n) { n.parentNode.removeChild(n); });
  var mine = { from: 'me', text: text };
  this.msgs.push(mine);
  th.insertAdjacentHTML('beforeend', rowHtml(this, mine));
  var delay = this.cfg.chat.replyDelay;
  if (delay > 0) th.insertAdjacentHTML('beforeend', TYPING);
  this.scrollDown();
  emit('message', { text: text }); this.cb('onMessage', { text: text });
  this._later(function () {
    if (!self.el) return;
    var t = self.q('.fx-typing'); if (t && t.parentNode) t.parentNode.removeChild(t);
    var reply = { from: 'bot', text: self.cfg.chat.reply, contacts: true };
    self.msgs.push(reply);
    self.el.thread.insertAdjacentHTML('beforeend', rowHtml(self, reply));
    self.scrollDown();
  }, Math.max(0, delay));
};

/* ---- events ---- */
WP.onClick = function (e) {
  var t = e.target && e.target.closest ? e.target.closest('[data-act]') : null;
  if (!t) return;
  switch (t.getAttribute('data-act')) {
    case 'toggle': this.ripple(e, t); this.toggle(); break;
    case 'close': this.close({ focus: true }); break;
    case 'minimize': if (this.state.min) this.restore(); else this.minimize(); break;
    case 'head': if (this.state.min) this.restore(); break;
    case 'contact': this.onContact(e, t); break;
  }
};

WP.onContact = function (e, a) {
  var id = a.getAttribute('data-id'), ct = null, list = this.contacts(), i;
  for (i = 0; i < list.length; i++) if (list[i].id === id) { ct = list[i]; break; }
  if (!ct) return;
  var info = { id: ct.id, type: ct.__type, name: ct.name, url: ct.__url, target: ct.target };
  var res = this.cb('onContactClick', info);
  emit('contact', info);
  if (res === false) e.preventDefault();
};

WP.ripple = function (e, btn) {
  if (this.cfg.animation.click !== 'ripple' || (this.cfg.animation.reducedMotion && H.reducedMotion())) return;
  var fill = btn.querySelector('.fx-bfill'); if (!fill) return;
  var r = fill.getBoundingClientRect(), x = e.clientX ? e.clientX - r.left : r.width / 2, y = e.clientY ? e.clientY - r.top : r.height / 2;
  var s = document.createElement('span'); s.className = 'fx-rip';
  s.style.cssText = 'width:24px;height:24px;left:' + (x - 12) + 'px;top:' + (y - 12) + 'px';
  fill.appendChild(s);
  setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 700);
};

WP.onImgError = function (e) {
  var t = e.target;
  if (!t || t.tagName !== 'IMG') return;
  var holder = t.parentNode, bimg = t.closest ? t.closest('.fx-imgbox') : null;
  if (bimg) {                                                      // button photo failed → fall back to the chat icon
    var main = this.q('.fx-ico-main'), layer = t.closest('.fx-bimg'), icos = this.q('.fx-icos');
    if (layer) layer.parentNode.removeChild(layer);
    if (main) main.innerHTML = P.ui('chat');
    if (icos) icos.classList.remove('is-img');
    return;
  }
  if (holder && holder.classList.contains('fx-avimg')) holder.classList.add('is-fb');
  else if (holder && holder.classList.contains('fx-ico')) holder.innerHTML = P.ui('chat');
  else if (holder && holder.classList.contains('fx-c-icon')) holder.innerHTML = P.ui('link');
  else t.style.display = 'none';
  H.log(this.cfg.advanced.debug, 'log', 'image failed to load: ' + (t.getAttribute('src') || '').slice(0, 120));
};

/* ============================================================ public API */
function init(input) {
  var r = C.resolve(C.DEFAULTS, input || {});
  r.warnings.forEach(function (w) { H.log(false, 'warn', w); });
  if (instance && !instance.destroyed) { instance.update(input || {}); return api; }   // never create two widgets
  instance = new Widget(r.config);
  if (instance.cfg.enabled) instance.start();
  return api;
}
function call(m, a) { if (instance && !instance.destroyed) instance[m](a); return api; }

var api = {
  __fx: true,
  version: '1.1.0-beta.1',
  init: init,
  open: function (o) { return call('open', o); },
  close: function (o) { return call('close', o); },
  toggle: function () { return call('toggle'); },
  send: function (t) { return call('send', t); },
  minimize: function () { return call('minimize'); },
  restore: function () { return call('restore'); },
  update: function (cfg) { if (instance && !instance.destroyed) instance.update(cfg); else H.log(false, 'warn', 'update() called before init()'); return api; },
  destroy: function () { if (instance) { instance.destroy(); instance = null; } return api; },
  isOpen: function () { return !!(instance && instance.state.open); },
  isMinimized: function () { return !!(instance && instance.state.min); },
  getConfig: function () { return instance ? H.clone(instance.cfg) : H.clone(C.DEFAULTS); },
  on: function (name, fn) { if (typeof fn === 'function') (listeners[name] = listeners[name] || []).push(fn); return api; },
  off: function (name, fn) { listeners[name] = (listeners[name] || []).filter(function (f) { return f !== fn; }); return api; },
  registerPlatform: function (key, def) { var ok = P.register(key, def); if (ok && instance && instance.mounted) instance.refresh(); return ok; },
  /* helpers used by the demo dashboard (so it shares the exact same config system) */
  defaults: function () { return H.clone(C.DEFAULTS); },
  presets: function () { var o = {}; Object.keys(C.PRESETS).forEach(function (k) { o[k] = { name: C.PRESETS[k].name, config: H.clone(C.PRESETS[k].config) }; }); return o; },
  platforms: function () { return P.list(); },
  validate: function (cfg) { var r = C.resolve(C.DEFAULTS, cfg || {}); return { config: r.config, warnings: r.warnings }; },
  diff: function (cfg) { return H.diff(C.DEFAULTS, C.resolve(C.DEFAULTS, cfg || {}).config) || {}; }
};
window.FixsArtsChat = api;
if (typeof module === 'object' && module && module.exports) module.exports = api;

/* ---- one-script install: the widget appears with the defaults as soon as the script is loaded.
   Optional customisation: window.FixsArtsChatConfig = {...}, data-config (JSON or URL) / data-preset on the <script> tag,
   or FixsArtsChat.init({...}) at any time. ---- */
H.onReady(function () {
  if (instance) return;
  if (H.isObj(window.FixsArtsChatConfig)) { init(window.FixsArtsChatConfig); return; }
  var d = scriptEl && scriptEl.getAttribute ? scriptEl.getAttribute('data-config') : null;
  var preset = scriptEl && scriptEl.getAttribute ? scriptEl.getAttribute('data-preset') : null;
  if (d && d.trim().charAt(0) !== '{' && window.fetch) {
    fetch(d).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (j) { init(preset ? H.merge({ preset: preset }, j) : j); })
      .catch(function (e) { H.log(false, 'warn', 'could not load data-config "' + d + '": ' + e.message); if (!instance) init(preset ? { preset: preset } : {}); });
    return;
  }
  var cfg = {};
  if (d) { try { cfg = JSON.parse(d); } catch (e) { H.log(false, 'warn', 'data-config is not valid JSON'); } }
  if (preset) cfg = H.merge({ preset: preset }, cfg);
  init(cfg);
});
