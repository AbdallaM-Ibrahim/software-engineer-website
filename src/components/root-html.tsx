import { Navbar } from "@/components/nav/navbar";
import { Providers } from "@/components/providers";
import { SkipLink } from "@/components/skip-link";
import { getProfile } from "@/lib/data";
import { ARABIC_FONT_VARIABLES, LATIN_FONT_VARIABLES } from "@/lib/fonts";
import { getDictionary } from "@/lib/i18n";
import { type Locale, isRtl } from "@/lib/site";

/**
 * The <html> shell, shared by both root layouts.
 *
 * English and Arabic are separate route groups, each with its own root layout,
 * because `lang` and `dir` have to be on the server-rendered <html> element —
 * a crawler reading an Arabic page must not be told it is English. That is only
 * possible in a root layout, so there are two, and this is the body they share.
 *
 * The nav lives here rather than in each page. With client navigation it would
 * otherwise remount on every route change, resetting its scroll state and
 * flashing a transparent header. Mounting it in the layout also gives it to the
 * error, not-found and loading pages, which previously rendered with no nav at
 * all. getProfile is cached and tagged, so sharing it with the page below costs
 * no extra read.
 */
export async function RootHtml({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const rtl = isRtl(locale);
  const dict = getDictionary(locale);
  const profile = await getProfile(locale);

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
        <Providers locale={locale}>
          <SkipLink label={dict.nav.skipToContent} />
          {/* No profile means an unseeded database, where the page below
              renders an empty state and a header would be a shell of nothing. */}
          {profile ? (
            <Navbar
              name={profile.name}
              nav={dict.nav}
              switchLabel={dict.common.switchLanguage}
              locale={locale}
            />
          ) : null}
          {children}
        </Providers>
      </body>
    </html>
  );
}
