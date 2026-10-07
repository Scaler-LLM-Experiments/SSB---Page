import type { Metadata } from 'next';
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--ssx-font-sans',
  display: 'swap',
});

// The one italic the page sets (Why SSB's struck "old MBA", at the display weight). Its own face,
// not a `style` on `sans`: that would add an italic of every weight, all preloaded.
const sansItalic = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: '600',
  style: 'italic',
  variable: '--font-sans-italic',
  display: 'swap',
  preload: false,
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--ssx-font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Scaler School of Business',
  description: 'SSB home page design exploration, built on the Scaler Design System.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" data-brand="ssb" className={`${sans.variable} ${sansItalic.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
