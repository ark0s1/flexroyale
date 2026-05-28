'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trophy, Swords } from 'lucide-react';
import { PlayerApiResponse } from '@/types/clash';
import { formatEuros, formatNumber, getWinRate } from '@/lib/utils';
import FlexGrade from '@/components/FlexGrade';
import SearchForm from '@/components/SearchForm';
import Footer from '@/components/Footer';
import { useI18n } from '@/components/I18nProvider';

function CompareContent() {
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [data1, setData1] = useState<PlayerApiResponse | null>(null);
  const [data2, setData2] = useState<PlayerApiResponse | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error1, setError1] = useState('');
  const [error2, setError2] = useState('');

  const defaultTag1 = searchParams.get('tag1') || '';

  async function loadPlayer(tag: string, slot: 1 | 2) {
    if (slot === 1) { setLoading1(true); setError1(''); }
    else { setLoading2(true); setError2(''); }

    try {
      const res = await fetch(`/api/player?tag=${tag}`);
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || 'Erreur API');
      if (slot === 1) setData1(json);
      else setData2(json);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erreur inconnue';
      if (slot === 1) setError1(msg);
      else setError2(msg);
    } finally {
      if (slot === 1) setLoading1(false);
      else setLoading2(false);
    }
  }

  const w = data1 && data2
    ? (data1.accountValue.totalEuros >= data2.accountValue.totalEuros ? 1 : 2)
    : null;

  const ratio = data1 && data2 && data2.accountValue.totalEuros > 0
    ? (data1.accountValue.totalEuros / data2.accountValue.totalEuros).toFixed(1)
    : null;

  function FunMessage() {
    if (!data1 || !data2) return null;
    const wData = w === 1 ? data1 : data2;
    const lData = w === 1 ? data2 : data1;
    const r = parseFloat(ratio || '1');
    const winner = wData.player.name;
    const loser = lData.player.name;

    if (r >= 5) return <p className="font-gaming text-amber-400 font-bold text-lg tracking-wide">🐋 {t.compareMsg5x.replace('{winner}', winner).replace('{ratio}', String(r)).replace('{loser}', loser)}</p>;
    if (r >= 2) return <p className="font-gaming text-emerald-400 font-bold text-lg tracking-wide">🔥 {t.compareMsg2x.replace('{winner}', winner).replace('{loser}', loser)}</p>;
    if (r >= 1.2) return <p className="font-gaming text-blue-400 font-bold text-lg tracking-wide">⚔️ {t.compareMsg1_2x.replace('{winner}', winner).replace('{loser}', loser)}</p>;
    return <p className="font-gaming text-purple-400 font-bold text-lg tracking-wide">🤝 {t.compareMsgTie}</p>;
  }

  function PlayerColumn({ slotNum }: { slotNum: 1 | 2 }) {
    const data = slotNum === 1 ? data1 : data2;
    const loading = slotNum === 1 ? loading1 : loading2;
    const error = slotNum === 1 ? error1 : error2;
    const isWinner = w === slotNum;

    return (
      <div
        className="flex-1 glass-card p-5 transition-all duration-300"
        style={isWinner ? {
          borderColor: 'rgba(251,191,36,0.4)',
          boxShadow: '0 0 30px rgba(251,191,36,0.15)',
        } : undefined}
      >
        <div className="mb-4">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">
            {t.comparePlayer} {slotNum}
          </p>
          <SearchForm
            compact
            defaultValue={slotNum === 1 ? defaultTag1 : ''}
            onSearch={tag => loadPlayer(tag, slotNum)}
          />
          {loading && (
            <p className="text-blue-400 text-xs mt-2 animate-pulse">{t.compareLoading}</p>
          )}
          {error && <p className="text-red-400 text-xs mt-2">⚠️ {error}</p>}
        </div>

        {isWinner && data && (
          <div className="text-center mb-3">
            <span
              className="font-gaming text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
              style={{ background: '#FBBF24', color: '#000' }}
            >
              🏆 WINNER
            </span>
          </div>
        )}

        {data ? (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-gaming text-xl font-bold text-white tracking-wide">{data.player.name}</h3>
              <p className="text-blue-400/60 font-mono text-xs">{data.player.tag}</p>
            </div>

            <div className="flex justify-center">
              <FlexGrade grade={data.accountValue.flexGrade} score={data.accountValue.flexScore} size="md" />
            </div>

            <div className="text-center">
              <p className="font-gaming text-3xl font-bold" style={{ color: '#FBBF24' }}>
                {formatEuros(data.accountValue.totalEuros)}
              </p>
              <p className="text-gray-500 text-xs mt-0.5">
                {data.accountValue.topPercent} {t.playerWorldRank}
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-500 flex items-center gap-1"><Trophy size={11} /> {t.playerTrophies}</span>
                <span className="text-white font-semibold font-gaming">{formatNumber(data.player.bestTrophies || data.player.trophies)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-500 flex items-center gap-1"><Swords size={11} /> Win rate</span>
                <span className={`font-semibold font-gaming ${getWinRate(data.player.wins, data.player.losses) >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                  {getWinRate(data.player.wins, data.player.losses)}%
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-500">🃏 {t.playerMaxCards}</span>
                <span className="text-white font-semibold font-gaming">{(data.player.cards || []).filter(c => c.level >= 16).length}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-500">⚡ {t.playerEvolutions}</span>
                <span className="text-white font-semibold font-gaming">{(data.player.cards || []).filter(c => (c.evolutionLevel || 0) > 0).length}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">👑 {t.playerKingLevel}</span>
                <span className="text-white font-semibold font-gaming">{data.player.expLevel}</span>
              </div>
            </div>

            <div className="text-center pt-1">
              <p className="text-gray-400 text-sm">{data.accountValue.archetypeEmoji} {data.accountValue.archetype}</p>
            </div>

            <Link
              href={`/player/${data.player.tag.replace('#', '')}`}
              className="block text-center text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              {t.compareFullProfile}
            </Link>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-600">
            <p className="text-4xl mb-3">🎮</p>
            <p className="text-sm font-gaming tracking-wide">{t.compareEnterTag}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070E] pb-16">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          {t.compareBack}
        </Link>

        <div className="text-center mb-10">
          <span className="badge-blue mb-4 inline-block">⚔️ Battle</span>
          <h1 className="font-gaming text-4xl sm:text-5xl font-bold text-white mb-2 tracking-wide">
            {t.compareTitle}
          </h1>
          <div className="divider-glow w-32 mx-auto my-4" />
          <p className="text-gray-500">{t.compareSubtitle}</p>
        </div>

        {/* Fun message */}
        {data1 && data2 && (
          <div className="glass-card p-5 text-center mb-6">
            <FunMessage />
            {ratio && (
              <p className="text-gray-500 text-sm mt-1">
                {t.compareRatio} {ratio}x
              </p>
            )}
          </div>
        )}

        {/* VS divider */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.5))' }} />
          <span className="font-gaming text-xl font-bold text-blue-500 tracking-widest">VS</span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(37,99,235,0.5), transparent)' }} />
        </div>

        {/* Compare columns */}
        <div className="flex flex-col sm:flex-row gap-4">
          <PlayerColumn slotNum={1} />
          <PlayerColumn slotNum={2} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense>
      <CompareContent />
    </Suspense>
  );
}
