'use client';

import Footer from './Footer';
import { useI18n } from './I18nProvider';

interface Props {
  tag: string;
  errorMessage: string | null;
}

export default function PlayerErrorUI({ tag, errorMessage }: Props) {
  const { t } = useI18n();

  const isNotFound = errorMessage?.includes('introuvable') || errorMessage?.includes('not found');
  const isIpBlocked = errorMessage?.includes('403');

  const description = isNotFound
    ? t.errorNotFoundDesc.replace('{tag}', `#${tag}`)
    : isIpBlocked
    ? t.errorApiUnavailable
    : errorMessage;

  return (
    <div className="min-h-screen bg-[#07070E] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center py-20">
        <div className="glass-card p-10 max-w-md w-full">
          <p className="text-6xl mb-6">{isNotFound ? '🔍' : '😕'}</p>
          <h1 className="font-gaming text-2xl font-bold text-white mb-3 tracking-wide">
            {isNotFound ? t.errorPlayerNotFound : t.errorGeneric}
          </h1>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            {isNotFound ? (
              <>
                {t.errorNotFoundDesc.split('{tag}')[0]}
                <span className="text-blue-400 font-mono">#{tag}</span>
                {t.errorNotFoundDesc.split('{tag}')[1]}
              </>
            ) : (
              description
            )}
          </p>
          <a
            href="/"
            className="btn-primary inline-block px-8 py-3 font-gaming font-bold tracking-wide"
          >
            {t.errorRetry}
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
