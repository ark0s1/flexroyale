'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AccountValue } from '@/types/clash';
import { formatEuros, formatGems, cn } from '@/lib/utils';
import { useI18n } from './I18nProvider';

interface ValueBreakdownProps {
  breakdown: AccountValue['breakdown'];
  totalEuros: number;
}

type BreakdownKey = keyof AccountValue['breakdown'];

// Palette terreuse + icone Bootstrap par categorie (aplats, pas de glow, pas de violet)
const CATEGORY_META: Record<BreakdownKey, { bar: string; icon: string }> = {
  cards:      { bar: '#6E8C9E', icon: 'bi-collection-fill' },
  evolutions: { bar: '#C8902E', icon: 'bi-lightning-charge-fill' },
  heroes:     { bar: '#8A8B4A', icon: 'bi-star-fill' },
  kingLevel:  { bar: '#C0573B', icon: 'bi-award-fill' },
  trophies:   { bar: '#C8902E', icon: 'bi-trophy-fill' },
  cosmetics:  { bar: '#9C7A5B', icon: 'bi-palette-fill' },
  anciennete: { bar: '#8A847A', icon: 'bi-hourglass-split' },
  ranked:     { bar: '#C0573B', icon: 'bi-bar-chart-fill' },
};

export default function ValueBreakdown({ breakdown, totalEuros }: ValueBreakdownProps) {
  const { t } = useI18n();
  const [openKey, setOpenKey] = useState<BreakdownKey | null>(null);

  const items = Object.entries(breakdown) as [BreakdownKey, AccountValue['breakdown'][BreakdownKey]][];
  const sortedItems = items.sort((a, b) => b[1].value - a[1].value);

  return (
    <div className="space-y-2">
      <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">
        {t.breakdownTitle}
      </h3>
      {sortedItems.map(([key, item]) => {
        const pct = totalEuros > 0 ? Math.round((item.value / totalEuros) * 100) : 0;
        const isOpen = openKey === key;
        const meta = CATEGORY_META[key];
        return (
          <div
            key={key}
            className="glass-card overflow-hidden transition-all duration-200"
            style={isOpen ? { borderColor: meta.bar } : undefined}
          >
            <button
              className="w-full flex items-center justify-between p-4 transition-colors"
              onClick={() => setOpenKey(isOpen ? null : key)}
              style={{ background: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(236,230,216,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <i className={`bi ${meta.icon} shrink-0`} aria-hidden="true" style={{ color: meta.bar }} />
                <span className="text-white text-sm font-medium truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-3 ml-2 shrink-0">
                <span className="font-gaming font-bold text-sm" style={{ color: meta.bar }}>
                  {formatEuros(item.value)}
                </span>
                <span className="text-gray-600 text-xs w-8 text-right">{pct}%</span>
                <ChevronDown
                  size={14}
                  className={cn('text-gray-600 transition-transform', isOpen && 'rotate-180')}
                />
              </div>
            </button>

            <div className="px-4 pb-3">
              <div className="h-1 overflow-hidden" style={{ background: 'rgba(236,230,216,0.08)' }}>
                <div
                  className="h-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: meta.bar }}
                />
              </div>
            </div>

            {isOpen && (
              <div className="px-4 pb-4 pt-1" style={{ borderTop: '1px solid rgba(236,230,216,0.08)' }}>
                <p className="text-gray-400 text-sm">{item.detail}</p>
                <p className="text-gray-600 text-xs mt-1">
                  ≈ {formatGems(item.gems)} {t.breakdownGems}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
