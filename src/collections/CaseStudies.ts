import type { CollectionConfig } from "payload";

export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  labels: {
    singular: "Case Study",
    plural: "Case Studies",
  },
  access: {
    // Anonymous readers get published documents only. Without this override the
    // public `read: () => true` would serve drafts to the live site too — Payload
    // only filters drafts for users it considers unauthenticated *by access*, not
    // automatically. `user` is null for the site's own Local API reads.
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
  },
  versions: {
    drafts: {
      // Autosave writes to the draft only — the published version is untouched
      // until Publish is pressed, so this cannot leak half-written copy to the
      // live page. 800ms debounce: frequent enough not to lose a paragraph,
      // slow enough not to write on every keystroke.
      autosave: { showSaveDraftButton: true, interval: 800 },
      // Drafts skip required-field validation, otherwise autosave would reject
      // every partially-filled document as you type it.
      validate: false,
    },
    maxPerDoc: 20,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "_status", "link", "order"],
    group: "Content",
  },
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
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "shortName",
      type: "text",
      admin: {
        description:
          "Product name on its own, without the descriptor in brackets — used on cards and in the hero metric strip.",
      },
    },
    {
      name: "slug",
      type: "text",
      admin: {
        description:
          "Matches a screenshot in public/case-studies/<slug>.jpg, used when no thumbnail is uploaded.",
      },
    },
    {
      name: "link",
      type: "text",
      admin: {
        description: "Live site URL.",
      },
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Screenshot of the live site. Falls back to public/case-studies/<slug>.jpg, then to a gradient.",
      },
    },
    {
      name: "metric",
      type: "group",
      label: "Headline metric",
      admin: {
        description:
          "The single number this project is remembered by. Shown on the card and in the hero strip.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "before",
              type: "text",
              admin: {
                width: "33%",
                description: "Optional starting value, e.g. 200.",
              },
            },
            {
              name: "value",
              type: "text",
              admin: { width: "33%", description: "e.g. 13,000 or 60%." },
            },
            {
              name: "direction",
              type: "select",
              defaultValue: "up",
              options: [
                { label: "Increase", value: "up" },
                { label: "Decrease", value: "down" },
              ],
              admin: { width: "33%" },
            },
          ],
        },
        {
          name: "label",
          type: "text",
          admin: {
            description:
              "What the number measures, e.g. product imports / day.",
          },
        },
      ],
    },
    {
      name: "star",
      type: "group",
      label: "STAR breakdown",
      fields: [
        {
          name: "situation",
          type: "textarea",
        },
        {
          name: "task",
          type: "textarea",
        },
        {
          name: "action",
          type: "textarea",
          admin: {
            description: "One action per line. Lines are rendered as bullets.",
          },
        },
        {
          name: "result",
          type: "textarea",
          admin: {
            description: "One result per line. Lines are rendered as bullets.",
          },
        },
      ],
    },
  ],
};
