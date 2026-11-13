/* demo.html — panel pengaturan + live preview + script siap tempel (pengaturan tersimpan otomatis) */
(function () {
  'use strict';
  var SW = window.SupportWidget;
  var SAVE_KEY = 'sw-demo-cfg';
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) {}
  var cfg = SW.normalize(saved || {}); // mulai dari pengaturan terakhir yang disimpan otomatis di browser ini
  var qrPreview = null; // data URL gambar QRIS yang baru dipilih (hanya untuk preview)
  var frame = document.getElementById('frame');

  var WEIGHTS = [[400, 'Normal'], [500, 'Medium'], [600, 'Semi-bold'], [700, 'Bold'], [800, 'Extra-bold']];
  var floating = function (c) { return c.position.mode === 'floating'; };
  var isBanner = function (c) { return c.layout === 'banner'; };
  var inline = function (c) { return c.position.mode === 'inline'; };
  var hasX = function (c) { return c.closeButton.show; };

  // t: text | area | num | color | select | check
  var SECTIONS = [
    { title: 'Pasang di website (salin script)', open: true, fields: [
      { t: 'snippet' }
    ] },
    { title: 'Tampilan', open: true, fields: [
      { k: 'layout', l: 'Gaya', t: 'select', o: [['banner', 'Banner (kartu)'], ['button', 'Tombol saja']] },
      { k: 'orientation', l: 'Bentuk banner', t: 'select', o: [['auto', 'Otomatis (turun baris kalau sempit)'], ['landscape', 'Landscape — selalu satu baris'], ['portrait', 'Portrait — selalu tersusun ke bawah']], when: isBanner, hint: 'Landscape/Portrait mempertahankan bentuk walau lebar atau skala diubah.' },
      { k: 'size.scale', l: 'Skala banner (%)', t: 'num', when: isBanner, hint: 'Seluruh banner (teks, ikon, jarak) mengecil/membesar dengan bentuk sama. Ukuran tampil = lebar × skala.' },
      { k: 'contentAlign', l: 'Rata isi banner (ikon, teks, tombol)', t: 'select', o: [['left', 'Rata kiri'], ['center', 'Tengah'], ['right', 'Rata kanan']], when: isBanner },
      { k: 'position.mode', l: 'Posisi', t: 'select', o: [['inline', 'Di dalam halaman'], ['floating', 'Melayang di sudut layar']] },
      { k: 'position.align', l: 'Rata (di dalam halaman)', t: 'select', o: [['left', 'Kiri'], ['center', 'Tengah'], ['right', 'Kanan']], when: inline },
      { k: 'position.corner', l: 'Sudut', t: 'select', o: [['bottom-right', 'Kanan bawah'], ['bottom-left', 'Kiri bawah'], ['top-right', 'Kanan atas'], ['top-left', 'Kiri atas']], when: floating },
      { k: 'position.offsetX', l: 'Jarak samping (px)', t: 'num', when: floating },
      { k: 'position.offsetY', l: 'Jarak atas/bawah (px)', t: 'num', when: floating },
      { k: 'display.desktop', l: 'Tampil di desktop', t: 'check' },
      { k: 'display.mobile', l: 'Tampil di mobile', t: 'check' }
    ] },
    { title: 'Tombol tutup (X)', fields: [
      { k: 'closeButton.show', l: 'Tampilkan tombol X di banner', t: 'check', hint: 'Pengunjung bisa menyembunyikan widget. Di preview, "Ulangi animasi" memunculkannya lagi.' },
      { k: 'closeButton.remember', l: 'Ingat pilihan pengunjung', t: 'select', o: [['never', 'Muncul lagi tiap halaman dimuat'], ['session', 'Sampai browser ditutup'], ['forever', 'Seterusnya']], when: hasX },
      { k: 'closeButton.size', l: 'Ukuran lingkaran X (px)', t: 'num', when: hasX },
      { k: 'closeButton.iconSize', l: 'Ukuran tanda X (px)', t: 'num', when: hasX },
      { k: 'closeButton.background', l: 'Warna lingkaran', t: 'color', when: hasX },
      { k: 'closeButton.color', l: 'Warna tanda X', t: 'color', when: hasX },
      { k: 'closeButton.alignIcon', l: 'Sejajarkan X dengan tengah ikon (otomatis)', t: 'check', when: hasX, hint: 'Seret tombol X langsung di preview untuk menaruhnya di mana saja; opsi ini otomatis mati. Centang lagi untuk kembali sejajar ikon.' },
      { k: 'closeButton.offsetY', l: 'Jarak X dari atas (px)', t: 'num', when: hasX, hint: 'Kalau sejajar ikon aktif: geser halus (negatif = naik). Kalau tidak: jarak dari sisi atas banner.' },
      { k: 'closeButton.offsetX', l: 'Jarak X dari sisi kanan (px)', t: 'num', when: hasX }
    ] },
    { title: 'Teks utama', fields: [
      { k: 'text.title', l: 'Judul', t: 'text' },
      { k: 'text.subtitle', l: 'Subjudul', t: 'text' },
      { k: 'text.description', l: 'Deskripsi', t: 'area' },
      { k: 'text.instructions', l: 'Petunjuk di bawah QRIS', t: 'area' },
      { k: 'text.thanks', l: 'Pesan terima kasih', t: 'area' }
    ] },
    { title: 'Tombol di tampilan widget', open: true, fields: [
      { k: 'launcherButton.show', l: 'Tampilkan tombol (gaya banner)', t: 'check', when: isBanner },
      { k: 'launcherButton.placement', l: 'Posisi tombol di banner', t: 'select', o: [['side', 'Di samping teks'], ['below', 'Di bawah teks (di samping ikon)'], ['bottom', 'Di bawah, selebar banner']], when: function (c) { return c.layout === 'banner' && c.launcherButton.show; }, hint: 'Berguna kalau banner landscape terlalu panjang.' },
      { k: 'launcherButton.label', l: 'Teks tombol', t: 'text' },
      { k: 'launcherButton.color', l: 'Warna teks', t: 'color' },
      { k: 'launcherButton.background', l: 'Warna tombol', t: 'color' },
      { k: 'launcherButton.fontSize', l: 'Ukuran teks (px)', t: 'num' },
      { k: 'launcherButton.fontWeight', l: 'Ketebalan', t: 'select', o: WEIGHTS }
    ] },
    { title: 'Tombol di dalam popup', open: true, fields: [
      { k: 'popupButton.label', l: 'Teks tombol konfirmasi', t: 'text' },
      { k: 'popupButton.closeLabel', l: 'Teks tombol tutup', t: 'text' },
      { k: 'popupButton.color', l: 'Warna teks', t: 'color' },
      { k: 'popupButton.background', l: 'Warna tombol', t: 'color' },
      { k: 'popupButton.fontSize', l: 'Ukuran teks (px)', t: 'num' },
      { k: 'popupButton.fontWeight', l: 'Ketebalan', t: 'select', o: WEIGHTS }
    ] },
    { title: 'Warna', fields: [
      { k: 'colors.background', l: 'Latar widget', t: 'color' },
      { k: 'colors.text', l: 'Teks utama', t: 'color' },
      { k: 'colors.textMuted', l: 'Teks sekunder', t: 'color' },
      { k: 'colors.border', l: 'Garis tepi', t: 'color' },
      { k: 'colors.popupBackground', l: 'Latar popup', t: 'color' },
      { k: 'colors.overlay', l: 'Warna overlay', t: 'color' },
      { k: 'colors.overlayOpacity', l: 'Kepekatan overlay (0–100)', t: 'num' }
    ] },
    { title: 'Ukuran & font', fields: [
      { k: 'size.autoWidth', l: 'Lebar otomatis (pas dengan isi)', t: 'check', when: function (c) { return !c.size.fullWidth; } },
      { k: 'size.width', l: 'Lebar (px, sebelum skala)', t: 'num', hint: 'Kalau lebar otomatis aktif, ini jadi batas lebar maksimal.' },
      { k: 'size.autoHeight', l: 'Tinggi otomatis (pas dengan isi)', t: 'check', when: isBanner },
      { k: 'size.height', l: 'Tinggi (px, sebelum skala)', t: 'num', when: function (c) { return c.layout === 'banner' && !c.size.autoHeight; }, hint: 'Isi banner otomatis di tengah secara vertikal.' },
      { k: 'size.fullWidth', l: 'Selebar penuh', t: 'check' },
      { k: 'size.padding', l: 'Padding (px)', t: 'num' },
      { k: 'size.fontSize', l: 'Ukuran font dasar (px)', t: 'num' },
      { k: 'size.radius', l: 'Sudut membulat (px)', t: 'num' },
      { k: 'size.popupWidth', l: 'Lebar popup (px)', t: 'num' },
      { k: 'size.qrSize', l: 'Lebar maksimal QRIS (px)', t: 'num' },
      { k: 'size.fontFamily', l: 'Font', t: 'select', o: [['system', 'Bawaan sistem'], ['inherit', 'Ikut website'], ['serif', 'Serif'], ['mono', 'Monospace']] }
    ] },
    { title: 'Ikon', fields: [
      { k: 'icon.show', l: 'Tampilkan ikon', t: 'check' },
      { k: 'icon.name', l: 'Pilih ikon', t: 'icons' },
      { k: 'icon.from', l: 'Warna ikon atas', t: 'color' },
      { k: 'icon.to', l: 'Warna ikon bawah', t: 'color' },
      { k: 'icon.url', l: 'Gambar ikon sendiri (opsional)', t: 'text', hint: 'Contoh: assets/logo.png — kosongkan untuk ikon bawaan.' }
    ] },
    { title: 'QRIS', open: true, fields: [
      { k: 'qris.url', l: 'Lokasi gambar QRIS', t: 'text', hint: 'Path relatif dari folder widget, atau URL penuh.' },
      { t: 'file' },
      { k: 'qris.alt', l: 'Teks alternatif', t: 'text' }
    ] },
    { title: 'Animasi & perilaku', fields: [
      { k: 'animation.type', l: 'Animasi', t: 'select', o: [['scale', 'Zoom'], ['fade', 'Fade'], ['slide', 'Geser'], ['none', 'Tanpa animasi']] },
      { k: 'animation.duration', l: 'Durasi (ms)', t: 'num' },
      { k: 'display.autoOpen', l: 'Buka popup otomatis', t: 'check' },
      { k: 'display.autoOpenDelay', l: 'Jeda buka otomatis (ms)', t: 'num', when: function (c) { return c.display.autoOpen; } }
    ] }
  ];

  /* ---------- helper ---------- */
  function get(p) { return p.split('.').reduce(function (o, k) { return o[k]; }, cfg); }
  function set(p, v) { var a = p.split('.'), last = a.pop(); a.reduce(function (o, k) { return o[k]; }, cfg)[last] = v; }
  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { if (k === 'text') e.textContent = attrs[k]; else e[k] = attrs[k]; });
    (kids || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }
  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.id);
    toast.id = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  /* ---------- preview ---------- */
  var siteWidget = null; // widget yang ditempel di atas website pengguna (mode "Muat")
  var layer = document.getElementById('layer'), slot = document.getElementById('slot'), device = document.getElementById('device');

  function send(action) {
    var c = SW.normalize(cfg);
    if (siteWidget) {
      siteWidget.opts.qrOverride = qrPreview || undefined;
      if (action === 'config') siteWidget.update(c);
      else if (action === 'open') siteWidget.open();
      else if (action === 'close') siteWidget.close();
      else if (action === 'replay') siteWidget.replay();
      return;
    }
    if (!frame.contentWindow) return;
    frame.contentWindow.postMessage({ sw: 'preview', action: action, config: c, qr: qrPreview, drag: true }, '*');
  }
  var sendLater = (function () { var t; return function () { clearTimeout(t); t = setTimeout(function () { send('config'); }, 80); }; })();

  /* ---------- seret widget di preview → posisi tersimpan di pengaturan ---------- */
  var CORNERS = { 'top-left': 'kiri atas', 'top-right': 'kanan atas', 'bottom-left': 'kiri bawah', 'bottom-right': 'kanan bawah' };
  function applyMove(pos) {
    Object.assign(cfg.position, pos);
    ['position.corner', 'position.offsetX', 'position.offsetY'].forEach(function (k) {
      var i = document.querySelector('[data-k="' + k + '"]');
      if (i) i.value = get(k);
    });
    refresh(); // script ikut diperbarui
    toast('Posisi: ' + CORNERS[pos.corner] + ', jarak ' + pos.offsetX + ' / ' + pos.offsetY + ' px');
  }
  function applyXMove(pos) {
    Object.assign(cfg.closeButton, pos);
    ['closeButton.offsetX', 'closeButton.offsetY', 'closeButton.alignIcon'].forEach(function (k) {
      var i = document.querySelector('[data-k="' + k + '"]');
      if (!i) return;
      if (i.type === 'checkbox') i.checked = !!get(k); else i.value = get(k);
    });
    refresh();
    toast('Tombol X: jarak atas ' + pos.offsetY + ' px, jarak kanan ' + pos.offsetX + ' px');
  }
  window.addEventListener('message', function (e) {
    if (e.source !== frame.contentWindow || !e.data) return;
    if (e.data.sw === 'moved') applyMove(e.data.position);
    else if (e.data.sw === 'xmoved') applyXMove(e.data.position);
  });

  /* ---------- preview di website pengguna ---------- */
  function normalizeUrl(v) {
    v = (v || '').trim();
    if (!v) return '';
    if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
    try { return new URL(v).href; } catch (e) { return ''; }
  }
  function setSite(url) {
    if (siteWidget) { siteWidget.destroy(); siteWidget = null; }
    layer.hidden = !url;
    document.getElementById('topField').hidden = !url;
    if (url) {
      frame.src = url;
      slot.style.top = (Number(document.getElementById('siteTop').value) || 0) + 'px';
      siteWidget = SW.mount(slot, SW.normalize(cfg), { preview: true, container: layer, draggable: true, onMove: applyMove, onCloseMove: applyXMove, qrOverride: qrPreview || undefined });
      try { localStorage.setItem('sw-demo-site', url); } catch (e) {}
    } else {
      frame.src = 'index.html?swpreview=1';
    }
  }
  document.getElementById('siteForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var url = normalizeUrl(document.getElementById('siteUrl').value);
    if (!url) return toast('Masukkan alamat website yang valid, mis. https://contoh.com');
    document.getElementById('siteUrl').value = url;
    setSite(url);
  });
  document.getElementById('siteClear').addEventListener('click', function () { setSite(''); });
  document.getElementById('siteTop').addEventListener('input', function () { slot.style.top = (Number(this.value) || 0) + 'px'; });
  try { document.getElementById('siteUrl').value = localStorage.getItem('sw-demo-site') || ''; } catch (e) {}

  frame.addEventListener('load', function () { if (!siteWidget) send('config'); });

  /* ---------- script siap tempel ---------- */
  var BASE_KEY = 'sw-demo-base', CDN = 'https://cdn.jsdelivr.net/gh/fixsarts/widgets@main/Support/';
  var snipOut = null;
  function defaultBase() {
    var saved = ''; try { saved = localStorage.getItem(BASE_KEY) || ''; } catch (e) {}
    if (saved) return saved;
    return /^https?:/.test(location.protocol) && !/^(localhost|127\.|0\.0\.0\.0)/.test(location.hostname) ? new URL('./', location.href).href : CDN;
  }
  var baseUrl = defaultBase();
  function cleanBase(v) { v = (v || '').trim(); return v && !/\/$/.test(v) ? v + '/' : v; }
  function diff(cur, def) { // hanya simpan yang berbeda dari bawaan: script jadi pendek
    var out = {};
    Object.keys(cur).forEach(function (k) {
      var a = cur[k], b = def[k];
      if (a && typeof a === 'object') { var d = diff(a, b || {}); if (Object.keys(d).length) out[k] = d; }
      else if (a !== b) out[k] = a;
    });
    return out;
  }
  function snippetText() {
    var c = SW.normalize(cfg), d = diff(c, SW.normalize({}));
    var json = JSON.stringify(d, null, 2).replace(/</g, '\\u003c');
    var base = cleanBase(baseUrl) || CDN;
    return '<!-- Support Widget -->\n' +
      (c.position.mode === 'inline' ? '<div id="support-widget"></div>\n' : '') +
      '<script>\nwindow.SUPPORT_CONFIG = ' + json + ';\n<\/script>\n' +
      '<script src="' + base + 'js/support-widget.js"><\/script>';
  }
  function updateSnippet() {
    if (snipOut) snipOut.value = snippetText();
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(SW.normalize(cfg))); } catch (e) {} // simpan pengaturan terakhir
  }
  function snippetControl() {
    var inp = h('input', { type: 'text', value: baseUrl, placeholder: CDN });
    inp.addEventListener('input', function () {
      baseUrl = inp.value;
      try { localStorage.setItem(BASE_KEY, baseUrl); } catch (e) {}
      updateSnippet();
    });
    snipOut = h('textarea', { readOnly: true, rows: 9, spellcheck: false });
    snipOut.style.fontFamily = 'ui-monospace,Menlo,Consolas,monospace';
    snipOut.style.fontSize = '12px';
    snipOut.style.minHeight = '160px';
    snipOut.addEventListener('focus', function () { snipOut.select(); });
    var copy = h('button', { type: 'button', className: 'btn primary', text: 'Salin script' });
    copy.addEventListener('click', function () { copyText(snippetText(), 'Script disalin. Tempel di website tujuan.'); });
    return h('div', { className: 'field' }, [
      h('span', { text: 'Alamat folder widget (tempat js/ dan css/ di-hosting)' }), inp,
      h('span', { className: 'hint', text: 'Contoh GitHub Pages / jsDelivr. Harus bisa dibuka publik, karena website lain memuat widget dari sini.' }),
      snipOut, copy,
      h('span', { className: 'hint', text: 'Pengaturan ikut tertanam di script, jadi tiap website boleh punya tampilan/teks sendiri tanpa menimpa file apa pun.' })
    ]);
  }
  function copyText(t, msg) {
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(
      function () { toast(msg); },
      function () {
        var ta = h('textarea', { value: t });
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
        toast(msg);
      });
  }

  /* ---------- bangun panel ---------- */
  var conds = [];
  function refresh() { conds.forEach(function (x) { x.el.hidden = !x.when(cfg); }); updateSnippet(); }

  function control(f) {
    if (f.t === 'file') {
      var inp = h('input', { type: 'file', accept: 'image/*' });
      inp.addEventListener('change', function () {
        var file = inp.files[0];
        if (!file) return;
        var r = new FileReader();
        r.onload = function () {
          qrPreview = r.result;
          cfg.qris.url = 'assets/' + file.name;
          document.querySelector('[data-k="qris.url"]').value = cfg.qris.url;
          send('config');
          updateSnippet();
          toast('Preview diganti. Salin file ke folder assets/ dengan nama: ' + file.name);
        };
        r.readAsDataURL(file);
      });
      return h('label', { className: 'field' }, [h('span', { text: 'Ganti gambar QRIS (preview)' }), inp,
        h('span', { className: 'hint', text: 'Setelah memilih, taruh file yang sama di folder assets/ lalu unduh config.' })]);
    }
    if (f.t === 'snippet') return snippetControl();
    if (f.t === 'icons') {
      var grid = h('div', { className: 'icons' });
      var pick = function (name) {
        Array.prototype.forEach.call(grid.children, function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-name') === name); });
      };
      SW.icons.forEach(function (n) {
        var b = h('button', { type: 'button', title: n });
        b.setAttribute('data-name', n);
        b.innerHTML = SW.iconSvg(n, '#475569', '#475569', 24);
        b.addEventListener('click', function () { set(f.k, n); pick(n); sendLater(); updateSnippet(); });
        grid.appendChild(b);
      });
      pick(get(f.k));
      return h('div', { className: 'field' }, [h('span', { text: f.l }), grid]);
    }
    var v = get(f.k), input;
    if (f.t === 'select') {
      input = h('select', {}, f.o.map(function (o) { return h('option', { value: o[0], text: o[1] }); }));
      input.value = String(v);
    } else if (f.t === 'area') {
      input = h('textarea', { value: v });
    } else if (f.t === 'check') {
      input = h('input', { type: 'checkbox', checked: !!v });
    } else {
      input = h('input', { type: f.t === 'num' ? 'number' : f.t === 'color' ? 'color' : 'text', value: v });
    }
    input.setAttribute('data-k', f.k);
    var evt = f.t === 'select' || f.t === 'check' || f.t === 'color' ? 'change' : 'input';
    var onchange = function () {
      var val = f.t === 'check' ? input.checked : f.t === 'num' ? Number(input.value) : input.value;
      if (f.t === 'select' && typeof v === 'number') val = Number(val);
      set(f.k, val);
      if (f.k === 'qris.url') qrPreview = null; // path diubah manual: pakai file asli
      refresh();
      sendLater();
    };
    input.addEventListener(evt, onchange);
    if (f.t === 'color') input.addEventListener('input', onchange);

    var wrap = h('label', { className: 'field' + (f.t === 'check' ? ' check' : '') });
    if (f.t === 'check') { wrap.appendChild(input); wrap.appendChild(h('span', { text: f.l })); }
    else { wrap.appendChild(h('span', { text: f.l })); wrap.appendChild(input); }
    if (f.hint) wrap.appendChild(h('span', { className: 'hint', text: f.hint }));
    if (f.when) conds.push({ el: wrap, when: f.when });
    return wrap;
  }

  function build() {
    var box = document.getElementById('settings');
    box.innerHTML = '';
    conds = [];
    SECTIONS.forEach(function (s) {
      var d = h('details', { open: !!s.open }, [h('summary', { text: s.title }), h('div', { className: 'fields' }, s.fields.map(control))]);
      box.appendChild(d);
    });
    refresh();
  }

  /* ---------- tombol atas ---------- */
  document.getElementById('btnCopy').addEventListener('click', function () { copyText(snippetText(), 'Script disalin. Tempel di website tujuan.'); });
  document.getElementById('btnReset').addEventListener('click', function () {
    if (!confirm('Kembalikan semua pengaturan ke default?')) return;
    cfg = SW.normalize({});
    qrPreview = null;
    build();
    updateSnippet();
    send('config');
  });
  document.getElementById('btnOpen').addEventListener('click', function () { send('open'); });
  document.getElementById('btnReplay').addEventListener('click', function () { send('replay'); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-device]'), function (b) {
    b.addEventListener('click', function () {
      Array.prototype.forEach.call(document.querySelectorAll('[data-device]'), function (x) { x.setAttribute('aria-pressed', x === b); });
      device.className = 'device ' + (b.getAttribute('data-device') === 'mobile' ? 'mobile' : '');
    });
  });

  build();
  updateSnippet();
})();
