import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "DueDilly — the diligence agent that refuses to guess",
  description: "Claimed vs verified Deal Scorecards for VCs, with an abstain gate when evidence is thin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <header className="sticky top-0 z-20 border-b border-line bg-ink/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/15 font-mono text-sm font-bold text-accent">
                Dd
              </span>
              <span className="text-lg font-semibold tracking-tight">DueDilly</span>
            </Link>
            <nav className="flex items-center gap-5 text-sm">
              <Link href="/" className="text-muted hover:text-white">
                Pipeline
              </Link>
              <Link href="/analyze" className="rounded-lg border border-accent/50 bg-accent/10 px-3 py-1.5 font-medium text-accent hover:bg-accent/20">
                Analyze a deal
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
