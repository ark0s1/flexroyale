import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

/* ─── Types ─── */
type Grade = 'S' | 'A' | 'B' | 'C' | 'D';

/* ─── Static data ─── */
const GRADES: Grade[] = ['S', 'A', 'B', 'C', 'D'];

const GRADE_DATA: Record<Grade, {
  color: string;
  bgGradient: string;
  borderColor: string;
  glowColor: string;
  tagline: string;
  emoji: string;
  score: string;
  topPercent: string;
  valueRange: string;
  description: string;
  archetypes: string[];
  criteria: string[];
}> = {
  S: {
    color: '#F59E0B',
    bgGradient: 'from-amber-500/20 to-amber-600/5',
    borderColor: 'border-amber-500/40',
    glowColor: 'rgba(245,158,11,0.15)',
    tagline: 'LÉGENDAIRE',
    emoji: '✨',
    score: '750+',
    topPercent: 'Top 1%',
    valueRange: '1 000 € – 5 000 €+',
    description:
      'Le grade S est le Saint Graal de Clash Royale. Il désigne les comptes les plus rares du jeu — une collection quasi-complète, des années d\'investissement et des trophées au sommet. Moins de 1 % des joueurs atteignent ce niveau. Si tu es ici, tu peux vraiment flex.',
    archetypes: ['GOATed Whale 🐋', 'End-Game Elite 👑'],
    criteria: [
      '50+ cartes au niveau maximum',
      'Score FlexRoyale ≥ 750 / 1000',
      'Trophées souvent supérieurs à 8 000',
      'Evolutions et Héros débloqués',
      'Compte estimé à plusieurs milliers d\'euros',
    ],
  },
  A: {
    color: '#10B981',
    bgGradient: 'from-emerald-500/20 to-emerald-600/5',
    borderColor: 'border-emerald-500/40',
    glowColor: 'rgba(16,185,129,0.12)',
    tagline: 'ELITE',
    emoji: '🔥',
    score: '550 – 749',
    topPercent: 'Top 5%',
    valueRange: '300 € – 1 000 €',
    description:
      'Grade A = compte elite. Tu as clairement investi du temps — et probablement quelques euros — dans ton compte. Tu surpasses 95 % des joueurs actifs. La marche vers le S est encore haute, mais tu y es presque.',
    archetypes: ['End-Game Elite 👑', 'Evo Collector ⚡'],
    criteria: [
      'Score FlexRoyale entre 550 et 749',
      'Nombreuses cartes proches du niveau max',
      'Profil Ranked solide (Master I+)',
      'Evolutions significatives débloquées',
    ],
  },
  B: {
    color: '#3B82F6',
    bgGradient: 'from-blue-500/20 to-blue-600/5',
    borderColor: 'border-blue-500/40',
    glowColor: 'rgba(59,130,246,0.12)',
    tagline: 'SOLIDE',
    emoji: '⚔️',
    score: '350 – 549',
    topPercent: 'Top 15%',
    valueRange: '100 € – 300 €',
    description:
      'Grade B = joueur sérieux. Tu surpasses largement la majorité des joueurs actifs. Ta collection a de la valeur et ta progression est visible. Il te reste un dernier palier à franchir pour atteindre l\'élite.',
    archetypes: ['High Ladder Grinder 🏆'],
    criteria: [
      'Score FlexRoyale entre 350 et 549',
      'Collection bien développée',
      'Actif en classé ou en ladder',
      'King Level élevé',
    ],
  },
  C: {
    color: '#8B5CF6',
    bgGradient: 'from-violet-500/20 to-violet-600/5',
    borderColor: 'border-violet-500/40',
    glowColor: 'rgba(139,92,246,0.12)',
    tagline: 'EN PROGRESSION',
    emoji: '📈',
    score: '150 – 349',
    topPercent: 'Top 35%',
    valueRange: '30 € – 100 €',
    description:
      'Grade C = mid-game. Tu progresses, ta collection prend de la valeur. Avec un peu plus de temps ou d\'investissement, le grade B est à portée. Chaque partie bien jouée rapproche ton score.',
    archetypes: ['Mid-Game Solid ⚔️'],
    criteria: [
      'Score FlexRoyale entre 150 et 349',
      'Collection en développement',
      'Quelques cartes à haut niveau',
      'Premier accès aux Evolutions',
    ],
  },
  D: {
    color: '#6B7280',
    bgGradient: 'from-gray-500/15 to-gray-600/5',
    borderColor: 'border-gray-500/40',
    glowColor: 'rgba(107,114,128,0.10)',
    tagline: 'DÉBUT DE L\'AVENTURE',
    emoji: '🌱',
    score: '< 150',
    topPercent: 'Top 60%+',
    valueRange: '0 € – 30 €',
    description:
      'Grade D = le début. Chaque bataille et chaque upgrade rapproche ton compte d\'un meilleur grade. Tout le monde commence quelque part — les futurs grades S aussi. Calcule ta valeur maintenant et suis ta progression.',
    archetypes: ['Early Journey 🌱'],
    criteria: [
      'Score FlexRoyale < 150',
      'Compte récent ou peu développé',
      'Collection en construction',
      'Fort potentiel de progression',
    ],
  },
};

