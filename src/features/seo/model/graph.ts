import { type Locale, absoluteUrl } from "@/shared/site";

/**
 * The JSON-LD document a page emits, and the helpers every node builder shares.
 *
 * Everything is emitted as one `@graph` per page with stable `@id`s, so the
 * Person defined on the home page is the same node a service page references as
 * its provider rather than a second, unrelated copy of you.
 *
 * Each feature contributes its own node builders — profile builds the Person,
 * services builds the Service and FAQPage — and this module only assembles them.
 *
 * Deliberately absent: Review and AggregateRating. Reviews you publish about
 * yourself are not eligible for rich results and are a documented cause of
 * manual actions, so the testimonials stay plain markup.
 */

export type Node = Record<string, unknown>;

/** Drops undefined/empty keys — an empty schema property is worse than none. */
export function clean(node: Node): Node {
  return Object.fromEntries(
    Object.entries(node).filter(([, value]) => {
      if (value === undefined || value === null || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }),
  );
}

export function buildBreadcrumbs(
  trail: { name: string; path: string }[],
  locale: Locale,
): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path, locale),
    })),
  };
}

/** Wraps nodes into the single `@graph` document a page emits. */
export function buildGraph(nodes: (Node | null)[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter((node): node is Node => node !== null),
  };
}
