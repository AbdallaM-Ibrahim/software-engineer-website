import type { CollectionConfig } from "payload";

export const Education: CollectionConfig = {
  slug: "education",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "degree",
    defaultColumns: ["degree", "institution", "from", "to"],
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
      name: "degree",
      type: "text",
      required: true,
    },
    {
      name: "institution",
      type: "text",
      required: true,
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
      name: "to",
      type: "date",
      admin: {
        date: { pickerAppearance: "monthOnly", displayFormat: "MMM yyyy" },
      },
    },
  ],
};
