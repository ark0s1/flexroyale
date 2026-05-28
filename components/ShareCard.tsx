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

  // URL de l'image OG (déjà générée par /api/og avec Satori + Sharp)
  const ogUrl = `${siteUrl}/api/og?name=${encodeURIComponent(player.name)}&value=${accountValue.totalEuros}&grade=${accountValue.flexGrade}&trophies=${player.bestTrophies || player.trophies}&archetype=${encodeURIComponent(accountValue.archetypeEmoji + ' ' + accountValue.archetype)}&topPercent=${encodeURIComponent(accountValue.topPercent)}`;

  // Texte sans URL (le lien est ajouté séparément selon la plateforme)
  const baseText = t.shareTweetTemplate
    .replace('{euros}', Math.round(accountValue.totalEuros).toLocaleString('fr-FR'))
    .replace('{grade}', accountValue.flexGrade)
    .replace('{top}', accountValue.topPercent);

  // WhatsApp : URL sur sa propre ligne pour que WhatsApp la détecte correctement
  const whatsappText = `${baseText}\n\n${shareUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  // Twitter/X : text + &url= séparé (standard Twitter)
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
      if (!response.ok) throw new Error('Génération de l\'image échouée');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flexroyale-${player.name.replace(/[^a-z0-9]/gi, '_')}-grade${accountValue.flexGrade}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur téléchargement:', err);
      // Fallback : ouvrir l'image dans un nouvel onglet
      window.open(ogUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Share2 size={16} className="text-blue-400" />
        <h3 className="text-white font-gaming font-bold tracking-wide">{t.shareTitle}</h3>
      </div>
      <div className="mb-4">
        <BattleCard player={player} accountValue={accountValue} />
      </div>
      <div className="flex flex-col gap-2">
        {/* Télécharger en PNG */}
        <button
          onClick={downloadPng}
          disabled={downloading}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold text-sm transition-all duration-200 disabled:opacity-60"
          style={{
            background: 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(99,37,235,0.3))',
            border: '1px solid rgba(37,99,235,0.5)',
          }}
          onMouseEnter={e => !downloading && (e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,99,235,0.45), rgba(99,37,235,0.45))')}
          onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(99,37,235,0.3))')}
        >
          {downloading
            ? <><Loader2 size={15} className="animate-spin" /> Génération en cours...</>
            : <><Download size={15} /> Télécharger en PNG</>
          }
        </button>

        {/* Copier le lien */}
        <button
          onClick={copyLink}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold text-sm transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
        >
          {copied
            ? <><Check size={15} className="text-green-400" /> {t.shareCopied}</>
            : <><Copy size={15} /> {t.shareCopy}</>
          }
        </button>

        {/* Réseaux sociaux */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-80"
            style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X / Twitter
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-80"
            style={{ background: '#25D366', border: '1px solid rgba(37,211,102,0.3)' }}
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
