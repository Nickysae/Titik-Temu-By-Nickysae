"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, MessageSquare, Heart } from "lucide-react";

export default function BottomNavigation() {
  const pathname = usePathname();
  
  const tabs = [
    { name: "HOME", href: "/", icon: Home },
    { name: "JOURNEY", href: "/journey", icon: Map },
    { name: "RINDU", href: "/rindu", icon: MessageSquare },
    { name: "US", href: "/us", icon: Heart },
  ];

  return (
    <nav className="absolute bottom-0 w-full bg-[var(--color-background)] border-t border-[var(--color-border)] px-8 py-5 flex justify-between items-center z-50">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link key={tab.name} href={tab.href} className="flex flex-col items-center gap-1.5 group">
            <tab.icon
              size={22}
              strokeWidth={isActive ? 2 : 1.5}
              className={`transition-colors duration-300 ${
                isActive ? "text-[var(--color-foreground)]" : "text-[var(--color-muted)] group-hover:text-[var(--color-foreground)]/70"
              }`}
            />
            <span
              className={`text-[9px] tracking-[0.15em] transition-colors duration-300 ${
                isActive ? "text-[var(--color-foreground)] font-medium" : "text-[var(--color-muted)] font-light"
              }`}
            >
              {tab.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
