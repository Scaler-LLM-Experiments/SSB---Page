import type { Metadata } from 'next';
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--ssx-font-sans',
  display: 'swap',
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
    <html lang="en" data-brand="ssb" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
