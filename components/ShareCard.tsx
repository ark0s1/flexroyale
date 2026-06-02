'use client';

import { useState } from 'react';
import { Copy, Check, Share2, MessageCircle, Download, Loader2 } from 'lucide-react';
import { Player, AccountValue } from '@/types/clash';
import { useI18n } from './I18nProvider';
import BattleCard from './BattleCard';

interface ShareCardProps {
  player: Player;
  accountValue: AccountValue;
}

export default function ShareCard({ player, accountValue }: ShareCardProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const siteUrl = 'https://flexroyale.vercel.app';
  const tag = player.tag.replace('#', '');
  const shareUrl = `${siteUrl}/player/${tag}`;
  const ogUrl = `${siteUrl}/api/og?name=${encodeURIComponent(player.name)}&value=${accountValue.totalEuros}&grade=${accountValue.flexGrade}&trophies=${player.bestTrophies || player.trophies}&archetype=${encodeURIComponent(accountValue.archetype)}&topPercent=${encodeURIComponent(accountValue.topPercent)}`;

  const baseText = t.shareTweetTemplate
    .replace('{euros}', Math.round(accountValue.totalEuros).toLocaleString('fr-FR'))
    .replace('{grade}', accountValue.flexGrade)
    .replace('{top}', accountValue.topPercent);

  const whatsappText = `${baseText}\n\n${shareUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
  const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(baseText)}&url=${encodeURIComponent(shareUrl)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function downloadPng() {
    if (downloading) return;
    setDownloading(true);
    try {
      const response = await fetch(ogUrl);
      if (!response.ok) throw new Error('Generation de l image echouee');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flexroyale-${player.name.replace(/[^a-z0-9]/gi, '_')}-grade${accountValue.flexGrade}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(ogUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Share2 size={16} className="text-dustyblue" />
        <h3 className="text-bone font-gaming font-bold tracking-wide">{t.shareTitle}</h3>
      </div>
      <div className="mb-4">
        <BattleCard player={player} accountValue={accountValue} />
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={downloadPng}
          disabled={downloading}
          className="flex items-center justify-center gap-2 py-3 px-4 text-bone font-semibold text-sm transition-colors disabled:opacity-60 border border-dustyblue/60 bg-dustyblue/20 hover:bg-dustyblue/30"
        >
          {downloading
            ? <><Loader2 size={15} className="animate-spin" /> Generation en cours...</>
            : <><Download size={15} /> Telecharger en PNG</>
          }
        </button>

        <button
          onClick={copyLink}
          className="flex items-center justify-center gap-2 py-3 px-4 text-bone font-semibold text-sm transition-colors border border-line bg-white/5 hover:bg-white/10"
        >
          {copied
            ? <><Check size={15} className="text-olive" /> {t.shareCopied}</>
            : <><Copy size={15} /> {t.shareCopy}</>
          }
        </button>

        <div className="grid grid-cols-2 gap-2">
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 px-4 text-bone font-semibold text-sm transition-colors border border-line bg-ink hover:bg-white/10">
            <span className="font-bold text-xs">X</span>
            Twitter
          </a>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 px-4 text-bone font-semibold text-sm transition-colors border border-olive/50 bg-olive/20 hover:bg-olive/30">
            <MessageCircle size={14} />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
