/**
 * Renders a structured-data document into the page.
 *
 * `</script>` inside a string value would close the tag early and turn the rest
 * of the JSON into markup, so the sequence is escaped. Values come from the CMS,
 * which means they are editable text, which means this matters.
 */
export function JsonLd({ data }: { data: unknown }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has to be inline script content; React would otherwise escape the JSON into unparseable text.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
