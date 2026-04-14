import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Providers } from './providers';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const pretendard = localFont({
  src: [
    {
      path: '../public/fonts/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-pretendard',
});

const ENV_PREFIX: Record<string, string> = { local: '[로컬] ', dev: '[개발] ' };
const titlePrefix = ENV_PREFIX[process.env.NEXT_PUBLIC_APP_ENV ?? ''] ?? '';

export const metadata: Metadata = {
  metadataBase: new URL('https://ax-compass.helloworldlabs.kr'),
  title: `${titlePrefix}AX Compass | AX 역량·성숙도 진단 기반 AX 컨설팅 서비스`,
  description:
    '구성원의 AX 역량과 기업의 AX 성숙도를 진단해 맞춤형 AX 컨설팅과 학습 로드맵을 제안합니다.',
  keywords:
    'AX Compass, AX 컨설팅, AX 역량 진단, AX 성숙도 진단, 기업 AX 진단, 조직 AX 진단, AI 역량 진단, AI 성숙도 진단, AX 전환, 학습 로드맵, 기업 교육 컨설팅',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AX Compass | AX 역량·성숙도 진단 기반 AX 컨설팅 서비스',
    description:
      '구성원의 AX 역량과 기업의 AX 성숙도를 진단해 맞춤형 AX 컨설팅과 학습 로드맵을 제안합니다.',
    url: '/',
    siteName: 'AX Compass',
    type: 'website',
    images: [
      {
        url: '/og_image.png',
        width: 1200,
        height: 630,
        alt: 'AX Compass | AX 역량·성숙도 진단 기반 AX 컨설팅 서비스',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AX Compass | AX 역량·성숙도 진단 기반 AX 컨설팅 서비스',
    description:
      '구성원의 AX 역량과 기업의 AX 성숙도를 진단해 맞춤형 AX 컨설팅과 학습 로드맵을 제안합니다.',
    images: ['/og_image.png'],
  },
  icons: {
    icon: [
      { url: '/android-chrome-192x192.png', sizes: '192x192' },
      { url: '/android-chrome-512x512.png', sizes: '512x512' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn(pretendard.variable, 'font-sans', geist.variable)}
    >
      <body className={`${pretendard.className} txt-b-regular flex min-h-screen flex-col`}>
        <Providers>
          <Header />
          <main className="bg-special-dark-blue-900 h-auto flex-1 lg:px-[100px]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
