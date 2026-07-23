import type { CollectionConfig } from "payload";

// "How I can help" cards in the About section. Previously an array field on the
// Profile global — promoted to a collection so each card can be reordered,
// searched and edited on its own rather than inside one long global form.
export const Services: CollectionConfig = {
  slug: "services",
  labels: {
    singular: "Service",
    plural: "Services",
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "icon", "order"],
    listSearchableFields: ["title", "description"],
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
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
  ],
};
