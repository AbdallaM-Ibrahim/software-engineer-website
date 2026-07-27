"use client";

import * as React from "react";
import { DirectionProvider } from "@radix-ui/react-direction";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/shared/ui/sonner";
import { type Locale, isRtl } from "@/shared/site";

export function Providers({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* Radix resolves direction from here and does not read document.dir on
          its own, so without this a popover aligned to the trailing edge would
          still anchor left in Arabic. Fixes every Radix primitive at once
          rather than patching each with an rtl: escape hatch. */}
      <DirectionProvider dir={isRtl(locale) ? "rtl" : "ltr"}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </NextThemesProvider>
      </DirectionProvider>
    </QueryClientProvider>
  );
}
