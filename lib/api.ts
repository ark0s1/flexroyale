import { Player } from '@/types/clash';

/**
 * Appelle le proxy Fly.io qui forward vers l'API Clash Royale.
 * Le proxy (cr-proxy-flexroyale.fly.dev) a le token CR en secret Fly.io
 * et une IP statique whitelistée — résout le problème Vercel rotating IPs.
 */
const CR_API_BASE = 'https://cr-proxy-flexroyale.fly.dev/v1';

export async function getPlayer(tag: string): Promise<Player> {
  const cleanTag = tag.replace('#', '').toUpperCase();
  const encodedTag = encodeURIComponent(`#${cleanTag}`);
  const url = `${CR_API_BASE}/players/${encodedTag}`;

  let response: Response;
  try {
    response = await fetch(url, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('TimeoutError') || msg.includes('timeout')) {
      throw new Error("L'API Clash Royale met trop de temps à répondre. Réessaie.");
    }
    throw new Error("Impossible de contacter l'API Clash Royale. Réessaie dans quelques secondes.");
  }

  if (response.ok) return response.json();

  if (response.status === 404) {
    throw new Error('Joueur introuvable. Vérifie le tag.');
  }
  if (response.status === 401 || response.status === 403) {
    throw new Error('Erreur proxy: token CR invalide côté Fly.io.');
  }
  if (response.status === 429) {
    throw new Error('Trop de requêtes. Réessaie dans quelques secondes.');
  }
  throw new Error(`Erreur API Clash Royale: ${response.status}`);
}

export function formatTag(tag: string): string {
  const clean = tag.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  return `#${clean}`;
}

export function cleanTag(tag: string): string {
  return tag.replace('#', '').toUpperCase();
}

export function isValidTag(tag: string): boolean {
  const clean = tag.replace('#', '');
  return /^[A-Z0-9]{3,12}$/i.test(clean);
}
