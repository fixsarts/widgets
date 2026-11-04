/* platforms.js — platform registry. Nothing about WhatsApp/Instagram is hard-coded in the UI:
   the panel renders whatever is in config.contacts and looks each item up here. */
var P = (function () {
  var REG = {};

  function stripAt(s) { return String(s || '').trim().replace(/^@+/, '').replace(/^\/+|\/+$/g, ''); }
  function digits(s) { return String(s || '').replace(/[^\d]/g, ''); }
  function enc(s) { return encodeURIComponent(String(s)); }

  /** Register (or override) a platform type. Public via FixsArtsChat.registerPlatform. */
  function register(key, def) {
    key = String(key || '').toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!key || !H.isObj(def)) return false;
    REG[key] = H.merge({ name: key, color: 'currentColor', icon: 'link', host: null, fields: ['url'], build: null }, def);
    if (def.host && typeof def.host === 'string') REG[key].host = new RegExp(def.host, 'i');
    REG[key].key = key;
    return true;
  }

  function brand(key, name, host, fields, build) {
    register(key, { name: name, color: ICONS.brandColor[key] || 'currentColor', icon: key, host: host, fields: fields, build: build });
  }

  brand('whatsapp', 'WhatsApp', /(^|\.)(wa\.me|whatsapp\.com)$/i, ['phone', 'message'], function (c) {
    var n = digits(c.phone || c.username);
    return n ? 'https://wa.me/' + n + (c.message ? '?text=' + enc(c.message) : '') : '';
  });
  brand('instagram', 'Instagram', /(^|\.)instagram\.com$/i, ['username'], function (c) { var u = stripAt(c.username); return u ? 'https://instagram.com/' + u + '/' : ''; });
  brand('telegram', 'Telegram', /(^|\.)(t\.me|telegram\.(me|org))$/i, ['username', 'message'], function (c) {
    var u = stripAt(c.username); return u ? 'https://t.me/' + u + (c.message ? '?text=' + enc(c.message) : '') : '';
  });
  register('email', {
    name: 'Email', color: '#f59e0b', icon: 'mail', host: null, fields: ['email', 'subject', 'message'],
    build: function (c) {
      var m = String(c.email || c.username || '').trim(); if (!m) return '';
      var q = []; if (c.subject) q.push('subject=' + enc(c.subject)); if (c.message) q.push('body=' + enc(c.message));
      return 'mailto:' + m + (q.length ? '?' + q.join('&') : '');
    }
  });
  brand('discord', 'Discord', /(^|\.)discord\.(gg|com)$/i, ['username'], function (c) { var u = stripAt(c.username); return u ? 'https://discord.gg/' + u : ''; });
  brand('messenger', 'Messenger', /(^|\.)(m\.me|messenger\.com)$/i, ['username'], function (c) { var u = stripAt(c.username); return u ? 'https://m.me/' + u : ''; });
  brand('facebook', 'Facebook', /(^|\.)(facebook|fb)\.com$/i, ['username'], function (c) { var u = stripAt(c.username); return u ? 'https://facebook.com/' + u : ''; });
  brand('tiktok', 'TikTok', /(^|\.)tiktok\.com$/i, ['username'], function (c) { var u = stripAt(c.username); return u ? 'https://tiktok.com/@' + u : ''; });
  brand('x', 'X (Twitter)', /(^|\.)(x|twitter)\.com$/i, ['username'], function (c) { var u = stripAt(c.username); return u ? 'https://x.com/' + u : ''; });
  brand('youtube', 'YouTube', /(^|\.)(youtube\.com|youtu\.be)$/i, ['username'], function (c) { var u = stripAt(c.username); return u ? 'https://youtube.com/@' + u : ''; });
  brand('github', 'GitHub', /(^|\.)github\.com$/i, ['username'], function (c) { var u = stripAt(c.username); return u ? 'https://github.com/' + u : ''; });
  brand('line', 'LINE', /(^|\.)line\.me$/i, ['username'], function (c) { var u = stripAt(c.username); return u ? 'https://line.me/R/ti/p/~' + u : ''; });
  brand('threads', 'Threads', /(^|\.)threads\.(net|com)$/i, ['username'], function (c) { var u = stripAt(c.username); return u ? 'https://threads.net/@' + u : ''; });
  brand('snapchat', 'Snapchat', /(^|\.)snapchat\.com$/i, ['username'], function (c) { var u = stripAt(c.username); return u ? 'https://snapchat.com/add/' + u : ''; });
  brand('signal', 'Signal', /(^|\.)signal\.(me|group)$/i, ['url'], null);
  brand('pinterest', 'Pinterest', /(^|\.)pinterest\.[a-z.]+$/i, ['username'], function (c) { var u = stripAt(c.username); return u ? 'https://pinterest.com/' + u + '/' : ''; });
  brand('twitch', 'Twitch', /(^|\.)twitch\.tv$/i, ['username'], function (c) { var u = stripAt(c.username); return u ? 'https://twitch.tv/' + u : ''; });
  brand('spotify', 'Spotify', /(^|\.)spotify\.com$/i, ['url'], null);
  brand('behance', 'Behance', /(^|\.)behance\.net$/i, ['username'], function (c) { var u = stripAt(c.username); return u ? 'https://behance.net/' + u : ''; });
  brand('dribbble', 'Dribbble', /(^|\.)dribbble\.com$/i, ['username'], function (c) { var u = stripAt(c.username); return u ? 'https://dribbble.com/' + u : ''; });
  register('phone', { name: 'Phone', color: '#22c55e', icon: 'phone', fields: ['phone'], build: function (c) { var n = String(c.phone || c.username || '').replace(/[^\d+]/g, ''); return n ? 'tel:' + n : ''; } });
  register('custom', { name: 'Custom link', color: 'currentColor', icon: 'link', fields: ['url'], build: null });

  /** Guess the platform from `type`, then from the name, then from the URL. */
  function detect(c) {
    var t = String(c.type || '').toLowerCase();
    if (t && REG[t]) return t;
    var nm = String(c.name || '').toLowerCase().trim(), k;
    for (k in REG) if (k !== 'custom' && (k === nm || REG[k].name.toLowerCase() === nm)) return k;
    var u = typeof c.url === 'string' ? c.url.trim() : '';
    if (/^mailto:/i.test(u)) return 'email';
    if (/^tel:/i.test(u)) return 'phone';
    if (u) {
      try {
        var host = new URL(u, 'https://x.invalid/').hostname;
        for (k in REG) if (REG[k].host && REG[k].host.test(host)) return k;
      } catch (e) { /* ignore */ }
    }
    return 'custom';
  }

  /** Resolve the final href for a contact. */
  function resolveUrl(c, def) {
    var url = typeof c.url === 'string' ? c.url.trim() : '';
    if (url) {
      // Prefilled message for WhatsApp links that don't carry text yet
      if (c.__type === 'whatsapp' && c.message && !/[?&]text=/.test(url) && /(wa\.me|whatsapp\.com)/i.test(url)) {
        url += (url.indexOf('?') > -1 ? '&' : '?') + 'text=' + enc(c.message);
      }
      return H.safeUrl(url);
    }
    return def.build ? H.safeUrl(def.build(c)) : '';
  }

  var HOVERS = ['lift', 'glow', 'slide', 'scale', 'none'];

  /** Fill in defaults for one contact entry. */
  function normalize(raw, index) {
    var c = H.isObj(raw) ? H.clone(raw) : {};
    c.__type = detect(c);
    var def = REG[c.__type] || REG.custom;
    c.id = String(c.id || (c.__type + '-' + index));
    c.enabled = c.enabled !== false;
    c.name = String(c.name || def.name);
    c.target = c.target === '_self' ? '_self' : '_blank';
    c.hover = HOVERS.indexOf(c.hover) > -1 ? c.hover : 'lift';
    c.order = typeof c.order === 'number' && isFinite(c.order) ? c.order : index;
    c.__index = index;
    c.__url = resolveUrl(c, def);
    c.__color = def.color;
    return c;
  }

  /** Render an icon (returns HTML). `icon` may be: '' (auto), builtin key, <svg> markup, or an image URL. */
  function iconHtml(c) {
    var def = REG[c.__type] || REG.custom, ic = typeof c.icon === 'string' ? c.icon.trim() : '';
    if (ic && ic.charAt(0) === '<') { var s = H.sanitizeSvg(ic); if (s) return s; }
    if (ic && H.looksLikeUrl(ic)) { var u = H.safeImg(ic); if (u) return '<img src="' + H.esc(u) + '" alt="" loading="lazy" decoding="async">'; }
    return builtin(ic || def.icon);
  }
  function builtin(key) {
    if (ICONS.brand[key]) return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="' + ICONS.brand[key] + '"/></svg>';
    if (ICONS.ui[key]) return ui(key);
    return ui('link');
  }
  function ui(key, w) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONS.ui[key] || '') + '</svg>';
  }

  function list() {
    return Object.keys(REG).map(function (k) { return { key: k, name: REG[k].name, color: REG[k].color, fields: REG[k].fields.slice() }; });
  }

  return { register: register, normalize: normalize, iconHtml: iconHtml, builtin: builtin, ui: ui, list: list, REG: REG, HOVERS: HOVERS, detect: detect };
})();
