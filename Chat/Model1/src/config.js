/* config.js — default configuration, themes, presets and validation.
   The demo dashboard, the live preview and the production widget all read THIS schema. */
var C = (function () {
  var AVATAR = 'https://raw.githubusercontent.com/fixsarts/assets/main/Logos/fixs.arts.gif';

  var DEFAULTS = {
    enabled: true,
    theme: 'dark',                       // light | dark | glass | gradient | custom

    layout: {
      position: 'right',                 // right | left
      vertical: 'bottom',                // bottom | top
      offsetX: 24, offsetY: 24,          // distance from the screen edge (px) — "margin"
      panelWidth: 380,                   // px (shrinks automatically on small screens)
      panelHeight: 540,                  // px, 0 = auto height (always capped to the screen)
      padding: 20,                       // panel inner padding (px)
      gap: 10,                           // gap between platform cards (px)
      panelOffset: 14,                   // gap between floating button and panel (px)
      zIndex: 2147483000
    },

    profile: {
      enabled: true,
      image: AVATAR,                     // URL, relative path or data: URI (GIF/PNG/JPG/JPEG/WebP/SVG)
      alt: '',
      name: 'Fixs.Arts',
      shape: 'circle',                   // circle | square | rounded | squircle | hexagon | custom
      customRadius: '',                  // CSS border-radius, used when shape = custom
      size: 56,                          // px
      borderWidth: 2,                    // px (0 = none)
      borderColor: null,                 // null = accent gradient
      shadow: 40,                        // 0..100
      position: 'left',                  // left | center | right
      fit: 'cover',                      // cover | contain
      zoom: 1, posX: 50, posY: 50,       // zoom 0.5..3, focus point 0..100 (%)
      background: null                   // colour behind the photo
    },

    status: {
      mode: 'online',                    // online | offline | auto (auto uses hours.*)
      onlineText: 'Online',
      offlineText: 'Offline — kami balas secepatnya',
      showDot: true
    },

    hours: {
      enabled: false,
      label: 'Jam operasional',
      text: 'Setiap hari · 09:00 – 21:00',
      timezone: 'Asia/Makassar',
      start: '09:00', end: '21:00',
      days: [0, 1, 2, 3, 4, 5, 6]        // 0 = Sunday
    },

    welcome: {
      title: 'Halo! Selamat datang di Fixs.Arts 👋',
      message: 'Ada yang bisa kami bantu? Tulis pesanmu di bawah ini.',
      subtitle: '',
      description: '',
      contactsLabel: '',
      showClose: true,
      showMinimize: true
    },

    chat: {
      placeholder: 'Ketik pesan…',
      sendLabel: 'Kirim',
      inputLabel: 'Pesan kamu',
      reply: 'Terima kasih sudah menghubungi Fixs.Arts! 👋 Untuk informasi lebih lanjut, silakan pilih platform yang ingin kamu gunakan.',
      replyDelay: 800,                   // ms (typing indicator), 0 = instant
      maxLength: 500
    },

    button: {
      shape: 'circle',                   // circle | rounded | square | pill | squircle | hexagon | custom
      customRadius: '',
      size: 60,
      icon: 'chat',                      // any icon key | avatar | custom
      customIcon: '',                    // <svg> markup when icon = custom
      image: '',                         // image / GIF URL (overrides icon)
      imageMode: 'fill',                 // fill = photo covers the whole button | inset = photo sits inside like an icon
      imageShape: 'same',                // same (as button) | circle | rounded | squircle | hexagon | square | custom
      imageRadius: '',                   // CSS border-radius when imageShape = custom
      imageSize: 70,                     // % of the button (inset mode)
      imagePadding: 0,                   // px gap between photo and button edge (fill mode)
      imageFit: 'cover',                 // cover | contain
      imageZoom: 1,                      // 0.5 .. 3
      imageX: 50, imageY: 50,            // focus point 0..100 (%)
      imageBackground: null,             // colour behind the photo (null = button background)
      imageOpacity: 1,
      imageBorderWidth: 0, imageBorderColor: '#ffffff',
      iconStroke: 2,                     // line thickness of built-in icons
      iconRotate: 0,                     // degrees
      iconSize: 46,                      // % of button height
      iconColor: '#ffffff',
      label: 'Chat dengan kami',         // shown when shape = pill
      closeIcon: true,                   // show an X while the panel is open
      background: null,                  // null = accent
      gradient: { enabled: true, from: '#3b82f6', to: '#8b5cf6', angle: 135, css: '' },
      borderWidth: 0,
      borderColor: '#ffffff',
      shadow: 55,                        // 0..100
      glow: 35,                          // 0..100
      glowColor: null,                   // null = accent
      opacity: 1,
      badge: { enabled: true, text: '1', color: '#ef4444', textColor: '#ffffff', hideOnOpen: true },
      tooltip: { enabled: true, text: 'Chat dengan kami 👋', autoShow: 0 }   // autoShow in ms (0 = off)
    },

    contacts: [
      {
        id: 'whatsapp', type: 'whatsapp', enabled: true, name: 'WhatsApp',
        username: '+62 856-5552-6686', phone: '6285655526686',
        description: 'Chat via WhatsApp',
        welcomeMessage: '',
        message: '',                       // optional prefilled text (added as ?text=)
        url: 'https://wa.me/6285655526686',
        icon: '', iconColor: null, iconBackground: null, background: null, borderColor: null,
        hover: 'lift', target: '_blank'
      },
      {
        id: 'instagram', type: 'instagram', enabled: true, name: 'Instagram',
        username: 'fixs.arts',
        description: '@fixs.arts',
        welcomeMessage: '',
        url: 'https://instagram.com/fixs.arts/',
        icon: '', iconColor: null, iconBackground: null, background: null, borderColor: null,
        hover: 'lift', target: '_blank'
      }
    ],

    appearance: {
      background: null,                  // null = from theme
      gradient: { enabled: false, from: '#0b0b12', to: '#241447', angle: 160, css: '' },
      backgroundImage: '', backgroundImageOpacity: 0.25,
      opacity: 1,                        // panel background transparency (0.2 .. 1)
      blur: null,                        // backdrop blur px (null = from theme)
      glass: false,                      // force glassmorphism on any theme
      borderWidth: 1, borderColor: null,
      shadow: 65,                        // 0..100
      glow: 0, glowColor: null,          // 0..100
      radius: 24,
      accent: null, accent2: null        // null = from theme
    },

    typography: {
      fontFamily: 'system',              // system | inter | space-grotesk | poppins | manrope | dm-sans | jetbrains-mono | serif | mono | custom stack
      loadFont: false,                   // opt-in: load the chosen Google Font
      fontSize: 14, fontWeight: 400,
      titleSize: 20, titleWeight: 700,
      color: null, mutedColor: null,
      lineHeight: 1.55, letterSpacing: 0,
      align: 'left'                      // left | center | right
    },

    animation: {
      open: 'morph',                     // morph | scale | fade | slide | bounce | none
      close: 'morph',
      duration: 380,                     // ms
      easing: 'smooth',                  // smooth | spring | ease | linear
      idle: 'pulse',                     // none | pulse | bounce | rotate | floating
      hover: 'lift',                     // lift | scale | glow | rotate | none
      click: 'ripple',                   // ripple | press | none
      stagger: true,
      reducedMotion: true                // honour prefers-reduced-motion
    },

    credit: {
      enabled: true,
      text: 'Powered by Fixs.Arts',
      url: 'https://github.com/fixsarts',
      color: null, fontSize: 11, align: 'center', newTab: true
    },

    a11y: {
      buttonLabel: 'Buka chat',
      closeButtonLabel: 'Tutup chat',
      panelLabel: 'Chat Fixs.Arts',
      closeLabel: 'Tutup',
      minimizeLabel: 'Minimalkan',
      restoreLabel: 'Buka kembali',
      newTabLabel: '(buka di tab baru)'
    },

    advanced: {
      id: 'fixsarts-chat',
      lazy: false,                       // false | idle | interaction
      delay: 0,                          // ms before the widget appears
      autoOpen: 0,                       // ms, 0 = never
      closeOnEsc: true,
      closeOnOutside: false,
      remember: false,                   // remember open/closed during the session
      devices: { desktop: true, tablet: true, mobile: true },
      customCss: '',
      debug: false
    },

    events: { onReady: null, onMessage: null, onOpen: null, onClose: null, onMinimize: null, onContactClick: null }
  };

  /* ------------------------------------------------------------------ themes */
  var THEMES = {
    dark: {
      bg: '#0a0a0d', text: '#f4f4f6', muted: 'rgba(244,244,246,.62)', border: 'rgba(255,255,255,.10)',
      surface: 'rgba(255,255,255,.045)', surface2: 'rgba(255,255,255,.09)', accent: '#3b82f6', accent2: '#8b5cf6', blur: 0
    },
    light: {
      bg: '#ffffff', text: '#0b0b10', muted: 'rgba(11,11,16,.58)', border: 'rgba(11,11,16,.10)',
      surface: 'rgba(11,11,16,.035)', surface2: 'rgba(11,11,16,.07)', accent: '#2563eb', accent2: '#7c3aed', blur: 0
    },
    glass: {
      bg: 'rgba(14,14,22,.55)', text: '#ffffff', muted: 'rgba(255,255,255,.70)', border: 'rgba(255,255,255,.20)',
      surface: 'rgba(255,255,255,.08)', surface2: 'rgba(255,255,255,.15)', accent: '#60a5fa', accent2: '#a78bfa', blur: 26
    },
    gradient: {
      bg: 'linear-gradient(155deg,#07070c 0%,#12123a 52%,#321a66 100%)', text: '#ffffff', muted: 'rgba(255,255,255,.68)',
      border: 'rgba(255,255,255,.14)', surface: 'rgba(255,255,255,.07)', surface2: 'rgba(255,255,255,.13)',
      accent: '#60a5fa', accent2: '#c084fc', blur: 0
    }
  };
  THEMES.custom = THEMES.dark;

  /* ----------------------------------------------------------------- presets */
  var PRESETS = {
    'fixs-dark': { name: 'Fixs Dark (default)', config: { theme: 'dark' } },
    'fixs-light': {
      name: 'Fixs Light',
      config: {
        theme: 'light',
        button: { gradient: { enabled: false }, background: '#0b0b10', iconColor: '#ffffff', glow: 15, shadow: 45, badge: { color: '#2563eb' } },
        profile: { shape: 'rounded' }, appearance: { shadow: 40 }
      }
    },
    'glass': {
      name: 'Glass',
      config: {
        theme: 'glass', appearance: { glow: 25, shadow: 70 },
        profile: { shape: 'squircle' },
        button: { shape: 'squircle', gradient: { enabled: true, from: 'rgba(255,255,255,0.22)', to: 'rgba(255,255,255,0.06)', angle: 145 }, borderWidth: 1, borderColor: 'rgba(255,255,255,0.45)', glow: 45 }
      }
    },
    'aurora': {
      name: 'Aurora Gradient',
      config: {
        theme: 'gradient',
        button: { shape: 'pill', gradient: { enabled: true, from: '#2563eb', to: '#c026d3', angle: 120 }, glow: 55 },
        profile: { shape: 'rounded' }, appearance: { glow: 30, radius: 28 },
        animation: { idle: 'rotate' }
      }
    },
    'mono': {
      name: 'Mono Black & White',
      config: {
        theme: 'dark',
        appearance: { accent: '#ffffff', accent2: '#a1a1aa', radius: 20, shadow: 80 },
        profile: { shape: 'squircle', borderColor: '#ffffff' },
        button: { shape: 'rounded', gradient: { enabled: false }, background: '#ffffff', iconColor: '#000000', glow: 18, glowColor: '#ffffff', badge: { color: '#000000', textColor: '#ffffff' } },
        animation: { idle: 'floating', open: 'scale', close: 'scale' }
      }
    },
    'neon': {
      name: 'Neon Hex',
      config: {
        theme: 'glass',
        appearance: { accent: '#8b5cf6', accent2: '#22d3ee', glow: 55, glowColor: '#8b5cf6', radius: 22 },
        profile: { shape: 'hexagon', size: 60 },
        button: { shape: 'hexagon', size: 64, gradient: { enabled: true, from: '#8b5cf6', to: '#22d3ee', angle: 135 }, glow: 70, glowColor: '#8b5cf6' },
        animation: { idle: 'pulse', open: 'bounce', close: 'fade' }
      }
    }
  };

  /* -------------------------------------------------------------- validation */
  var T = ['light', 'dark', 'glass', 'gradient', 'custom'];
  var SHAPES_B = ['circle', 'rounded', 'square', 'pill', 'squircle', 'hexagon', 'custom'];
  var SHAPES_A = ['circle', 'square', 'rounded', 'squircle', 'hexagon', 'custom'];
  var ANIM = ['morph', 'scale', 'fade', 'slide', 'bounce', 'none'];
  var RULES = {
    'enabled': ['bool'], 'theme': ['enum', T],
    'layout.position': ['enum', ['right', 'left']], 'layout.vertical': ['enum', ['bottom', 'top']],
    'layout.offsetX': ['num', 0, 600], 'layout.offsetY': ['num', 0, 600], 'layout.panelWidth': ['num', 260, 900],
    'layout.panelHeight': ['num', 0, 1400], 'layout.padding': ['num', 0, 80], 'layout.gap': ['num', 0, 40],
    'layout.panelOffset': ['num', 0, 80], 'layout.zIndex': ['num', 0, 2147483647],
    'profile.enabled': ['bool'], 'profile.image': ['img'], 'profile.alt': ['str', 120], 'profile.name': ['str', 80],
    'profile.shape': ['enum', SHAPES_A], 'profile.customRadius': ['radius'], 'profile.size': ['num', 24, 140],
    'profile.borderWidth': ['num', 0, 12], 'profile.borderColor': ['color', true], 'profile.shadow': ['num', 0, 100],
    'profile.position': ['enum', ['left', 'center', 'right']], 'profile.fit': ['enum', ['cover', 'contain']],
    'profile.zoom': ['num', 0.5, 3], 'profile.posX': ['num', 0, 100], 'profile.posY': ['num', 0, 100], 'profile.background': ['color', true],
    'status.mode': ['enum', ['online', 'offline', 'auto']], 'status.onlineText': ['str', 80], 'status.offlineText': ['str', 120], 'status.showDot': ['bool'],
    'hours.enabled': ['bool'], 'hours.label': ['str', 60], 'hours.text': ['str', 160], 'hours.timezone': ['str', 60],
    'hours.start': ['time'], 'hours.end': ['time'],
    'welcome.title': ['str', 200], 'welcome.message': ['str', 400], 'welcome.subtitle': ['str', 400], 'welcome.description': ['str', 800],
    'chat.placeholder': ['str', 120], 'chat.sendLabel': ['str', 60], 'chat.inputLabel': ['str', 80], 'chat.reply': ['str', 1000],
    'chat.replyDelay': ['num', 0, 5000], 'chat.maxLength': ['num', 20, 2000],
    'welcome.contactsLabel': ['str', 80], 'welcome.showClose': ['bool'], 'welcome.showMinimize': ['bool'],
    'button.shape': ['enum', SHAPES_B], 'button.customRadius': ['radius'], 'button.size': ['num', 32, 120],
    'button.icon': ['str', 40], 'button.customIcon': ['str', 6000], 'button.image': ['img'], 'button.iconSize': ['num', 20, 90],
    'button.iconColor': ['color'], 'button.label': ['str', 40], 'button.closeIcon': ['bool'], 'button.background': ['color', true],
    'button.gradient.enabled': ['bool'], 'button.gradient.from': ['color'], 'button.gradient.to': ['color'], 'button.gradient.angle': ['num', 0, 360],
    'button.borderWidth': ['num', 0, 10], 'button.borderColor': ['color'], 'button.shadow': ['num', 0, 100], 'button.glow': ['num', 0, 100],
    'button.glowColor': ['color', true], 'button.opacity': ['num', 0.1, 1],
    'button.imageMode': ['enum', ['fill', 'inset']], 'button.imageShape': ['enum', ['same'].concat(SHAPES_A)], 'button.imageRadius': ['radius'],
    'button.imageSize': ['num', 20, 100], 'button.imagePadding': ['num', 0, 30], 'button.imageFit': ['enum', ['cover', 'contain']],
    'button.imageZoom': ['num', 0.5, 3], 'button.imageX': ['num', 0, 100], 'button.imageY': ['num', 0, 100], 'button.imageBackground': ['color', true],
    'button.imageOpacity': ['num', 0, 1], 'button.imageBorderWidth': ['num', 0, 10], 'button.imageBorderColor': ['color'],
    'button.iconStroke': ['num', 0.5, 3.5], 'button.iconRotate': ['num', -360, 360],
    'button.badge.enabled': ['bool'], 'button.badge.text': ['str', 4], 'button.badge.color': ['color'], 'button.badge.textColor': ['color'], 'button.badge.hideOnOpen': ['bool'],
    'button.tooltip.enabled': ['bool'], 'button.tooltip.text': ['str', 80], 'button.tooltip.autoShow': ['num', 0, 120000],
    'appearance.background': ['color', true], 'appearance.gradient.enabled': ['bool'], 'appearance.gradient.from': ['color'],
    'appearance.gradient.to': ['color'], 'appearance.gradient.angle': ['num', 0, 360], 'appearance.backgroundImage': ['img'],
    'appearance.backgroundImageOpacity': ['num', 0, 1], 'appearance.opacity': ['num', 0.2, 1], 'appearance.blur': ['num', 0, 60, true],
    'appearance.glass': ['bool'], 'appearance.borderWidth': ['num', 0, 8], 'appearance.borderColor': ['color', true],
    'appearance.shadow': ['num', 0, 100], 'appearance.glow': ['num', 0, 100], 'appearance.glowColor': ['color', true],
    'appearance.radius': ['num', 0, 60], 'appearance.accent': ['color', true], 'appearance.accent2': ['color', true],
    'typography.fontFamily': ['str', 200], 'typography.loadFont': ['bool'], 'typography.fontSize': ['num', 10, 24], 'typography.fontWeight': ['num', 100, 900],
    'typography.titleSize': ['num', 12, 44], 'typography.titleWeight': ['num', 100, 900], 'typography.color': ['color', true],
    'typography.mutedColor': ['color', true], 'typography.lineHeight': ['num', 1, 2.4], 'typography.letterSpacing': ['num', -2, 6],
    'typography.align': ['enum', ['left', 'center', 'right']],
    'animation.open': ['enum', ANIM], 'animation.close': ['enum', ANIM], 'animation.duration': ['num', 0, 3000],
    'animation.easing': ['enum', ['smooth', 'spring', 'ease', 'linear']], 'animation.idle': ['enum', ['none', 'pulse', 'bounce', 'rotate', 'floating']],
    'animation.hover': ['enum', ['lift', 'scale', 'glow', 'rotate', 'none']], 'animation.click': ['enum', ['ripple', 'press', 'none']],
    'animation.stagger': ['bool'], 'animation.reducedMotion': ['bool'],
    'credit.enabled': ['bool'], 'credit.text': ['str', 80], 'credit.url': ['url'], 'credit.color': ['color', true],
    'credit.fontSize': ['num', 8, 20], 'credit.align': ['enum', ['left', 'center', 'right']], 'credit.newTab': ['bool'],
    'a11y.buttonLabel': ['str', 80], 'a11y.closeButtonLabel': ['str', 80], 'a11y.panelLabel': ['str', 80], 'a11y.closeLabel': ['str', 60],
    'a11y.minimizeLabel': ['str', 60], 'a11y.restoreLabel': ['str', 60], 'a11y.newTabLabel': ['str', 60],
    'advanced.id': ['id'], 'advanced.lazy': ['lazy'], 'advanced.delay': ['num', 0, 60000], 'advanced.autoOpen': ['num', 0, 600000],
    'advanced.closeOnEsc': ['bool'], 'advanced.closeOnOutside': ['bool'], 'advanced.remember': ['bool'],
    'advanced.devices.desktop': ['bool'], 'advanced.devices.tablet': ['bool'], 'advanced.devices.mobile': ['bool'],
    'advanced.customCss': ['str', 20000], 'advanced.debug': ['bool']
  };

  function getp(o, path) { var p = path.split('.'), i; for (i = 0; i < p.length; i++) { if (o == null) return undefined; o = o[p[i]]; } return o; }
  function setp(o, path, v) { var p = path.split('.'), i; for (i = 0; i < p.length - 1; i++) { if (!H.isObj(o[p[i]])) o[p[i]] = {}; o = o[p[i]]; } o[p[p.length - 1]] = v; }

  function check(rule, v) {
    var t = rule[0];
    switch (t) {
      case 'bool': return typeof v === 'boolean' ? { v: v } : (v === 'true' || v === 'false') ? { v: v === 'true' } : null;
      case 'num':
        var n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
        if (n === null && rule[3]) return { v: null };
        if (typeof n !== 'number' || !isFinite(n)) return null;
        return { v: H.clamp(n, rule[1], rule[2]), clamped: n < rule[1] || n > rule[2] };
      case 'str': if (typeof v === 'number') v = String(v); return typeof v === 'string' ? { v: v.slice(0, rule[1]) } : null;
      case 'enum': return rule[1].indexOf(v) > -1 ? { v: v } : null;
      case 'color': if (v === null && rule[1]) return { v: null }; return H.isColor(v) ? { v: v.trim() } : null;
      case 'img': if (v === '' || v == null) return { v: '' }; return typeof v === 'string' && H.safeImg(v) ? { v: v.trim() } : null;
      case 'url': if (v === '') return { v: '' }; return typeof v === 'string' && H.safeUrl(v) ? { v: v.trim() } : null;
      case 'radius': if (v === '' || v == null) return { v: '' }; return typeof v === 'string' && /^[0-9a-z%\s\/.\-+*(),]+$/i.test(v) ? { v: v.trim() } : null;
      case 'time': return typeof v === 'string' && /^([01]?\d|2[0-3]):[0-5]\d$/.test(v) ? { v: v } : null;
      case 'id': return typeof v === 'string' && /^[a-zA-Z][\w-]{0,40}$/.test(v) ? { v: v } : null;
      case 'lazy': return (v === false || v === 'idle' || v === 'interaction') ? { v: v } : (v === true ? { v: 'idle' } : null);
    }
    return { v: v };
  }

  /** Expand shorthands so people can write short configs. */
  function shorthand(input) {
    var i = H.isObj(input) ? H.clone(input) : {};
    if (typeof i.credit === 'boolean') i.credit = { enabled: i.credit };
    if (typeof i.credit === 'string') i.credit = { enabled: true, text: i.credit };
    if (typeof i.profile === 'string') i.profile = { image: i.profile };
    if (typeof i.profile === 'boolean') i.profile = { enabled: i.profile };
    if (typeof i.welcome === 'string') i.welcome = { title: i.welcome };
    if (typeof i.hours === 'boolean') i.hours = { enabled: i.hours };
    if (typeof i.theme === 'string') i.theme = i.theme.toLowerCase();
    var b = i.button;
    if (H.isObj(b)) {
      if (typeof b.badge === 'boolean') b.badge = { enabled: b.badge };
      if (typeof b.badge === 'string' || typeof b.badge === 'number') b.badge = { enabled: true, text: String(b.badge) };
      if (typeof b.tooltip === 'boolean') b.tooltip = { enabled: b.tooltip };
      if (typeof b.tooltip === 'string') b.tooltip = { enabled: true, text: b.tooltip };
      if (typeof b.gradient === 'string') b.gradient = { enabled: true, css: b.gradient };
      if (typeof b.gradient === 'boolean') b.gradient = { enabled: b.gradient };
    }
    var a = i.appearance;
    if (H.isObj(a)) {
      if (typeof a.gradient === 'string') a.gradient = { enabled: true, css: a.gradient };
      if (typeof a.gradient === 'boolean') a.gradient = { enabled: a.gradient };
    }
    if (typeof i.animation === 'string') i.animation = { open: i.animation, close: i.animation };
    return i;
  }

  /** Merge input over `current` (defaults for init) and validate. Returns { config, warnings }. */
  function resolve(current, input) {
    var inp = shorthand(input), base = H.clone(current), warnings = [];
    if (typeof inp.preset === 'string') {
      if (PRESETS[inp.preset]) base = H.merge(base, shorthand(PRESETS[inp.preset].config));
      else warnings.push('preset "' + inp.preset + '" not found. Available: ' + Object.keys(PRESETS).join(', '));
    }
    delete inp.preset;
    var cfg = H.merge(base, inp);

    Object.keys(RULES).forEach(function (path) {
      var v = getp(cfg, path);
      if (v === undefined) return;
      var r = check(RULES[path], v);
      if (r === null) {
        warnings.push(path + ': invalid value ' + JSON.stringify(v) + ' — using default ' + JSON.stringify(getp(DEFAULTS, path)));
        setp(cfg, path, getp(DEFAULTS, path));
      } else if (r.v !== v) setp(cfg, path, r.v);
    });

    // hours.days
    if (!Array.isArray(cfg.hours.days)) cfg.hours.days = DEFAULTS.hours.days.slice();
    cfg.hours.days = cfg.hours.days.map(Number).filter(function (d) { return d >= 0 && d <= 6; });

    // custom icon svg is sanitised at render time; contacts array
    if (!Array.isArray(cfg.contacts)) { warnings.push('contacts: must be an array'); cfg.contacts = []; }
    cfg.contacts = cfg.contacts.filter(function (c, i) {
      if (!H.isObj(c)) { warnings.push('contacts[' + i + ']: must be an object — ignored'); return false; }
      return true;
    });
    cfg.contacts.forEach(function (c, i) {
      if (c.enabled === false) return;
      var n = P.normalize(c, i);
      if (!n.__url) warnings.push('contacts[' + i + '] "' + n.name + '": no valid URL (set url, or the fields required by type "' + n.__type + '") — it will be hidden');
    });
    if (!H.isObj(cfg.events)) cfg.events = {};
    return { config: cfg, warnings: warnings };
  }

  return { DEFAULTS: DEFAULTS, THEMES: THEMES, PRESETS: PRESETS, RULES: RULES, resolve: resolve, shorthand: shorthand };
})();
