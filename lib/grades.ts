export type Grade = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';

export interface GradeConfig {
  label: string;
  color: string;        // hex terreux (aplat)
  bgColor: string;      // classe tailwind
  borderColor: string;  // classe tailwind
  glowColor: string;    // conserve pour compat (non utilise comme glow)
  tagline: string;
  icon: string;         // classe Bootstrap Icons (remplace l'emoji)
}

export const GRADE_CONFIG: Record<Grade, GradeConfig> = {
  'S+': {
    label: 'S+',
    color: '#C0573B',
    bgColor: 'bg-terracotta',
    borderColor: 'border-terracotta',
    glowColor: '',
    tagline: 'APEX LEGEND',
    icon: 'bi-trophy-fill',
  },
  S: {
    label: 'S',
    color: '#C8902E',
    bgColor: 'bg-ochre',
    borderColor: 'border-ochre',
    glowColor: '',
    tagline: 'LEGENDAIRE',
    icon: 'bi-star-fill',
  },
  A: {
    label: 'A',
    color: '#8A8B4A',
    bgColor: 'bg-olive',
    borderColor: 'border-olive',
    glowColor: '',
    tagline: 'ELITE',
    icon: 'bi-fire',
  },
  B: {
    label: 'B',
    color: '#9C7A5B',
    bgColor: 'bg-clay',
    borderColor: 'border-clay',
    glowColor: '',
    tagline: 'SOLIDE',
    icon: 'bi-shield-fill',
  },
  C: {
    label: 'C',
    color: '#6E8C9E',
    bgColor: 'bg-dustyblue',
    borderColor: 'border-dustyblue',
    glowColor: '',
    tagline: 'EN PROGRESSION',
    icon: 'bi-graph-up-arrow',
  },
  D: {
    label: 'D',
    color: '#8A847A',
    bgColor: 'bg-stone',
    borderColor: 'border-stone',
    glowColor: '',
    tagline: 'EARLY GAME',
    icon: 'bi-dash-circle',
  },
};
