'use client';

import Image from 'next/image';
import Link from 'next/link';
import SearchForm from '@/components/SearchForm';
import TopFlexers from '@/components/TopFlexers';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import { useState } from 'react';
import { useI18n } from '@/components/I18nProvider';

const STEPS = [
  { step: '01', icon: 'bi-person-vcard', titleKey: 'homeStep1Title', descKey: 'homeStep1Desc' },
  { step: '02', icon: 'bi-calculator', titleKey: 'homeStep2Title', descKey: 'homeStep2Desc' },
  { step: '03', icon: 'bi-share', titleKey: 'homeStep3Title', descKey: 'homeStep3Desc' },
] as const;

const GRADES = [
  { grade: 'S+', slug: 'S-plus', color: '#C0573B', label: 'APEX' },
  { grade: 'S', slug: 'S', color: '#C8902E', label: 'LEGEND' },
  { grade: 'A', slug: 'A', color: '#8A8B4A', label: 'ELITE' },
  { grade: 'B', slug: 'B', color: '#9C7A5B', label: 'SOLID' },
  { grade: 'C', slug: 'C', color: '#6E8C9E', label: 'GROWTH' },
  { grade: 'D', slug: 'D', color: '#8A847A', label: 'START' },
];

export default function HomePage() {
  const { t } = useI18n();
  const [flexCount, setFlexCount] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-espresso text-bone overflow-x-hidden">
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-14">
        <div className="absolute inset-0 bg-grid pointer-events-none" />

        <div className="relative z-10 mb-7 border border-clay bg-[#26231E] p-4">
          <Image
            src="/logo.png"
            alt="FlexRoyale"
            width={112}
            height={112}
            priority
            className="object-contain"
          />
        </div>

        <div className="relative z-10 text-center mb-6 max-w-3xl">
          <span className="badge-blue mb-4 inline-flex items-center gap-2">
            <i className="bi bi-controller" aria-hidden="true" />
            Clash Royale Account Value
          </span>
          <h1 className="font-gaming text-5xl sm:text-7xl md:text-8xl font-black tracking-wide mb-4 leading-none">
            <span className="text-dustyblue">FLEX</span>
            <span className="text-bone">ROYALE</span>
          </h1>
          <p className="font-gaming text-2xl sm:text-4xl text-bone/90 mb-2">
            {t.homeTagline}
          </p>
          <p className="text-muted text-lg">{t.homeSubline}</p>
        </div>

        <div className="relative z-10 w-full max-w-lg mx-auto mb-12">
          <div className="glass-card p-6">
            <SearchForm />
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl text-center">
          {[
            { value: '5 000 EUR', label: t.homeStatMax },
            { value: 'Top 1%', label: t.homeStatTop },
            { value: '6 Grades', label: 'S+ -> D' },
            { value: flexCount !== null ? flexCount.toLocaleString('fr-FR') : '-', label: 'joueurs ont flex' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4">
              <p className="font-gaming text-2xl sm:text-3xl text-ochre font-bold">{stat.value}</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="py-20 px-4 border-t border-line">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge-blue mb-4 inline-block">Guide</span>
            <h2 className="font-gaming text-4xl sm:text-5xl font-bold text-bone">
              {t.homeHowTitle}
            </h2>
            <div className="divider-glow w-32 mx-auto mt-4" />
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {STEPS.map((item) => (
              <div key={item.step} className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-gaming text-sm text-gray-500">{item.step}</span>
                  <i className={`bi ${item.icon} text-2xl text-terracotta`} aria-hidden="true" />
                </div>
                <h3 className="font-gaming text-xl font-bold text-bone mb-2">
                  {t[item.titleKey]}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t[item.descKey]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-line">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <span className="badge-gold mb-4 inline-block">Grades</span>
              <h2 className="font-gaming text-4xl font-bold text-bone">Explore les niveaux FlexRoyale</h2>
            </div>
            <p className="text-gray-500 text-sm max-w-md">
              Chaque grade a sa page dediee, ses seuils, ses archetypes et ses criteres.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {GRADES.map((item) => (
              <Link
                key={item.slug}
                href={`/grade/${item.slug}`}
                className="glass-card p-4 transition-colors hover:border-clay"
              >
                <div className="font-gaming text-4xl font-black" style={{ color: item.color }}>
                  {item.grade}
                </div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">{item.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 my-16">
        <AdBanner slot="home-mid" format="horizontal" />
      </div>

      <TopFlexers onCountChange={setFlexCount} />
      <Footer />
    </div>
  );
}
