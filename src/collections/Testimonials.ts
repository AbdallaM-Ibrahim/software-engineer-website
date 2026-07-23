import type { CollectionConfig } from "payload";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "author",
    defaultColumns: ["author", "role", "company", "order"],
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
      name: "quote",
      type: "textarea",
      required: true,
    },
    {
      name: "author",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "text",
    },
    {
      name: "company",
      type: "text",
    },
    {
      name: "isPlaceholder",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Marks dummy content to replace later.",
      },
    },
  ],
};
