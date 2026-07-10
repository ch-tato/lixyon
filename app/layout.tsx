import type { Metadata } from 'next';
import { Bebas_Neue, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { GrainOverlay } from '@/components/chrome/GrainOverlay';
import { CustomCursor } from '@/components/chrome/CustomCursor';
import { Navbar } from '@/components/chrome/Navbar';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LIXYON/33',
  description:
    'Hybrid operator fusing impenetrable security architecture with frictionless interface design.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-ink text-paper font-body">
        <SmoothScrollProvider>
          <GrainOverlay />
          <CustomCursor />
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
