/* animations.js — open/close transitions for the panel (Web Animations API).
   Idle / hover / click effects live in styles.css; this file only handles panel motion. */
var A = (function () {
  var EASE = {
    smooth: 'cubic-bezier(.22,1,.36,1)',
    spring: 'cubic-bezier(.34,1.56,.64,1)',
    ease: 'ease-in-out',
    linear: 'linear'
  };
  var TYPES = ['morph', 'scale', 'fade', 'slide', 'bounce', 'none'];

  function px(n) { return Math.round(n * 100) / 100 + 'px'; }

  /** Radius (in px) of the floating button's visible face, used as the morph start radius. */
  function buttonRadius(btnShape, bw, bh) {
    try {
      var cs = getComputedStyle(btnShape.querySelector('.fx-bface')), r = cs.borderTopLeftRadius || '0px';
      var v = parseFloat(r);
      if (!isFinite(v)) return 0;
      if (/%$/.test(r)) return Math.min(bw, bh) * v / 100;
      return Math.min(v, Math.min(bw, bh) / 2);
    } catch (e) { return 0; }
  }

  /**
   * Plays one transition and returns the list of Animation objects (first = the one to await).
   * ctx: { panel, inner, btn, shape, layout, dur, easing, dir:'in'|'out' }
   */
  function play(type, ctx) {
    var p = ctx.panel, dir = ctx.dir, out = dir === 'out';
    var dur = out ? Math.max(120, ctx.dur * 0.82) : ctx.dur;
    var easing = out ? 'cubic-bezier(.4,0,.2,1)' : (EASE[ctx.easing] || EASE.smooth);
    var lay = ctx.layout, isB = lay.vertical === 'bottom', isR = lay.position === 'right';
    var opt = { duration: dur, easing: easing, fill: 'both' };
    var frames, list = [];

    function ordered(f) { return out ? f.slice().reverse() : f; }

    if (type === 'morph') {
      var W = p.offsetWidth, Hh = p.offsetHeight, bw = ctx.btn.offsetWidth, bh = ctx.btn.offsetHeight;
      var br = buttonRadius(ctx.shape, bw, bh);
      var pr = parseFloat(getComputedStyle(p).borderTopLeftRadius) || 0;
      var top = isB ? Hh - bh : 0, bottom = isB ? 0 : Hh - bh, left = isR ? W - bw : 0, right = isR ? 0 : W - bw;
      var dy = (isB ? 1 : -1) * (bh + lay.panelOffset);
      var from = { clipPath: 'inset(' + px(top) + ' ' + px(right) + ' ' + px(bottom) + ' ' + px(left) + ' round ' + px(br) + ')', transform: 'translateY(' + px(dy) + ')' };
      var to = { clipPath: 'inset(0px 0px 0px 0px round ' + px(pr) + ')', transform: 'translateY(0px)' };
      p.classList.add('morphing');
      list.push(p.animate(ordered([from, to]), opt));
      if (ctx.inner) {
        list.push(ctx.inner.animate(ordered([
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'translateY(0px)' }
        ]), { duration: dur * (out ? 0.45 : 0.62), delay: out ? 0 : dur * 0.28, easing: out ? 'ease-in' : easing, fill: 'both' }));
      }
      return list;
    }

    if (type === 'fade') frames = [{ opacity: 0 }, { opacity: 1 }];
    else if (type === 'scale') frames = [{ opacity: 0, transform: 'scale(.82)' }, { opacity: 1, transform: 'scale(1)' }];
    else if (type === 'slide') frames = [{ opacity: 0, transform: 'translateY(' + (isB ? 34 : -34) + 'px)' }, { opacity: 1, transform: 'translateY(0)' }];
    else if (type === 'bounce') {
      if (out) frames = [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.78)' }];
      else {
        list.push(p.animate([
          { opacity: 0, transform: 'scale(.55)', offset: 0 },
          { opacity: 1, transform: 'scale(1.07)', offset: 0.55 },
          { opacity: 1, transform: 'scale(.975)', offset: 0.78 },
          { opacity: 1, transform: 'scale(1)', offset: 1 }
        ], { duration: dur * 1.1, easing: 'cubic-bezier(.3,.7,.4,1)', fill: 'both' }));
        return list;
      }
      list.push(p.animate(frames, opt));
      return list;
    }
    else return [];

    list.push(p.animate(ordered(frames), opt));
    return list;
  }

  /** Smoothly animate the panel height between two states (minimise / restore). */
  function height(p, from, to, dur, easing) {
    if (!p.animate) return null;
    return p.animate([{ height: from + 'px' }, { height: to + 'px' }], { duration: dur, easing: EASE[easing] || EASE.smooth, fill: 'forwards' });
  }

  return { EASE: EASE, TYPES: TYPES, play: play, height: height };
})();
