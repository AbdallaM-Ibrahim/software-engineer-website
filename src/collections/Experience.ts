import type { CollectionConfig } from "payload";

export const Experience: CollectionConfig = {
  slug: "experience",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "company", "from", "isPresent"],
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
      name: "company",
      type: "text",
      required: true,
    },
    {
      name: "website",
      type: "text",
      admin: {
        description: "Company website URL.",
      },
    },
    {
      name: "from",
      type: "date",
      required: true,
      admin: {
        date: { pickerAppearance: "monthOnly", displayFormat: "MMM yyyy" },
      },
    },
    {
      name: "isPresent",
      type: "checkbox",
      defaultValue: false,
      label: "Current role",
    },
    {
      name: "to",
      type: "date",
      admin: {
        date: { pickerAppearance: "monthOnly", displayFormat: "MMM yyyy" },
        condition: (data) => !data?.isPresent,
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description:
          "One responsibility per line. Lines are rendered as bullets.",
      },
    },
  ],
};