/* ─── generateStaticParams ─── */
export function generateStaticParams() {
  return GRADES.map((grade) => ({ grade }));
}

/* ─── Metadata ─── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ grade: string }>;
}): Promise<Metadata> {
  const { grade } = await params;
  const g = grade.toUpperCase() as Grade;
  if (!GRADES.includes(g)) return {};

  const d = GRADE_DATA[g];
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://flexroyale.vercel.app').trim();

  return {
    title: `Grade ${g} Clash Royale — ${d.tagline} | FlexRoyale`,
    description: `Tout sur le grade ${g} de Clash Royale (${d.topPercent}, score ${d.score}). ${d.description.substring(0, 120)}... Calcule ton grade sur FlexRoyale.`,
    openGraph: {
      title: `Grade ${g} Clash Royale — ${d.emoji} ${d.tagline}`,
      description: `${d.topPercent} des joueurs mondiaux. Score ${d.score}. Compte estimé ${d.valueRange}. Découvre si tu as le grade ${g}.`,
      url: `${siteUrl}/grade/${g}`,
      siteName: 'FlexRoyale',
      images: [{ url: `${siteUrl}/og-default.png`, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Grade ${g} Clash Royale — ${d.emoji} ${d.tagline}`,
      description: `${d.topPercent} des joueurs. Score ${d.score}. Compte estimé ${d.valueRange}.`,
    },
    alternates: {
      canonical: `${siteUrl}/grade/${g}`,
    },
  };
}

/* ─── Page Component ─── */
export default async function GradePage({
  params,
}: {
  params: Promise<{ grade: string }>;
}) {
  const { grade } = await params;
  const g = grade.toUpperCase() as Grade;
  if (!GRADES.includes(g)) notFound();

  const d = GRADE_DATA[g];

  /* Grades voisins pour la navigation */
  const idx = GRADES.indexOf(g);
  const prevGrade = idx > 0 ? GRADES[idx - 1] : null;
  const nextGrade = idx < GRADES.length - 1 ? GRADES[idx + 1] : null;

  return (
    <div className="min-h-screen bg-[#07070E] text-white">
      {/* Grid background */}
      <div className="fixed inset-0 bg-grid opacity-40 pointer-events-none" />

      {/* Glow blob */}
      <div
        className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${d.glowColor} 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 sm:py-20">

        {/* ── Header nav ── */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            className="text-white/50 hover:text-white transition-colors text-sm flex items-center gap-2"
          >
            ← FlexRoyale
          </Link>
          <Link
            href="/"
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Calculateur de valeur Clash Royale
          </Link>
        </div>

        {/* ── Hero ── */}
        <div className="text-center mb-12">
          {/* Grade badge */}
          <div className="inline-flex items-center justify-center mb-6">
            <div
              className={`w-32 h-32 rounded-2xl border-2 ${d.borderColor} flex items-center justify-center`}
              style={{
                background: `linear-gradient(135deg, ${d.glowColor}, transparent)`,
                boxShadow: `0 0 60px ${d.glowColor}, 0 0 20px ${d.glowColor}`,
              }}
            >
              <span
                className="font-gaming text-7xl font-black leading-none"
                style={{ color: d.color }}
              >
                {g}
              </span>
            </div>
          </div>

          {/* Tagline */}
          <div
            className="inline-block text-xs font-bold tracking-widest px-3 py-1 rounded-full border mb-4"
            style={{
              color: d.color,
              borderColor: `${d.color}40`,
              background: `${d.color}15`,
            }}
          >
            {d.emoji} {d.tagline}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black mb-3">
            Grade <span style={{ color: d.color }}>{g}</span> Clash Royale
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {d.description}
          </p>
        </div>

        {/* ── Stats cards ── */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Score FlexRoyale', value: d.score },
            { label: 'Classement mondial', value: d.topPercent },
            { label: 'Valeur estimée', value: d.valueRange },
          ].map(({ label, value }) => (
            <div key={label} className="glass-card p-4 text-center">
              <div
                className="text-lg sm:text-xl font-black mb-1"
                style={{ color: d.color }}
              >
                {value}
              </div>
              <div className="text-xs text-white/40">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Archetypes ── */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">
            Archétypes typiques
          </h2>
          <div className="flex flex-wrap gap-2">
            {d.archetypes.map((a) => (
              <span
                key={a}
                className="text-sm font-semibold px-4 py-2 rounded-full border"
                style={{
                  color: d.color,
                  borderColor: `${d.color}40`,
                  background: `${d.color}12`,
                }}
              >
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* ── Criteria ── */}
        <div className="glass-card p-6 mb-10">
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">
            Critères du grade {g}
          </h2>
          <ul className="space-y-3">
            {d.criteria.map((c) => (
              <li key={c} className="flex items-start gap-3 text-sm text-white/70">
                <span style={{ color: d.color }} className="mt-0.5 shrink-0">▸</span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* ── CTA ── */}
        <div className="text-center mb-12">
          <p className="text-white/50 text-sm mb-4">
            Curieux de connaître ton grade ? Saisis ton tag Clash Royale.
          </p>
          <Link
            href="/"
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base font-bold rounded-xl"
          >
            🔍 Calculer mon grade
          </Link>
        </div>

        {/* ── Grade navigation ── */}
        <div className="divider-glow mb-8" />
        <div className="flex items-center justify-between">
          <div>
            {prevGrade && (
              <Link
                href={`/grade/${prevGrade}`}
                className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2"
              >
                ← Grade {prevGrade}
                <span className="text-xs text-white/20">
                  {GRADE_DATA[prevGrade].tagline}
                </span>
              </Link>
            )}
          </div>
          <div className="text-center">
            <p className="text-xs text-white/20">Tous les grades</p>
            <div className="flex gap-2 mt-1">
              {GRADES.map((gr) => (
                <Link
                  key={gr}
                  href={`/grade/${gr}`}
                  className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center border transition-all ${
                    gr === g ? 'border-white/20 scale-110' : 'border-white/5 hover:border-white/20'
                  }`}
                  style={
                    gr === g
                      ? { color: d.color, borderColor: `${d.color}60`, background: `${d.color}20` }
                      : { color: GRADE_DATA[gr].color }
                  }
                >
                  {gr}
                </Link>
              ))}
            </div>
          </div>
          <div className="text-right">
            {nextGrade && (
              <Link
                href={`/grade/${nextGrade}`}
                className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2 justify-end"
              >
                <span className="text-xs text-white/20">
                  {GRADE_DATA[nextGrade].tagline}
                </span>
                Grade {nextGrade} →
              </Link>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <p className="text-center text-xs text-white/20 mt-12">
          FlexRoyale — Calculateur de valeur de compte Clash Royale
        </p>
      </div>
    </div>
  );
}
