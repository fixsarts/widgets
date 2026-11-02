/*!
 * Fixs Flip Clock v1.0.0
 * Widget jam flip tanpa dependensi, bisa dipasang di website mana pun.
 * ©fixsarts.studio
 *
 * Pemakaian cepat (HTML saja):
 *   <script src="flip-clock.js"></script>
 *   <div data-fixs-flipclock data-theme="dark"></div>
 *
 * Pemakaian via JavaScript:
 *   FixsFlipClock.create('#jam', { theme: 'light', show: { seconds: false } });
 */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  Tema bawaan & opsi default                                         */
  /* ------------------------------------------------------------------ */
  var THEMES = {
    dark: {
      background: '#000000',
      card: '#2b2b2b',
      text: '#f2f2f2',
      divider: '#000000',
      label: '#b5b5b5',
      date: '#a8a8a8',
      credit: '#6b6b6b'
    },
    light: {
      background: '#ffffff',
      card: '#d3d3d3',
      text: '#1b1b1b',
      divider: '#ffffff',
      label: '#555555',
      date: '#666666',
      credit: '#222222'
    }
  };

  var DEFAULTS = {
    theme: 'dark',          // 'dark' | 'light'
    colors: {},             // override: background, card, text, divider, label, date, credit
    show: {
      hours: true,
      minutes: true,
      seconds: true,
      date: true,
      ampm: true            // label AM/PM (hanya jika hour12 = true)
    },
    hour12: true,           // true = 12 jam (AM/PM), false = 24 jam
    leadingZero: true,      // 09 atau 9
    separator: 'none',      // 'none' | 'colon'
    flip: true,             // efek flip on/off
    flipDuration: 0.3,      // detik (per setengah putaran)
    size: 160,              // tinggi kartu (px)
    fit: true,              // otomatis mengecil jika container sempit
    timezone: null,         // contoh: 'Asia/Makassar' (null = zona waktu perangkat)
    locale: 'en-US',        // bahasa untuk tanggal, contoh: 'id-ID'
    dateFormat: {           // format tanggal, contoh hasil (id-ID): Senin, 02 Nov 2026
      weekday: 'long',      //   'long' (Senin) | 'short' (Sen) | false
      day: '2-digit',       //   '2-digit' (02) | 'numeric' (2) | false
      month: 'short',       //   'short' (Nov) | 'long' (November) | '2-digit' (11) | 'numeric' (11) | false
      year: 'numeric',      //   'numeric' (2026) | '2-digit' (26) | false
      comma: true,          //   koma setelah nama hari
      uppercase: false      //   HURUF BESAR
    },
    gapDigit: null,         // jarak antar kartu dalam satu pasang angka (px pada ukuran `size`), null = otomatis
    gapGroup: null,         // jarak antar pasangan jam / menit / detik (px), null = otomatis
    gapDate: null,          // jarak antara jam dengan tanggal & credit (px), null = otomatis
    credit: true,           // tulisan ©fixsarts.studio
    radius: 14,             // lengkung sudut kartu (px)
    align: 'center',        // 'left' | 'center' | 'right' (posisi jam di dalam container)
    padding: true,          // false = tanpa padding luar (cocok untuk navbar / footer)
    transparent: false,     // true = latar widget transparan (ikut warna website)
    position: null,         // null = ikut posisi elemen | 'top-left' | 'top-center' | 'top-right'
                            //   | 'bottom-left' | 'bottom-center' | 'bottom-right' (melayang/fixed)
    offset: 16,             // jarak dari tepi layar (px), hanya untuk mode melayang
    loadFont: true,         // muat font Oswald & Roboto dari Google Fonts
    fontFamily: "'Oswald','Bebas Neue','Arial Narrow',Impact,sans-serif"
  };

  /* ------------------------------------------------------------------ */
  /*  Helper                                                             */
  /* ------------------------------------------------------------------ */
  function isObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }

  function merge(base, extra) {
    var out = {}, k;
    for (k in base) out[k] = isObj(base[k]) ? merge(base[k], {}) : base[k];
    if (extra) {
      for (k in extra) {
        if (extra[k] === undefined) continue;
        if (isObj(extra[k]) && isObj(out[k])) out[k] = merge(out[k], extra[k]);
        else out[k] = extra[k];
      }
    }
    return out;
  }

  function el(tag, cls, parent) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (parent) parent.appendChild(n);
    return n;
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ---- format tanggal ---- */
  function hasDate(f) { return !!(f.weekday || f.day || f.month || f.year); }

  function makeDateFmt(o) {
    function opts(tz) {
      var f = o.dateFormat, r = {};
      if (tz) r.timeZone = tz;
      if (f.weekday) r.weekday = f.weekday;
      if (f.day) r.day = f.day;
      if (f.month) r.month = f.month;
      if (f.year) r.year = f.year;
      return r;
    }
    try { return new Intl.DateTimeFormat(o.locale, opts(o.timezone || undefined)); }
    catch (e) { return new Intl.DateTimeFormat('en-US', opts()); }
  }

  function dateText(dfmt, f, now) {
    if (!hasDate(f)) return '';
    var p = {};
    dfmt.formatToParts(now).forEach(function (x) { p[x.type] = x.value; });
    var numMonth = f.month === 'numeric' || f.month === '2-digit';
    var nums = [f.day && p.day, f.month && p.month, f.year && p.year].filter(Boolean);
    var s = nums.join(numMonth ? '/' : ' ');
    if (f.weekday && p.weekday) s = s ? p.weekday + (f.comma ? ', ' : ' ') + s : p.weekday;
    return f.uppercase ? s.toUpperCase() : s;
  }

  function loadFont() {
    if (document.getElementById('fsc-font')) return;
    var l = document.createElement('link');
    l.id = 'fsc-font';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Roboto:wght@400;500&display=swap';
    document.head.appendChild(l);
  }

  /* ------------------------------------------------------------------ */
  /*  CSS (hidup di dalam Shadow DOM, jadi tidak bentrok dengan website) */
  /* ------------------------------------------------------------------ */
  var CSS = [
    ':host{display:block}',
    '*{box-sizing:border-box;margin:0;padding:0}',
    '.clock{--h:160px;--d:.3s;',
    '  display:flex;flex-direction:column;align-items:var(--ai,center);justify-content:center;',
    '  gap:calc(var(--h)*var(--gt,.17));width:100%;',
    '  padding:calc(var(--h)*.2) calc(var(--h)*.12) calc(var(--h)*.1);',
    '  background:var(--bg);color:var(--text);border-radius:var(--r);user-select:none}',
    '.row{display:flex;align-items:center;gap:calc(var(--h)*var(--gg,.2))}',
    '.group{display:flex;gap:calc(var(--h)*var(--gd,.06))}',
    '.sep{display:flex;flex-direction:column;gap:calc(var(--h)*.14);margin:0 calc(var(--h)*var(--gg,.2)*-.3)}',
    '.sep i{display:block;width:calc(var(--h)*.055);height:calc(var(--h)*.055);border-radius:50%;background:var(--text);opacity:.85}',

    /* kartu */
    '.card{position:relative;width:calc(var(--h)*.64);height:var(--h);',
    '  perspective:calc(var(--h)*5);font-family:var(--font);font-weight:500;',
    '  font-size:calc(var(--h)*.84);color:var(--text)}',
    '.card::after{content:"";position:absolute;left:0;right:0;top:50%;z-index:6;',
    '  height:max(1.5px,calc(var(--h)*.014));transform:translateY(-50%);background:var(--divider)}',
    '.half{position:absolute;left:0;width:100%;height:50%;overflow:hidden;',
    '  background-color:var(--card);backface-visibility:hidden;-webkit-backface-visibility:hidden;',
    '  box-shadow:0 calc(var(--h)*.012) calc(var(--h)*.04) rgba(0,0,0,.22)}',
    '.top,.flip-top{top:0;border-radius:var(--r) var(--r) 0 0;',
    '  background-image:linear-gradient(rgba(255,255,255,.07),rgba(0,0,0,.07))}',
    '.bottom,.flip-bottom{bottom:0;border-radius:0 0 var(--r) var(--r);',
    '  background-image:linear-gradient(rgba(0,0,0,.1),rgba(255,255,255,.04))}',
    '.t{position:absolute;left:0;width:100%;height:var(--h);display:flex;align-items:center;',
    '  justify-content:center;line-height:1;padding-bottom:calc(var(--h)*.03)}',
    '.top .t,.flip-top .t{top:0}',
    '.bottom .t,.flip-bottom .t{bottom:0}',
    '.top{z-index:1}.bottom{z-index:1}',
    '.flip-top,.flip-bottom{display:none;z-index:3}',
    '.flip-top{transform-origin:bottom}',
    '.flip-bottom{transform-origin:top}',
    '.card.flipping .flip-top,.card.flipping .flip-bottom{display:block}',
    '.card.flipping .flip-top{animation:fsc-top var(--d) ease-in both}',
    '.card.flipping .flip-bottom{animation:fsc-bot var(--d) ease-out var(--d) both}',
    '@keyframes fsc-top{from{transform:rotateX(0)}to{transform:rotateX(-90deg)}}',
    '@keyframes fsc-bot{from{transform:rotateX(90deg)}to{transform:rotateX(0)}}',

    /* label AM/PM */
    '.ampm{position:absolute;z-index:7;left:calc(var(--h)*.1);top:calc(var(--h)*.07);',
    '  font-size:calc(var(--h)*.095);letter-spacing:.12em;font-weight:500;color:var(--label)}',

    /* tanggal & credit */
    '.date{font-family:"Roboto","Helvetica Neue",Arial,sans-serif;font-weight:400;',
    '  font-size:calc(var(--h)*.17);letter-spacing:.04em;word-spacing:.1em;color:var(--date);',
    '  text-align:var(--ta,center);white-space:nowrap}',
    '.date.upper{letter-spacing:.2em;word-spacing:.45em}',
    '.credit{font-family:"Roboto","Helvetica Neue",Arial,sans-serif;',
    '  font-size:max(9px,calc(var(--h)*.065));letter-spacing:.04em;color:var(--credit);text-align:var(--ta,center)}',
    '@media (prefers-reduced-motion:reduce){.card.flipping .flip-top,.card.flipping .flip-bottom{animation-duration:.01s}}'
  ].join('\n');

  /* ------------------------------------------------------------------ */
  /*  Satu kartu angka                                                   */
  /* ------------------------------------------------------------------ */
  function Digit(parent, duration) {
    this.value = null;
    this.timer = null;
    this.duration = duration;

    this.el = el('div', 'card', parent);
    var self = this;
    function half(cls) {
      var h = el('div', 'half ' + cls, self.el);
      return el('span', 't', h);
    }
    this.topT = half('top');
    this.botT = half('bottom');
    this.flipTopT = half('flip-top');
    this.flipBotT = half('flip-bottom');
    this.el.style.setProperty('--d', duration + 's');
  }

  Digit.prototype._all = function (v) {
    this.topT.textContent = this.botT.textContent =
      this.flipTopT.textContent = this.flipBotT.textContent = v;
  };

  Digit.prototype._finish = function () {
    clearTimeout(this.timer);
    this.timer = null;
    this._all(this.value);
    this.el.classList.remove('flipping');
  };

  Digit.prototype.set = function (v, animate) {
    if (v === this.value) return;
    if (this.timer) this._finish();
    var old = this.value;
    this.value = v;

    if (!animate || old === null) { this._all(v); return; }

    this.topT.textContent = v;          // setengah atas = angka baru (terlihat setelah kartu lama jatuh)
    this.flipTopT.textContent = old;    // kartu atas lama jatuh ke bawah
    this.flipBotT.textContent = v;      // kartu bawah baru naik menutup
    void this.el.offsetWidth;           // restart animasi
    this.el.classList.add('flipping');

    var self = this;
    this.timer = setTimeout(function () { self._finish(); }, this.duration * 2000 + 40);
  };

  Digit.prototype.destroy = function () { clearTimeout(this.timer); };

  /* ------------------------------------------------------------------ */
  /*  Widget utama                                                       */
  /* ------------------------------------------------------------------ */
  function FlipClock(target, options) {
    var t = typeof target === 'string' ? document.querySelector(target) : target;
    if (!t) throw new Error('FixsFlipClock: elemen target tidak ditemukan');

    this.target = t;
    this.opts = merge(DEFAULTS, options || {});
    this.host = el('div', 'fixs-flipclock-host', t);
    this.root = this.host.attachShadow({ mode: 'open' });
    this.tick = this.tick.bind(this);

    this._build();
    this._render(false);
    this._schedule();

    var self = this;
    if (typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(function () { self._fit(); });
      this.ro.observe(t);
    }
    this._onResize = function () { self._fit(); };
    window.addEventListener('resize', this._onResize);
  }

  FlipClock.prototype._formatters = function () {
    var o = this.opts, tz = o.timezone || undefined, f;
    try {
      f = new Intl.DateTimeFormat('en-US', {
        timeZone: tz, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    } catch (e) {
      f = new Intl.DateTimeFormat('en-US', { hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    this.fmt = f;
    this.dfmt = makeDateFmt(o);
  };

  FlipClock.prototype._build = function () {
    var o = this.opts, show = o.show, self = this;

    if (o.loadFont) loadFont();
    this._formatters();

    this.root.innerHTML = '';
    var style = el('style', null, this.root);
    style.textContent = CSS;

    var clock = this.clock = el('div', 'clock', this.root);
    var c = merge(THEMES[o.theme] || THEMES.dark, o.colors);
    clock.style.setProperty('--bg', c.background);
    clock.style.setProperty('--card', c.card);
    clock.style.setProperty('--text', c.text);
    clock.style.setProperty('--divider', c.divider);
    clock.style.setProperty('--label', c.label);
    clock.style.setProperty('--date', c.date);
    clock.style.setProperty('--credit', c.credit);
    clock.style.setProperty('--font', o.fontFamily);
    clock.style.setProperty('--r', o.radius + 'px');
    clock.style.setProperty('--h', o.size + 'px');
    clock.style.setProperty('--ai', o.align === 'left' ? 'flex-start' : o.align === 'right' ? 'flex-end' : 'center');
    clock.style.setProperty('--ta', o.align === 'left' || o.align === 'right' ? o.align : 'center');
    if (o.transparent) clock.style.setProperty('--bg', 'transparent');
    if (!o.padding) clock.style.padding = '0';
    if (o.gapDigit != null) clock.style.setProperty('--gd', o.gapDigit / o.size);
    if (o.gapGroup != null) clock.style.setProperty('--gg', o.gapGroup / o.size);
    if (o.gapDate != null) clock.style.setProperty('--gt', o.gapDate / o.size);
    this._place();

    var row = this.row = el('div', 'row', clock);
    var dur = o.flipDuration;
    this.digits = { hours: null, minutes: null, seconds: null };

    var order = ['hours', 'minutes', 'seconds'], first = true;
    order.forEach(function (key) {
      if (!show[key]) return;
      if (!first && o.separator === 'colon') {
        var sep = el('div', 'sep', row);
        el('i', null, sep); el('i', null, sep);
      }
      var g = el('div', 'group', row);
      self.digits[key] = [new Digit(g, dur), new Digit(g, dur)];
      first = false;
    });

    // label AM/PM di kartu pertama jam
    this.ampmEl = null;
    if (this.digits.hours && o.hour12 && show.ampm) {
      this.ampmEl = el('div', 'ampm', this.digits.hours[0].el);
    }

    this.dateEl = (show.date && hasDate(o.dateFormat))
      ? el('div', 'date' + (o.dateFormat.uppercase ? ' upper' : ''), clock) : null;
    this.creditEl = o.credit ? el('div', 'credit', clock) : null;
    if (this.creditEl) this.creditEl.textContent = '\u00A9fixsarts.studio';

    this._fit();
  };

  /** Mode melayang: tempel di pojok layar (position: fixed). */
  FlipClock.prototype._place = function () {
    var s = this.host.style, o = this.opts, p = o.position;
    s.cssText = '';
    if (!p) return;
    var off = o.offset + 'px';
    s.position = 'fixed';
    s.zIndex = '2147483000';
    s.width = 'max-content';
    s.maxWidth = 'calc(100vw - ' + (o.offset * 2) + 'px)';
    if (p.indexOf('top') === 0) s.top = off; else s.bottom = off;
    if (/left$/.test(p)) s.left = off;
    else if (/right$/.test(p)) s.right = off;
    else { s.left = '50%'; s.transform = 'translateX(-50%)'; }
  };

  FlipClock.prototype._fit = function () {
    var o = this.opts;
    this.clock.style.setProperty('--h', o.size + 'px');
    if (!o.fit) return;
    var avail = o.position ? window.innerWidth - o.offset * 2 : this.target.clientWidth;
    if (!avail) return;
    var w = this.row.getBoundingClientRect().width;
    if (this.dateEl) w = Math.max(w, this.dateEl.getBoundingClientRect().width);
    if (this.creditEl) w = Math.max(w, this.creditEl.getBoundingClientRect().width);
    var natural = w + (o.padding ? o.size * 0.24 : 0);
    if (natural > avail) {
      this.clock.style.setProperty('--h', Math.max(24, o.size * avail / natural) + 'px');
    }
  };

  FlipClock.prototype._render = function (animate) {
    var o = this.opts, now = new Date(), p = {}, d = this.digits;
    animate = animate && o.flip && !document.hidden;

    this.fmt.formatToParts(now).forEach(function (x) { p[x.type] = x.value; });
    var h24 = parseInt(p.hour, 10) % 24;
    var min = p.minute, sec = p.second, hh;

    if (o.hour12) {
      var h = h24 % 12 || 12;
      hh = (h < 10 && !o.leadingZero) ? ['', String(h)] : [pad(h)[0], pad(h)[1]];
    } else {
      hh = [pad(h24)[0], pad(h24)[1]];
    }

    if (d.hours)   { d.hours[0].set(hh[0], animate);   d.hours[1].set(hh[1], animate); }
    if (d.minutes) { d.minutes[0].set(min[0], animate); d.minutes[1].set(min[1], animate); }
    if (d.seconds) { d.seconds[0].set(sec[0], animate); d.seconds[1].set(sec[1], animate); }

    if (this.ampmEl) this.ampmEl.textContent = h24 >= 12 ? 'PM' : 'AM';
    if (this.dateEl) this.dateEl.textContent = dateText(this.dfmt, o.dateFormat, now);
  };

  FlipClock.prototype._schedule = function () {
    var delay = 1000 - (Date.now() % 1000) + 8;
    this.timeout = setTimeout(this.tick, delay);
  };

  FlipClock.prototype.tick = function () {
    this._render(true);
    this._schedule();
  };

  /** Ubah konfigurasi saat berjalan. Contoh: clock.update({ theme: 'light' }) */
  FlipClock.prototype.update = function (opts) {
    this.opts = merge(this.opts, opts || {});
    var all = this.digits;
    ['hours', 'minutes', 'seconds'].forEach(function (k) {
      if (all[k]) all[k].forEach(function (x) { x.destroy(); });
    });
    this._build();
    this._render(false);
    return this;
  };

  /** Hapus widget dari halaman. */
  FlipClock.prototype.destroy = function () {
    clearTimeout(this.timeout);
    if (this.ro) this.ro.disconnect();
    window.removeEventListener('resize', this._onResize);
    var all = this.digits;
    ['hours', 'minutes', 'seconds'].forEach(function (k) {
      if (all[k]) all[k].forEach(function (x) { x.destroy(); });
    });
    if (this.host.parentNode) this.host.parentNode.removeChild(this.host);
    if (this.target.__fsc === this) delete this.target.__fsc;
  };

  /* ------------------------------------------------------------------ */
  /*  Auto-init lewat atribut data-*                                     */
  /* ------------------------------------------------------------------ */
  function bool(v) { return !(v === 'false' || v === '0' || v === 'no'); }

  function fromData(n) {
    var d = n.dataset, o = {};
    if (d.theme) o.theme = d.theme;
    if (d.show) {
      var list = d.show.toLowerCase().split(/[\s,]+/);
      var has = function (a, b) { return list.indexOf(a) > -1 || list.indexOf(b) > -1; };
      o.show = {
        hours: has('hours', 'h'),
        minutes: has('minutes', 'm'),
        seconds: has('seconds', 's'),
        date: has('date', 'd')
      };
    }
    if (d.hour12 !== undefined) o.hour12 = bool(d.hour12);
    if (d.ampm !== undefined) o.show = merge(o.show || {}, { ampm: bool(d.ampm) });
    if (d.leadingZero !== undefined) o.leadingZero = bool(d.leadingZero);
    if (d.separator) o.separator = d.separator;
    if (d.flip !== undefined) o.flip = bool(d.flip);
    if (d.size) o.size = parseFloat(d.size);
    if (d.fit !== undefined) o.fit = bool(d.fit);
    if (d.timezone) o.timezone = d.timezone;
    if (d.locale) o.locale = d.locale;
    if (d.credit !== undefined) o.credit = bool(d.credit);
    if (d.radius) o.radius = parseFloat(d.radius);
    if (d.align) o.align = d.align;
    if (d.padding !== undefined) o.padding = bool(d.padding);
    if (d.transparent !== undefined) o.transparent = bool(d.transparent);
    if (d.position) o.position = d.position;
    if (d.offset) o.offset = parseFloat(d.offset);

    // format tanggal: data-date-weekday / -day / -month / -year (nilai "false" = sembunyikan)
    var fv = function (v) { return (v === 'false' || v === 'none' || v === 'off') ? false : v; };
    var df = {};
    if (d.dateWeekday !== undefined) df.weekday = fv(d.dateWeekday);
    if (d.dateDay !== undefined) df.day = fv(d.dateDay);
    if (d.dateMonth !== undefined) df.month = fv(d.dateMonth);
    if (d.dateYear !== undefined) df.year = fv(d.dateYear);
    if (d.dateComma !== undefined) df.comma = bool(d.dateComma);
    if (d.dateUppercase !== undefined) df.uppercase = bool(d.dateUppercase);
    if (Object.keys(df).length) o.dateFormat = df;

    // jarak (px): data-gap-digit / data-gap-group / data-gap-date
    if (d.gapDigit !== undefined) o.gapDigit = parseFloat(d.gapDigit);
    if (d.gapGroup !== undefined) o.gapGroup = parseFloat(d.gapGroup);
    if (d.gapDate !== undefined) o.gapDate = parseFloat(d.gapDate);

    var colors = {};
    if (d.bg) colors.background = d.bg;
    if (d.card) colors.card = d.card;
    if (d.text) colors.text = d.text;
    if (d.divider) colors.divider = d.divider;
    if (d.label) colors.label = d.label;
    if (d.dateColor) colors.date = d.dateColor;
    if (d.creditColor) colors.credit = d.creditColor;
    if (Object.keys(colors).length) o.colors = colors;
    return o;
  }

  function autoInit(root) {
    (root || document).querySelectorAll('[data-fixs-flipclock]').forEach(function (n) {
      if (n.__fsc) return;
      n.__fsc = new FlipClock(n, fromData(n));
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { autoInit(); });
    else autoInit();
  }

  /* ------------------------------------------------------------------ */
  /*  API publik                                                         */
  /* ------------------------------------------------------------------ */
  var API = {
    version: '1.0.0',
    themes: THEMES,
    defaults: DEFAULTS,
    create: function (target, options) { return new FlipClock(target, options); },
    /** Hasil teks tanggal untuk opsi tertentu, contoh: FixsFlipClock.formatDate(new Date(), { locale: 'id-ID' }) */
    formatDate: function (date, options) {
      var o = merge(DEFAULTS, options || {});
      return dateText(makeDateFmt(o), o.dateFormat, date || new Date());
    },
    init: autoInit
  };

  if (typeof module === 'object' && module.exports) module.exports = API;
  global.FixsFlipClock = API;
})(typeof window !== 'undefined' ? window : this);
