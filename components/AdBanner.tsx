'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
}

export default function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
    return (
      <div className={`bg-[#26231E] border border-line p-4 text-center text-gray-600 text-sm ${className}`}>
        <span className="inline-flex items-center gap-2">
          <i className="bi bi-megaphone" aria-hidden="true" />
          Espace publicitaire
        </span>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
