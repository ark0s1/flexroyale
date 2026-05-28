import { NextResponse } from 'next/server';

// NO edge runtime — runs on Lambda so we see the real outbound IP that hits the CR API

export async function GET() {
  // 1. Get our outbound IP
  const ipRes = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' }).catch(() => null);
  const ipData = ipRes ? await ipRes.json().catch(() => ({})) : {};
  const outboundIp: string = ipData.ip || 'unknown';

  // 2. Test all tokens against the CR API
  const tokenKeys = ['CLASH_ROYALE_API_TOKEN', 'CR_API_TOKEN_2', 'CR_API_TOKEN_3'];
  const tokenResults: Record<string, { status: number; ok: boolean }> = {};

  for (const key of tokenKeys) {
    const token = process.env[key];
    if (!token) {
      tokenResults[key] = { status: -1, ok: false };
      continue;
    }
    const res = await fetch('https://api.clashroyale.com/v1/players/%23PGU8V0GR8', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    }).catch(() => null);
    tokenResults[key] = {
      status: res?.status ?? -1,
      ok: res?.ok ?? false,
    };
  }

  const anyOk = Object.values(tokenResults).some((r) => r.ok);

  return NextResponse.json({
    outboundIp,
    anyTokenWorked: anyOk,
    tokens: tokenResults,
    hint: anyOk
      ? 'Au moins un token fonctionne pour cette IP.'
      : `L'IP ${outboundIp} n'est whitelistée dans aucun token. Ajoute-la sur developer.clashroyale.com.`,
  });
}
