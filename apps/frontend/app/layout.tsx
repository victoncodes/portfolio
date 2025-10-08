import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Budget Tracker',
  description: 'Track expenses, goals, and learn finance basics',
  manifest: '/manifest.json',
  themeColor: '#22c55e',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

