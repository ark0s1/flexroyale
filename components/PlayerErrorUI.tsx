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
  if (msg.includes('Trop de requêtes') || msg.includes('429')) return 'rate_limit';
  if (
    msg.includes('contacter') || msg.includes('proxy') ||
    msg.includes('403') || msg.includes('401') || msg.includes('502') || msg.includes('503')
  ) return 'proxy_down';
  return 'generic';
}

const ERROR_CONTENT: Record<ErrorType, {
  emoji: string;
  title: string;
  description: (tag: string) => string;
  showRetry: boolean;
  autoRetry: boolean;
}> = {
  not_found: {
    emoji: '🔍',
    title: 'Joueur introuvable',
    description: (tag) => `Le tag #${tag} ne correspond à aucun joueur. Vérifie l'orthographe — les tags Clash Royale ne contiennent pas de "O", seulement des "0".`,
    showRetry: false,
    autoRetry: false,
  },
  proxy_down: {
    emoji: '🔌',
    title: 'Service temporairement indisponible',
    description: () => 'Le proxy Clash Royale est momentanément hors ligne. Ça arrive rarement — réessaie dans 30 secondes.',
    showRetry: true,
    autoRetry: true,
  },
  timeout: {
    emoji: '⏱️',
    title: 'Réponse trop lente',
    description: () => "L'API Clash Royale met trop de temps à répondre. Les serveurs de Supercell peuvent être surchargés. Réessaie dans quelques secondes.",
    showRetry: true,
    autoRetry: true,
  },
  rate_limit: {
    emoji: '🚦',
    title: 'Trop de requêtes',
    description: () => "Tu as fait beaucoup de recherches d'affilée. Attends quelques secondes avant de réessayer.",
    showRetry: true,
    autoRetry: false,
  },
  generic: {
    emoji: '😕',
    title: 'Une erreur est survenue',
    description: () => "Quelque chose s'est mal passé. Si le problème persiste, le tag est peut-être invalide.",
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
      if (countdown === 1) {
        window.location.reload();
      } else {
        setCountdown(c => c - 1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, content.autoRetry]);

  return (
    <div className="min-h-screen bg-[#07070E] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center py-20">
        <div className="glass-card p-10 max-w-md w-full">
          <p className="text-6xl mb-6">{content.emoji}</p>

          <h1 className="font-gaming text-2xl font-bold text-white mb-3 tracking-wide">
            {content.title}
          </h1>

          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            {content.description(tag)}
          </p>

          {/* Message d'erreur technique (optionnel, réduit) */}
          {errorMessage && type !== 'not_found' && (
            <details className="mb-5 text-left">
              <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-400 transition-colors">
                Détails techniques
              </summary>
              <p className="mt-2 text-xs text-gray-600 font-mono bg-black/30 rounded p-2 break-words">
                {errorMessage}
              </p>
            </details>
          )}

          {/* Boutons d'action */}
          <div className="flex flex-col gap-3">
            {content.showRetry && (
              <button
                onClick={() => window.location.reload()}
                className="btn-primary px-8 py-3 font-gaming font-bold tracking-wide w-full"
              >
                {content.autoRetry && countdown > 0
                  ? `Réessayer (${countdown}s)`
                  : 'Réessayer'}
              </button>
            )}
            <a
              href="/"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors py-2"
            >
              ← Retour à l&apos;accueil
            </a>
          </div>
        </div>

        {/* Status indicator */}
        {(type === 'proxy_down' || type === 'timeout') && (
          <a
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 text-xs text-gray-700 hover:text-gray-500 transition-colors underline underline-offset-2"
          >
            Vérifier le statut du service →
          </a>
        )}
      </div>
      <Footer />
    </div>
  );
}
