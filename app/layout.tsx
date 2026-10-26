import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Little Moments',
  description: 'A little corner of the internet for everything you never want to forget.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-cream text-cocoa">
        {children}
      </body>
    </html>
  );
}
