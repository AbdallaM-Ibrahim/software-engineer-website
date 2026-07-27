/**
 * Escaping for the values interpolated into a Resend template.
 *
 * Resend templates interpolate with TRIPLE mustache, which substitutes the raw
 * value into the HTML without escaping. Visitor-supplied text therefore has to
 * be escaped here or a submitted `<script>`/`<a>` becomes live markup in the
 * recipient's inbox.
 *
 * Subject lines and plain-text bodies are not HTML — escaping there would
 * surface literal `&lt;` and `<br />` — so they read the raw `*_TEXT` variables
 * instead. Don't collapse the two.
 */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escape, then turn newlines into <br />. Explicit breaks beat
 * `white-space: pre-wrap`, which Outlook renders inconsistently.
 */
export function toHtmlParagraph(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}
