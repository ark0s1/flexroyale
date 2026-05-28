'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Lang, Translations, translations } from '@/lib/i18n';

const STORAGE_KEY = 'flexroyale_lang';

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'fr',
  setLang: () => {},
  t: translations.fr,
});

function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === 'fr' || saved === 'en') return saved;
  } catch {}
  const nav = navigator.language || '';
  return nav.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr');

  useEffect(() => {
    setLangState(detectLang());
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] as Translations }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
