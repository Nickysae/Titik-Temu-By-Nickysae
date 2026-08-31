import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import BottomNavigation from "@/components/layout/BottomNavigation";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Titik Temu",
  description: "A little place for two people who are far apart.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakarta.className} antialiased bg-[var(--color-background)] text-[var(--color-foreground)] min-h-screen flex justify-center`}
      >
        <div className="w-full max-w-md bg-[var(--color-background)] min-h-screen relative flex flex-col shadow-sm border-x border-[var(--color-border)]">
          <main className="flex-1 overflow-y-auto pb-24">
            {children}
          </main>
          <BottomNavigation />
        </div>
      </body>
    </html>
  );
}
