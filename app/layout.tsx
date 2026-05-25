import './globals.css';
import type { Metadata } from 'next';
import { Fredoka } from 'next/font/google';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fredoka',
});

export const metadata: Metadata = {
  title: 'SoundboardMe',
  description: 'Maak een soundboard van iemand. Deel met één link.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={fredoka.variable}>
      <body className="font-display text-white antialiased min-h-screen">{children}</body>
    </html>
  );
}
