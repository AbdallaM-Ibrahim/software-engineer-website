import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A native <select> styled to match the Input.
 *
 * Chosen over the Radix select the rest of shadcn uses: it needs no extra
 * dependency, drives the OS picker on mobile (where most of this site's Gulf and
 * Egypt traffic is), and flips for RTL without any work. The chevron is drawn on
 * top because the native indicator can't be styled.
 */
export const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        data-slot="native-select"
        className={cn(
          "border-input flex h-9 w-full min-w-0 appearance-none rounded-md border bg-transparent px-3 py-1 pe-9 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="text-muted-foreground pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2" />
    </div>
  );
});
NativeSelect.displayName = "NativeSelect";
