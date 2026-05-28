import { NextResponse } from 'next/server';

const CR_PROXY = 'https://cr-proxy-flexroyale.fly.dev';

export const runtime = 'edge';

export async function GET() {
  const start = Date.now();

  try {
    // Ping le proxy avec un tag connu valide (tag public Supercell)
    const response = await fetch(`${CR_PROXY}/v1/players/%239UV9VPLG`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8_000),
    });

    const latencyMs = Date.now() - start;

    // 200 ou 404 = proxy vivant (404 = joueur inconnu mais proxy répond)
    if (response.ok || response.status === 404) {
      return NextResponse.json({
        status: 'ok',
        proxy: 'reachable',
        latencyMs,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        status: 'degraded',
        proxy: 'error',
        proxyStatus: response.status,
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {
        status: 'down',
        proxy: 'unreachable',
        error: msg,
        latencyMs: Date.now() - start,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
