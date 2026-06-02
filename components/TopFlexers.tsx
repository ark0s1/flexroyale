'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const LEADERBOARD_RESET_DATE = new Date('2026-05-31T00:00:00.000Z');

const GRADE_STYLES: Record<string, { bg: string; text: string }> = {
  'S+': { bg: 'rgba(192,87,59,0.15)', text: '#C0573B' },
  S: { bg: 'rgba(200,144,46,0.15)', text: '#C8902E' },
  A: { bg: 'rgba(138,139,74,0.15)', text: '#8A8B4A' },
  B: { bg: 'rgba(156,122,91,0.15)', text: '#9C7A5B' },
  C: { bg: 'rgba(110,140,158,0.15)', text: '#6E8C9E' },
  D: { bg: 'rgba(138,132,122,0.15)', text: '#8A847A' },
};

const RANK_ICONS: Record<number, string> = {
  0: 'bi-1-circle-fill',
  1: 'bi-2-circle-fill',
  2: 'bi-3-circle-fill',
};

interface FlexerEntry {
  tag: string;
  name: string;
  grade: string;
  archetype: string;
  archetypeEmoji: string;
  trophies: number;
  value: number;
  addedAt?: string;
}

export default function TopFlexers({ onCountChange }: { onCountChange?: (n: number) => void } = {}) {
  const [entries, setEntries] = useState<FlexerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.ok ? r.json() : [])
      .then((data: FlexerEntry[]) => {
        const arr = Array.isArray(data) ? data : [];
        const visible = arr.filter(
          e => e.addedAt && new Date(e.addedAt) >= LEADERBOARD_RESET_DATE
        );
        setEntries(visible);
        onCountChange?.(visible.length);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [onCountChange]);

  return (
    <section className="w-full max-w-2xl mx-auto px-4 pb-12">
      <div className="text-center mb-8">
        <span className="badge-gold mb-4 inline-block">Hall of Fame</span>
        <h2 className="text-4xl font-gaming font-black text-bone flex items-center justify-center gap-3">
          <i className="bi bi-trophy-fill text-ochre" aria-hidden="true" />
          Top Flexers
        </h2>
        <div className="w-16 h-px bg-line mx-auto mt-3 mb-4" />
        <p className="text-gray-400 text-sm">Les comptes les plus overloaded du moment</p>
      </div>

      {loading ? (
        <div className="glass-card p-8 text-center text-gray-400 text-sm animate-pulse">
          Chargement du Hall of Fame...
        </div>
      ) : entries.length === 0 ? (
        <div className="glass-card p-8 text-center text-gray-400 text-sm">
          Aucun joueur encore - sois le premier a rechercher ton compte !
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((flexer, i) => {
            const gradeBase = flexer.grade || 'B';
            const style = GRADE_STYLES[gradeBase] || GRADE_STYLES['B'];
            return (
              <Link
                key={`${flexer.tag}-${i}`}
                href={`/player/${flexer.tag}`}
                className="glass-card flex items-center gap-4 px-5 py-4 hover:border-clay transition-colors"
              >
                <span className="text-xl w-8 text-center flex-shrink-0 text-ochre">
                  {RANK_ICONS[i] ? <i className={`bi ${RANK_ICONS[i]}`} aria-hidden="true" /> : <span className="text-gray-400 font-bold text-base">{i + 1}</span>}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-bone font-bold truncate">{flexer.name}</span>
                    <span className="text-xs font-bold px-1.5 py-0.5" style={{ background: style.bg, color: style.text }}>
                      {flexer.grade}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">
                    {flexer.archetype} - {flexer.trophies.toLocaleString()} trophees
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-ochre font-gaming font-black text-lg">
                    {flexer.value.toLocaleString('fr-FR')} EUR
                  </p>
                  <p className="text-gray-500 text-xs">estime</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
