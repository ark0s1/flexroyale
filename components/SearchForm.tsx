'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from './I18nProvider';

interface SearchFormProps {
  defaultValue?: string;
  compact?: boolean;
  onSearch?: (tag: string) => void;
}

export default function SearchForm({ defaultValue = '', compact = false, onSearch }: SearchFormProps) {
  const router = useRouter();
  const { t } = useI18n();
  const [tag, setTag] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  function validateTag(value: string): string {
    const clean = value.replace('#', '').trim();
    if (clean.length < 3) return t.searchErrorShort;
    if (clean.length > 12) return t.searchErrorLong;
    if (!/^[A-Z0-9]+$/i.test(clean)) return t.searchErrorInvalid;
    return '';
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const clean = tag.replace('#', '').trim().toUpperCase();
    const validationError = validateTag(clean);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);

    if (onSearch) {
      onSearch(clean);
      setLoading(false);
    } else {
      router.push(`/player/${clean}`);
    }
  }

  function handleChange(value: string) {
    setTag(value);
    if (error) setError('');
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className={cn('flex gap-3', compact ? 'flex-row' : 'flex-col sm:flex-row')}>
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dustyblue font-black text-lg select-none font-gaming">
              #
            </span>
            <input
              type="text"
              value={tag.replace('#', '')}
              onChange={e => handleChange(e.target.value)}
              placeholder="PGU8V0GR8"
              maxLength={12}
              className={cn(
                'input-gaming w-full pl-9 pr-4 font-mono tracking-wider',
                compact ? 'py-2 text-sm' : 'py-4 text-lg',
                error ? 'border-terracotta focus:border-terracotta' : ''
              )}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={cn(
              'btn-primary flex items-center justify-center gap-2 font-gaming font-bold tracking-wide',
              compact ? 'px-5 py-2 text-sm' : 'px-8 py-4 text-base sm:whitespace-nowrap'
            )}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            {!compact && (loading ? t.searchLoading : t.searchButton)}
          </button>
        </div>

        {error && (
          <p className="mt-2 text-terracotta text-sm flex items-center gap-1">
            <i className="bi bi-exclamation-triangle" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>

      {!compact && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => { setLoading(true); router.push('/player/PGU8V0GR8'); }}
            className="text-dustyblue hover:text-bone text-sm transition-colors font-medium"
          >
            {t.searchExample}
          </button>
          <div className="relative">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-400 text-sm flex items-center gap-1 transition-colors"
              onClick={() => setShowTooltip(!showTooltip)}
            >
              <HelpCircle size={14} />
              {t.searchHowToFind}
            </button>
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 glass-card p-4 text-sm text-gray-300 z-10">
                <p className="font-bold text-bone mb-2 font-gaming">{t.searchTooltipTitle}</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-400">
                  <li>{t.searchTooltipStep1}</li>
                  <li>{t.searchTooltipStep2}</li>
                  <li>{t.searchTooltipStep3}</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
