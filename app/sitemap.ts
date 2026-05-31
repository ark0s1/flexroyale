import { MetadataRoute } from 'next';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://flexroyale.vercel.app').trim();

const GRADES = ['S-plus', 'S', 'A', 'B', 'C', 'D'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const gradePages = GRADES.map((grade) => ({
    url: `${siteUrl}/grade/${grade}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...gradePages,
  ];
}
