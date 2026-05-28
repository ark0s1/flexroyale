'use client';

import { useI18n } from './I18nProvider';

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1 glass-card px-2 py-1.5 shadow-xl">
      <button
        onClick={() => setLang('fr')}
        title="Français"
        className={`text-lg leading-none px-1.5 py-0.5 rounded-full transition-all duration-200 ${
          lang === 'fr'
            ? 'bg-blue-600/30 ring-1 ring-blue-500/60 scale-110'
            : 'opacity-40 hover:opacity-70'
        }`}
      >
        🇫🇷
      </button>
      <button
        onClick={() => setLang('en')}
        title="English"
        className={`text-lg leading-none px-1.5 py-0.5 rounded-full transition-all duration-200 ${
          lang === 'en'
            ? 'bg-blue-600/30 ring-1 ring-blue-500/60 scale-110'
            : 'opacity-40 hover:opacity-70'
        }`}
      >
        🇬🇧
      </button>
    </div>
  );
}
