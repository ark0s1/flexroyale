import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Grade = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';

const GRADES: Grade[] = ['S+', 'S', 'A', 'B', 'C', 'D'];

function toSlug(g: Grade): string {
  return g === 'S+' ? 'S-plus' : g;
}

function fromSlug(slug: string): Grade | null {
  const up = slug.toUpperCase();
  if (up === 'S-PLUS' || up === 'SPLUS') return 'S+';
  if (up === 'S' || up === 'A' || up === 'B' || up === 'C' || up === 'D') return up as Grade;
  return null;
}

const GRADE_DATA: Record<Grade, {
  color: string;
  icon: string;
  tagline: string;
  score: string;
  topPercent: string;
  valueRange: string;
  description: string;
  archetypes: string[];
  criteria: string[];
}> = {
  'S+': {
    color: '#C0573B',
    icon: 'bi-trophy-fill',
    tagline: 'APEX LEGEND',
    score: '950+',
    topPercent: 'Top 0.1%',
    valueRange: '5 000 EUR+',
    description: 'Le grade S+ est le sommet de FlexRoyale, reserve aux comptes quasi parfaits avec une collection massive, un tres haut niveau ranked et un historique de jeu exceptionnel.',
    archetypes: ['GOATed Whale', 'End-Game Elite'],
    criteria: [
      'Score FlexRoyale >= 950 / 1000',
      'Collection quasi complete au niveau maximum',
      'Record de trophees tres eleve',
      'Evolutions et Heros largement debloques',
      'Profil Ranked au sommet',
      'Compte estime a plusieurs milliers d euros',
    ],
  },
  S: {
    color: '#C8902E',
    icon: 'bi-star-fill',
    tagline: 'LEGENDAIRE',
    score: '750 - 949',
    topPercent: 'Top 1%',
    valueRange: '1 000 - 5 000 EUR+',
    description: 'Le grade S distingue les comptes les plus rares : collection avancee, progression longue, tres haut ladder et une valeur nettement au-dessus de la moyenne.',
    archetypes: ['GOATed Whale', 'End-Game Elite'],
    criteria: [
      'Score FlexRoyale >= 750 / 1000',
      'Nombreuses cartes au niveau maximum',
      'Trophees souvent superieurs a 8 000',
      'Evolutions et Heros debloques',
      'Compte estime a plusieurs milliers d euros',
    ],
  },
  A: {
    color: '#8A8B4A',
    icon: 'bi-fire',
    tagline: 'ELITE',
    score: '550 - 749',
    topPercent: 'Top 5%',
    valueRange: '300 - 1 000 EUR',
    description: 'Le grade A correspond a un compte elite : beaucoup de temps investi, une collection solide et une marge claire vers le grade S.',
    archetypes: ['End-Game Elite', 'Evo Collector'],
    criteria: [
      'Score FlexRoyale entre 550 et 749',
      'Nombreuses cartes proches du niveau max',
      'Profil Ranked solide',
      'Evolutions significatives debloquees',
    ],
  },
  B: {
    color: '#9C7A5B',
    icon: 'bi-shield-fill',
    tagline: 'SOLIDE',
    score: '350 - 549',
    topPercent: 'Top 15%',
    valueRange: '100 - 300 EUR',
    description: 'Le grade B marque un joueur serieux : collection bien developpee, progression visible et base saine pour viser l elite.',
    archetypes: ['High Ladder Grinder'],
    criteria: [
      'Score FlexRoyale entre 350 et 549',
      'Collection bien developpee',
      'Activite en ladder ou ranked',
      'King Level eleve',
    ],
  },
  C: {
    color: '#6E8C9E',
    icon: 'bi-graph-up-arrow',
    tagline: 'EN PROGRESSION',
    score: '150 - 349',
    topPercent: 'Top 35%',
    valueRange: '30 - 100 EUR',
    description: 'Le grade C est le mid-game : la collection prend de la valeur et chaque palier supplementaire rapproche le compte du grade B.',
    archetypes: ['Mid-Game Solid'],
    criteria: [
      'Score FlexRoyale entre 150 et 349',
      'Collection en developpement',
      'Quelques cartes a haut niveau',
      'Premier acces aux Evolutions',
    ],
  },
  D: {
    color: '#8A847A',
    icon: 'bi-dash-circle',
    tagline: 'EARLY GAME',
    score: '< 150',
    topPercent: 'Top 60%+',
    valueRange: '0 - 30 EUR',
    description: 'Le grade D est le debut du parcours. Le compte a encore beaucoup de potentiel et peut progresser vite avec du temps de jeu regulier.',
    archetypes: ['Early Journey'],
    criteria: [
      'Score FlexRoyale < 150',
      'Compte recent ou peu developpe',
      'Collection en construction',
      'Fort potentiel de progression',
    ],
  },
};

