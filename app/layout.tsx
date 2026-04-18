import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Software Download Portal',
  description: 'Professional software download directory with admin dashboard'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <header className="border-b border-border bg-black/50 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold">
              SoftHub
            </Link>
            <div className="space-x-5 text-sm text-zinc-300">
              <Link href="/">Home</Link>
              <Link href="/admin">Admin</Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
