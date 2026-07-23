import { Providers } from "@/components/providers";
import { ARABIC_FONT_VARIABLES, LATIN_FONT_VARIABLES } from "@/lib/fonts";
import { type Locale, isRtl } from "@/lib/site";

/**
 * The <html> shell, shared by both root layouts.
 *
 * English and Arabic are separate route groups, each with its own root layout,
 * because `lang` and `dir` have to be on the server-rendered <html> element —
 * a crawler reading an Arabic page must not be told it is English. That is only
 * possible in a root layout, so there are two, and this is the body they share.
 */
export function RootHtml({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const rtl = isRtl(locale);

  return (
    <html
      lang={locale}
      dir={rtl ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${rtl ? ARABIC_FONT_VARIABLES : LATIN_FONT_VARIABLES} h-full antialiased`}
      data-locale={locale}
    >
      <body className="flex min-h-full flex-col">
        {/* Scroll reveals are driven by IntersectionObserver. With scripts
            disabled that never fires, so force every section visible. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