export function generateStaticParams() {
  return GRADES.map((grade) => ({ grade: toSlug(grade) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ grade: string }>;
}): Promise<Metadata> {
  const { grade } = await params;
  const g = fromSlug(grade);
  if (!g) return {};

  const d = GRADE_DATA[g];
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://flexroyale.vercel.app').trim();

  return {
    title: `Grade ${g} Clash Royale - ${d.tagline} | FlexRoyale`,
    description: `Tout sur le grade ${g} de Clash Royale (${d.topPercent}, score ${d.score}). ${d.description}`,
    openGraph: {
      title: `Grade ${g} Clash Royale - ${d.tagline}`,
      description: `${d.topPercent} des joueurs mondiaux. Score ${d.score}. Compte estime ${d.valueRange}.`,
      url: `${siteUrl}/grade/${toSlug(g)}`,
      siteName: 'FlexRoyale',
      images: [{ url: `${siteUrl}/og-default.png`, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Grade ${g} Clash Royale - ${d.tagline}`,
      description: `${d.topPercent} des joueurs. Score ${d.score}. Compte estime ${d.valueRange}.`,
    },
    alternates: {
      canonical: `${siteUrl}/grade/${toSlug(g)}`,
    },
  };
}

export default async function GradePage({
  params,
}: {
  params: Promise<{ grade: string }>;
}) {
  const { grade } = await params;
  const g = fromSlug(grade);
  if (!g) notFound();

  const d = GRADE_DATA[g];
  const idx = GRADES.indexOf(g);
  const prevGrade = idx > 0 ? GRADES[idx - 1] : null;
  const nextGrade = idx < GRADES.length - 1 ? GRADES[idx + 1] : null;

  return (
    <div className="min-h-screen bg-espresso text-bone">
      <div className="fixed inset-0 bg-grid opacity-50 pointer-events-none" />

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12 sm:py-20">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-gray-500 hover:text-bone transition-colors text-sm flex items-center gap-2">
            <i className="bi bi-arrow-left" aria-hidden="true" />
            FlexRoyale
          </Link>
          <Link href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            Calculateur de valeur Clash Royale
          </Link>
        </div>

        <section className="glass-card p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div
              className="w-32 h-32 border-2 flex items-center justify-center shrink-0"
              style={{ borderColor: d.color, background: `${d.color}12` }}
            >
              <span className="font-gaming text-7xl font-black leading-none" style={{ color: d.color }}>
                {g}
              </span>
            </div>
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest px-3 py-1 border mb-4" style={{ color: d.color, borderColor: `${d.color}66` }}>
                <i className={`bi ${d.icon}`} aria-hidden="true" />
                {d.tagline}
              </span>
              <h1 className="font-gaming text-4xl sm:text-5xl font-black mb-3">
                Grade <span style={{ color: d.color }}>{g}</span> Clash Royale
              </h1>
              <p className="text-gray-400 text-base leading-relaxed">{d.description}</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Score FlexRoyale', value: d.score },
            { label: 'Classement mondial', value: d.topPercent },
            { label: 'Valeur estimee', value: d.valueRange },
          ].map(({ label, value }) => (
            <div key={label} className="glass-card p-4">
              <div className="font-gaming text-2xl font-black mb-1" style={{ color: d.color }}>{value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </section>

        <section className="grid sm:grid-cols-2 gap-5 mb-10">
          <div className="glass-card p-6">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Archetypes typiques</h2>
            <div className="flex flex-wrap gap-2">
              {d.archetypes.map((a) => (
                <span key={a} className="text-sm font-semibold px-4 py-2 border" style={{ color: d.color, borderColor: `${d.color}50`, background: `${d.color}10` }}>
                  {a}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Criteres du grade {g}</h2>
            <ul className="space-y-3">
              {d.criteria.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm text-gray-400">
                  <i className="bi bi-check2-square mt-0.5 shrink-0" aria-hidden="true" style={{ color: d.color }} />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="text-center glass-card p-6 mb-10">
          <p className="text-gray-500 text-sm mb-4">Curieux de connaitre ton grade ? Saisis ton tag Clash Royale.</p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base font-bold">
            <i className="bi bi-search" aria-hidden="true" />
            Calculer mon grade
          </Link>
        </section>

        <div className="divider-glow mb-8" />
        <nav className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            {prevGrade && (
              <Link href={`/grade/${toSlug(prevGrade)}`} className="text-sm text-gray-500 hover:text-bone transition-colors">
                Grade {prevGrade} - {GRADE_DATA[prevGrade].tagline}
              </Link>
            )}
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600">Tous les grades</p>
            <div className="flex justify-center gap-2 mt-2">
              {GRADES.map((gr) => (
                <Link
                  key={gr}
                  href={`/grade/${toSlug(gr)}`}
                  className="min-w-8 h-8 px-2 text-xs font-black flex items-center justify-center border"
                  style={
                    gr === g
                      ? { color: d.color, borderColor: `${d.color}80`, background: `${d.color}18` }
                      : { color: GRADE_DATA[gr].color, borderColor: 'rgba(236,230,216,0.12)' }
                  }
                >
                  {gr}
                </Link>
              ))}
            </div>
          </div>
          <div className="text-right">
            {nextGrade && (
              <Link href={`/grade/${toSlug(nextGrade)}`} className="text-sm text-gray-500 hover:text-bone transition-colors">
                {GRADE_DATA[nextGrade].tagline} - Grade {nextGrade}
              </Link>
            )}
          </div>
        </nav>
      </main>
    </div>
  );
}
