import type { CollectionConfig } from "payload";

export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  labels: {
    singular: "Case Study",
    plural: "Case Studies",
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "link", "order"],
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
