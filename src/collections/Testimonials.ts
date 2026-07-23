import type { CollectionConfig } from "payload";

// Relative import: the Payload CLI loads this through tsx, which does not
// resolve the `@/*` alias.
import { revalidateHooks } from "../lib/revalidate";

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
  hooks: revalidateHooks("testimonials"),
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
      // Translating someone else's words is a judgement call — leave the
      // Arabic blank and the English quote shows through, which is the honest
      // default for an attributed statement.
      localized: true,
    },
    {
      name: "author",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "text",
      localized: true,
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
