/*!
 * Support the Creator Widget — vanilla JS, Shadow DOM, tanpa build.
 * Butuh: js/support-config.js (pengaturan) + css/support-widget.css (otomatis dimuat).
 */
(function (win, doc) {
  'use strict';
  if (!doc || !doc.createElement) return;

  var script = doc.currentScript;
  var ROOT = script && script.src ? new URL('../', script.src).href : ''; // folder induk dari /js/

  /* ---------- Default (juga sebagai skema) ---------- */
  var DEFAULTS = {
    enabled: true,
    layout: 'banner', // banner | button
    contentAlign: 'left', // isi banner: left | center | right
    position: { mode: 'inline', corner: 'bottom-right', align: 'left', offsetX: 20, offsetY: 20 },
    text: {
      title: 'Support the Creator',
      subtitle: 'Suka dengan website ini?',
      description: 'Dukung pengembangan dan kreativitasnya.',
      instructions: 'Buka aplikasi e-wallet atau mobile banking, pilih Scan / QRIS, lalu pindai kode di atas. Nominal bebas.',
      thanks: 'Terima kasih banyak! Dukunganmu sangat berarti untuk pengembangan website ini.'
    },
    launcherButton: { show: true, label: 'Dukung Sekarang', color: '#ffffff', background: '#2f4fd0', fontSize: 16, fontWeight: 600 },
    popupButton: { label: 'Saya sudah donasi', closeLabel: 'Tutup', color: '#ffffff', background: '#2f4fd0', fontSize: 16, fontWeight: 600 },
    icon: { show: true, name: 'heart-handshake', url: '', from: '#9fd6ff', to: '#3b5bdb' },
    colors: { background: '#ffffff', text: '#1b3a9e', textMuted: '#4b4b4b', border: '#e3e8f4', popupBackground: '#ffffff', overlay: '#0b1020', overlayOpacity: 55 },
    size: { scale: 100, width: 560, fullWidth: false, padding: 20, fontSize: 16, radius: 20, iconSize: 64, popupWidth: 400, qrSize: 260, fontFamily: 'system' },
    animation: { type: 'scale', duration: 300 }, // scale | fade | slide | none
    qris: { url: 'assets/qris.jpg', alt: 'Kode QRIS untuk donasi' },
    display: { desktop: true, mobile: true, autoOpen: false, autoOpenDelay: 3000 }
  };

  var ENUMS = {
    layout: ['banner', 'button'],
    contentAlign: ['left', 'center', 'right'],
    'position.mode': ['inline', 'floating'],
    'position.corner': ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
    'position.align': ['left', 'center', 'right'],
    'animation.type': ['scale', 'fade', 'slide', 'none'],
    'size.fontFamily': ['system', 'inherit', 'serif', 'mono']
  };
  var RANGES = {
    'colors.overlayOpacity': [0, 100], 'size.scale': [40, 150], 'size.width': [140, 1400], 'size.padding': [0, 80], 'size.fontSize': [10, 28],
    'size.radius': [0, 60], 'size.iconSize': [16, 160], 'size.popupWidth': [260, 720], 'size.qrSize': [120, 600],
    'launcherButton.fontSize': [10, 32], 'popupButton.fontSize': [10, 32], 'launcherButton.fontWeight': [100, 900],
    'popupButton.fontWeight': [100, 900], 'position.offsetX': [0, 200], 'position.offsetY': [0, 200],
    'animation.duration': [0, 3000], 'display.autoOpenDelay': [0, 60000]
  };
  var FONTS = {
    system: 'system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
    inherit: 'inherit',
    serif: 'Georgia,"Times New Roman",serif',
    mono: 'ui-monospace,SFMono-Regular,Menlo,Consolas,monospace'
  };

  var ICONS = {
    'heart-handshake': '<path d="M12 20.5s-7.5-4.6-9.2-9.3C1.7 8 3.4 4.5 6.8 4.5c2 0 3.5 1.1 5.2 3 1.7-1.9 3.2-3 5.2-3 3.4 0 5.1 3.5 4 6.7-1.7 4.7-9.2 9.3-9.2 9.3z"/><path d="M8.2 11.6c1.4-1.5 3-1.9 4.4-.8l2.7 2.2"/><path d="M8.6 13.6l2.3 2.1c.5.4 1.2.4 1.7-.1"/><path d="M12.9 9.6l1.9 1.6"/>',
    heart: '<path d="M12 20.5s-7.5-4.6-9.2-9.3C1.7 8 3.4 4.5 6.8 4.5c2 0 3.5 1.1 5.2 3 1.7-1.9 3.2-3 5.2-3 3.4 0 5.1 3.5 4 6.7-1.7 4.7-9.2 9.3-9.2 9.3z"/>',
    coffee: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 3v2M11 3v2M14 3v2"/>',
    gift: '<path d="M4 11h16v9H4z"/><path d="M3 7.5h18V11H3z"/><path d="M12 7.5V20"/><path d="M12 7.5C12 5 10.5 3.5 8.8 3.5 7.5 3.5 6.7 4.3 6.7 5.3c0 1.3 1.6 2.2 5.3 2.2z"/><path d="M12 7.5c0-2.5 1.5-4 3.2-4 1.3 0 2.1.8 2.1 1.8 0 1.3-1.6 2.2-5.3 2.2z"/>',
    star: '<path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.2 6.6 20.1l1-6.1L3.2 9.7l6.1-.9z"/>',
    sparkles: '<path d="M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    wallet: '<path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h12v3"/><path d="M3.5 7.5V17A2 2 0 0 0 5.5 19H19a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 19 8H6a2.5 2.5 0 0 1-2.5-.5z"/><path d="M16.5 13.5h.01"/>'
  };

  var uid = 0;
  function svgIcon(name, c1, c2, px) {
    var id = 'sw-g' + ++uid;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="' + px + '" height="' + px +
      '" fill="none" stroke="url(#' + id + ')" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<defs><linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" x1="0" y1="2" x2="0" y2="22">' +
      '<stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient></defs>' +
      (ICONS[name] || ICONS.heart) + '</svg>';
  }
  var SVG_X = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  /* ---------- Normalisasi config ---------- */
  function isObj(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function merge(base, over, path) {
    var out = {};
    Object.keys(base).forEach(function (k) {
      var p = path ? path + '.' + k : k, b = base[k], o = isObj(over) ? over[k] : undefined;
      if (isObj(b)) out[k] = merge(b, o, p);
      else if (typeof b === 'number') {
        var n = (typeof o === 'string' && o.trim() === '') ? NaN : Number(o);
        n = o == null || !isFinite(n) ? b : n;
        if (RANGES[p]) n = Math.min(RANGES[p][1], Math.max(RANGES[p][0], n));
        out[k] = n;
      } else if (typeof b === 'boolean') out[k] = typeof o === 'boolean' ? o : b;
      else {
        var s = typeof o === 'string' ? o : b;
        out[k] = ENUMS[p] && ENUMS[p].indexOf(s) < 0 ? b : s;
      }
    });
    return out;
  }
  function round1(n) { return Math.round(n * 10) / 10; }
  function normalize(input) { return merge(DEFAULTS, input || {}); }

  function assetUrl(u) { // path relatif (assets/qris.jpg) dihitung dari folder widget, bukan dari halaman
    if (!u || /^([a-z][a-z0-9+.\-]*:|\/\/|\/)/i.test(u)) return u;
    return ROOT ? ROOT + u : u;
  }
  function overlayRgba(hex, pct) {
    var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return 'rgba(11,16,32,' + pct / 100 + ')';
    var h = m[1].length === 3 ? m[1].replace(/./g, '$&$&') : m[1];
    return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4, 6), 16) + ',' + pct / 100 + ')';
  }
  function el(tag, cls, text) {
    var e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* ---------- Widget ---------- */
  function Widget(target, userCfg, opts) {
    this.target = target || null;
    this.opts = opts || {};
    this.cfg = normalize(userCfg);
    this.isOpen = false;
    this.shown = false;
    this.cssReady = false;
    this.timers = [];

    var self = this;
    this.host = el('div');
    this.host.setAttribute('data-support-widget', '');
    this.host.style.visibility = 'hidden'; // sampai CSS selesai dimuat (tanpa kedipan)
    this.shadow = this.host.attachShadow({ mode: 'open' });

    this.link = doc.createElement('link');
    this.link.rel = 'stylesheet';
    this.link.href = (win.SupportWidget && win.SupportWidget.cssUrl) || ROOT + 'css/support-widget.css';
    var cssDone = function () {
      self.cssReady = true;
      self.host.style.visibility = '';
      if (self.wantReveal) self.reveal();
    };
    this.link.addEventListener('load', cssDone);
    this.link.addEventListener('error', cssDone);
    this.shadow.appendChild(this.link);

    this._onKey = function (e) {
      if (self.isOpen && (e.key === 'Escape' || e.key === 'Esc')) {
        e.stopPropagation();
        if (self.zoomEl && self.zoomEl.classList.contains('open')) self.zoom(false); else self.close();
      }
    };

    this.render();
    this.place();
    this.schedule();
  }
  var P = Widget.prototype;

  P.later = function (fn, ms) { this.timers.push(setTimeout(fn, ms)); };
  P.clearTimers = function () { this.timers.forEach(clearTimeout); this.timers = []; };

  P.place = function () {
    var c = this.cfg, inline = c.position.mode === 'inline';
    this.host.style.display = inline ? 'block' : 'contents';
    if (!c.enabled) { if (this.host.parentNode) this.host.parentNode.removeChild(this.host); return; }
    var parent = inline && this.target ? this.target : doc.body || doc.documentElement;
    if (this.host.parentNode !== parent) parent.appendChild(this.host);
  };

  P.render = function () {
    var c = this.cfg, self = this, col = c.colors, sz = c.size, lb = c.launcherButton, pb = c.popupButton;
    var anim = c.animation.type, sc = sz.scale / 100;
    while (this.shadow.lastChild !== this.link) this.shadow.removeChild(this.shadow.lastChild);

    /* root + variabel CSS */
    var root = el('div', 'sw' + (c.display.desktop ? '' : ' no-desktop') + (c.display.mobile ? '' : ' no-mobile'));
    var vars = {
      '--sw-font': FONTS[sz.fontFamily], '--sw-fs': sz.fontSize + 'px', '--sw-text': col.text, '--sw-muted': col.textMuted,
      '--sw-bg': col.background, '--sw-border': col.border, '--sw-radius': sz.radius + 'px', '--sw-pad': sz.padding + 'px',
      '--sw-w': sz.fullWidth ? '100%' : Math.round(sz.width * sc) + 'px', '--sw-lfs': round1(sz.fontSize * sc) + 'px',
      '--sw-lpad': round1(sz.padding * sc) + 'px', '--sw-lradius': round1(sz.radius * sc) + 'px', '--sw-popw': sz.popupWidth + 'px', '--sw-qr': sz.qrSize + 'px',
      '--sw-popbg': col.popupBackground, '--sw-overlay': overlayRgba(col.overlay, col.overlayOpacity),
      '--sw-dur': (anim === 'none' ? 0 : c.animation.duration) + 'ms',
      '--sw-lb-bg': lb.background, '--sw-lb-color': lb.color, '--sw-lb-fs': round1(lb.fontSize * sc) + 'px', '--sw-lb-fw': lb.fontWeight,
      '--sw-pb-bg': pb.background, '--sw-pb-color': pb.color, '--sw-pb-fs': pb.fontSize + 'px', '--sw-pb-fw': pb.fontWeight
    };
    Object.keys(vars).forEach(function (k) { root.style.setProperty(k, vars[k]); });
    this.root = root;

    /* tampilan widget */
    var isBtn = c.layout === 'button', isz = Math.round((isBtn ? sz.iconSize * 0.45 : sz.iconSize) * sc);
    var wrap = el('div', 'sw-wrap ' + (c.position.mode === 'inline' ? 'inline ' + c.position.align : 'floating') + ' ' + anim);
    if (!this.shown) wrap.classList.add('is-hidden');
    if (c.position.mode === 'floating') {
      var cr = c.position.corner.split('-');
      wrap.style[cr[0]] = c.position.offsetY + 'px';
      wrap.style[cr[1]] = c.position.offsetX + 'px';
    }
    this.wrap = wrap;

    var btn = el('button', 'sw-launcher align-' + c.contentAlign + (isBtn ? ' is-button' : ''));
    btn.type = 'button';
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-label', c.text.title || lb.label || 'Support');
    this.launcher = btn;
    if (c.icon.show) btn.appendChild(this.iconNode(isz, 'sw-icon', isBtn ? lb.color : null));
    if (isBtn) {
      btn.appendChild(el('span', 'sw-cta', lb.label || c.text.title || 'Support'));
    } else {
      var texts = el('span', 'sw-texts');
      [['sw-title', c.text.title], ['sw-sub', c.text.subtitle], ['sw-desc', c.text.description]].forEach(function (p) {
        if (p[1]) texts.appendChild(el('span', p[0], p[1]));
      });
      btn.appendChild(texts);
      if (lb.show && lb.label) btn.appendChild(el('span', 'sw-cta', lb.label));
    }
    btn.addEventListener('click', function () { self.open(); });
    wrap.appendChild(btn);
    root.appendChild(wrap);

    /* popup */
    var overlay = el('div', 'sw-overlay ' + anim + (this.isOpen ? ' open' : ''));
    this.overlay = overlay;
    overlay.addEventListener('mousedown', function (e) { overlay._down = e.target === overlay; });
    overlay.addEventListener('click', function (e) { if (e.target === overlay && overlay._down) self.close(); });

    var dlg = el('div', 'sw-dialog' + (this.thanksShown ? ' is-thanks' : ''));
    dlg.setAttribute('role', 'dialog');
    dlg.setAttribute('aria-modal', 'true');
    dlg.tabIndex = -1;
    var tid = 'sw-title-' + ++uid;
    dlg.setAttribute('aria-labelledby', tid);
    dlg.addEventListener('keydown', function (e) { if (e.key === 'Tab') self.trapTab(e); });
    this.dialog = dlg;

    var close = el('button', 'sw-close');
    close.type = 'button';
    close.setAttribute('aria-label', pb.closeLabel || 'Tutup');
    close.innerHTML = SVG_X;
    close.addEventListener('click', function () { self.close(); });
    this.closeBtn = close;
    dlg.appendChild(close);

    var main = el('div', 'sw-view main');
    if (c.icon.show) main.appendChild(this.iconNode(56, 'sw-d-icon'));
    var h = el('h2', 'sw-d-title', c.text.title);
    h.id = tid;
    main.appendChild(h);
    if (c.text.subtitle) main.appendChild(el('p', 'sw-d-sub', c.text.subtitle));
    if (c.text.description) main.appendChild(el('p', 'sw-d-desc', c.text.description));

    var qr = el('button', 'sw-qr'), img = el('img'), zimg = el('img');
    qr.type = 'button';
    qr.setAttribute('aria-label', 'Perbesar gambar QRIS');
    img.alt = c.qris.alt;
    img.decoding = 'async';
    img.addEventListener('error', function () { qr.classList.add('failed'); });
    img.addEventListener('load', function () { qr.classList.remove('failed'); });
    qr.appendChild(img);
    qr.appendChild(el('div', 'sw-qr-err', 'Gambar QRIS gagal dimuat.'));
    qr.addEventListener('click', function () { self.zoom(true); });
    this.qrImg = img;
    this.qrBox = qr;
    this.zoomImg = zimg;
    main.appendChild(qr);
    if (this.isOpen) this.loadQr();

    if (c.text.instructions) main.appendChild(el('p', 'sw-d-instr', c.text.instructions));
    if (pb.label) {
      var conf = el('button', 'sw-btn', pb.label);
      conf.type = 'button';
      conf.addEventListener('click', function () { self.showThanks(); });
      main.appendChild(conf);
    }
    dlg.appendChild(main);

    var th = el('div', 'sw-view thanks'), ti = el('div', 'sw-d-icon');
    ti.innerHTML = svgIcon('heart', c.icon.from, c.icon.to, 56);
    th.appendChild(ti);
    th.appendChild(el('p', 'sw-t-msg', c.text.thanks));
    var done = el('button', 'sw-btn', pb.closeLabel || 'Tutup');
    done.type = 'button';
    done.addEventListener('click', function () { self.close(); });
    this.doneBtn = done;
    th.appendChild(done);
    dlg.appendChild(th);

    overlay.appendChild(dlg);

    var zoom = el('div', 'sw-zoom');
    zoom.setAttribute('role', 'dialog');
    zoom.tabIndex = -1;
    zoom.setAttribute('aria-label', 'QRIS diperbesar');
    zimg.alt = c.qris.alt;
    zoom.appendChild(zimg);
    zoom.addEventListener('click', function () { self.zoom(false); });
    this.zoomEl = zoom;
    overlay.appendChild(zoom);
    root.appendChild(overlay);
    this.shadow.appendChild(root);
  };

  P.iconNode = function (px, cls, flat) {
    var c = this.cfg.icon, span = el('span', cls);
    if (c.url) {
      var im = el('img');
      im.src = assetUrl(c.url);
      im.alt = '';
      im.style.width = im.style.height = px + 'px';
      span.appendChild(im);
    } else {
      span.innerHTML = svgIcon(c.name, flat || c.from, flat || c.to, px);
    }
    return span;
  };

  P.loadQr = function () {
    var url = this.opts.qrOverride || assetUrl(this.cfg.qris.url);
    if (this.qrImg.getAttribute('src') !== url) { this.qrBox.classList.remove('failed'); this.qrImg.src = url; }
  };

  P.zoom = function (on) {
    if (!this.zoomEl) return;
    if (on) { this.zoomImg.src = this.qrImg.src; this.zoomEl.classList.add('open'); this.zoomEl.focus({ preventScroll: true }); }
    else { this.zoomEl.classList.remove('open'); this.qrBox.focus({ preventScroll: true }); }
  };

  P.trapTab = function (e) {
    var f = Array.prototype.filter.call(this.dialog.querySelectorAll('button'), function (b) { return b.getClientRects().length; });
    if (!f.length) return e.preventDefault();
    var first = f[0], last = f[f.length - 1], active = this.shadow.activeElement;
    if (e.shiftKey && (active === first || active === this.dialog)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  };

  P.showThanks = function () {
    this.thanksShown = true;
    this.dialog.classList.add('is-thanks');
    this.dialog.scrollTop = 0;
    this.doneBtn.focus({ preventScroll: true });
  };

  /* kunci scroll halaman tanpa membuat layout bergeser (kompensasi lebar scrollbar halaman) */
  P.lockPage = function () {
    var de = doc.documentElement;
    this.prev = { overflow: de.style.overflow, pr: de.style.paddingRight };
    var sbw = win.innerWidth - de.clientWidth;
    de.style.overflow = 'hidden';
    if (sbw > 0) de.style.paddingRight = sbw + 'px';
  };
  P.unlockPage = function () {
    if (!this.prev) return;
    var de = doc.documentElement;
    de.style.overflow = this.prev.overflow;
    de.style.paddingRight = this.prev.pr;
    this.prev = null;
  };

  P.open = function () {
    if (this.isOpen || this.destroyed || !this.cfg.enabled) return this;
    var self = this;
    this.isOpen = true;
    this.thanksShown = false;
    this.dialog.classList.remove('is-thanks');
    this.lastFocus = doc.activeElement;
    this.loadQr();
    this.lockPage();
    doc.addEventListener('keydown', this._onKey, true);
    void this.overlay.offsetWidth; // paksa reflow agar transisi berjalan
    this.overlay.classList.add('open');
    this.later(function () { if (self.isOpen) self.dialog.focus({ preventScroll: true }); }, 30);
    return this;
  };

  P.close = function () {
    if (!this.isOpen) return this;
    this.isOpen = false;
    this.zoomEl.classList.remove('open');
    this.overlay.classList.remove('open');
    doc.removeEventListener('keydown', this._onKey, true);
    this.unlockPage();
    var f = this.lastFocus;
    try { (f && doc.contains(f) ? f : this.launcher).focus({ preventScroll: true }); } catch (e) {}
    return this;
  };

  P.toggle = function () { return this.isOpen ? this.close() : this.open(); };

  P.reveal = function () {
    if (!this.cssReady) { this.wantReveal = true; return; }
    this.shown = true;
    void this.wrap.offsetWidth;
    this.wrap.classList.remove('is-hidden');
  };

  P.schedule = function () {
    var self = this, d = this.cfg.display;
    this.clearTimers();
    if (this.shown) return;
    var start = function () {
      if (self.destroyed) return;
      self.reveal();
      if (d.autoOpen && !self.opts.preview) self.autoOpen();
    };
    (win.requestAnimationFrame || function (f) { setTimeout(f, 16); })(function () { start(); });
  };

  P.autoOpen = function () {
    var self = this, d = this.cfg.display, key = 'support-widget-opened';
    var mobile = win.matchMedia && win.matchMedia('(max-width: 767px)').matches;
    if (!(mobile ? d.mobile : d.desktop)) return;
    try { if (win.sessionStorage.getItem(key)) return; } catch (e) {}
    this.later(function () {
      if (self.destroyed || self.isOpen) return;
      self.open();
      try { win.sessionStorage.setItem(key, '1'); } catch (e) {}
    }, d.autoOpenDelay);
  };

  P.update = function (userCfg) {
    if (this.destroyed) return this;
    this.cfg = normalize(userCfg);
    this.render();
    this.place();
    if (!this.shown) this.schedule();
    return this;
  };

  P.replay = function () { // ulang animasi masuk (dipakai demo.html)
    this.close();
    this.clearTimers();
    this.shown = false;
    this.wantReveal = false;
    this.render();
    this.place();
    this.schedule();
    return this;
  };

  P.destroy = function () {
    if (this.destroyed) return;
    this.close();
    this.clearTimers();
    this.destroyed = true;
    if (this.host.parentNode) this.host.parentNode.removeChild(this.host);
    if (this.target && this.target.__supportWidget === this) delete this.target.__supportWidget;
  };

  /* ---------- API publik ---------- */
  function query(sel) { try { return sel ? doc.querySelector(sel) : null; } catch (e) { return null; } }

  function mount(target, cfg, opts) {
    var node = typeof target === 'string' ? query(target) : target && target.nodeType === 1 ? target : null;
    if (node && node.__supportWidget) node.__supportWidget.destroy();
    var w = new Widget(node, cfg, opts);
    if (node) node.__supportWidget = w;
    return w;
  }

  win.SupportWidget = {
    mount: mount,
    normalize: normalize,
    defaults: clone(DEFAULTS),
    icons: Object.keys(ICONS),
    iconSvg: function (name, c1, c2, px) { return svgIcon(name, c1 || '#9fd6ff', c2 || '#3b5bdb', px || 24); },
    root: ROOT
  };

  /* ---------- Auto-start dari tag <script> ---------- */
  var main = null;
  if (script && script.getAttribute('data-manual') === null) {
    var preview = /[?&]swpreview(=|&|$)/.test(win.location.search); // dipakai demo.html
    var start = function () {
      var cfg = win.SUPPORT_CONFIG || {};
      var node = query(script.getAttribute('data-target') || '#support-widget');
      if (!node && (cfg.position || {}).mode !== 'floating' && script.parentNode) {
        node = el('div'); // tidak ada target: buat slot tepat setelah tag script
        script.parentNode.insertBefore(node, script.nextSibling);
      }
      if (!node) cfg = Object.assign({}, cfg, { position: Object.assign({}, cfg.position, { mode: 'floating' }) });
      main = mount(node, cfg, { preview: preview });
    };
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start); else start();
  }

  /* ---------- Live preview (demo.html mengirim pesan ke halaman ini) ---------- */
  if (/[?&]swpreview(=|&|$)/.test(win.location.search)) {
    win.addEventListener('message', function (e) {
      var m = e.data;
      if (e.source !== win.parent || !isObj(m) || m.sw !== 'preview' || !main) return;
      if (m.qr) main.opts.qrOverride = m.qr; else delete main.opts.qrOverride;
      if (m.action === 'config') main.update(m.config);
      else if (m.action === 'open') main.open();
      else if (m.action === 'close') main.close();
      else if (m.action === 'replay') main.replay();
    });
  }
})(window, document);
