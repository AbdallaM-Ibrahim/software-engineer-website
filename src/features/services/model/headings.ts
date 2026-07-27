/**
 * Heading ids for a service page's authored body.
 *
 * Two consumers that must agree exactly: the table of contents, which is built
 * on the server from the Lexical value, and the RichText heading converter,
 * which stamps the ids onto the rendered markup. Both go through the helpers
 * here so a link can never point at an id that was never emitted.
 */

type LexicalNode = {
  type?: string;
  tag?: string;
  text?: string;
  children?: LexicalNode[];
};

export type Heading = { id: string; text: string };

/**
 * Below this many headings a sticky rail is more furniture than help, so the
 * contents stay a disclosure at every width.
 */
export const RAIL_MIN_HEADINGS = 3;

/**
 * Whether a service page earns the sticky rail.
 *
 * Lives here rather than beside the component because the server page needs it
 * to choose its grid, and a "use client" module's functions cannot be called
 * from the server — only rendered as components.
 */
export function hasRail(headings: Heading[]): boolean {
  return headings.length >= RAIL_MIN_HEADINGS;
}

/** Plain text of a node subtree — a heading can hold several formatted runs. */
export function lexicalText(node: LexicalNode): string {
  if (typeof node.text === "string") return node.text;
  if (!node.children) return "";
  return node.children.map(lexicalText).join("");
}

/**
 * A URL-safe id.
 *
 * Keeps letters and numbers in any script rather than stripping to ASCII, so an
 * Arabic heading gets a real id instead of an empty string.
 */
export function headingSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Slug, with `-2`, `-3` … appended so two headings worded the same still get
 * distinct ids. `used` is the caller's counter: the converter creates one per
 * render and the extractor one per call, and because both walk the document in
 * order they arrive at the same answers.
 */
export function uniqueHeadingId(
  text: string,
  used: Map<string, number>,
): string {
  const base = headingSlug(text);
  if (!base) return "";
  const seen = used.get(base) ?? 0;
  used.set(base, seen + 1);
  return seen === 0 ? base : `${base}-${seen + 1}`;
}

/** The h2s of a Lexical value, in document order. */
export function extractHeadings(data: unknown): Heading[] {
  const root = (data as { root?: LexicalNode } | null | undefined)?.root;
  if (!root?.children) return [];

  const used = new Map<string, number>();
  const headings: Heading[] = [];

  for (const node of root.children) {
    if (node.type !== "heading" || node.tag !== "h2") continue;
    const text = lexicalText(node).trim();
    const id = uniqueHeadingId(text, used);
    // A heading of pure punctuation slugs to nothing; skip rather than emit a
    // link to "#".
    if (!id) continue;
    headings.push({ id, text });
  }

  return headings;
}
