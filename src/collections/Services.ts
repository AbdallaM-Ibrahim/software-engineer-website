import type { CollectionConfig } from "payload";

// Relative imports: the Payload CLI loads this through tsx, which does not
// resolve the `@/*` alias.
import { revalidateHooks } from "../lib/revalidate";
import { translationReviewed } from "../fields/translation-reviewed";

/** "Payment Integration" -> "payment-integration". */
function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Services are both the "How I can help" cards on the home page and a landing
 * page each at /services/<slug> — the pages that carry the commercial-intent
 * keywords, since the home page can only rank for so much on its own.
 *
 * The card shows `teaser`; the page shows `description` and `body`. Keeping
 * them separate is deliberate: the same paragraph on two URLs is a duplicate,
 * and Google picks which one to keep.
 */
export const Services: CollectionConfig = {
  slug: "services",
  labels: {
    singular: "Service",
    plural: "Services",
  },
  access: {
    // Same reasoning as CaseStudies: with drafts enabled, a bare
    // `read: () => true` serves unpublished documents to the live site. This
    // only takes effect for queries that pass `overrideAccess: false`.
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
  },
  versions: {
    drafts: {
      autosave: { showSaveDraftButton: true, interval: 800 },
      // Drafts skip required-field validation, or autosave would reject a
      // half-written document on every keystroke.
      validate: false,
    },
    maxPerDoc: 20,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "order"],
    listSearchableFields: ["title", "description"],
    group: "Content",
    description:
      "Each service is a card on the home page and its own landing page at /services/<slug>.",
  },
  hooks: revalidateHooks("services"),
  defaultSort: "order",
  fields: [
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Lower numbers appear first.",
        position: "sidebar",
      },
    },
    {
      name: "icon",
      type: "select",
      defaultValue: "code",
      required: true,
      admin: {
        position: "sidebar",
        description: "Picks the glyph on the card.",
      },
      options: [
        { label: "Web / Code", value: "code" },
        { label: "Automation", value: "automation" },
        { label: "Payments", value: "payments" },
        { label: "Data / Insights", value: "data" },
      ],
    },
    translationReviewed,
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      // NOT localized. One URL path per service across both languages
      // (/services/x and /ar/services/x) keeps the hreflang pairs trivial and
      // means an Arabic link never 404s because its slug was never filled in.
      admin: {
        position: "sidebar",
        description:
          "URL path. Derived from the English title when left blank; changing it breaks existing links.",
      },
      hooks: {
        beforeValidate: [
          ({ value, data, req }) => {
            if (typeof value === "string" && value.trim()) {
              return slugify(value);
            }
            // Only the English title seeds a slug — the Arabic one would
            // produce an empty string once non-Latin characters are stripped.
            if (req.locale && req.locale !== "en") return value;
            const title = data?.title;
            return typeof title === "string" && title.trim()
              ? slugify(title)
              : value;
          },
        ],
      },
    },
    {
      name: "teaser",
      type: "textarea",
      localized: true,
      maxLength: 180,
      admin: {
        description:
          "One line for the home page card. Keep it different from the description below — the same text on two pages is a duplicate.",
      },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      localized: true,
      admin: {
        description:
          "Lead paragraph on the service page, and the fallback meta description.",
      },
    },
    {
      name: "serviceType",
      type: "text",
      localized: true,
      admin: {
        description:
          'Plain-language category for structured data, e.g. "Payment gateway integration". Falls back to the title.',
      },
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Optional image at the top of the service page.",
      },
    },
    {
      name: "body",
      type: "richText",
      localized: true,
      admin: {
        description:
          "The page itself. Use real headings — they are what a search engine reads as the page's structure.",
      },
    },
    {
      name: "faq",
      type: "array",
      localized: true,
      labels: { singular: "Question", plural: "FAQ" },
      admin: {
        initCollapsed: true,
        description:
          "Rendered as an FAQPage in structured data. Answer the questions buyers actually ask.",
      },
      fields: [
        {
          name: "question",
          type: "text",
          required: true,
        },
        {
          name: "answer",
          type: "textarea",
          required: true,
        },
      ],
    },
    {
      name: "relatedCaseStudies",
      type: "relationship",
      relationTo: "case-studies",
      hasMany: true,
      admin: {
        description:
          "Proof for this service. Also the internal links that connect the page to the rest of the site.",
      },
    },
  ],
};
