import { Metadata } from 'next';
import PlayerCard from '@/components/PlayerCard';
import Footer from '@/components/Footer';
import PlayerErrorUI from '@/components/PlayerErrorUI';
import { PlayerApiResponse } from '@/types/clash';
import { getPlayer } from '@/lib/api';
import { calculateAccountValue } from '@/lib/calculator';
import { saveToLeaderboard } from '@/lib/saveToLeaderboard';

interface Props {
  params: { tag: string };
}

interface FetchResult {
  data: PlayerApiResponse | null;
  errorMessage: string | null;
}

async function fetchPlayer(tag: string): Promise<FetchResult> {
  try {
    const player = await getPlayer(tag);
    const accountValue = calculateAccountValue(player);
    return { data: { player, accountValue }, errorMessage: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue.';
    return { data: null, errorMessage: msg };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await fetchPlayer(params.tag);
  if (!data) {
    return { title: 'Joueur introuvable — FlexRoyale' };
  }

  const { player, accountValue } = data;
  const siteUrl = 'https://flexroyale.vercel.app';
  const playerUrl = `${siteUrl}/player/${params.tag}`;
  const ogUrl = `${siteUrl}/api/og?name=${encodeURIComponent(player.name)}&value=${accountValue.totalEuros}&grade=${accountValue.flexGrade}&trophies=${player.bestTrophies || player.trophies}&archetype=${encodeURIComponent(accountValue.archetypeEmoji + ' ' + accountValue.archetype)}&topPercent=${encodeURIComponent(accountValue.topPercent)}`;

  return {
    title: `${player.name} — Grade ${accountValue.flexGrade} · ${Math.round(accountValue.totalEuros).toLocaleString('fr-FR')} € | FlexRoyale`,
    description: `Le compte Clash Royale de ${player.name} vaut environ ${Math.round(accountValue.totalEuros).toLocaleString('fr-FR')} €. Grade ${accountValue.flexGrade} — ${accountValue.topPercent} mondial.`,
    openGraph: {
      url: playerUrl,
      title: `${player.name} — Grade ${accountValue.flexGrade} | FlexRoyale`,
      description: `Valeur estimée : ${Math.round(accountValue.totalEuros).toLocaleString('fr-FR')} € · ${accountValue.topPercent} mondial`,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${player.name} — Grade ${accountValue.flexGrade} | FlexRoyale`,
      description: `Valeur estimée : ${Math.round(accountValue.totalEuros).toLocaleString('fr-FR')} € · ${accountValue.topPercent} mondial`,
      images: [ogUrl],
    },
  };
}

export default async function PlayerPage({ params }: Props) {
  const { data, errorMessage } = await fetchPlayer(params.tag);

  if (!data) {
    return <PlayerErrorUI tag={params.tag} errorMessage={errorMessage} />;
  }

  // Sauvegarde en arrière-plan dans le leaderboard (ne bloque pas le rendu)
  await saveToLeaderboard(data.player, data.accountValue).catch(() => {});

  return (
    <>
      <PlayerCard player={data.player} accountValue={data.accountValue} />
      <Footer />
    </>
  );
}