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

const CATEGORY_COLORS: Record<BreakdownKey, { bar: string; glow: string }> = {
  cards:      { bar: '#8B5CF6', glow: 'rgba(139,92,246,0.3)' },
  evolutions: { bar: '#FBBF24', glow: 'rgba(251,191,36,0.3)' },
  heroes:     { bar: '#10B981', glow: 'rgba(16,185,129,0.3)' },
  kingLevel:  { bar: '#F59E0B', glow: 'rgba(245,158,11,0.3)' },
  trophies:   { bar: '#EAB308', glow: 'rgba(234,179,8,0.3)' },
  cosmetics:  { bar: '#EC4899', glow: 'rgba(236,72,153,0.3)' },
  anciennete: { bar: '#2563EB', glow: 'rgba(37,99,235,0.3)' },
  ranked:     { bar: '#F97316', glow: 'rgba(249,115,22,0.3)' },
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
        const colors = CATEGORY_COLORS[key];
        return (
          <div
            key={key}
            className="glass-card overflow-hidden transition-all duration-200"
            style={isOpen ? { borderColor: `${colors.bar}44` } : undefined}
          >
            <button
              className="w-full flex items-center justify-between p-4 transition-colors"
              onClick={() => setOpenKey(isOpen ? null : key)}
              style={{ background: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-base shrink-0">{item.label.split(' ')[0]}</span>
                <span className="text-white text-sm font-medium truncate">
                  {item.label.split(' ').slice(1).join(' ')}
                </span>
              </div>
              <div className="flex items-center gap-3 ml-2 shrink-0">
                <span className="font-gaming font-bold text-sm" style={{ color: colors.bar }}>
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
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: colors.bar,
                    boxShadow: `0 0 8px ${colors.glow}`,
                  }}
                />
              </div>
            </div>

            {isOpen && (
              <div className="px-4 pb-4 pt-1" style={{ borderTop: `1px solid rgba(255,255,255,0.06)` }}>
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
