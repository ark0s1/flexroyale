'use client';

/* eslint-disable @next/next/no-img-element -- asset de jeu volontairement en <img> (evite le cout + la surface de vuln de l'optimiseur d'images Vercel) ; perf via loading=lazy + dimensions. */
import { Player, AccountValue } from '@/types/clash';

interface BattleCardProps {
  player: Player;
  accountValue: AccountValue;
}

type Grade = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';

/* Config terreuse Bauhaus : aplats, angles vifs, pas de glow, icones Bootstrap. */
const GRADE_CONFIG: Record<Grade, {
  primary: string;
  bg: string;
  title: string;
  rank: string;
  icon: string;
}> = {
  'S+': { primary: '#C0573B', bg: '#241410', title: 'APEX LEGEND',     rank: 'TOP 0.1% MONDIAL', icon: 'bi-trophy-fill' },
  S:    { primary: '#C8902E', bg: '#241D0F', title: 'LEGENDAIRE',      rank: 'TOP 1% MONDIAL',   icon: 'bi-star-fill' },
  A:    { primary: '#8A8B4A', bg: '#1D1F10', title: 'ELITE',           rank: 'TOP 5% MONDIAL',   icon: 'bi-fire' },
  B:    { primary: '#9C7A5B', bg: '#211A12', title: 'SOLIDE',          rank: 'TOP 35% MONDIAL',  icon: 'bi-shield-fill' },
  C:    { primary: '#6E8C9E', bg: '#141C20', title: 'EN PROGRESSION',  rank: 'TOP 60% MONDIAL',  icon: 'bi-graph-up-arrow' },
  D:    { primary: '#8A847A', bg: '#1A1917', title: 'EARLY GAME',      rank: 'TOP 80%',          icon: 'bi-dash-circle' },
};

const GRADE_CHARACTERS: Record<Grade, { src: string; label: string }> = {
  'S+': { src: '/grades/S-plus.png', label: 'Grade S+' },
  S:    { src: '/grades/S.png',      label: 'Grade S'  },
  A:    { src: '/grades/A.png',      label: 'Grade A'  },
  B:    { src: '/grades/B.png',      label: 'Grade B'  },
  C:    { src: '/grades/C.png',      label: 'Grade C'  },
  D:    { src: '/grades/D.png',      label: 'Grade D'  },
};

