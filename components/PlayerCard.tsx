'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Swords } from 'lucide-react';
import { Player, AccountValue } from '@/types/clash';
import { formatEuros, formatGems, getWinRate, formatNumber } from '@/lib/utils';
import FlexGrade from './FlexGrade';
import ValueBreakdown from './ValueBreakdown';
import ShareCard from './ShareCard';
import AccountBonusValue from './AccountBonusValue';
import RarityRanking from './RarityRanking';
import AdBanner from './AdBanner';
import StatsRow from './StatsRow';
import { useI18n } from './I18nProvider';

interface PlayerCardProps {
  player: Player;
  accountValue: AccountValue;
}

function AnimatedValue({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1500;
    const step = 16;
    const increment = (end / duration) * step;

    const timer = setInterval(() => {
      start = Math.min(start + increment, end);
      setDisplayed(Math.floor(start));
      if (start >= end) clearInterval(timer);
    }, step);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayed.toLocaleString('fr-FR')}{suffix}</span>;
}

export default function PlayerCard({ player, accountValue }: PlayerCardProps) {
  const { t } = useI18n();
  const winRate = getWinRate(player.wins || 0, player.losses || 0);
  const maxCards = (player.cards || []).filter(c => c.level >= c.maxLevel).length;
  const evolvedCards = (player.cards || []).filter(c => (c.evolutionLevel || 0) > 0).length;
  const heroCards = (player.cards || []).filter(c => c.iconUrls?.heroMedium).length;
  const tag = player.tag.replace('#', '');

  return (
    <div className="min-h-screen bg-[#07070E] pb-16">
      {/* Back nav */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          {t.playerBack}
        </Link>
      </div>

      {/* ─── Hero — player identity ─── */}
      <div className="max-w-3xl mx-auto px-4 mb-6">
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(7,7,14,0.8) 60%)',
            border: '1px solid rgba(37,99,235,0.25)',
          }}
        >
          <div
            className="absolute top-[-60px] right-[-60px] w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)', filter: 'blur(30px)' }}
          />
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-blue text-xs">King Level {player.expLevel}</span>
              </div>
              <h1 className="font-gaming text-3xl sm:text-4xl font-bold text-white tracking-wide">{player.name}</h1>
              <p className="text-blue-400/70 font-mono text-xs mt-1">{player.tag}</p>
              {player.clan && (
                <p className="text-gray-500 text-sm mt-1.5 flex items-center gap-1">
                  <Users size={12} />
                  {player.clan.name}
                </p>
              )}
              {player.arena?.name && (
                <p className="text-gray-600 text-xs mt-0.5">{player.arena.name}</p>
              )}
            </div>
            <div className="flex gap-5 sm:gap-8">
              <div className="text-center">
                <p className="font-gaming text-2xl font-bold" style={{ color: '#FBBF24' }}>
                  {formatNumber(player.trophies)}
                </p>
                <p className="text-gray-500 text-xs">{t.playerTrophies}</p>
              </div>
              <div className="text-center">
                <p className="font-gaming text-2xl font-bold" style={{ color: '#FDE68A' }}>
                  {formatNumber(player.bestTrophies)}
                </p>
                <p className="text-gray-500 text-xs">{t.playerRecord}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main value display ─── */}
      <div className="max-w-3xl mx-auto px-4 mb-6">
        <div className="glass-card p-6 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.06) 0%, transparent 70%)' }}
          />
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-3 relative z-10">
            {t.playerEstimatedValue}
          </p>
          <p className="font-gaming text-6xl sm:text-7xl font-bold mb-2 relative z-10" style={{ color: '#FBBF24', textShadow: '0 0 40px rgba(251,191,36,0.4)' }}>
            <AnimatedValue value={Math.round(accountValue.totalEuros)} suffix=" €" />
          </p>
          <p className="text-gray-600 text-sm mb-6 relative z-10">
            ≈ {formatGems(accountValue.totalGems)} gems
          </p>

          <div className="divider-glow w-full mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <FlexGrade grade={accountValue.flexGrade} score={accountValue.flexScore} size="lg" />
            <div className="text-center sm:text-left">
              <p className="font-gaming text-2xl sm:text-3xl font-bold text-white">
                {accountValue.archetypeEmoji} {accountValue.archetype}
              </p>
              <p className="text-blue-400 font-semibold mt-1 text-sm">
                {accountValue.topPercent} {t.playerWorldRank}
              </p>
              <p className="text-gray-600 text-xs mt-1">
                {t.playerFlexScore}: {accountValue.flexScore}/1000
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ad banner */}
      <div className="max-w-3xl mx-auto px-4 mb-6">
        <AdBanner slot="player-top" format="horizontal" className="rounded-xl" />
      </div>

      {/* ─── Breakdown + Prestige + Quick stats ─── */}
      <div className="max-w-3xl mx-auto px-4 mb-6 grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <ValueBreakdown breakdown={accountValue.breakdown} totalEuros={accountValue.totalEuros} />
        </div>

        {/* Prestige & Ranked */}
        <div className="sm:col-span-2">
          <AccountBonusValue player={player} />
        </div>

        {/* Trésors du compte */}
        <div className="sm:col-span-2">
          <RarityRanking player={player} />
        </div>

        {/* Quick stats */}
        <div className="glass-card p-5">
          <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-4">
            {t.playerQuickStats}
          </h3>
          <div>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Swords size={12} /> Win rate
                </span>
                <span className={`font-gaming font-bold ${winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                  {winRate}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${winRate}%`,
                    background: winRate >= 50 ? '#10B981' : '#EF4444',
                    boxShadow: winRate >= 50 ? '0 0 8px rgba(16,185,129,0.4)' : '0 0 8px rgba(239,68,68,0.4)',
                  }}
                />
              </div>
            </div>
            <StatsRow label={t.playerMaxCards} value={maxCards} icon="🃏" color="text-purple-400" />
            <StatsRow label={t.playerEvolutions} value={evolvedCards} icon="⚡" color="text-amber-400" />
            <StatsRow label={t.playerHeroes} value={heroCards} icon="🦸" color="text-emerald-400" />
            <StatsRow label={t.playerBattles} value={formatNumber(player.battleCount || 0)} icon="⚔️" />
            <StatsRow label={t.playerThreeCrowns} value={formatNumber(player.threeCrownWins || 0)} icon="👑" color="text-amber-400" />
            <StatsRow label={t.playerDonations} value={formatNumber(player.totalDonations || 0)} icon="🎁" />
            {player.challengeMaxWins > 0 && (
              <StatsRow label={t.playerChallengeWins} value={player.challengeMaxWins} icon="🏅" color="text-emerald-400" />
            )}
          </div>
        </div>

        {/* Share card */}
        <div>
          <ShareCard player={player} accountValue={accountValue} />
        </div>
      </div>

      {/* ─── Compare CTA ─── */}
      <div className="max-w-3xl mx-auto px-4 mb-6">
        <Link
          href={`/compare?tag1=${tag}`}
          className="btn-primary block w-full text-center py-4 px-6 font-gaming font-bold tracking-wide text-lg"
        >
          {t.playerCompareBtn}
        </Link>
      </div>

      {/* Bottom ad */}
      <div className="max-w-3xl mx-auto px-4">
        <AdBanner slot="player-bottom" format="rectangle" className="rounded-xl" />
      </div>
    </div>
  );
}
