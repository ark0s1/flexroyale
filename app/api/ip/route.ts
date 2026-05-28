import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const preferredRegion = 'lhr1';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch('https://api.ipify.org?format=json', {
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json({ ip: data.ip, ts: Date.now() });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