function GradeCharacter({ grade }: { grade: Grade }) {
  const char = GRADE_CHARACTERS[grade];
  return (
    <div style={{ position: 'absolute', right: '0', top: '14px', width: '120px', height: '120px', pointerEvents: 'none', zIndex: 0, opacity: 0.85 }}>
      <img
        src={char.src}
        alt={char.label}
        width={120}
        height={120}
        loading="lazy"
        decoding="async"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
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

  const stats = [
    { label: 'TROPHEES', value: trophies, icon: 'bi-trophy-fill' },
    { label: 'KING LVL', value: `${player.expLevel}`, icon: 'bi-award-fill' },
    { label: 'BATAILLES', value: battlesDisplay, icon: 'bi-controller' },
    { label: 'MAX CARDS', value: `${maxCards}`, icon: 'bi-collection-fill' },
    { label: 'EVOLUTIONS', value: `${evolvedCards}`, icon: 'bi-lightning-charge-fill' },
    { label: 'VALEUR', value: `${euros} EUR`, icon: 'bi-gem' },
  ];

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      background: c.bg,
      border: `1px solid ${c.primary}`,
      borderRadius: 0,
      overflow: 'hidden',
      fontFamily: "'Rajdhani', 'Inter', sans-serif",
    }}>
      {/* Caractere illustration (aplat, sans glow) */}
      <GradeCharacter grade={grade} />

      {/* Bande superieure pleine */}
      <div style={{ height: '6px', background: c.primary }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px 0', position: 'relative', zIndex: 2 }}>
        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: 'rgba(236,230,216,0.4)' }}>FLEXROYALE</span>
        <div style={{
          padding: '3px 10px',
          background: c.primary, color: '#1C1A17',
          fontSize: '10px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase',
        }}>
          Grade {grade}
        </div>
      </div>

      {/* Nom joueur */}
      <div style={{ padding: '10px 16px 6px', position: 'relative', zIndex: 2 }}>
        <div style={{
          fontSize: '30px', fontWeight: 900, fontFamily: "'Rajdhani', sans-serif",
          letterSpacing: '1px', color: '#ECE6D8',
          lineHeight: 1, textTransform: 'uppercase', wordBreak: 'break-word',
          maxWidth: 'calc(100% - 110px)',
        }}>
          {player.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(236,230,216,0.35)', fontFamily: 'monospace' }}>{player.tag}</span>
          {player.clan && (
            <span style={{ fontSize: '10px', color: 'rgba(236,230,216,0.25)', borderLeft: '1px solid rgba(236,230,216,0.15)', paddingLeft: '8px' }}>
              {player.clan.name}
            </span>
          )}
        </div>
      </div>

      {/* Separateur */}
      <div style={{ margin: '0 16px 14px', height: '1px', background: 'rgba(236,230,216,0.12)' }} />

      {/* Grade hero */}
      <div style={{ padding: '0 16px 14px', display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 2 }}>
        <div style={{ flexShrink: 0, textAlign: 'center', width: '88px' }}>
          <div style={{
            fontSize: '82px', fontWeight: 900, fontFamily: "'Rajdhani', sans-serif",
            color: c.primary, lineHeight: 1, letterSpacing: '-2px',
          }}>
            {grade}
          </div>
          <div style={{ marginTop: '2px', color: c.primary, fontSize: '20px', lineHeight: 1 }}>
            <i className={`bi ${c.icon}`} aria-hidden="true" />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: grade === 'C' || grade === 'D' ? '16px' : '22px', fontWeight: 900,
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: '2px', color: c.primary, lineHeight: 1,
            textTransform: 'uppercase',
          }}>
            {c.title}
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(236,230,216,0.45)', letterSpacing: '1.5px', marginTop: '4px', textTransform: 'uppercase' }}>
            {c.rank}
          </div>
          {/* Score */}
          <div style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              padding: '4px 10px',
              background: c.primary, color: '#1C1A17',
              fontSize: '15px', fontWeight: 800, fontFamily: "'Rajdhani', sans-serif",
            }}>
              {accountValue.flexScore}<span style={{ fontSize: '10px', fontWeight: 600, opacity: 0.7 }}>/1000</span>
            </div>
            <span style={{ fontSize: '9px', color: 'rgba(236,230,216,0.35)', letterSpacing: '1px', textTransform: 'uppercase' }}>Flex Score</span>
          </div>
          {/* Win rate */}
          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span style={{ fontSize: '9px', color: 'rgba(236,230,216,0.35)', letterSpacing: '1px' }}>WIN RATE</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: winRate >= 50 ? '#8A8B4A' : '#C0573B', fontFamily: "'Rajdhani', sans-serif" }}>{winRate}%</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(236,230,216,0.08)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(winRate, 100)}%`, background: winRate >= 50 ? '#8A8B4A' : '#C0573B' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Separateur */}
      <div style={{ margin: '0 16px 10px', height: '1px', background: 'rgba(236,230,216,0.12)' }} />

      {/* Stats 3x2 */}
      <div style={{ padding: '0 16px 12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7px', position: 'relative', zIndex: 2 }}>
        {stats.map(({ label, value, icon }) => (
          <div key={label} style={{
            padding: '9px 6px', textAlign: 'center',
            background: 'rgba(236,230,216,0.04)', border: '1px solid rgba(236,230,216,0.08)',
          }}>
            <div style={{ fontSize: '15px', marginBottom: '3px', lineHeight: 1, color: c.primary }}>
              <i className={`bi ${icon}`} aria-hidden="true" />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#ECE6D8', fontFamily: "'Rajdhani', sans-serif", lineHeight: 1, letterSpacing: '0.3px' }}>
              {value}
            </div>
            <div style={{ fontSize: '8px', color: 'rgba(236,230,216,0.35)', letterSpacing: '0.8px', marginTop: '3px', textTransform: 'uppercase' }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Archetype */}
      <div style={{
        margin: '0 16px 16px', padding: '10px 14px',
        background: 'rgba(236,230,216,0.04)', borderLeft: `4px solid ${c.primary}`,
        display: 'flex', alignItems: 'center', gap: '10px',
        position: 'relative', zIndex: 2,
      }}>
        <i className="bi bi-person-badge-fill" aria-hidden="true" style={{ fontSize: '16px', color: c.primary }} />
        <span style={{
          fontSize: '14px', fontWeight: 800, color: c.primary,
          fontFamily: "'Rajdhani', sans-serif", letterSpacing: '1.5px', textTransform: 'uppercase',
        }}>
          {accountValue.archetype}
        </span>
      </div>
    </div>
  );
}
