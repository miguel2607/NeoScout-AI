/**
 * mockApi.js — Simulación de API REST para NeoScout AI (sin backend real).
 * @module mockApi
 */

/** @typedef {{ id: string, name: string, position: string, age: number, rating: number, price: number, image: string }} Player */

const MOCK_PLAYERS = [
  {
    id: 'p-001',
    name: 'Kylian Mbappé',
    position: 'Delantero',
    age: 25,
    rating: 98,
    price: 200_000_000,
    image: 'https://www.pngarts.com/files/18/Kylian-Mbappe-Transparent-Images.png',
  },
  {
    id: 'p-002',
    name: 'Pedri González',
    position: 'Centrocampista',
    age: 22,
    rating: 99,
    price: 250_000_000,
    image: 'https://www.fcbarcelona.com/photo-resources/2025/09/09/3dd2346c-01bb-4ad9-9b62-ed5cbf8d8b06/08-Pedri.png?width=670&height=790',
  },
  {
    id: 'p-003',
    name: 'Cristiano Ronaldo',
    position: 'Delantero centro',
    age: 39,
    rating: 90,
    price: 100_000_000,
    image: 'https://www.pngarts.com/files/2/Cristiano-Ronaldo-Download-PNG-Image.png',
  },
  {
    id: 'p-004',
    name: 'Lionel Messi',
    position: 'Delantero / mediapunta',
    age: 37,
    rating: 87,
    price: 28_000_000,
    image: 'https://www.pngarts.com/files/5/Footballer-Lionel-Messi-Transparent-Image.png',
  },
];

const PLAYERS_ERROR_CHANCE = 0.12;
const CONTACT_FAIL_CHANCE = 0.18;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Simula GET /api/players
 * - Retardo mínimo 800 ms
 * - Respuesta: array de jugadores
 * - Probabilidad de error 500 (rechazo de Promise)
 */
export function getPlayers() {
  const waitMs = Math.round(randomBetween(800, 1600));
  return delay(waitMs).then(() => {
    if (Math.random() < PLAYERS_ERROR_CHANCE) {
      console.log('500 Internal Server Error');
      const err = new Error('No se pudieron cargar los jugadores. Inténtalo de nuevo.');
      err.code = 500;
      return Promise.reject(err);
    }
    /** @type {Player[]} */
    const copy = MOCK_PLAYERS.map((p) => ({ ...p }));
    if (Math.random() < 0.08) {
      return [];
    }
    return copy;
  });
}

/**
 * Simula POST /api/contact
 * @param {{ nombre: string, email: string, telefono: string, club: string }} data
 * @returns {Promise<{ ok: true, message: string, requestId: string }>}
 */
export function submitContactForm(data) {
  const waitMs = Math.round(randomBetween(1000, 1800));
  return delay(waitMs).then(() => {
    if (Math.random() < CONTACT_FAIL_CHANCE) {
      console.log('500 Internal Server Error');
      const err = new Error('El servidor no pudo registrar tu solicitud en este momento.');
      err.code = 500;
      return Promise.reject(err);
    }
    const requestId = `REQ-${Date.now().toString(36).toUpperCase()}`;
    return {
      ok: true,
      message: 'Solicitud registrada correctamente. Te contactaremos pronto.',
      requestId,
      echo: { ...data },
    };
  });
}