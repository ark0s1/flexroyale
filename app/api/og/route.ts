import { NextRequest, NextResponse } from 'next/server';
import satori from 'satori';
import type { ReactNode } from 'react';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || 'Joueur';
  const value = searchParams.get('value') || '0';
  const grade = searchParams.get('grade') || 'B';
  const trophies = searchParams.get('trophies') || '0';
  const archetype = searchParams.get('archetype') || 'Clash Player';
  const topPercent = searchParams.get('topPercent') || '';

  const gradeColors: Record<string, string> = {
    S: '#FBBF24',
    A: '#10B981',
    B: '#2563EB',
    C: '#8B5CF6',
    D: '#6B7280',
  };

  const gradeColor = gradeColors[grade] || '#6B7280';
  const valueFormatted = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(parseFloat(value));

  const trophiesFormatted = parseInt(trophies).toLocaleString('fr-FR');

  let fontData: Buffer;
  try {
    const fontPath = join(process.cwd(), 'public', 'fonts', 'Inter-Bold.ttf');
    fontData = readFileSync(fontPath);
  } catch {
    fontData = Buffer.alloc(0);
  }

  const satoriOptions: Parameters<typeof satori>[1] = {
    width: 1200,
    height: 630,
    fonts: fontData.length > 0
      ? [{ name: 'Inter', data: fontData, weight: 700, style: 'normal' }]
      : [],
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'flexroyale.vercel.app';
  const siteDomain = siteUrl.replace('https://', '').replace('http://', '');

  const svg = await satori(
    ({
      type: 'div',
      props: {
        style: {
          background: 'linear-gradient(135deg, #07070E 0%, #0D1B3E 50%, #07070E 100%)',
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
        },
        children: [
          // Logo
          {
            type: 'div',
            props: {
              style: { fontSize: '28px', color: '#2563EB', marginBottom: '8px', fontWeight: 700 },
              children: '⚔️ FlexRoyale',
            },
          },
          // Player name
          {
            type: 'div',
            props: {
              style: { fontSize: '52px', fontWeight: 900, marginBottom: '4px' },
              children: name,
            },
          },
          // Grade badge
          {
            type: 'div',
            props: {
              style: {
                background: gradeColor,
                borderRadius: '16px',
                padding: '8px 32px',
                fontSize: '40px',
                fontWeight: 900,
                marginBottom: '24px',
                color: grade === 'S' ? '#000' : '#fff',
              },
              children: `Grade ${grade}`,
            },
          },
          // Value
          {
            type: 'div',
            props: {
              style: { fontSize: '72px', fontWeight: 900, color: '#FBBF24', marginBottom: '8px' },
              children: valueFormatted,
            },
          },
          // Subtitle
          {
            type: 'div',
            props: {
              style: { fontSize: '22px', color: '#93C5FD', marginBottom: '24px' },
              children: 'Valeur estimée du compte',
            },
          },
          // Stats row
          {
            type: 'div',
            props: {
              style: { display: 'flex', gap: '40px', fontSize: '20px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { textAlign: 'center' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: { color: '#FBBF24', fontWeight: 700, fontSize: '28px' },
                          children: trophiesFormatted,
                        },
                      },
                      {
                        type: 'div',
                        props: { style: { color: '#93C5FD' }, children: 'Trophées' },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { textAlign: 'center' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: { color: '#FBBF24', fontWeight: 700, fontSize: '28px' },
                          children: archetype,
                        },
                      },
                      {
                        type: 'div',
                        props: { style: { color: '#93C5FD' }, children: 'Profil' },
                      },
                    ],
                  },
                },
                topPercent ? {
                  type: 'div',
                  props: {
                    style: { textAlign: 'center' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: { color: '#FBBF24', fontWeight: 700, fontSize: '28px' },
                          children: topPercent,
                        },
                      },
                      {
                        type: 'div',
                        props: { style: { color: '#93C5FD' }, children: 'Mondial' },
                      },
                    ],
                  },
                } : { type: 'div', props: { children: '' } },
              ],
            },
          },
          // Footer
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '20px',
                fontSize: '14px',
                color: '#1D4ED8',
              },
              children: `${siteDomain} — Not affiliated with Supercell`,
            },
          },
        ],
      },
    }) as ReactNode,
    satoriOptions
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new NextResponse(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
