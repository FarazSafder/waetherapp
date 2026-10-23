"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloudSun } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/getbylocation", label: "Search by city name" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link
          href="/"
          className="flex w-fit items-center gap-2 rounded-md text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <CloudSun aria-hidden="true" className="size-7 text-blue-500" />
          Weather app
        </Link>

        <nav aria-label="Main navigation" className="flex flex-wrap gap-2">
          {links.map(({ href, label }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
                  "rounded-lg",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
