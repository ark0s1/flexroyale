'use client';

import { useState, useEffect } from 'react';
import Footer from './Footer';

interface Props {
  tag: string;
  errorMessage: string | null;
}

type ErrorType = 'not_found' | 'proxy_down' | 'timeout' | 'rate_limit' | 'generic';

function classifyError(msg: string | null): ErrorType {
  if (!msg) return 'generic';
  if (msg.includes('introuvable') || msg.includes('not found')) return 'not_found';
  if (msg.includes('trop de temps') || msg.includes('timeout') || msg.includes('TimeoutError')) return 'timeout';
  if (msg.includes('Trop de requetes') || msg.includes('429')) return 'rate_limit';
  if (
    msg.includes('contacter') || msg.includes('proxy') ||
    msg.includes('403') || msg.includes('401') || msg.includes('502') || msg.includes('503')
  ) return 'proxy_down';
  return 'generic';
}

const ERROR_CONTENT: Record<ErrorType, {
  icon: string;
  title: string;
  description: (tag: string) => string;
  showRetry: boolean;
  autoRetry: boolean;
}> = {
  not_found: {
    icon: 'bi-search',
    title: 'Joueur introuvable',
    description: (tag) => `Le tag #${tag} ne correspond a aucun joueur. Verifie l orthographe : les tags Clash Royale ne contiennent pas de O, seulement des 0.`,
    showRetry: false,
    autoRetry: false,
  },
  proxy_down: {
    icon: 'bi-plug',
    title: 'Service temporairement indisponible',
    description: () => 'Le proxy Clash Royale est momentanement hors ligne. Reessaie dans 30 secondes.',
    showRetry: true,
    autoRetry: true,
  },
  timeout: {
    icon: 'bi-hourglass-split',
    title: 'Reponse trop lente',
    description: () => "L API Clash Royale met trop de temps a repondre. Les serveurs de Supercell peuvent etre surcharges.",
    showRetry: true,
    autoRetry: true,
  },
  rate_limit: {
    icon: 'bi-sign-stop',
    title: 'Trop de requetes',
    description: () => "Tu as fait beaucoup de recherches d affilee. Attends quelques secondes avant de reessayer.",
    showRetry: true,
    autoRetry: false,
  },
  generic: {
    icon: 'bi-exclamation-triangle',
    title: 'Une erreur est survenue',
    description: () => "Quelque chose s est mal passe. Si le probleme persiste, le tag est peut-etre invalide.",
    showRetry: true,
    autoRetry: false,
  },
};

export default function PlayerErrorUI({ tag, errorMessage }: Props) {
  const type = classifyError(errorMessage);
  const content = ERROR_CONTENT[type];
  const [countdown, setCountdown] = useState(content.autoRetry ? 10 : 0);

  useEffect(() => {
    if (!content.autoRetry || countdown <= 0) return;
    const timer = setTimeout(() => {
      if (countdown === 1) window.location.reload();
      else setCountdown(c => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, content.autoRetry]);

  return (
    <div className="min-h-screen bg-espresso flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center py-20">
        <div className="glass-card p-10 max-w-md w-full">
          <i className={`bi ${content.icon} text-5xl text-terracotta mb-6 block`} aria-hidden="true" />

          <h1 className="font-gaming text-2xl font-bold text-bone mb-3 tracking-wide">
            {content.title}
          </h1>

          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            {content.description(tag)}
          </p>

          {errorMessage && type !== 'not_found' && (
            <details className="mb-5 text-left">
              <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-400 transition-colors">
                Details techniques
              </summary>
              <p className="mt-2 text-xs text-gray-600 font-mono bg-black/30 p-2 break-words">
                {errorMessage}
              </p>
            </details>
          )}

          <div className="flex flex-col gap-3">
            {content.showRetry && (
              <button onClick={() => window.location.reload()} className="btn-primary px-8 py-3 font-gaming font-bold tracking-wide w-full">
                {content.autoRetry && countdown > 0 ? `Reessayer (${countdown}s)` : 'Reessayer'}
              </button>
            )}
            <a href="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors py-2">
              Retour a l&apos;accueil
            </a>
          </div>
        </div>

        {(type === 'proxy_down' || type === 'timeout') && (
          <a href="/api/health" target="_blank" rel="noopener noreferrer" className="mt-6 text-xs text-gray-700 hover:text-gray-500 transition-colors underline underline-offset-2">
            Verifier le statut du service
          </a>
        )}
      </div>
      <Footer />
    </div>
  );
}
