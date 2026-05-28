'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const GRADE_STYLES: Record<string, { bg: string; text: string }> = {
  'S+': { bg: 'rgba(255,0,80,0.15)', text: '#FF0050' },
  S: { bg: 'rgba(250,204,21,0.15)', text: '#facc15' },
  A: { bg: 'rgba(167,139,250,0.15)', text: '#a78bfa' },
  B: { bg: 'rgba(96,165,250,0.15)', text: '#60a5fa' },
  C: { bg: 'rgba(74,222,128,0.15)', text: '#4ade80' },
  D: { bg: 'rgba(156,163,175,0.15)', text: '#9ca3af' },
};

const RANK_ICONS: Record<number, string> = { 0: '🥇', 1: '🥈', 2: '🥉' };

interface FlexerEntry {
  tag: string;
  name: string;
  grade: string;
  archetype: string;
  archetypeEmoji: string;
  trophies: number;
  value: number;
}

export default function TopFlexers({ onCountChange }: { onCountChange?: (n: number) => void } = {}) {
  const [entries, setEntries] = useState<FlexerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.ok ? r.json() : [])
      .then((data: FlexerEntry[]) => {
        const arr = Array.isArray(data) ? data : [];
        setEntries(arr);
        onCountChange?.(arr.length);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="w-full max-w-2xl mx-auto px-4 pb-12">
      <div className="text-center mb-8">
        <span className="badge-gold mb-4 inline-block">Hall of Fame</span>
        <h2 className="text-4xl font-gaming font-black text-white flex items-center justify-center gap-3">
          🏆 Top Flexers
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto mt-3 mb-4 rounded-full" />
        <p className="text-gray-400 text-sm">Les comptes les plus overloaded du moment</p>
      </div>

      {loading ? (
        <div className="glass-card p-8 text-center text-gray-400 text-sm animate-pulse">
          Chargement du Hall of Fame…
        </div>
      ) : entries.length === 0 ? (
        <div className="glass-card p-8 text-center text-gray-400 text-sm">
          Aucun joueur encore — sois le premier à rechercher ton compte !
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((flexer, i) => {
            const gradeBase = flexer.grade?.charAt(0) || 'B';
            const style = GRADE_STYLES[gradeBase] || GRADE_STYLES['B'];
            return (
              <Link
                key={`${flexer.tag}-${i}`}
                href={`/player/${flexer.tag}`}
                className="glass-card flex items-center gap-4 px-5 py-4 hover:scale-[1.01] transition-transform"
              >
                <span className="text-2xl w-8 text-center flex-shrink-0">
                  {RANK_ICONS[i] ?? <span className="text-gray-400 font-bold text-base">{i + 1}</span>}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-bold truncate">{flexer.name}</span>
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded"
                      style={{ background: style.bg, color: style.text }}
                    >
                      {flexer.grade}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">
                    {flexer.archetypeEmoji} {flexer.archetype} · {flexer.trophies.toLocaleString()} 🏆
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-yellow-400 font-gaming font-black text-lg">
                    {flexer.value.toLocaleString('fr-FR')} €
                  </p>
                  <p className="text-gray-500 text-xs">estimé</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
