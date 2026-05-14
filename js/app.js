/**
 * app.js — Interacción NeoScout AI (navbar, reveal, catálogo API, formulario).
 */
import { getPlayers, submitContactForm } from './mockApi.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = String(str);
  return d.innerHTML;
}

function formatPriceEUR(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  if (n >= 1_000_000) return `€${Math.round(n / 1_000_000)}M`;
  if (n >= 1_000) return `€${Math.round(n / 1_000)}K`;
  return `€${n}`;
}

function googleSearchUrl(name) {
  const q = encodeURIComponent(`${name} futbolista`);
  return `https://www.google.com/search?q=${q}`;
}

/** ---------- Navbar móvil ---------- */
function initNav() {
  const toggle = $('#nav-toggle');
  const panel = $('#nav-menu');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    const open = panel.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  panel.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      panel.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
    });
  });
}

/** ---------- Scroll reveal ---------- */
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    $$('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const els = $$('[data-reveal]');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  els.forEach((el) => io.observe(el));
}

function initYear() {
  const y = $('#year');
  if (y) y.textContent = String(new Date().getFullYear());
}

/** ---------- Toast (sin alert) ---------- */
function showToast(message, { error = false, ms = 6500 } = {}) {
  let el = $('.ns-toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'ns-toast';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.toggle('ns-toast--error', error);
  requestAnimationFrame(() => el.classList.add('is-visible'));
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    el.classList.remove('is-visible');
  }, ms);
}

/** ---------- Catálogo jugadores ---------- */
function renderPlayerCard(p) {
  const name = escapeHtml(p.name);
  const pos = escapeHtml(p.position);
  const rating = escapeHtml(String(p.rating));
  const price = escapeHtml(formatPriceEUR(p.price));
  const img = escapeHtml(p.image);
  const href = escapeHtml(googleSearchUrl(p.name));
  const alt = escapeHtml(`Foto de ${p.name}`);
  return `
    <article class="player-card is-visible" data-player-id="${escapeHtml(p.id)}">
      <figure class="player-card__media">
        <a class="player-card__img-link" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="Buscar ${name} en Google">
          <img src="${img}" alt="${alt}" width="320" height="200" class="player-card__img" loading="lazy" decoding="async" referrerpolicy="no-referrer-when-downgrade">
        </a>
      </figure>
      <div class="player-card__body">
        <h3 class="player-card__name">${name}</h3>
        <p class="player-card__role">${pos}</p>
        <div class="player-card__meta">
          <span class="badge badge--rating">OVR <strong>${rating}</strong></span>
          <span class="badge badge--price">${price}</span>
        </div>
      </div>
    </article>
  `;
}

function setBanner(banner, { mode, text, showRetry }) {
  if (!banner) return;
  if (mode === 'hidden') {
    banner.hidden = true;
    banner.classList.remove('ns-api-banner--loading', 'ns-api-banner--error', 'ns-api-banner--empty');
    banner.setAttribute('aria-busy', 'false');
    return;
  }

  banner.hidden = false;
  banner.classList.remove('ns-api-banner--loading', 'ns-api-banner--error', 'ns-api-banner--empty');
  banner.classList.add(`ns-api-banner--${mode}`);
  banner.dataset.mode = mode;

  const p = banner.querySelector('.ns-api-banner__text');
  if (p) p.textContent = text;

  const retry = banner.querySelector('[data-action="retry-players"]');
  if (retry) {
    retry.hidden = !showRetry;
    retry.disabled = mode === 'loading';
  }

  const spin = banner.querySelector('.ns-spinner');
  if (spin) spin.hidden = mode !== 'loading';

  banner.setAttribute('aria-busy', mode === 'loading' ? 'true' : 'false');
}

