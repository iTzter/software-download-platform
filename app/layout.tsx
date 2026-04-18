import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software Download Portal",
  description: "Professional software download portal powered by Next.js and Supabase"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
