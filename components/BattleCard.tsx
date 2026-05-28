'use client';

import { Player, AccountValue } from '@/types/clash';

interface BattleCardProps {
  player: Player;
  accountValue: AccountValue;
}

type Grade = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';

const GRADE_CONFIG: Record<Grade, {
  primary: string;
  secondary: string;
  glowRgb: string;
  bg: string;
  border: string;
  title: string;
  rank: string;
  icon: string;
  auraOpacity: number;
}> = {
  'S+': {
    primary: '#FF0050', secondary: '#FF6B9D', glowRgb: '255,0,80',
    bg: 'linear-gradient(160deg, #0e0005 0%, #200010 40%, #160008 70%, #0e0005 100%)',
    border: 'rgba(255,0,80,0.6)', title: 'APEX LEGEND', rank: 'TOP 0.1% MONDIAL', icon: 'u{1F451}', auraOpacity: 0.22,
  },
  S: {
    primary: '#FBBF24', secondary: '#FDE68A', glowRgb: '251,191,36',
    bg: 'linear-gradient(160deg, #0d0900 0%, #1e1500 40%, #120e00 70%, #0d0900 100%)',
    border: 'rgba(251,191,36,0.5)', title: 'LÉGENDAIRE', rank: 'TOP 1% MONDIAL', icon: '👑', auraOpacity: 0.18,
  },
  A: {
    primary: '#60A5FA', secondary: '#BFDBFE', glowRgb: '96,165,250',
    bg: 'linear-gradient(160deg, #030611 0%, #061228 40%, #040a1e 70%, #030611 100%)',
    border: 'rgba(96,165,250,0.45)', title: 'ELITE', rank: 'TOP 5% MONDIAL', icon: '⚡', auraOpacity: 0.14,
  },
  B: {
    primary: '#CBD5E1', secondary: '#F1F5F9', glowRgb: '203,213,225',
    bg: 'linear-gradient(160deg, #07070E 0%, #141824 40%, #0e1220 70%, #07070E 100%)',
    border: 'rgba(203,213,225,0.28)', title: 'SOLIDE', rank: 'TOP 35% MONDIAL', icon: '🛡️', auraOpacity: 0.07,
  },
  C: {
    primary: '#3B82F6', secondary: '#93C5FD', glowRgb: '59,130,246',
    bg: 'linear-gradient(160deg, #07070E 0%, #0c1520 40%, #0a1018 70%, #07070E 100%)',
    border: 'rgba(59,130,246,0.3)', title: 'EN PROGRESSION', rank: 'TOP 60% MONDIAL', icon: '⚔️', auraOpacity: 0.08,
  },
  D: {
    primary: '#6B7280', secondary: '#9CA3AF', glowRgb: '107,114,128',
    bg: 'linear-gradient(160deg, #060608 0%, #090909 40%, #060608 100%)',
    border: 'rgba(107,114,128,0.18)', title: 'NPC MATERIAL 💀', rank: 'TOP 80%... BRAVE', icon: '💀', auraOpacity: 0.04,
  },
};

/* ── Real CR card images by grade ─────────────────────────────────── */

const GRADE_CHARACTERS: Record<Grade, { src: string; label: string }> = {
  'S+': { src: '/grades/S-plus.png', label: 'Grade S+' },
  S:    { src: '/grades/S.png',      label: 'Grade S'  },
  A:    { src: '/grades/A.png',      label: 'Grade A'  },
  B:    { src: '/grades/B.png',      label: 'Grade B'  },
  C:    { src: '/grades/C.png',      label: 'Grade C'  },
  D:    { src: '/grades/D.png',      label: 'Grade D'  },
};

function GradeCharacter({ grade, glowRgb }: { grade: Grade; glowRgb: string }) {
  const char = GRADE_CHARACTERS[grade];
  return (
    <div style={{
      position: 'absolute',
      right: '-8px',
      top: '18px',
      width: '130px',
      height: '130px',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      {/* Glow halo behind character */}
      <div style={{
        position: 'absolute',
        inset: '10px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${glowRgb},0.3) 0%, transparent 70%)`,
        filter: 'blur(12px)',
      }} />
      <img
        src={char.src}
        alt={char.label}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: `drop-shadow(0 0 14px rgba(${glowRgb},0.7)) drop-shadow(0 4px 8px rgba(0,0,0,0.9))`,
          opacity: grade === 'D' ? 0.75 : 0.88,
        }}
      />
    </div>
  );
}

// Hex grid pattern
function HexPattern({ color }: { color: string }) {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.025, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={`hex-${color.replace('#', '')}`} x="0" y="0" width="28" height="32" patternUnits="userSpaceOnUse">
          <path d="M14 2 L26 9 L26 23 L14 30 L2 23 L2 9 Z" fill="none" stroke={color} strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#hex-${color.replace('#', '')})`} />
    </svg>
  );
}

