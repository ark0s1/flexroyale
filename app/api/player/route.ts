import { NextRequest, NextResponse } from 'next/server';
import { getPlayer } from '@/lib/api';
import { calculateAccountValue } from '@/lib/calculator';

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag');

  if (!tag) {
    return NextResponse.json(
      { error: 'Tag joueur requis' },
      { status: 400 }
    );
  }

  try {
    const player = await getPlayer(tag);
    const accountValue = calculateAccountValue(player);

    return NextResponse.json({
      player,
      accountValue,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
