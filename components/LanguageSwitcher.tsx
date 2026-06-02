'use client';

import { useI18n } from './I18nProvider';

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1 glass-card px-2 py-1.5">
      <button
        onClick={() => setLang('fr')}
        title="Francais"
        className={`text-xs font-bold leading-none px-2 py-1 transition-colors ${
          lang === 'fr'
            ? 'bg-terracotta text-bone'
            : 'text-gray-500 hover:text-bone'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLang('en')}
        title="English"
        className={`text-xs font-bold leading-none px-2 py-1 transition-colors ${
          lang === 'en'
            ? 'bg-terracotta text-bone'
            : 'text-gray-500 hover:text-bone'
        }`}
      >
        EN
      </button>
    </div>
  );
}
