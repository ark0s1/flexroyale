import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEuros(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatGems(gems: number): string {
  if (gems >= 1_000_000) {
    return `${(gems / 1_000_000).toFixed(1)}M`;
  }
  if (gems >= 1_000) {
    return `${(gems / 1_000).toFixed(0)}K`;
  }
  return gems.toLocaleString('fr-FR');
}

export function formatNumber(n: number): string {
  return n.toLocaleString('fr-FR');
}

export function getWinRate(wins: number, losses: number): number {
  const total = wins + losses;
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
}

export function normalizeTag(tag: string): string {
  return tag.replace(/[^A-Z0-9]/gi, '').toUpperCase();
}

export function buildShareUrl(tag: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://flexroyale.netlify.app';
  return `${siteUrl}/player/${normalizeTag(tag)}`;
}
