import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MagicBlock Hacker House - Build Unstoppable Experiences',
  description:
    'Join builders and creators at MagicBlock Hacker House. Build real-time, free, and private experiences on Solana with 1ms block time.',
  keywords: [
    'MagicBlock',
    'Solana',
    'Hacker House',
    'Web3',
    'DeFi',
    'Real-time Gaming',
    'Blockchain',
  ],
  openGraph: {
    title: 'MagicBlock Hacker House',
    description: 'Build unstoppable real-time experiences on Solana',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
