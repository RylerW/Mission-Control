<?php
declare(strict_types=1);

$nonce = base64_encode(random_bytes(16));

header('Content-Type: text/html; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
header(
    "Content-Security-Policy: default-src 'self'; "
    . "script-src 'self' 'nonce-{$nonce}' https://cdn.jsdelivr.net https://unpkg.com; "
    . "style-src 'self' 'nonce-{$nonce}' https://cdn.jsdelivr.net https://fonts.googleapis.com; "
    . "font-src 'self' https://fonts.gstatic.com; "
    . "img-src 'self' data: blob:; "
    . "connect-src 'self' https: http:; "
    . "frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
);
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>n8nDash v2 - Hardened</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <script nonce="<?= htmlspecialchars($nonce, ENT_QUOTES, 'UTF-8') ?>" src="https://unpkg.com/lucide@latest"></script>
  <script nonce="<?= htmlspecialchars($nonce, ENT_QUOTES, 'UTF-8') ?>" src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <script nonce="<?= htmlspecialchars($nonce, ENT_QUOTES, 'UTF-8') ?>" src="https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js"></script>
  <style nonce="<?= htmlspecialchars($nonce, ENT_QUOTES, 'UTF-8') ?>">
    :root{
      --bg:#0b1020; --surface:#0f162b; --card:#121a2f; --text:#e6edf6; --muted:#9aa6b2;
      --line:rgba(255,255,255,.08); --shadow:0 8px 40px rgba(2,8,23,.35); --radius:18px;
      --accent:#0ea5e9; --accent-rgb:14,165,233;
    }
    .theme-ocean{ --accent:#0ea5e9; --accent-rgb:14,165,233; }
    .theme-emerald{ --accent:#22c55e; --accent-rgb:34,197,94; }
    .theme-orchid{ --accent:#a855f7; --accent-rgb:168,85,247; }
    .theme-citrus{ --accent:#f59e0b; --accent-rgb:245,158,11; }

    *{box-sizing:border-box}
    html,body{min-height:100%;background:var(--bg);color:var(--text);font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
    a{color:#9ec1ff}
    .app{display:grid;grid-template-columns:240px 1fr;grid-template-rows:auto 1fr;min-height:100vh;grid-template-areas:"sidebar header" "sidebar main";}
    .sidebar{grid-area:sidebar;background:linear-gradient(180deg,#0f1530,#0b1020);border-right:1px solid var(--line);padding:20px 14px;position:sticky;top:0;height:100vh}
    .brand{display:flex;align-items:center;gap:10px;font-weight:800}
    .brand .logo{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--accent),#04b7ff);display:grid;place-items:center;color:#00131d;box-shadow:0 8px 20px rgba(2,8,23,.35)}
    .side-nav{margin-top:18px}
    .side-nav a{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;color:var(--text);text-decoration:none;border:1px solid transparent}
    .side-nav a:hover{background:rgba(255,255,255,.05);border-color:var(--line)}
    .header{grid-area:header;display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--surface);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:5}
    .header .right{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .chip{border:1px solid var(--line);padding:8px 10px;border-radius:999px;background:rgba(255,255,255,.03)}
    .btn-soft{border:1px solid var(--line);background:rgba(255,255,255,.03);color:var(--text);border-radius:12px;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
    .btn-soft i{width:16px;height:16px}
    .btn-soft:hover{background:rgba(255,255,255,.06)}
    .theme-dot{width:14px;height:14px;border-radius:999px;display:inline-block;margin-right:6px}
    .main{grid-area:main;padding:18px;}
    .toolbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;margin-bottom:14px}
    .canvas{position:relative;border:1px dashed var(--line);border-radius:16px;background:linear-gradient(180deg,#0c1226,#0a0f20);min-height:70vh;padding:14px;overflow:visible}
    .grid-bg{position:absolute;inset:0;background-image:linear-gradient(transparent 31px,var(--line) 32px), linear-gradient(90deg, transparent 31px,var(--line) 32px);background-size:32px 32px;opacity:.35;pointer-events:none}
    .panel{position:absolute;background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);overflow:visible}
    .panel .head{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid var(--line);background:linear-gradient(180deg,rgba(255,255,255,.02),transparent)}
    .title{display:flex;align-items:center;gap:10px;font-weight:700}
    .title .icon{width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,.07);display:grid;place-items:center}
    .panel .body{padding:12px;}
    .divider{height:1px;background:var(--line);margin:10px 0}
    .badge-main{border:1px solid rgba(255,255,255,.15);padding:2px 8px;border-radius:999px;font-size:12px;background:rgba(14,165,233,.15);color:#7dd3fc}
    .toast-float{position:fixed;right:18px;bottom:18px;z-index:9999;max-width:420px}
    .handle{display:none;cursor:move}
    .app.editing .handle{display:inline-grid}
    .ghost{opacity:.65}
    .kpi{font-size:32px;font-weight:800}
    .delta.up{color:#22c55e}.delta.down{color:#ef4444}
    .table-darkish{--bs-table-bg:transparent;--bs-table-color:var(--text);--bs-table-border-color:var(--line)}

    .btn-accent{border:1px solid rgba(var(--accent-rgb), .45) !important;background:rgba(var(--accent-rgb), .16) !important;color:var(--text) !important;box-shadow:0 4px 18px rgba(var(--accent-rgb), .15) !important;transition:.15s ease;display:inline-flex;align-items:center;gap:8px;white-space:nowrap;overflow:hidden;}
    .btn-accent i{width:16px;height:16px}
    .btn-accent:hover{ background:rgba(var(--accent-rgb), .24) !important; border-color:rgba(var(--accent-rgb), .7) !important; }
    .btn-accent:disabled{ opacity:.75 }

    .btn-icon{width:32px;height:32px;padding:0;display:inline-grid;place-items:center;border-radius:10px;border:1px solid var(--line);background:rgba(255,255,255,.03);color:var(--text);position:relative;overflow:hidden;}
    .btn-icon.accent{ border-color:rgba(var(--accent-rgb), .45); }
    .btn-icon:hover{ background:rgba(255,255,255,.06); }
    .btn-icon i{ width:16px; height:16px; }
    .btn-pill{ border-radius:999px; height:32px; padding:0 12px; font-size:13px; line-height:1; }

    .btn-pill .spinner-border,.btn-icon .spinner-border{ width:16px; height:16px; border-width:2px; }

    .nd-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:10000;display:flex;align-items:flex-start;justify-content:center;padding:40px 20px;overflow:auto}
    .nd-sheet{width:min(1100px,96vw);background:var(--surface);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow);overflow:hidden}
    .nd-sheet .nd-head{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--line)}
    .nd-sheet .nd-body{padding:14px}

    @media (max-width:1080px){
      .app{grid-template-columns:80px 1fr}
      .brand .text,.side-nav a span{display:none}
    }
  </style>
</head>
<body class="theme-ocean">
<div class="app" id="appRoot">
  <aside class="sidebar">
    <div class="brand mb-3"><div class="logo">⚡</div><div class="text">n8nDash v2</div></div>
    <div class="side-nav vstack gap-1">
      <a href="#"><i data-lucide="layout"></i><span>Dashboards</span></a>
      <a href="#"><i data-lucide="blocks"></i><span>Widget Library</span></a>
      <a href="#"><i data-lucide="settings"></i><span>Settings</span></a>
    </div>
    <div class="mt-4 small text-secondary">Drag in <b>Edit Mode</b>. Layout and widget configs are stored in localStorage.</div>
  </aside>

  <header class="header">
    <div class="d-flex align-items-center gap-2"><span class="chip">Demo - Frontend-only</span></div>
    <div class="right">
      <div class="dropdown">
        <button class="btn btn-soft dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          <span class="theme-dot" style="background:var(--accent)"></span> Theme
        </button>
        <ul class="dropdown-menu dropdown-menu-dark">
          <li><a class="dropdown-item" data-theme="ocean" href="#">Ocean</a></li>
          <li><a class="dropdown-item" data-theme="emerald" href="#">Emerald</a></li>
          <li><a class="dropdown-item" data-theme="orchid" href="#">Orchid</a></li>
          <li><a class="dropdown-item" data-theme="citrus" href="#">Citrus</a></li>
        </ul>
      </div>
      <button id="btn-edit" class="btn btn-accent btn-pill"><i data-lucide="edit-3"></i> Edit Mode</button>
      <button id="btn-main" class="btn btn-soft"><i data-lucide="refresh-ccw"></i> Run Selected</button>
      <button id="btn-save" class="btn btn-soft"><i data-lucide="save"></i> Save Layout</button>
      <button id="btn-reset" class="btn btn-soft"><i data-lucide="undo2"></i> Reset</button>
    </div>
  </header>

  <main class="main">
    <div class="toolbar">
      <div>
        <h3 class="mb-0">Executive Metrics - Demo</h3>
        <div class="text-secondary small">All widgets configurable - Fetch from n8n webhooks</div>
      </div>
      <div class="d-flex align-items-center gap-2"><span class="badge-main">Main refresh targets: Data and Charts</span></div>
    </div>

    <section class="canvas" id="canvas">
      <div class="grid-bg"></div>

      <section class="panel" data-id="kpi-revenue" data-kind="data" data-main="1" style="left:16px; top:16px; width:360px; height:180px;"></section>
      <section class="panel" data-id="kpi-subs" data-kind="data" data-main="1" style="left:396px; top:16px; width:320px; height:180px;"></section>
      <section class="panel" data-id="list-links" data-kind="data" data-main="1" style="left:736px; top:352px; width:560px; height:260px;"></section>

      <section class="panel" data-id="chart-revenue" data-kind="chart" data-main="1" style="left:736px; top:16px; width:560px; height:320px;"></section>
      <section class="panel" data-id="chart-traffic" data-kind="chart" data-main="1" style="left:16px; top:212px; width:700px; height:320px;"></section>
      <section class="panel" data-id="chart-pie" data-kind="chart" data-main="0" style="left:16px; top:548px; width:360px; height:320px;"></section>

      <section class="panel" data-id="app-blog" data-kind="custom" data-main="0" style="left:396px; top:548px; width:520px; height:300px;"></section>
      <section class="panel" data-id="app-webhook" data-kind="custom" data-main="0" style="left:936px; top:548px; width:360px; height:420px;"></section>
    </section>

    <div class="toast-float" id="toasts"></div>
  </main>
</div>

<script nonce="<?= htmlspecialchars($nonce, ENT_QUOTES, 'UTF-8') ?>" src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script nonce="<?= htmlspecialchars($nonce, ENT_QUOTES, 'UTF-8') ?>">
'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const toastBox = $('#toasts');

function toast(msg, type = 'info') {
  const cls = type === 'success' ? 'success' : type === 'danger' ? 'danger' : type === 'warning' ? 'warning' : 'secondary';
  const el = document.createElement('div');
  el.className = `alert alert-${cls} shadow-sm mt-2`;
  el.textContent = String(msg);
  toastBox.appendChild(el);
  setTimeout(() => el.remove(), 4500);
}

function getByPath(obj, path) {
  if (!path || typeof path !== 'string') return undefined;
  const norm = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
  let cur = obj;
  for (const key of norm) {
    if (cur == null || !Object.prototype.hasOwnProperty.call(cur, key)) return undefined;
    cur = cur[key];
  }
  return cur;
}

function uid() {
  if (window.crypto?.randomUUID) return `id-${crypto.randomUUID()}`;
  return `id-${Math.random().toString(36).slice(2, 11)}`;
}

function safeJSONParse(raw, fallback) {
  try { return JSON.parse(raw); } catch { return fallback; }
}

function safeHttpUrl(url, allowRelative = false) {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed, window.location.origin);
    if (!allowRelative && !/^https?:$/i.test(parsed.protocol)) return null;
    if (allowRelative && parsed.origin === window.location.origin) return parsed.toString();
    if (/^https?:$/i.test(parsed.protocol)) return parsed.toString();
    return null;
  } catch {
    return null;
  }
}

function normalizeHeaders(headers) {
  const out = {};
  for (const h of (Array.isArray(headers) ? headers : [])) {
    const key = String(h?.key || '').trim();
    const value = String(h?.value || '').trim();
    if (!key || key.length > 128) continue;
    if (!/^[A-Za-z0-9-]+$/.test(key)) continue;
    out[key] = value.slice(0, 2048);
  }
  return out;
}

function createLink(url, label) {
  const safe = safeHttpUrl(url, true);
  const a = document.createElement('a');
  a.textContent = label;
  if (!safe) {
    a.href = '#';
    a.classList.add('text-secondary');
    return a;
  }
  a.href = safe;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  return a;
}

lucide.createIcons();
const rootBody = document.body;
const appRoot = $('#appRoot');
const canvas = $('#canvas');
const panels = () => $$('.panel', canvas);
let overlayEl = null;
let EDIT = false;

const THEMES = ['ocean', 'emerald', 'orchid', 'citrus'];
const savedTheme = localStorage.getItem('nd.theme');
if (THEMES.includes(savedTheme)) {
  rootBody.classList.remove(...THEMES.map((t) => `theme-${t}`));
  rootBody.classList.add(`theme-${savedTheme}`);
}

$$('[data-theme]').forEach((a) => a.addEventListener('click', (e) => {
  e.preventDefault();
  const t = a.getAttribute('data-theme');
  if (!THEMES.includes(t)) return;
  rootBody.classList.remove(...THEMES.map((x) => `theme-${x}`));
  rootBody.classList.add(`theme-${t}`);
  localStorage.setItem('nd.theme', t);
}));

function fitCanvasHeight() {
  const bottoms = panels().map((p) => p.offsetTop + p.offsetHeight);
  const maxBottom = bottoms.length ? Math.max(...bottoms) : 0;
  const pad = 48;
  const min = Math.max(window.innerHeight * 0.6, 480);
  canvas.style.height = `${Math.max(maxBottom + pad, min)}px`;
}

const ro = new ResizeObserver(() => fitCanvasHeight());
function observe() { panels().forEach((p) => ro.observe(p)); }

(function loadLayout() {
  const saved = safeJSONParse(localStorage.getItem('nd.layout') || 'null', null);
  if (saved && typeof saved === 'object') {
    panels().forEach((p) => {
      const s = saved[p.dataset.id];
      if (!s) return;
      for (const key of ['left', 'top', 'width', 'height']) {
        const val = String(s[key] || '');
        if (/^\d+px$/.test(val)) p.style[key] = val;
      }
    });
  }
  fitCanvasHeight();
  observe();
  window.addEventListener('resize', fitCanvasHeight);
})();

$('#btn-save').addEventListener('click', () => {
  const out = {};
  panels().forEach((p) => {
    out[p.dataset.id] = { left: p.style.left, top: p.style.top, width: p.style.width, height: p.style.height };
  });
  localStorage.setItem('nd.layout', JSON.stringify(out));
  toast('Layout saved.', 'success');
});

$('#btn-reset').addEventListener('click', () => {
  localStorage.removeItem('nd.layout');
  localStorage.removeItem('nd.widgets.v3_2');
  location.reload();
});

$('#btn-edit').addEventListener('click', () => {
  EDIT = !EDIT;
  $('#btn-edit').innerHTML = EDIT ? '<i data-lucide="check"></i> Done' : '<i data-lucide="edit-3"></i> Edit Mode';
  appRoot.classList.toggle('editing', EDIT);
  panels().forEach((p) => p.classList.toggle('ghost', EDIT));
  lucide.createIcons();
});

interact('.panel').draggable({
  allowFrom: '.handle',
  listeners: {
    start(e) { if (!EDIT) e.interaction.stop(); },
    move(e) {
      const t = e.target;
      const x = (parseFloat(t.dataset.x || '0') || 0) + e.dx;
      const y = (parseFloat(t.dataset.y || '0') || 0) + e.dy;
      t.style.transform = `translate(${x}px,${y}px)`;
      t.dataset.x = String(x);
      t.dataset.y = String(y);
    },
    end(e) {
      const t = e.target;
      const r = t.getBoundingClientRect();
      const pr = canvas.getBoundingClientRect();
      const left = Math.max(8, r.left - pr.left);
      const top = Math.max(8, r.top - pr.top);
      t.style.left = `${Math.round(left / 16) * 16}px`;
      t.style.top = `${Math.round(top / 16) * 16}px`;
      t.style.transform = '';
      t.dataset.x = '0';
      t.dataset.y = '0';
      fitCanvasHeight();
    }
  }
}).resizable({
  edges: { left: false, right: true, bottom: true, top: false },
  listeners: {
    move(e) {
      if (!EDIT) return;
      e.target.style.width = `${Math.round(e.rect.width / 16) * 16}px`;
      e.target.style.height = `${Math.round(e.rect.height / 16) * 16}px`;
      fitCanvasHeight();
    }
  }
});

const LS_WIDGETS = 'nd.widgets.v3_2';
const store = {
  load() {
    const data = safeJSONParse(localStorage.getItem(LS_WIDGETS) || '{}', {});
    return data && typeof data === 'object' ? data : {};
  },
  save(obj) { localStorage.setItem(LS_WIDGETS, JSON.stringify(obj)); },
  get(id) { return this.load()[id] || null; },
  set(id, cfg) { const all = this.load(); all[id] = cfg; this.save(all); }
};

function openOverlay(title, innerHTML) {
  closeOverlay();
  overlayEl = document.createElement('div');
  overlayEl.className = 'nd-overlay';
  overlayEl.innerHTML = `
    <div class="nd-sheet">
      <div class="nd-head">
        <div class="d-flex align-items-center gap-2"><i data-lucide="settings"></i><div class="fw-bold">${esc(title)}</div></div>
        <button type="button" class="btn btn-soft btn-sm" data-ovl="close"><i data-lucide="x"></i> Close</button>
      </div>
      <div class="nd-body" id="nd-pane">${innerHTML}</div>
    </div>
  `;
  document.body.appendChild(overlayEl);
  document.body.style.overflow = 'hidden';
  lucide.createIcons();
  overlayEl.addEventListener('click', (e) => { if (e.target === overlayEl) closeOverlay(); });
  overlayEl.querySelector('[data-ovl="close"]').addEventListener('click', closeOverlay);
}

function closeOverlay() {
  if (!overlayEl) return;
  overlayEl.remove();
  overlayEl = null;
  document.body.style.overflow = '';
}

function headerTemplate(cfg) {
  const actionable = cfg.kind === 'data' || cfg.kind === 'chart';
  return `
  <div class="head">
    <div class="title">
      <div class="icon"><i data-lucide="${esc(cfg.icon || 'box')}"></i></div>
      <span class="w-title">${esc(cfg.title || 'Untitled')}</span>
    </div>
    <div class="d-flex align-items-center gap-2">
      <span class="badge-main">${esc(cfg.typeLabel || (cfg.kind === 'custom' ? 'App' : 'Data'))}</span>
      ${actionable ? '<button class="btn btn-icon btn-refresh accent" title="Refresh"><i data-lucide="refresh-ccw"></i></button>' : ''}
      <button class="btn btn-icon btn-config" title="Configure"><i data-lucide="settings"></i></button>
      <span class="handle" title="Drag (Edit Mode)"><i data-lucide="move"></i></span>
    </div>
  </div>`;
}

function bodyShell() {
  return '<div class="body"><div class="content"></div><div class="divider d-none"></div><div class="status small text-secondary d-none"></div></div>';
}

function setStatus(panel, msg) {
  const div = panel.querySelector('.status');
  const sep = panel.querySelector('.divider');
  if (!msg) {
    div.classList.add('d-none');
    div.textContent = '';
    sep.classList.add('d-none');
    return;
  }
  div.classList.remove('d-none');
  sep.classList.remove('d-none');
  div.textContent = String(msg);
}

function spinRefresh(btn, on) {
  const icon = btn.querySelector('i');
  let sp = btn.querySelector('.spinner-border');
  if (on) {
    if (icon) icon.style.display = 'none';
    if (!sp) {
      sp = document.createElement('span');
      sp.className = 'spinner-border';
      btn.appendChild(sp);
    }
  } else {
    if (icon) icon.style.display = '';
    if (sp) sp.remove();
  }
}

async function fetchAndApply(panel, cfg, applyFn, formDataOverride) {
  const statusSetter = (txt) => setStatus(panel, txt);
  const btn = panel.querySelector('.btn-run') || panel.querySelector('.btn-refresh');
  if (!btn) { toast('No action button found.', 'warning'); return; }

  const isRefreshBtn = btn.classList.contains('btn-refresh');
  btn.disabled = true;
  let spinEl = null;
  if (isRefreshBtn) spinRefresh(btn, true);
  else {
    spinEl = document.createElement('span');
    spinEl.className = 'spinner-border spinner-border-sm';
    btn.appendChild(spinEl);
  }

  const { url, method, sendAsJson, headers } = cfg.n8n || {};
  const safeBaseUrl = safeHttpUrl(url, false);
  if (!safeBaseUrl) {
    toast('Please configure a valid http(s) webhook URL.', 'warning');
    statusSetter('Missing or invalid URL');
    btn.disabled = false;
    if (isRefreshBtn) spinRefresh(btn, false); else if (spinEl) spinEl.remove();
    return;
  }

  let fetchUrl = safeBaseUrl;
  const fetchMethod = String(method || 'POST').toUpperCase() === 'GET' ? 'GET' : 'POST';
  const fetchOpts = {
    method: fetchMethod,
    headers: normalizeHeaders(headers),
    mode: 'cors',
    credentials: 'omit',
    cache: 'no-store',
    redirect: 'error',
    referrerPolicy: 'no-referrer'
  };

  if (fetchMethod === 'GET') {
    if (formDataOverride) {
      const params = new URLSearchParams();
      for (const [k, v] of formDataOverride.entries()) {
        if (v instanceof File) continue;
        params.append(String(k), String(v));
      }
      fetchUrl += (fetchUrl.includes('?') ? '&' : '?') + params.toString();
    }
  } else if (formDataOverride) {
    const hasFile = [...formDataOverride.values()].some((v) => v instanceof File);
    if (!sendAsJson || hasFile) {
      delete fetchOpts.headers['Content-Type'];
      fetchOpts.body = formDataOverride;
    } else {
      fetchOpts.headers['Content-Type'] = 'application/json';
      const obj = {};
      for (const [k, v] of formDataOverride.entries()) obj[k] = v;
      fetchOpts.body = JSON.stringify(obj);
    }
  } else if (sendAsJson) {
    fetchOpts.headers['Content-Type'] = 'application/json';
    fetchOpts.body = '{}';
  }

  statusSetter('Sending...');
  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 30000);
  fetchOpts.signal = ac.signal;

  try {
    const res = await fetch(fetchUrl, fetchOpts);
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    let data = null;
    let text = null;
    let blob = null;

    if (ct.includes('application/json')) {
      try { data = await res.json(); } catch { data = null; }
    } else if (ct.startsWith('text/')) {
      text = await res.text();
    } else {
      blob = await res.blob();
    }

    if (!res.ok) toast(`Webhook returned ${res.status}`, 'warning');
    else toast('Webhook succeeded.', 'success');
    applyFn(data, text, blob, ct);
  } catch (err) {
    toast('Network/CORS/timeout error calling webhook.', 'danger');
    statusSetter('Error (see console / CORS)');
    console.error(err);
  } finally {
    clearTimeout(timeout);
    btn.disabled = false;
    if (isRefreshBtn) spinRefresh(btn, false); else if (spinEl) spinEl.remove();
    fitCanvasHeight();
  }
}

function renderDataWidget(panel, cfg) {
  const content = panel.querySelector('.content');
  const v = cfg.dataSpec || {};
  content.innerHTML = `
    <div class="row g-2 align-items-center">
      <div class="col-12">
        <div class="kpi">
          <span class="main-val" id="v1-${esc(cfg.id)}">${esc(v.demoV1 || '-')}</span>
          <span class="delta ${String(v.demoV2 || '').trim().startsWith('-') ? 'down' : 'up'}" id="v2-${esc(cfg.id)}">${esc(v.demoV2 || '')}</span>
        </div>
        <div class="small text-secondary">${esc(cfg.subtitle || '')}</div>
      </div>
      <div class="col-12" id="list-${esc(cfg.id)}"></div>
    </div>
  `;
  lucide.createIcons();

  if ((cfg.dataSpec?.mode || 'kpi') === 'list') {
    const listEl = $(`#list-${cfg.id}`);
    listEl.innerHTML = `<table class="table table-sm table-darkish align-middle mb-0"><tbody id="tbody-${esc(cfg.id)}"></tbody></table>`;
    const tbody = $(`#tbody-${cfg.id}`);
    const items = Array.isArray(v.demoList) ? v.demoList : [];
    if (!items.length) {
      tbody.innerHTML = '<tr><td class="text-secondary small">No items yet.</td></tr>';
    } else {
      tbody.replaceChildren(...items.map((item) => {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.appendChild(createLink(item.url || '#', String(item.text || 'Item')));
        tr.appendChild(td);
        return tr;
      }));
    }
  }

  $('.btn-refresh', panel).addEventListener('click', async (e) => {
    e.preventDefault();
    await fetchAndApply(panel, cfg, (data) => {
      if ((cfg.dataSpec?.mode || 'kpi') === 'list') {
        const listPath = cfg.dataSpec.listPath || 'items';
        const labelPath = cfg.dataSpec.itemLabelPath || 'title';
        const urlPath = cfg.dataSpec.itemUrlPath || 'url';
        const arr = Array.isArray(getByPath(data, listPath)) ? getByPath(data, listPath) : [];
        const tbody = $(`#tbody-${cfg.id}`);
        if (!arr.length) {
          tbody.innerHTML = '<tr><td class="text-secondary small">No items returned.</td></tr>';
        } else {
          tbody.replaceChildren(...arr.map((it) => {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.appendChild(createLink(getByPath(it, urlPath), String(getByPath(it, labelPath) || 'Item')));
            tr.appendChild(td);
            return tr;
          }));
        }
        setStatus(panel, `Loaded ${arr.length} items.`);
      } else {
        const v1 = getByPath(data, cfg.dataSpec.value1Path || 'value1');
        const v2 = getByPath(data, cfg.dataSpec.value2Path || 'value2');
        const v3 = safeHttpUrl(getByPath(data, cfg.dataSpec.value3UrlPath || 'value3Url'), true);
        const v1El = $(`#v1-${cfg.id}`);
        const v2El = $(`#v2-${cfg.id}`);
        v1El.textContent = v1 != null ? String(v1) : '-';
        v2El.textContent = v2 != null ? String(v2) : '';
        v2El.classList.toggle('down', String(v2 || '').trim().startsWith('-'));
        v2El.classList.toggle('up', !String(v2 || '').trim().startsWith('-'));
        if (v3) {
          let anchor = v1El.closest('a.link-v1');
          if (!anchor) {
            anchor = document.createElement('a');
            anchor.className = 'link-v1';
            anchor.style.textDecoration = 'none';
            anchor.style.color = 'inherit';
            v1El.replaceWith(anchor);
            anchor.appendChild(v1El);
          }
          anchor.href = v3;
          anchor.target = '_blank';
          anchor.rel = 'noopener noreferrer';
        }
        setStatus(panel, 'OK');
      }
    });
  });

  attachConfig(panel, cfg, 'data');
}

function renderChartWidget(panel, cfg) {
  const content = panel.querySelector('.content');
  const canvasId = `c-${cfg.id}`;
  content.innerHTML = `<div style="height:calc(100% - 0px); min-height:180px;"><canvas id="${esc(canvasId)}"></canvas></div>`;
  lucide.createIcons();
  let chart = null;

  async function run() {
    await fetchAndApply(panel, cfg, (data) => {
      if (!window.Chart) return;
      const c = $(`#${canvasId}`);
      if (!c) return;
      const ctx = c.getContext('2d');
      if (chart) chart.destroy();

      const style = cfg.chartSpec?.style || 'line';
      if (style === 'line') {
        const labels = getByPath(data, cfg.chartSpec.labelsPath || 'xLabels') || Array.from({ length: 30 }, (_, i) => i + 1);
        const dsData = getByPath(data, cfg.chartSpec.dataPath || 'series[0].data') || Array.from({ length: 30 }, () => Math.round(7000 + Math.random() * 2000));
        const labelName = cfg.chartSpec.datasetLabel || getByPath(data, 'series[0].label') || 'Series';
        chart = new Chart(ctx, { type: 'line', data: { labels, datasets: [{ label: labelName, data: dsData, tension: 0.35, fill: false, borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { x: { ticks: { color: '#e6edf6' }, grid: { color: 'rgba(255,255,255,.08)' } }, y: { ticks: { color: '#e6edf6' }, grid: { color: 'rgba(255,255,255,.08)' }, suggestedMax: getByPath(data, cfg.chartSpec.yMaxPath || 'yMax') || undefined } } } });
        setStatus(panel, `Line: ${labels.length} points`);
      } else if (style === 'bar') {
        const labels = getByPath(data, cfg.chartSpec.labelsPath || 'labels') || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const dsData = getByPath(data, cfg.chartSpec.dataPath || 'data') || [530, 610, 580, 740, 890, 660, 720];
        const labelName = cfg.chartSpec.datasetLabel || getByPath(data, 'series[0].label') || 'Visits';
        chart = new Chart(ctx, { type: 'bar', data: { labels, datasets: [{ label: labelName, data: dsData }] }, options: { responsive: true, maintainAspectRatio: false, scales: { x: { ticks: { color: '#e6edf6' }, grid: { color: 'rgba(255,255,255,.08)' } }, y: { ticks: { color: '#e6edf6' }, grid: { color: 'rgba(255,255,255,.08)' }, suggestedMax: getByPath(data, cfg.chartSpec.yMaxPath || 'yMax') || undefined } } } });
        setStatus(panel, `Bar: ${labels.length} bars`);
      } else {
        const labels = getByPath(data, cfg.chartSpec.labelsPath || 'labels') || ['A', 'B', 'C'];
        const values = getByPath(data, cfg.chartSpec.dataPath || 'values') || [30, 40, 30];
        chart = new Chart(ctx, { type: 'pie', data: { labels, datasets: [{ data: values }] }, options: { responsive: true, maintainAspectRatio: false } });
        setStatus(panel, `Pie: ${labels.length} slices`);
      }
    });
  }

  $('.btn-refresh', panel).addEventListener('click', (e) => { e.preventDefault(); run(); });
  attachConfig(panel, cfg, 'chart');
}

function inputHtml(f) {
  const id = esc(f.id || uid());
  const nm = esc(f.name || 'field');
  const ph = f.placeholder ? `placeholder="${esc(f.placeholder)}"` : '';
  if (f.type === 'select') return `<div class="col-md-4"><select id="${id}" name="${nm}" class="form-select">${(f.options || []).map((o) => `<option>${esc(o)}</option>`).join('')}</select></div>`;
  if (f.type === 'textarea') return `<div class="col-12"><textarea id="${id}" name="${nm}" rows="4" class="form-control" ${ph}></textarea></div>`;
  if (f.type === 'file') return `<div class="col-12"><input id="${id}" name="${nm}" type="file" class="form-control" /></div>`;
  if (f.type === 'checkbox') return `<div class="col-12 form-check ms-2"><input id="${id}" name="${nm}" class="form-check-input" type="checkbox"><label class="form-check-label" for="${id}">${esc(f.label || nm)}</label></div>`;
  if (f.type === 'number') return `<div class="col-md-4"><input id="${id}" name="${nm}" type="number" class="form-control" ${ph}/></div>`;
  return `<div class="col-md-6"><input id="${id}" name="${nm}" class="form-control" ${ph}/></div>`;
}

function renderCustomWidget(panel, cfg) {
  const content = panel.querySelector('.content');
  content.innerHTML = `
    <form class="row g-2" id="frm-${esc(cfg.id)}">
      ${(cfg.customSpec?.responseOnly) ? '' : (cfg.customSpec?.fields || [
        { id: uid(), type: 'text', name: 'topic', placeholder: 'Topic (e.g., AI for SMBs)' },
        { id: uid(), type: 'select', name: 'tone', options: ['Professional', 'Friendly', 'Playful'] }
      ]).map((f) => inputHtml(f)).join('')}
      <div class="${(cfg.customSpec?.responseOnly) ? 'col-12 d-grid' : 'col-md-2 d-grid'}">
        <button class="btn btn-accent btn-pill btn-run" type="submit"><i data-lucide="play"></i><span>${esc(cfg.runLabel || 'Run')}</span></button>
      </div>
    </form>
    <div class="divider d-none"></div>
    <div class="small status d-none" id="resp-${esc(cfg.id)}"></div>
  `;
  lucide.createIcons();

  $(`#frm-${cfg.id}`, panel).addEventListener('submit', async (e) => {
    e.preventDefault();
    const respEl = $(`#resp-${cfg.id}`, panel);
    setStatus(panel, 'Sending...');
    await fetchAndApply(panel, cfg, (data, text, blob, ct) => {
      respEl.innerHTML = '';
      if (ct.includes('application/json')) {
        const pre = document.createElement('pre');
        pre.className = 'small mb-0';
        pre.textContent = JSON.stringify(data, null, 2);
        respEl.appendChild(pre);
      } else if (ct.startsWith('text/')) {
        const pre = document.createElement('pre');
        pre.className = 'small mb-0';
        pre.textContent = text || '';
        respEl.appendChild(pre);
      } else if (blob) {
        const url = URL.createObjectURL(blob);
        const wrap = document.createElement('div');
        wrap.textContent = `Received ${ct || 'binary'} (${blob.size.toLocaleString()} bytes). `;
        const dl = document.createElement('a');
        dl.href = url;
        dl.download = 'response';
        dl.textContent = 'Download';
        wrap.appendChild(dl);
        respEl.appendChild(wrap);
      }
      respEl.classList.remove('d-none');
      panel.querySelector('.divider').classList.remove('d-none');
      setStatus(panel, 'OK');
    }, new FormData(e.target));
  });

  attachConfig(panel, cfg, 'custom');
}

function identityFields(cfg) {
  return `<div class="row g-2"><div class="col-md-4"><label class="form-label small">Icon (lucide)</label><input class="form-control form-control-sm" data-cfg="icon" value="${esc(cfg.icon)}" placeholder="e.g. dollar-sign"/></div><div class="col-md-6"><label class="form-label small">Title</label><input class="form-control form-control-sm" data-cfg="title" value="${esc(cfg.title)}"/></div><div class="col-md-2"><label class="form-label small">Badge</label><select class="form-select form-select-sm" data-cfg="typeLabel"><option ${cfg.typeLabel === 'Data' ? 'selected' : ''}>Data</option><option ${cfg.typeLabel === 'App' ? 'selected' : ''}>App</option></select></div></div>`;
}

function n8nFields(cfg) {
  const n = cfg.n8n || {};
  return `<div class="row g-2 mt-2"><div class="col-md-8"><label class="form-label small">Webhook URL</label><input class="form-control form-control-sm" data-cfg="url" value="${esc(n.url || '')}" placeholder="https://your-n8n/webhook/..."/></div><div class="col-md-2"><label class="form-label small">Method</label><select class="form-select form-select-sm" data-cfg="method"><option ${n.method === 'POST' ? 'selected' : ''}>POST</option><option ${n.method === 'GET' ? 'selected' : ''}>GET</option></select></div><div class="col-md-2"><label class="form-label small">POST Body</label><select class="form-select form-select-sm" data-cfg="sendAsJson"><option value="auto" ${!n.sendAsJson ? 'selected' : ''}>Auto</option><option value="json" ${n.sendAsJson ? 'selected' : ''}>JSON</option></select></div></div>`;
}

function configForm(cfg, kind) {
  return `
    <form class="wcfg" autocomplete="off">
      ${identityFields(cfg)}
      ${n8nFields(cfg)}
      <div class="divider"></div>
      ${kind === 'data' ? `<div class="row g-2"><div class="col-md-4"><label class="form-label small">Mode</label><select class="form-select form-select-sm" data-cfg="dataMode"><option value="kpi" ${cfg.dataSpec.mode !== 'list' ? 'selected' : ''}>KPI</option><option value="list" ${cfg.dataSpec.mode === 'list' ? 'selected' : ''}>List</option></select></div><div class="col-md-4"><label class="form-label small">value1 path</label><input class="form-control form-control-sm" data-cfg="value1Path" value="${esc(cfg.dataSpec.value1Path || 'value1')}"/></div><div class="col-md-4"><label class="form-label small">value2 path</label><input class="form-control form-control-sm" data-cfg="value2Path" value="${esc(cfg.dataSpec.value2Path || 'value2')}"/></div></div>` : ''}
      ${kind === 'chart' ? `<div class="row g-2"><div class="col-md-4"><label class="form-label small">Style</label><select class="form-select form-select-sm" data-cfg="chartStyle"><option value="line" ${cfg.chartSpec.style === 'line' ? 'selected' : ''}>Line</option><option value="bar" ${cfg.chartSpec.style === 'bar' ? 'selected' : ''}>Bar</option><option value="pie" ${cfg.chartSpec.style === 'pie' ? 'selected' : ''}>Pie</option></select></div><div class="col-md-4"><label class="form-label small">labels path</label><input class="form-control form-control-sm" data-cfg="labelsPath" value="${esc(cfg.chartSpec.labelsPath || 'labels')}"/></div><div class="col-md-4"><label class="form-label small">data path</label><input class="form-control form-control-sm" data-cfg="dataPath" value="${esc(cfg.chartSpec.dataPath || 'data')}"/></div></div>` : ''}
      ${kind === 'custom' ? `<div class="row g-2"><div class="col-md-6"><label class="form-label small">Run Label</label><input class="form-control form-control-sm" data-cfg="runLabel" value="${esc(cfg.runLabel || 'Run')}"/></div><div class="col-md-6 form-check mt-4"><input class="form-check-input" type="checkbox" data-cfg="responseOnly" ${cfg.customSpec.responseOnly ? 'checked' : ''}><label class="form-check-label">Response-only (no inputs)</label></div></div>` : ''}
      <div class="d-flex justify-content-end gap-2 mt-2"><button type="button" class="btn btn-soft btn-sm" data-act="close">Close</button><button type="submit" class="btn btn-accent btn-sm">Save</button></div>
    </form>
  `;
}

function attachConfig(panel, cfg, kind) {
  const header = panel.querySelector('.head');

  function rerenderHeader() {
    header.querySelector('.title .icon').innerHTML = `<i data-lucide="${esc(cfg.icon)}"></i>`;
    header.querySelector('.w-title').textContent = cfg.title;
    header.querySelector('.badge-main').textContent = cfg.typeLabel;
    lucide.createIcons();
  }

  header.querySelector('.btn-config').onclick = () => {
    openOverlay(`Configure: ${cfg.title}`, configForm(cfg, kind));
    const pane = $('#nd-pane');

    pane.addEventListener('input', (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      if (t.matches('[data-cfg="icon"]')) { cfg.icon = String(t.value || 'box').trim() || 'box'; rerenderHeader(); }
      if (t.matches('[data-cfg="title"]')) { cfg.title = String(t.value || 'Widget'); rerenderHeader(); }
      if (t.matches('[data-cfg="typeLabel"]')) { cfg.typeLabel = String(t.value || 'Data'); rerenderHeader(); }
      if (t.matches('[data-cfg="url"]')) cfg.n8n.url = String(t.value || '').trim();
      if (t.matches('[data-cfg="method"]')) cfg.n8n.method = String(t.value || 'POST');
      if (t.matches('[data-cfg="sendAsJson"]')) cfg.n8n.sendAsJson = t.value === 'json';
      if (kind === 'data') {
        if (t.matches('[data-cfg="dataMode"]')) cfg.dataSpec.mode = t.value;
        if (t.matches('[data-cfg="value1Path"]')) cfg.dataSpec.value1Path = t.value;
        if (t.matches('[data-cfg="value2Path"]')) cfg.dataSpec.value2Path = t.value;
      }
      if (kind === 'chart') {
        if (t.matches('[data-cfg="chartStyle"]')) cfg.chartSpec.style = t.value;
        if (t.matches('[data-cfg="labelsPath"]')) cfg.chartSpec.labelsPath = t.value;
        if (t.matches('[data-cfg="dataPath"]')) cfg.chartSpec.dataPath = t.value;
      }
      if (kind === 'custom') {
        if (t.matches('[data-cfg="runLabel"]')) cfg.runLabel = t.value;
        if (t.matches('[data-cfg="responseOnly"]')) cfg.customSpec.responseOnly = t.checked;
      }
      store.set(cfg.id, cfg);
    });

    pane.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      if (btn.getAttribute('data-act') === 'close') closeOverlay();
    });

    pane.addEventListener('submit', (e) => {
      if (!e.target.matches('.wcfg')) return;
      e.preventDefault();
      store.set(cfg.id, cfg);
      closeOverlay();
      rerenderPanel(panel, cfg);
      toast('Saved.', 'success');
    });
  };
}

function rerenderPanel(panel, cfg) {
  panel.innerHTML = headerTemplate(cfg) + bodyShell();
  lucide.createIcons();
  if (cfg.kind === 'data') renderDataWidget(panel, cfg);
  if (cfg.kind === 'chart') renderChartWidget(panel, cfg);
  if (cfg.kind === 'custom') renderCustomWidget(panel, cfg);
  fitCanvasHeight();
}

function initPanel(panel) {
  const id = panel.dataset.id;
  const kind = panel.dataset.kind;
  const saved = store.get(id);

  const defaults = {
    id,
    kind,
    icon: 'box',
    title: (() => {
      if (id === 'kpi-revenue') return 'Revenue (MRR)';
      if (id === 'kpi-subs') return 'YouTube Subscribers';
      if (id === 'list-links') return 'Latest Headlines';
      if (id === 'chart-revenue') return 'Revenue (30 days)';
      if (id === 'chart-traffic') return 'Traffic (7 days)';
      if (id === 'chart-pie') return 'Market Share';
      if (id === 'app-blog') return 'Blog Generator';
      if (id === 'app-webhook') return 'Webhook App';
      return 'Widget';
    })(),
    typeLabel: kind === 'custom' ? 'App' : 'Data',
    runLabel: kind === 'custom' ? 'Run' : 'Refresh',
    n8n: { url: '', method: 'POST', sendAsJson: false, headers: [] },
    dataSpec: kind === 'data' ? {
      mode: id === 'list-links' ? 'list' : 'kpi',
      value1Path: 'value1', value2Path: 'value2', value3UrlPath: 'value3Url',
      listPath: 'items', itemLabelPath: 'title', itemUrlPath: 'url',
      demoV1: id === 'kpi-revenue' ? '$82,440' : id === 'kpi-subs' ? '12,873' : '-',
      demoV2: id === 'kpi-revenue' ? '+4.3%' : id === 'kpi-subs' ? '+142' : ''
    } : undefined,
    chartSpec: kind === 'chart' ? {
      style: id === 'chart-revenue' ? 'line' : id === 'chart-traffic' ? 'bar' : 'pie',
      labelsPath: id === 'chart-revenue' ? 'xLabels' : 'labels',
      dataPath: id === 'chart-revenue' ? 'series[0].data' : id === 'chart-traffic' ? 'data' : 'values',
      datasetLabel: id === 'chart-revenue' ? 'Revenue' : id === 'chart-traffic' ? 'Visits' : 'Series',
      yMaxPath: 'yMax'
    } : undefined,
    customSpec: kind === 'custom' ? {
      responseOnly: false,
      fields: id === 'app-blog' ? [
        { id: uid(), type: 'text', name: 'topic', placeholder: 'Topic (e.g., AI for SMBs)' },
        { id: uid(), type: 'select', name: 'tone', options: ['Professional', 'Friendly', 'Playful'] }
      ] : [
        { id: uid(), type: 'text', name: 'prompt', placeholder: 'Enter prompt' },
        { id: uid(), type: 'file', name: 'file' }
      ]
    } : undefined,
    subtitle: ''
  };

  const cfg = saved ? Object.assign(defaults, saved) : defaults;
  store.set(id, cfg);

  panel.innerHTML = headerTemplate(cfg) + bodyShell();
  lucide.createIcons();
  if (kind === 'data') renderDataWidget(panel, cfg);
  if (kind === 'chart') renderChartWidget(panel, cfg);
  if (kind === 'custom') renderCustomWidget(panel, cfg);
}

panels().forEach(initPanel);

$('#btn-main').addEventListener('click', () => {
  toast('Refreshing selected widgets...');
  panels().filter((p) => p.dataset.main === '1').forEach((p) => {
    const btn = p.querySelector('.btn-refresh') || p.querySelector('.btn-run');
    if (btn) btn.click();
  });
});
</script>
</body>
</html>
