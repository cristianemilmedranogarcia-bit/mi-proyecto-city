import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PostPlace CT | Norwalk Jobs, Services & Buy/Sell Marketplace',
  description:
    'The authentic local marketplace connecting job seekers, local businesses, independent contractors, buyers, and sellers in Norwalk & Fairfield County, CT.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
