import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/institution', '/result', '/assessment/member', '/assessment/executive', '/api'],
      },
    ],
    sitemap: 'https://ax-compass.helloworldlabs.kr/sitemap.xml',
  };
}