export default function BattleCard({ player, accountValue }: BattleCardProps) {
  const grade = accountValue.flexGrade;
  const c = GRADE_CONFIG[grade];
  const wins = player.wins || 0;
  const losses = player.losses || 0;
  const winRate = (wins + losses) > 0 ? Math.round(wins / (wins + losses) * 100) : 0;
  const maxCards = (player.cards || []).filter(card => card.level >= card.maxLevel).length;
  const evolvedCards = (player.cards || []).filter(card => (card.evolutionLevel || 0) > 0).length;
  const battles = player.battleCount || 0;
  const battlesDisplay = battles >= 1000 ? `${(battles / 1000).toFixed(1)}K` : `${battles}`;
  const euros = Math.round(accountValue.totalEuros).toLocaleString('fr-FR');
  const trophies = (player.bestTrophies || player.trophies || 0).toLocaleString('fr-FR');

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: '18px',
      overflow: 'hidden',
      boxShadow: `0 0 40px rgba(${c.glowRgb},0.2), 0 0 80px rgba(${c.glowRgb},0.08), 0 24px 80px rgba(0,0,0,0.9)`,
      fontFamily: "'Rajdhani', 'Inter', sans-serif",
    }}>
      {/* ── Animations ── */}
      <style>{`
        @keyframes bc-shine { 0%{transform:translateX(-120%) skewX(-12deg)} 100%{transform:translateX(320%) skewX(-12deg)} }
        @keyframes bc-glow-pulse { 0%,100%{opacity:.7} 50%{opacity:1} }
        @keyframes bc-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes bc-particle { 0%{transform:translateY(0) scale(1);opacity:1} 100%{transform:translateY(-22px) scale(0);opacity:0} }
        .bc-glow   { animation: bc-glow-pulse 2.4s ease-in-out infinite; }
        .bc-float  { animation: bc-float 3.2s ease-in-out infinite; }
        .bc-shine  { animation: bc-shine 5s ease-in-out infinite; }
        .bc-p1{animation:bc-particle 2s ease-out infinite 0.0s}
        .bc-p2{animation:bc-particle 2s ease-out infinite 0.4s}
        .bc-p3{animation:bc-particle 2s ease-out infinite 0.8s}
        .bc-p4{animation:bc-particle 2s ease-out infinite 1.2s}
        .bc-p5{animation:bc-particle 2s ease-out infinite 1.6s}
      `}</style>

      {/* Hex grid */}
      <HexPattern color={c.primary} />

      {/* Character illustration (absolute, behind content) */}
      <GradeCharacter grade={grade} glowRgb={c.glowRgb} />

      {/* Aura glow spot */}
      <div style={{
        position: 'absolute', top: '80px', left: '-30px',
        width: '220px', height: '220px', borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${c.glowRgb},${c.auraOpacity}) 0%, transparent 70%)`,
        filter: 'blur(24px)', pointerEvents: 'none',
      }} />

      {/* Shine sweep */}
      <div className="bc-shine" style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: `linear-gradient(90deg, transparent, rgba(${c.glowRgb},0.06), transparent)`,
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* ─── Top accent bar ─── */}
      <div style={{
        height: '3px',
        background: `linear-gradient(90deg, transparent, ${c.primary}, ${(grade === 'S+' || grade === 'S') ? '#FDE68A' : c.secondary}, ${c.primary}, transparent)`,
      }} />

      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px 0', position: 'relative', zIndex: 2 }}>
        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: 'rgba(255,255,255,0.25)' }}>⚔ FLEXROYALE</span>
        <div style={{
          padding: '3px 10px', borderRadius: '20px',
          background: `rgba(${c.glowRgb},0.1)`, border: `1px solid ${c.border}`,
          fontSize: '10px', fontWeight: 800, letterSpacing: '2px', color: c.primary, textTransform: 'uppercase',
        }}>
          Grade {grade}
        </div>
      </div>

      {/* ─── Player name ─── */}
      <div style={{ padding: '10px 16px 6px', position: 'relative', zIndex: 2 }}>
        <div style={{
          fontSize: '30px', fontWeight: 900, fontFamily: "'Rajdhani', sans-serif",
          letterSpacing: '1.5px', color: '#FFFFFF',
          textShadow: `0 0 24px rgba(${c.glowRgb},0.5), 0 2px 4px rgba(0,0,0,0.8)`,
          lineHeight: 1, textTransform: 'uppercase', wordBreak: 'break-word',
          maxWidth: 'calc(100% - 110px)',  /* leave room for character */
        }}>
          {player.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{player.tag}</span>
          {player.clan && (
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '8px' }}>
              {player.clan.name}
            </span>
          )}
        </div>
      </div>

      {/* ─── Divider ─── */}
      <div style={{ margin: '0 16px 14px', height: '1px', background: `linear-gradient(90deg, transparent, ${c.border}, transparent)` }} />

      {/* ─── Grade hero ─── */}
      <div style={{ padding: '0 16px 14px', display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 2 }}>
        {/* Giant grade letter + icon */}
        <div className="bc-float" style={{ position: 'relative', flexShrink: 0, textAlign: 'center', width: '88px' }}>
          <div className="bc-glow" style={{
            position: 'absolute', inset: '-8px', borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${c.glowRgb},0.2) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />
          <div style={{
            fontSize: '86px', fontWeight: 900, fontFamily: "'Rajdhani', sans-serif",
            color: c.primary, lineHeight: 1,
            textShadow: `0 0 16px rgba(${c.glowRgb},0.9), 0 0 32px rgba(${c.glowRgb},0.6), 0 0 64px rgba(${c.glowRgb},0.3)`,
            userSelect: 'none', letterSpacing: '-2px',
          }}>
            {grade}
          </div>
          {/* S particles */}
          {grade === 'S' && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`bc-p${i + 1}`} style={{
                  position: 'absolute', width: '4px', height: '4px', borderRadius: '50%',
                  background: c.primary, left: `${[20, 60, 80, 40, 10][i]}%`, bottom: '10%',
                  boxShadow: `0 0 4px ${c.primary}`,
                }} />
              ))}
            </div>
          )}
          <div style={{ fontSize: '22px', marginTop: '-4px', filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))' }}>
            {c.icon}
          </div>
        </div>

        {/* Grade info */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: grade === 'C' || grade === 'D' ? '16px' : '22px', fontWeight: 900,
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: '2px', color: c.primary, lineHeight: 1,
            textShadow: `0 0 12px rgba(${c.glowRgb},0.4)`, textTransform: 'uppercase',
          }}>
            {c.title}
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', letterSpacing: '1.5px', marginTop: '4px', textTransform: 'uppercase' }}>
            {c.rank}
          </div>
          {/* Score pill */}
          <div style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              padding: '4px 10px', borderRadius: '6px',
              background: `rgba(${c.glowRgb},0.12)`, border: `1px solid rgba(${c.glowRgb},0.35)`,
              fontSize: '15px', fontWeight: 800, color: c.primary, fontFamily: "'Rajdhani', sans-serif",
            }}>
              {accountValue.flexScore}<span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>/1000</span>
            </div>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase' }}>Flex Score</span>
          </div>
          {/* Win rate bar */}
          <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px' }}>WIN RATE</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: winRate >= 50 ? '#10B981' : '#EF4444', fontFamily: "'Rajdhani', sans-serif" }}>{winRate}%</span>
            </div>
            <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${Math.min(winRate, 100)}%`, borderRadius: '2px',
                background: winRate >= 50 ? '#10B981' : '#EF4444',
                boxShadow: winRate >= 50 ? '0 0 6px rgba(16,185,129,0.5)' : '0 0 6px rgba(239,68,68,0.5)',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Divider ─── */}
      <div style={{ margin: '0 16px 10px', height: '1px', background: `linear-gradient(90deg, transparent, ${c.border}, transparent)` }} />

      {/* ─── Stats grid 3×2 ─── */}
      <div style={{ padding: '0 16px 12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7px', position: 'relative', zIndex: 2 }}>
        {[
          { label: 'TROPHÉES', value: trophies, icon: '🏆' },
          { label: 'KING LVL', value: `${player.expLevel}`, icon: '👑' },
          { label: 'BATAILLES', value: battlesDisplay, icon: '🗡️' },
          { label: 'MAX CARDS', value: `${maxCards}`, icon: '🃏' },
          { label: 'ÉVOLUTIONS', value: `${evolvedCards}`, icon: '⚡' },
          { label: 'VALEUR', value: `${euros} €`, icon: '💎' },
        ].map(({ label, value, icon }) => (
          <div key={label} style={{
            padding: '8px 6px', borderRadius: '9px', textAlign: 'center',
            background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.055)',
          }}>
            <div style={{ fontSize: '15px', marginBottom: '2px', lineHeight: 1 }}>{icon}</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', fontFamily: "'Rajdhani', sans-serif", lineHeight: 1, letterSpacing: '0.3px' }}>
              {value}
            </div>
            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.8px', marginTop: '2px', textTransform: 'uppercase' }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Archetype banner ─── */}
      <div style={{
        margin: '0 16px 16px', padding: '9px 14px', borderRadius: '10px',
        background: `rgba(${c.glowRgb},0.07)`, border: `1px solid rgba(${c.glowRgb},0.2)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        position: 'relative', zIndex: 2,
      }}>
        <span style={{ fontSize: '18px', filter: `drop-shadow(0 0 6px rgba(${c.glowRgb},0.5))` }}>
          {accountValue.archetypeEmoji}
        </span>
        <span style={{
          fontSize: '14px', fontWeight: 800, color: c.primary,
          fontFamily: "'Rajdhani', sans-serif", letterSpacing: '1.5px', textTransform: 'uppercase',
          textShadow: `0 0 10px rgba(${c.glowRgb},0.4)`,
        }}>
          {accountValue.archetype}
        </span>
      </div>

      {/* ─── Bottom accent bar ─── */}
      <div style={{ height: '2px', background: `linear-gradient(90deg, transparent, rgba(${c.glowRgb},0.6), transparent)` }} />
    </div>
  );
}

