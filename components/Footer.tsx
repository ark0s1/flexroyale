'use client';

import { useI18n } from './I18nProvider';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-16 py-10 px-4">
      <div className="divider-glow max-w-4xl mx-auto mb-8" />
      <div className="text-center space-y-3">
        <p className="font-gaming text-lg tracking-widest text-white/20">⚔️ FLEXROYALE</p>
        <p className="text-gray-600 text-xs max-w-xl mx-auto leading-relaxed">
          This content is not affiliated with, endorsed, sponsored, or specifically approved
          by Supercell and Supercell is not responsible for it. For more information see{' '}
          <a
            href="https://supercell.com/en/fan-content-policy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-400 underline transition-colors"
          >
            Supercell&apos;s Fan Content Policy
          </a>.
        </p>
        <p className="text-gray-700 text-xs">
          Clash Royale® is a trademark of Supercell Oy. Card values are estimations only.
        </p>
        <p className="text-gray-700 text-xs">
          © 2026 FlexRoyale —{' '}
          <a href="/privacy" className="hover:text-gray-500 transition-colors">{t.footerPrivacy}</a>
        </p>
      </div>
    </footer>
  );
}
