import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Party Games',
  description: 'Plataforma de minijuegos multijugador local',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased selection:bg-indigo-500/30">
        <main className="flex-1 flex flex-col w-full h-full min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
