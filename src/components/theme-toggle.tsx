"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

/**
 * Flips between light and dark.
 *
 * The label is passed in rather than written here: it used to be a hardcoded
 * English "Toggle theme", which shipped to Arabic readers as the one English
 * control on the page.
 *
 * Both icons are always in the DOM and CSS picks between them. next-themes
 * writes `.dark` on <html> from a blocking script before first paint, so the
 * right one is showing immediately and identically on server and client. The
 * previous mount guard rendered the moon until hydration, which meant every
 * dark-preferring visitor watched it flip to a sun on every page load.
 */
export function ThemeToggle({ label }: { label: string }) {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={label}
    >
      <Sun className="hidden size-5 dark:block" />
      <Moon className="size-5 dark:hidden" />
    </Button>
  );
}
