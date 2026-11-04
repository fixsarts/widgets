/*! Fixs.Arts Chat Widget v1.1.0-beta.1 — portable floating contact widget (Vanilla JS, Shadow DOM) */
(function (window, document) {
  'use strict';
  if (!window || !document) return;
  if (window.FixsArtsChat && window.FixsArtsChat.__fx) return;   // already loaded — prevents duplicate widgets

  var CSS_TEXT = `/* styles.css — lives inside the widget's Shadow DOM, so it can never touch the host website.
   All dynamic values (--fx-*) are generated from the config in chat.js (buildCss). */
:host { all: initial; display: block; }
*, *::before, *::after { box-sizing: border-box; }
[hidden] { display: none !important; }
h2, p { margin: 0; }
a { -webkit-tap-highlight-color: transparent; }
svg { display: block; }

.fx-root {
  --ease: cubic-bezier(.22, 1, .36, 1);
  position: fixed; z-index: var(--fx-z); display: flex; gap: var(--fx-poff); pointer-events: none;
  font-family: var(--fx-ff); font-size: var(--fx-fs); font-weight: var(--fx-fw); line-height: var(--fx-lh);
  letter-spacing: var(--fx-ls); color: var(--fx-text); text-align: left; direction: ltr;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility;
}
.fx-root[data-v="bottom"] { bottom: calc(var(--fx-oy) + env(safe-area-inset-bottom, 0px)); flex-direction: column; }
.fx-root[data-v="top"] { top: calc(var(--fx-oy) + env(safe-area-inset-top, 0px)); flex-direction: column-reverse; }
.fx-root[data-h="right"] { right: calc(var(--fx-ox) + env(safe-area-inset-right, 0px)); align-items: flex-end; }
.fx-root[data-h="left"] { left: calc(var(--fx-ox) + env(safe-area-inset-left, 0px)); align-items: flex-start; }

/* While the panel is morphing out of / into the button, the dock leaves the flow so the panel sits exactly where the button was */
.fx-root[data-away] .fx-dock { position: absolute; pointer-events: none; }
.fx-root[data-away][data-v="bottom"] .fx-dock { bottom: 0; }
.fx-root[data-away][data-v="top"] .fx-dock { top: 0; }
.fx-root[data-away][data-h="right"] .fx-dock { right: 0; }
.fx-root[data-away][data-h="left"] .fx-dock { left: 0; }

/* ------------------------------------------------------------------ panel */
.fx-panel {
  position: relative; pointer-events: auto; display: flex; flex-direction: column;
  width: var(--fx-pw); max-width: calc(100vw - var(--fx-ox) - 12px); height: var(--fx-ph);
  border-radius: var(--fx-radius); overflow: hidden; color: var(--fx-text);
  border: var(--fx-bw) solid var(--fx-border); box-shadow: var(--fx-shadow);
  -webkit-backdrop-filter: var(--fx-bf); backdrop-filter: var(--fx-bf);
  transition: box-shadow .4s ease; outline: none;
}
.fx-root[data-h="right"][data-v="bottom"] .fx-panel { transform-origin: 100% 100%; }
.fx-root[data-h="left"][data-v="bottom"] .fx-panel { transform-origin: 0 100%; }
.fx-root[data-h="right"][data-v="top"] .fx-panel { transform-origin: 100% 0; }
.fx-root[data-h="left"][data-v="top"] .fx-panel { transform-origin: 0 0; }
.fx-panel.morphing { box-shadow: none !important; }
.fx-panel.is-min { height: auto !important; }
.fx-panel.is-min .fx-body, .fx-panel.is-min .fx-form, .fx-panel.is-min .fx-credit { display: none; }
.fx-panel.is-min .fx-head { cursor: pointer; border-bottom-color: transparent; }

.fx-layer { position: absolute; inset: 0; background: var(--fx-bg); opacity: var(--fx-bgo); pointer-events: none; }
.fx-img { position: absolute; inset: 0; background-image: var(--fx-img, none); background-size: cover; background-position: center; opacity: var(--fx-imgo); pointer-events: none; }
.fx-inner { position: relative; display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; }

/* header */
.fx-head {
  position: relative; display: flex; align-items: center; gap: 14px; flex: none;
  padding: var(--fx-pad); padding-right: calc(var(--fx-pad) + 68px);
  background: var(--fx-headbg); border-bottom: 1px solid var(--fx-border);
}
.fx-head[data-av="right"] { flex-direction: row-reverse; padding-right: var(--fx-pad); padding-left: calc(var(--fx-pad) + 68px); }
.fx-head[data-av="right"] .fx-id { text-align: right; }
.fx-head[data-av="right"] .fx-status { justify-content: flex-end; }
.fx-head[data-av="right"] .fx-ctrl { right: auto; left: 12px; }
.fx-head[data-av="center"] { flex-direction: column; text-align: center; gap: 10px; padding: calc(var(--fx-pad) + 8px) var(--fx-pad) var(--fx-pad); }
.fx-head[data-av="center"] .fx-status { justify-content: center; }
.fx-id { min-width: 0; flex: 1; }
.fx-name { font-weight: 650; font-size: 1.1em; line-height: 1.25; letter-spacing: -.01em; overflow: hidden; text-overflow: ellipsis; }
.fx-status { display: flex; align-items: center; gap: 7px; margin-top: 3px; color: var(--fx-muted); font-size: .86em; }
.fx-dot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: #22c55e; animation: fx-dot 2.2s ease-out infinite; }
.fx-status[data-on="0"] .fx-dot { background: #94a3b8; animation: none; }
.fx-status.no-dot .fx-dot { display: none; }
.fx-ctrl { position: absolute; top: 12px; right: 12px; display: flex; gap: 4px; z-index: 3; }
.fx-ib {
  display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; padding: 0; margin: 0;
  border: 0; border-radius: 50%; background: transparent; color: var(--fx-muted); cursor: pointer; outline: none;
  transition: background .2s, color .2s, transform .2s var(--ease);
}
.fx-ib svg { width: 17px; height: 17px; }
.fx-ib:hover { background: var(--fx-surface2); color: var(--fx-text); }
.fx-ib:active { transform: scale(.9); }

/* avatar */
.fx-avwrap { flex: none; width: var(--fx-asize); height: var(--fx-asize); filter: var(--fx-afilter); }
.fx-avatar { display: flex; width: 100%; height: 100%; padding: var(--fx-abw); background: var(--fx-aborder); border-radius: var(--fx-aradius); clip-path: var(--fx-aclip); }
.fx-avimg { position: relative; flex: 1; overflow: hidden; display: flex; align-items: center; justify-content: center; border-radius: var(--fx-aradius); clip-path: var(--fx-aclip); background: var(--fx-abg); }
.fx-avimg img { display: block; width: 100%; height: 100%; object-fit: var(--fx-afit); object-position: var(--fx-apos); transform: scale(var(--fx-azoom)); }
.fx-fb { position: absolute; inset: 0; display: none; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: calc(var(--fx-asize) * .34); background: linear-gradient(135deg, var(--fx-accent), var(--fx-accent2)); }
.fx-avimg.is-fb .fx-fb { display: flex; }
.fx-avimg.is-fb img { display: none; }

/* body */
.fx-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: var(--fx-pad); scrollbar-width: thin; scrollbar-color: var(--fx-border) transparent; }
.fx-title { font-size: var(--fx-ts); font-weight: var(--fx-tw); line-height: 1.22; letter-spacing: -.02em; text-align: var(--fx-align); }
.fx-msg { margin-top: 8px; font-size: 1.12em; font-weight: 500; text-align: var(--fx-align); }
.fx-sub { margin-top: 6px; color: var(--fx-muted); text-align: var(--fx-align); }
.fx-desc { margin-top: 10px; color: var(--fx-muted); font-size: .92em; text-align: var(--fx-align); }
.fx-label { margin-top: 20px; font-size: .74em; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--fx-muted); text-align: var(--fx-align); }
.fx-list { display: flex; flex-direction: column; gap: var(--fx-gap); margin: 18px 0 0; padding: 0; list-style: none; }
.fx-label + .fx-list { margin-top: 10px; }

/* chat thread */
.fx-thread { display: flex; flex-direction: column; gap: 10px; }
.fx-row { display: flex; }
.fx-row.me { justify-content: flex-end; }
.fx-bub { max-width: 86%; padding: 10px 14px; border-radius: 18px; overflow-wrap: anywhere; display: flex; flex-direction: column; gap: 4px; }
.fx-row.bot .fx-bub { background: var(--fx-surface2); border: 1px solid var(--fx-border); border-bottom-left-radius: 6px; }
.fx-row.me .fx-bub { color: #fff; background: linear-gradient(135deg, var(--fx-accent), var(--fx-accent2)); border-bottom-right-radius: 6px; white-space: pre-wrap; }
.fx-row { animation: fx-rise .45s var(--ease) both; }
.fx-bub strong { font-weight: 650; }
.fx-bub span { color: var(--fx-muted); }
.fx-actions { margin-top: -2px; animation: fx-rise .5s var(--ease) .1s both; }
.fx-actions .fx-list { margin-top: 4px; }
.fx-typing .fx-bub { flex-direction: row; gap: 5px; padding: 13px 15px; }
.fx-typing i { width: 6px; height: 6px; border-radius: 50%; background: var(--fx-muted); animation: fx-blink 1.1s infinite ease-in-out; }
.fx-typing i:nth-child(2) { animation-delay: .15s; }
.fx-typing i:nth-child(3) { animation-delay: .3s; }
.fx-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

/* message form */
.fx-form { flex: none; display: flex; gap: 8px; align-items: center; padding: 12px var(--fx-pad); border-top: 1px solid var(--fx-border); }
.fx-input {
  flex: 1; min-width: 0; height: 42px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--fx-border); outline: none;
  background: var(--fx-surface); color: var(--fx-text); font: inherit; transition: border-color .2s, box-shadow .2s;
}
.fx-input::placeholder { color: var(--fx-muted); }
.fx-input:focus { border-color: var(--fx-accent); box-shadow: 0 0 0 3px rgba(99, 102, 241, .22); }
.fx-send {
  flex: none; display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; padding: 0; border: 0; border-radius: 50%;
  color: #fff; cursor: pointer; background: linear-gradient(135deg, var(--fx-accent), var(--fx-accent2)); outline: none; transition: transform .2s var(--ease), box-shadow .2s;
}
.fx-send svg { width: 18px; height: 18px; margin-left: -1px; }
.fx-send:hover { transform: scale(1.07); box-shadow: 0 6px 18px -4px var(--fx-accent); }
.fx-send:active { transform: scale(.93); }
.fx-send:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: 2px; }

/* contact cards */
.fx-contact {
  --c-icon: var(--fx-text);
  position: relative; display: flex; align-items: center; gap: 14px; padding: 12px 14px;
  border-radius: calc(var(--fx-radius) * .62); border: 1px solid var(--c-border, var(--fx-border)); background: var(--c-bg, var(--fx-surface));
  color: var(--fx-text); text-decoration: none; outline: none; cursor: pointer;
  transition: transform .28s var(--ease), border-color .25s, background .25s, box-shadow .3s;
}
.fx-c-icon {
  flex: none; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;
  border-radius: calc(var(--fx-radius) * .5); color: var(--c-icon); background: var(--c-ibg, rgba(128, 128, 128, .16)); transition: transform .3s var(--ease), box-shadow .3s;
}
@supports (background: color-mix(in srgb, red 10%, blue)) {
  .fx-c-icon { background: var(--c-ibg, color-mix(in srgb, var(--c-icon) 16%, transparent)); }
}
.fx-c-icon svg { width: 22px; height: 22px; }
.fx-c-icon img { width: 24px; height: 24px; object-fit: contain; }
.fx-c-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.fx-c-name { font-weight: 600; line-height: 1.3; }
.fx-c-sub { color: var(--fx-muted); font-size: .86em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fx-c-welcome { margin-top: 4px; color: var(--fx-muted); font-size: .8em; font-style: italic; }
.fx-c-arrow { flex: none; width: 18px; height: 18px; opacity: .4; transition: transform .28s var(--ease), opacity .25s; }
.fx-c-arrow svg { width: 100%; height: 100%; }
.fx-list li { display: block; margin: 0; padding: 0; }
.fx-contact:hover, .fx-contact:focus-visible { background: var(--c-bg, var(--fx-surface2)); border-color: var(--fx-accent); }
@supports (border-color: color-mix(in srgb, red 10%, blue)) {
  .fx-contact:hover, .fx-contact:focus-visible { border-color: color-mix(in srgb, var(--c-icon) 55%, transparent); }
}
.fx-contact:hover .fx-c-arrow, .fx-contact:focus-visible .fx-c-arrow { opacity: .9; transform: translateX(3px); }
.fx-contact:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: 2px; }
.fx-contact[data-hover="lift"]:hover { transform: translateY(-2px); box-shadow: 0 12px 26px -12px rgba(0, 0, 0, .55); }
.fx-contact[data-hover="scale"]:hover { transform: scale(1.025); }
.fx-contact[data-hover="slide"]:hover { transform: translateX(5px); }
.fx-contact[data-hover="glow"]:hover { box-shadow: 0 0 22px -4px var(--fx-accent); }
@supports (box-shadow: 0 0 10px color-mix(in srgb, red 10%, blue)) {
  .fx-contact[data-hover="glow"]:hover { box-shadow: 0 0 0 1px color-mix(in srgb, var(--c-icon) 35%, transparent), 0 0 28px -4px color-mix(in srgb, var(--c-icon) 60%, transparent); }
}
.fx-contact:hover .fx-c-icon { transform: scale(1.06); }
.fx-contact:active { transform: scale(.985); }

.fx-hours { display: flex; align-items: flex-start; gap: 8px; margin-top: 16px; color: var(--fx-muted); font-size: .84em; }
.fx-hours svg { flex: none; width: 15px; height: 15px; margin-top: 2px; }
.fx-hours b { font-weight: 600; color: var(--fx-text); }

.fx-credit { position: relative; flex: none; padding: 10px var(--fx-pad) 12px; border-top: 1px solid var(--fx-border); text-align: var(--fx-ca); font-size: var(--fx-cs); color: var(--fx-cc); }
.fx-credit a, .fx-credit span { color: inherit; text-decoration: none; opacity: .85; transition: opacity .2s, color .2s; letter-spacing: .02em; }
.fx-credit a:hover, .fx-credit a:focus-visible { opacity: 1; color: var(--fx-accent); outline: none; text-decoration: underline; text-underline-offset: 3px; }

/* staggered entrance (only while the panel is "unsettled", so live updates don't replay it) */
.fx-root[data-stagger] .fx-panel:not([data-settled]) .fx-contact { animation: fx-rise .6s var(--ease) backwards; animation-delay: calc(var(--i, 0) * 70ms + 180ms); }

/* ------------------------------------------------------------ dock + button */
.fx-dock { position: relative; display: flex; align-items: center; pointer-events: auto; }
.fx-btn {
  position: relative; display: block; margin: 0; padding: 0; border: 0; background: none; color: inherit; font: inherit; cursor: pointer;
  opacity: var(--fx-bo); outline: none; -webkit-tap-highlight-color: transparent;
  transition: transform .32s var(--ease), opacity .3s ease;
}
.fx-btn.is-away { opacity: 0 !important; transform: scale(.55) !important; pointer-events: none; }
.fx-bshape { position: relative; display: flex; height: var(--fx-bsize); min-width: var(--fx-bsize); filter: var(--fx-bfilter); transition: filter .3s ease; }
.fx-bface { position: relative; display: flex; flex: 1; border-radius: var(--fx-bradius); clip-path: var(--fx-bclip); }
.fx-bface::before {
  content: ""; position: absolute; inset: 0; z-index: 2; pointer-events: none; border-radius: inherit; clip-path: inherit; padding: var(--fx-bbw); background: var(--fx-bborder);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor;
  mask-image: linear-gradient(#000 0 0), linear-gradient(#000 0 0); mask-clip: content-box, border-box; mask-composite: exclude;
}
.fx-bfill {
  position: relative; display: flex; flex: 1; align-items: center; justify-content: center; gap: 10px; padding: 0 var(--fx-bpad);
  border-radius: var(--fx-bradius); clip-path: var(--fx-bclip); background: var(--fx-bbg); color: var(--fx-bicon); overflow: hidden; white-space: nowrap;
}
.fx-icos { position: relative; z-index: 2; flex: none; width: var(--fx-bicsz); height: var(--fx-bicsz); }
.fx-icos.is-img { width: var(--fx-bi-size); height: var(--fx-bi-size); }
.fx-ico-main svg { stroke-width: var(--fx-bstroke); transform: rotate(var(--fx-brot)); }
.fx-ico { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; transition: transform .4s var(--ease), opacity .25s; }
.fx-ico svg, .fx-ico img { display: block; width: 100%; height: 100%; object-fit: contain; }
.fx-ico-x { opacity: 0; transform: rotate(-90deg) scale(.5); }
.fx-root[data-open].has-x .fx-ico-main { opacity: 0; transform: rotate(90deg) scale(.5); }
.fx-root[data-open].has-x .fx-ico-x { opacity: 1; transform: none; }
/* button photo: fill = covers the whole button, inset = sits inside like an icon. Shape / fit / zoom / focus point all come from config */
.fx-bimg { position: absolute; inset: var(--fx-bi-pad); z-index: 1; opacity: var(--fx-bi-op); transition: transform .4s var(--ease), opacity .25s; }
.fx-imgbox { display: flex; width: 100%; height: 100%; padding: var(--fx-bi-bw); background: var(--fx-bi-bc); border-radius: var(--fx-bi-radius); clip-path: var(--fx-bi-clip); }
.fx-imgin { position: relative; display: block; flex: 1; overflow: hidden; border-radius: var(--fx-bi-radius); clip-path: var(--fx-bi-clip); background: var(--fx-bi-bg); }
.fx-imgin img { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: var(--fx-bi-fit); object-position: var(--fx-bi-pos); transform: scale(var(--fx-bi-zoom)); }
.fx-ico-main .fx-imgbox { opacity: var(--fx-bi-op); }
.fx-root[data-open].has-x .fx-bimg { opacity: 0; transform: scale(.8); }
.fx-blabel { font-weight: 600; font-size: .95em; letter-spacing: .01em; }
.fx-ring { position: absolute; inset: 0; border-radius: var(--fx-bradius); clip-path: var(--fx-bclip); background: var(--fx-bbg); opacity: 0; pointer-events: none; }
.fx-spin { display: none; position: absolute; inset: -3px; border-radius: var(--fx-bradius); clip-path: var(--fx-bclip); overflow: hidden; pointer-events: none; }
.fx-spin::before { content: ""; position: absolute; left: 50%; top: 50%; width: 260%; height: 260%; margin: -130% 0 0 -130%; background: conic-gradient(from 0deg, var(--fx-accent), var(--fx-accent2), transparent 55%, var(--fx-accent)); animation: fx-spin 3.4s linear infinite; }
.fx-btn:focus-visible .fx-bshape { outline: 2px solid var(--fx-accent); outline-offset: 4px; border-radius: var(--fx-bradius); }

.fx-root[data-idle="pulse"] .fx-ring { animation: fx-pulse 2.6s cubic-bezier(.2, .6, .3, 1) infinite; }
.fx-root[data-idle="bounce"] .fx-bshape { animation: fx-bounce 2.8s ease-in-out infinite; }
.fx-root[data-idle="floating"] .fx-bshape { animation: fx-float 3.4s ease-in-out infinite; }
.fx-root[data-idle="rotate"] .fx-spin { display: block; }
.fx-root[data-open] .fx-ring, .fx-root[data-open] .fx-bshape { animation: none; }

@media (hover: hover) {
  .fx-root[data-bh="lift"] .fx-btn:hover { transform: translateY(-3px) scale(1.05); }
  .fx-root[data-bh="scale"] .fx-btn:hover { transform: scale(1.12); }
  .fx-root[data-bh="glow"] .fx-btn:hover .fx-bshape { filter: var(--fx-bfilter-hover); }
  .fx-root[data-bh="rotate"] .fx-btn:hover { transform: rotate(8deg) scale(1.06); }
}
.fx-root:not([data-click="none"]) .fx-btn:active { transform: scale(.93); }
.fx-rip { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, .45); transform: scale(0); animation: fx-rip .65s ease-out forwards; pointer-events: none; }

.fx-badge {
  position: absolute; top: -4px; right: -4px; z-index: 3; display: flex; align-items: center; justify-content: center;
  min-width: 20px; height: 20px; padding: 0 5px; border-radius: 999px; background: var(--fx-badge-bg); color: var(--fx-badge-fg);
  font-size: 11px; font-weight: 700; line-height: 1; box-shadow: 0 0 0 2px rgba(0, 0, 0, .28), 0 4px 10px rgba(0, 0, 0, .35);
  transition: transform .35s var(--ease), opacity .2s; pointer-events: none;
}
.fx-badge.is-hidden { transform: scale(0); opacity: 0; }

.fx-tip {
  position: absolute; top: 50%; padding: 9px 13px; border-radius: 13px; white-space: nowrap; font-size: .93em; font-weight: 500;
  color: var(--fx-text); background: var(--fx-tipbg); border: 1px solid var(--fx-border); box-shadow: 0 10px 28px -10px rgba(0, 0, 0, .55);
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  opacity: 0; pointer-events: none; transition: opacity .22s ease, transform .3s var(--ease);
}
.fx-root[data-h="right"] .fx-tip { right: calc(100% + 14px); transform: translate(10px, -50%); }
.fx-root[data-h="left"] .fx-tip { left: calc(100% + 14px); transform: translate(-10px, -50%); }
.fx-tip.show, .fx-dock:focus-within .fx-tip { opacity: 1; transform: translate(0, -50%); }
@media (hover: hover) { .fx-dock:hover .fx-tip { opacity: 1; transform: translate(0, -50%); } }
.fx-root[data-open] .fx-tip { display: none; }

@keyframes fx-dot { 0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, .55); } 70%, 100% { box-shadow: 0 0 0 7px rgba(34, 197, 94, 0); } }
@keyframes fx-pulse { 0% { opacity: .55; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
@keyframes fx-spin { to { transform: rotate(360deg); } }
@keyframes fx-bounce { 0%, 50%, 100% { transform: translateY(0); } 58% { transform: translateY(-13px); } 66% { transform: translateY(0); } 74% { transform: translateY(-6px); } 82% { transform: translateY(0); } }
@keyframes fx-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes fx-rip { to { transform: scale(4); opacity: 0; } }
@keyframes fx-blink { 0%, 80%, 100% { opacity: .25; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }
@keyframes fx-rise { from { opacity: 0; transform: translateY(14px); } }

@media (max-width: 520px) {
  .fx-head { gap: 12px; }
  .fx-tip { display: none; }
}
@media print { .fx-root { display: none !important; } }
@media (prefers-reduced-motion: reduce) {
  .fx-root[data-rm] *, .fx-root[data-rm] *::before { animation: none !important; transition: none !important; }
}
`;

/* ---- src/icons.js ---- */
/* icons.js — generated by scripts/gen-icons.js (brand paths: Simple Icons, CC0).
   brand: filled 24x24 path data. ui: stroke-based inner SVG markup. */
var ICONS = {
  brand: {
    "whatsapp": "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
    "instagram": "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077",
    "telegram": "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
    "discord": "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z",
    "messenger": "M12 0C5.24 0 0 4.952 0 11.64c0 3.499 1.434 6.521 3.769 8.61a.96.96 0 0 1 .323.683l.065 2.135a.96.96 0 0 0 1.347.85l2.381-1.053a.96.96 0 0 1 .641-.046A13 13 0 0 0 12 23.28c6.76 0 12-4.952 12-11.64S18.76 0 12 0m6.806 7.44c.522-.03.971.567.63 1.094l-4.178 6.457a.707.707 0 0 1-.977.208l-3.87-2.504a.44.44 0 0 0-.49.007l-4.363 3.01c-.637.438-1.415-.317-.995-.966l4.179-6.457a.706.706 0 0 1 .977-.21l3.87 2.505c.15.097.344.094.491-.007l4.362-3.008a.7.7 0 0 1 .364-.13",
    "facebook": "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
    "tiktok": "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
    "x": "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z",
    "youtube": "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    "github": "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
    "line": "M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314",
    "snapchat": "M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z",
    "signal": "M12 0q-.934 0-1.83.139l.17 1.111a11 11 0 0 1 3.32 0l.172-1.111A12 12 0 0 0 12 0M9.152.34A12 12 0 0 0 5.77 1.742l.584.961a10.8 10.8 0 0 1 3.066-1.27zm5.696 0-.268 1.094a10.8 10.8 0 0 1 3.066 1.27l.584-.962A12 12 0 0 0 14.848.34M12 2.25a9.75 9.75 0 0 0-8.539 14.459c.074.134.1.292.064.441l-1.013 4.338 4.338-1.013a.62.62 0 0 1 .441.064A9.7 9.7 0 0 0 12 21.75c5.385 0 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25m-7.092.068a12 12 0 0 0-2.59 2.59l.909.664a11 11 0 0 1 2.345-2.345zm14.184 0-.664.909a11 11 0 0 1 2.345 2.345l.909-.664a12 12 0 0 0-2.59-2.59M1.742 5.77A12 12 0 0 0 .34 9.152l1.094.268a10.8 10.8 0 0 1 1.269-3.066zm20.516 0-.961.584a10.8 10.8 0 0 1 1.27 3.066l1.093-.268a12 12 0 0 0-1.402-3.383M.138 10.168A12 12 0 0 0 0 12q0 .934.139 1.83l1.111-.17A11 11 0 0 1 1.125 12q0-.848.125-1.66zm23.723.002-1.111.17q.125.812.125 1.66c0 .848-.042 1.12-.125 1.66l1.111.172a12.1 12.1 0 0 0 0-3.662M1.434 14.58l-1.094.268a12 12 0 0 0 .96 2.591l-.265 1.14 1.096.255.36-1.539-.188-.365a10.8 10.8 0 0 1-.87-2.35m21.133 0a10.8 10.8 0 0 1-1.27 3.067l.962.584a12 12 0 0 0 1.402-3.383zm-1.793 3.848a11 11 0 0 1-2.345 2.345l.664.909a12 12 0 0 0 2.59-2.59zm-19.959 1.1L.357 21.48a1.8 1.8 0 0 0 2.162 2.161l1.954-.455-.256-1.095-1.953.455a.675.675 0 0 1-.81-.81l.454-1.954zm16.832 1.769a10.8 10.8 0 0 1-3.066 1.27l.268 1.093a12 12 0 0 0 3.382-1.402zm-10.94.213-1.54.36.256 1.095 1.139-.266c.814.415 1.683.74 2.591.961l.268-1.094a10.8 10.8 0 0 1-2.35-.869zm3.634 1.24-.172 1.111a12.1 12.1 0 0 0 3.662 0l-.17-1.111q-.812.125-1.66.125a11 11 0 0 1-1.66-.125",
    "threads": "M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z",
    "pinterest": "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z",
    "twitch": "M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z",
    "spotify": "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z",
    "behance": "M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z",
    "dribbble": "M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"
  },
  brandColor: {"whatsapp":"#25D366","instagram":"#E4405F","telegram":"#26A5E4","discord":"#5865F2","messenger":"#0099FF","facebook":"#1877F2","tiktok":"#25F4EE","x":"#ffffff","youtube":"#FF0000","github":"#ffffff","line":"#06C755","snapchat":"#FFFC00","signal":"#3A76F0","threads":"#ffffff","pinterest":"#E60023","twitch":"#9146FF","spotify":"#1DB954","behance":"#1769FF","dribbble":"#EA4C89"},
  ui: {
    "chat": "<path d=\"M7.9 20A9 9 0 1 0 4 16.1L2 22Z\"/>",
    "chat-dots": "<path d=\"M7.9 20A9 9 0 1 0 4 16.1L2 22Z\"/><path d=\"M8 12h.01M12 12h.01M16 12h.01\"/>",
    "message": "<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"/>",
    "headset": "<path d=\"M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z\"/><path d=\"M21 16v2a4 4 0 0 1-4 4h-5\"/>",
    "sparkle": "<path d=\"M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z\"/><path d=\"M19 15l.7 1.8L21.5 17.5l-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z\"/>",
    "mail": "<rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\"/><path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\"/>",
    "phone": "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"/>",
    "link": "<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"/><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"/>",
    "close": "<path d=\"M18 6 6 18M6 6l12 12\"/>",
    "chevron-down": "<path d=\"m6 9 6 6 6-6\"/>",
    "chevron-up": "<path d=\"m18 15-6-6-6 6\"/>",
    "arrow": "<path d=\"M5 12h14M13 6l6 6-6 6\"/>",
    "send": "<path d=\"M22 2 11 13\"/><path d=\"M22 2 15 22l-4-9-9-4z\"/>",
    "clock": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/>"
  }
};

/* ---- src/helpers.js ---- */
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

/* ---- src/platforms.js ---- */
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

/* ---- src/config.js ---- */
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
      url: 'https://www.instagram.com/fixs.arts/',
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

/* ---- src/animations.js ---- */
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

/* ---- src/chat.js ---- */
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

})(typeof window !== 'undefined' ? window : undefined, typeof document !== 'undefined' ? document : undefined);
