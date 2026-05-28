import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return NextResponse.json({ ip: data.ip, message: 'Outbound IP of this server' });
  } catch {
    return NextResponse.json({ ip: 'unknown', error: 'Could not fetch IP' });
  }
}
