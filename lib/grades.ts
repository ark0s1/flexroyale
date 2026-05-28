export type Grade = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';

export interface GradeConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  tagline: string;
  emoji: string;
}

export const GRADE_CONFIG: Record<Grade, GradeConfig> = {
  'S+': {
    label: 'S+',
    color: '#FF0050',
    bgColor: 'bg-rose-600',
    borderColor: 'border-rose-400',
    glowColor: 'shadow-rose-500/50',
    tagline: 'APEX LEGEND',
    emoji: 'u{1F451}',
  },

  S: {
    label: 'S',
    color: '#F59E0B',
    bgColor: 'bg-amber-500',
    borderColor: 'border-amber-400',
    glowColor: 'shadow-amber-500/50',
    tagline: 'LÉGENDAIRE',
    emoji: '✨',
  },
  A: {
    label: 'A',
    color: '#10B981',
    bgColor: 'bg-emerald-500',
    borderColor: 'border-emerald-400',
    glowColor: 'shadow-emerald-500/50',
    tagline: 'ELITE',
    emoji: '🔥',
  },
  B: {
    label: 'B',
    color: '#3B82F6',
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-400',
    glowColor: 'shadow-blue-500/50',
    tagline: 'SOLIDE',
    emoji: '⚔️',
  },
  C: {
    label: 'C',
    color: '#8B5CF6',
    bgColor: 'bg-violet-500',
    borderColor: 'border-violet-400',
    glowColor: 'shadow-violet-500/50',
    tagline: 'EN PROGRESSION',
    emoji: '📈',
  },
  D: {
    label: 'D',
    color: '#6B7280',
    bgColor: 'bg-gray-500',
    borderColor: 'border-gray-400',
    glowColor: 'shadow-gray-500/50',
    tagline: 'NPC MATERIAL 💀',
    emoji: '😅',
  },
};
