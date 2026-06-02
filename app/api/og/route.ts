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
    'S+': '#C0573B',
    'S': '#C8902E',
    'A': '#8A8B4A',
    'B': '#9C7A5B',
    'C': '#6E8C9E',
    'D': '#8A847A',
  };

  const gradeColor = gradeColors[grade] || '#9C7A5B';
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
          background: '#1C1A17',
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ECE6D8',
          padding: '40px',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
        },
        children: [
          // Left accent stripe
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: '0',
                top: '0',
                bottom: '0',
                width: '16px',
                background: gradeColor,
              },
            },
          },
          // Card Container
          {
            type: 'div',
            props: {
              style: {
                background: '#26231E',
                border: '1px solid #423C32',
                display: 'flex',
                flexDirection: 'column',
                width: '1000px',
                height: '490px',
                padding: '40px',
                position: 'relative',
              },
              children: [
                // Top header
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '20px',
                            color: '#A39B8B',
                            fontWeight: 700,
                            letterSpacing: '4px',
                          },
                          children: 'FLEXROYALE',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            border: `1px solid ${gradeColor}`,
                            background: `${gradeColor}20`,
                            color: gradeColor,
                            fontSize: '16px',
                            fontWeight: 700,
                            letterSpacing: '2px',
                            padding: '4px 12px',
                          },
                          children: `GRADE ${grade}`,
                        },
                      },
                    ],
                  },
                },
                // Player Name
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '60px',
                      fontWeight: 900,
                      color: '#ECE6D8',
                      textTransform: 'uppercase',
                      marginBottom: '10px',
                    },
                    children: name,
                  },
                },
                // Archetype Row
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '20px',
                      color: gradeColor,
                      fontWeight: 700,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      marginBottom: '40px',
                    },
                    children: archetype,
                  },
                },
                // Value and Rank Section
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '20px',
                      marginBottom: '40px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '84px',
                            fontWeight: 900,
                            color: '#C8902E',
                            lineHeight: 1,
                          },
                          children: valueFormatted,
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '22px',
                            color: '#A39B8B',
                          },
                          children: 'Valeur estimee',
                        },
                      },
                    ],
                  },
                },
                // Divider
                {
                  type: 'div',
                  props: {
                    style: {
                      height: '1px',
                      background: '#423C32',
                      width: '100%',
                      marginBottom: '30px',
                    },
                  },
                },
                // Stats row
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      gap: '60px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column' },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: { color: '#ECE6D8', fontWeight: 700, fontSize: '28px' },
                                children: trophiesFormatted,
                              },
                            },
                            {
                              type: 'div',
                              props: { style: { color: '#A39B8B', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }, children: 'Trophees' },
                            },
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column' },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: { color: '#ECE6D8', fontWeight: 700, fontSize: '28px' },
                                children: grade,
                              },
                            },
                            {
                              type: 'div',
                              props: { style: { color: '#A39B8B', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }, children: 'Grade' },
                            },
                          ],
                        },
                      },
                      topPercent ? {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column' },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: { color: '#ECE6D8', fontWeight: 700, fontSize: '28px' },
                                children: topPercent,
                              },
                            },
                            {
                              type: 'div',
                              props: { style: { color: '#A39B8B', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }, children: 'Mondial' },
                            },
                          ],
                        },
                      } : null,
                    ].filter(Boolean),
                  },
                },
              ],
            },
          },
          // Footnote
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '24px',
                fontSize: '14px',
                color: '#8A847A',
              },
              children: `${siteDomain} - Not affiliated with Supercell`,
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
