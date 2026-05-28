'use client';

import { GRADE_CONFIG, type Grade } from '@/lib/grades';
import { useI18n } from './I18nProvider';
import { cn } from '@/lib/utils';

interface FlexGradeProps {
  grade: Grade;
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

const TAGLINE_KEYS: Record<Grade, 'gradeTaglineS' | 'gradeTaglineSPlus' | 'gradeTaglineA' | 'gradeTaglineB' | 'gradeTaglineC' | 'gradeTaglineD'> = {
  'S+': 'gradeTaglineSPlus',
  S: 'gradeTaglineS',
  A: 'gradeTaglineA',
  B: 'gradeTaglineB',
  C: 'gradeTaglineC',
  D: 'gradeTaglineD',
};

export default function FlexGrade({ grade, score, size = 'md', showTagline = true }: FlexGradeProps) {
  const config = GRADE_CONFIG[grade];
  const { t } = useI18n();
  const tagline = t[TAGLINE_KEYS[grade]];

  const sizeClasses = {
    sm: { badge: 'w-14 h-14 text-3xl', tagline: 'text-xs', score: 'text-xs' },
    md: { badge: 'w-20 h-20 text-5xl', tagline: 'text-sm', score: 'text-xs' },
    lg: { badge: 'w-28 h-28 text-6xl', tagline: 'text-base', score: 'text-sm' },
  };

  const sizes = sizeClasses[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          sizes.badge,
          'rounded-2xl flex items-center justify-center font-black border-2 font-gaming tracking-wider',
          (grade === 'S' || grade === 'S+') ? 'animate-pulse-gold' : ''
        )}
        style={{
          background: `${config.color}18`,
          borderColor: `${config.color}66`,
          color: config.color,
          boxShadow: `0 0 25px ${config.color}44, inset 0 0 20px ${config.color}11`,
          textShadow: `0 0 20px ${config.color}`,
        }}
      >
        {config.label}
      </div>
      {showTagline && (
        <div className="text-center">
          <p
            className={cn(sizes.tagline, 'font-gaming font-bold tracking-widest')}
            style={{ color: config.color }}
          >
            {grade === 'S' ? (
              <span className="gold-text-shine">{tagline}</span>
            ) : tagline}
          </p>
          <p className="text-gray-600 text-xs mt-0.5">Score: {score}/1000</p>
        </div>
      )}
    </div>
  );
}
