/* helpers.js — shared, DOM-free utilities (plus a few safe DOM helpers) */
var H = (function () {
  var toStr = Object.prototype.toString;
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function isObj(v) { return toStr.call(v) === '[object Object]'; }

  /** Deep clone (plain objects / arrays; functions are kept by reference). */
  function clone(v) {
    if (Array.isArray(v)) return v.map(clone);
    if (isObj(v)) { var o = {}; for (var k in v) if (has(v, k)) o[k] = clone(v[k]); return o; }
    return v;
  }

  /** Deep merge: returns a NEW object. Arrays are replaced, not merged. */
  function merge(base, extra) {
    var out = clone(base);
    if (!isObj(extra)) return out;
    for (var k in extra) {
      if (!has(extra, k) || k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
      var v = extra[k];
      if (v === undefined) continue;
      if (isObj(v) && isObj(out[k])) out[k] = merge(out[k], v);
      else out[k] = clone(v);
    }
    return out;
  }

  /** Minimal difference between base and cur (null when identical). */
  function diff(base, cur) {
    var out = {}, any = false;
    for (var k in cur) {
      if (!has(cur, k)) continue;
      var a = base ? base[k] : undefined, b = cur[k];
      if (isObj(b) && isObj(a)) { var d = diff(a, b); if (d) { out[k] = d; any = true; } }
      else if (typeof b !== 'function' && JSON.stringify(a) !== JSON.stringify(b)) { out[k] = clone(b); any = true; }
    }
    return any ? out : null;
  }

  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var _uid = 0;
  function uid(p) { _uid += 1; return (p || 'fx') + '-' + Math.random().toString(36).slice(2, 7) + _uid; }

  /* ---------- URLs ---------- */
  var SAFE_PROTOCOLS = { 'http:': 1, 'https:': 1, 'mailto:': 1, 'tel:': 1, 'sms:': 1, 'tg:': 1, 'whatsapp:': 1, 'fb-messenger:': 1, 'skype:': 1, 'viber:': 1, 'line:': 1, 'signal:': 1 };
  /** Returns the url when safe to put into href, otherwise ''. */
  function safeUrl(u) {
    if (typeof u !== 'string') return '';
    u = u.trim();
    if (!u) return '';
    if (/^(\/|\.\/|\.\.\/|#)/.test(u)) return u;
    try {
      var p = new URL(u, (typeof location !== 'undefined' && location.href) || 'https://localhost/');
      return SAFE_PROTOCOLS[p.protocol] ? u : '';
    } catch (e) { return ''; }
  }
  /** Image sources: http(s), relative, data:image/* and blob: */
  function safeImg(u) {
    if (typeof u !== 'string') return '';
    u = u.trim();
    if (!u) return '';
    if (/^data:image\/(png|jpe?g|gif|webp|svg\+xml|avif|bmp|x-icon);/i.test(u)) return u;
    if (/^blob:/i.test(u)) return u;
    if (/^(\/|\.\/|\.\.\/)/.test(u)) return u;
    if (/^https?:\/\//i.test(u)) return u;
    if (/^[\w\-./%]+\.(png|jpe?g|gif|webp|svg|avif|ico)(\?.*)?$/i.test(u)) return u; // bare relative path
    return '';
  }
  function looksLikeUrl(s) { return typeof s === 'string' && (/^(https?:\/\/|data:image\/|blob:|\.{0,2}\/)/i.test(s.trim()) || /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i.test(s.trim())); }

  /** Escape a value for use inside a CSS url("...") */
  function cssUrl(u) { return 'url("' + String(u).replace(/["\\\n\r]/g, function (c) { return encodeURIComponent(c); }) + '")'; }

  /* ---------- SVG sanitising (for user supplied icons) ---------- */
  function sanitizeSvg(str) {
    if (typeof str !== 'string' || str.indexOf('<') === -1) return '';
    try {
      var doc = new DOMParser().parseFromString(str.trim(), 'image/svg+xml');
      var svg = doc.documentElement;
      if (!svg || svg.nodeName.toLowerCase() !== 'svg' || doc.getElementsByTagName('parsererror').length) return '';
      var bad = svg.querySelectorAll('script,foreignObject,iframe,object,embed,style,animate,set');
      for (var i = 0; i < bad.length; i++) bad[i].parentNode.removeChild(bad[i]);
      var all = svg.querySelectorAll('*'); all = Array.prototype.slice.call(all); all.push(svg);
      all.forEach(function (el) {
        Array.prototype.slice.call(el.attributes).forEach(function (a) {
          var n = a.name.toLowerCase(), v = String(a.value).trim().toLowerCase();
          if (n.indexOf('on') === 0) el.removeAttribute(a.name);
          else if ((n === 'href' || n === 'xlink:href') && !/^#/.test(v)) el.removeAttribute(a.name);
          else if (/javascript:|data:text\/html/.test(v)) el.removeAttribute(a.name);
        });
      });
      svg.removeAttribute('width'); svg.removeAttribute('height');
      svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
      if (!svg.getAttribute('viewBox')) svg.setAttribute('viewBox', '0 0 24 24');
      return new XMLSerializer().serializeToString(svg);
    } catch (e) { return ''; }
  }

  /* ---------- colours ---------- */
  function isColor(c) {
    if (typeof c !== 'string' || !c.trim()) return false;
    c = c.trim();
    if (typeof CSS !== 'undefined' && CSS.supports) return CSS.supports('color', c);
    return /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(c) || /^(rgb|hsl)a?\(/i.test(c);
  }
  /** Apply alpha (0..1) to a colour string. Hex/rgb handled natively, others via color-mix. */
  function alpha(c, a) {
    c = String(c).trim(); a = clamp(a, 0, 1);
    var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c);
    if (m) {
      var h = m[1]; if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4, 6), 16) + ',' + a + ')';
    }
    var r = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(c);
    if (r) return 'rgba(' + r[1] + ',' + r[2] + ',' + r[3] + ',' + a + ')';
    return 'color-mix(in srgb,' + c + ' ' + Math.round(a * 100) + '%,transparent)';
  }

  /* ---------- shapes ---------- */
  function squirclePoly(n, steps) {
    n = n || 5; steps = steps || 72;
    var pts = [];
    for (var i = 0; i < steps; i++) {
      var t = i / steps * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t);
      var x = (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), 2 / n), y = (s < 0 ? -1 : 1) * Math.pow(Math.abs(s), 2 / n);
      pts.push((50 + x * 50).toFixed(2) + '% ' + (50 + y * 50).toFixed(2) + '%');
    }
    return 'polygon(' + pts.join(',') + ')';
  }
  var SQUIRCLE = squirclePoly(5, 72);
  var HEXAGON = 'polygon(50% 0%,93.3% 25%,93.3% 75%,50% 100%,6.7% 75%,6.7% 25%)';
  var RADIUS_RE = /^[0-9a-z%\s\/.\-+*(),]+$/i;
  /** Shape -> { radius, clip } CSS values. */
  function shapeCss(shape, custom, rounded) {
    switch (shape) {
      case 'circle': return { radius: '50%', clip: 'none' };
      case 'square': return { radius: '4px', clip: 'none' };
      case 'rounded': return { radius: rounded || '28%', clip: 'none' };
      case 'pill': return { radius: '999px', clip: 'none' };
      case 'squircle': return { radius: '0', clip: SQUIRCLE };
      case 'hexagon': return { radius: '0', clip: HEXAGON };
      case 'custom': return { radius: (custom && RADIUS_RE.test(custom)) ? custom : '30%', clip: 'none' };
      default: return { radius: '50%', clip: 'none' };
    }
  }

  /* ---------- fonts ---------- */
  var FONT_STACKS = {
    system: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
    inter: '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
    'space-grotesk': '"Space Grotesk","Inter",-apple-system,"Segoe UI",sans-serif',
    poppins: '"Poppins","Inter",-apple-system,"Segoe UI",sans-serif',
    manrope: '"Manrope","Inter",-apple-system,"Segoe UI",sans-serif',
    'dm-sans': '"DM Sans","Inter",-apple-system,"Segoe UI",sans-serif',
    'jetbrains-mono': '"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace',
    serif: 'ui-serif,Georgia,Cambria,"Times New Roman",serif',
    mono: 'ui-monospace,SFMono-Regular,Menlo,Consolas,monospace'
  };
  var GOOGLE_FONTS = { inter: 'Inter', 'space-grotesk': 'Space Grotesk', poppins: 'Poppins', manrope: 'Manrope', 'dm-sans': 'DM Sans', 'jetbrains-mono': 'JetBrains Mono' };
  function fontStack(v) {
    if (FONT_STACKS[v]) return FONT_STACKS[v];
    if (typeof v === 'string' && /^[\w\s",.'\-]+$/.test(v)) return v; // custom stack
    return FONT_STACKS.system;
  }
  /** Opt-in: inject a Google Fonts stylesheet link into <head> (free, no API key). */
  function loadFont(key) {
    var fam = GOOGLE_FONTS[key];
    if (!fam || typeof document === 'undefined') return;
    var id = 'fixsarts-chat-font-' + key;
    if (document.getElementById(id)) return;
    var l = document.createElement('link');
    l.id = id; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(fam).replace(/%20/g, '+') + ':wght@300;400;500;600;700;800&display=swap';
    document.head.appendChild(l);
  }

  /* ---------- storage / misc ---------- */
  function store(key, val) {
    try {
      if (val === undefined) return window.sessionStorage.getItem(key);
      if (val === null) window.sessionStorage.removeItem(key); else window.sessionStorage.setItem(key, val);
    } catch (e) { /* storage may be blocked */ }
    return null;
  }
  function initials(name) {
    var w = String(name || '').split(/[\s.\-_]+/).filter(Boolean);
    if (!w.length) return '•';
    return (w[0][0] + (w[1] ? w[1][0] : '')).toUpperCase();
  }
  function reducedMotion() {
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
  }
  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }
  function log(debug, level, msg) {
    if (typeof console === 'undefined') return;
    if (level === 'warn' || debug) (console[level] || console.log).call(console, '[FixsArtsChat] ' + msg);
  }

  return {
    has: has, isObj: isObj, clone: clone, merge: merge, diff: diff, clamp: clamp, esc: esc, uid: uid,
    safeUrl: safeUrl, safeImg: safeImg, looksLikeUrl: looksLikeUrl, cssUrl: cssUrl, sanitizeSvg: sanitizeSvg,
    isColor: isColor, alpha: alpha, shapeCss: shapeCss, fontStack: fontStack, loadFont: loadFont,
    FONT_STACKS: FONT_STACKS, store: store, initials: initials, reducedMotion: reducedMotion, onReady: onReady, log: log
  };
})();
