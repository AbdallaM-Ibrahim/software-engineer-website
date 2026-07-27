import { DEFAULT_LOCALE, type Locale, localePath } from "@/shared/site";

/**
 * Link to a section of the home page.
 *
 * These render on the service pages too, where a bare `#work` fragment points
 * at nothing, so they are always root-relative and locale-aware.
 */
export function sectionHref(id: string, locale: Locale = DEFAULT_LOCALE) {
  const base = localePath("/", locale);
  return `${base === "/" ? "" : base}/#${id}`;
}
