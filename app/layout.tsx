import { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Buy me a pencil',
  description: 'Support my creative journey—every pencil counts.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#faf8f5] text-[#2c2c2c] antialiased font-sans">
        <div className="grain-overlay" aria-hidden />
        {children}
      </body>
    </html>
  );
}