async function loadPlayers() {
  const grid = $('#catalog-grid');
  const banner = $('#catalog-api-banner');
  const retryBtn = banner?.querySelector('[data-action="retry-players"]');

  if (!grid || !banner) return;

  setBanner(banner, {
    mode: 'loading',
    text: 'Cargando jugadores desde NeoScout…',
    showRetry: false,
  });
  grid.innerHTML = '';

  try {
    const players = await getPlayers();

    if (!players.length) {
      setBanner(banner, {
        mode: 'empty',
        text: 'No hay jugadores disponibles en este momento. Vuelve a intentarlo más tarde.',
        showRetry: true,
      });
      return;
    }

    setBanner(banner, { mode: 'hidden', text: '', showRetry: false });
    grid.innerHTML = players.map(renderPlayerCard).join('');
  } catch (err) {
    setBanner(banner, {
      mode: 'error',
      text: err?.message || 'Ha ocurrido un error al cargar el catálogo.',
      showRetry: true,
    });
  }

  if (retryBtn && !retryBtn._bound) {
    retryBtn._bound = true;
    retryBtn.addEventListener('click', () => loadPlayers());
  }
}

function initCatalog() {
  loadPlayers();
}

/** ---------- Validación formulario ---------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function digitsOnly(s) {
  return String(s).replace(/\D/g, '');
}

function validatePhone(phone) {
  const d = digitsOnly(phone);
  return d.length >= 9 && d.length <= 15;
}

function setFieldError(inputId, message) {
  const err = document.getElementById(`${inputId}-error`);
  const field = document.getElementById(inputId)?.closest('.field');
  if (err) err.textContent = message || '';
  if (field) field.classList.toggle('field--invalid', Boolean(message));
}

function clearFormErrors() {
  ['nombre', 'email', 'telefono', 'club'].forEach((id) => setFieldError(id, ''));
}

function validateForm() {
  clearFormErrors();
  const nombre = ($('#nombre')?.value || '').trim();
  const email = ($('#email')?.value || '').trim();
  const telefono = ($('#telefono')?.value || '').trim();
  const club = ($('#club')?.value || '').trim();

  let ok = true;

  if (!nombre) {
    setFieldError('nombre', 'Escribe tu nombre completo.');
    ok = false;
  }

  if (!email) {
    setFieldError('email', 'El correo electrónico es obligatorio.');
    ok = false;
  } else if (!EMAIL_RE.test(email)) {
    setFieldError('email', 'Introduce un correo válido (ejemplo: nombre@club.com).');
    ok = false;
  }

  if (!telefono) {
    setFieldError('telefono', 'El teléfono es obligatorio.');
    ok = false;
  } else if (!validatePhone(telefono)) {
    setFieldError('telefono', 'Usa un teléfono válido (9–15 dígitos, puedes incluir prefijo +).');
    ok = false;
  }

  if (!club) {
    setFieldError('club', 'Indica el club o equipo.');
    ok = false;
  }

  if (!ok) {
    const first = document.querySelector('.field--invalid input, .field--invalid textarea');
    first?.focus();
  }

  return ok ? { nombre, email, telefono, club } : null;
}

function setSubmitLoading(isLoading, btn) {
  if (!btn) return;
  const defaultText = btn.dataset.defaultText || 'Registrar solicitud de acceso';
  btn.disabled = isLoading;
  btn.classList.toggle('is-loading', isLoading);
  btn.textContent = isLoading ? 'Registrando solicitud…' : defaultText;
}

function initForm() {
  const form = $('#contact-form');
  const btn = $('#contact-submit');
  if (!form || !btn) return;

  btn.dataset.defaultText = btn.textContent.trim();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = validateForm();
    if (!data) return;

    const confirmed = window.confirm(
      '¿Registrar esta solicitud en NeoScout AI?\n\nPodremos contactarte con la información indicada.'
    );
    if (!confirmed) return;

    clearFormErrors();
    setSubmitLoading(true, btn);

    try {
      const res = await submitContactForm(data);
      showToast(`${res.message} (Ref: ${res.requestId})`, { error: false });
      form.reset();
    } catch (err) {
      showToast(err?.message || 'No se pudo completar el registro de tu solicitud.', { error: true });
    } finally {
      setSubmitLoading(false, btn);
    }
  });

  ['nombre', 'email', 'telefono', 'club'].forEach((id) => {
    const el = document.getElementById(id);
    el?.addEventListener('input', () => setFieldError(id, ''));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initYear();
  initCatalog();
  initForm();
});
