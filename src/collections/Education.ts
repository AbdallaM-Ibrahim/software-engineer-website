import type { CollectionConfig } from "payload";

// Relative import: the Payload CLI loads this through tsx, which does not
// resolve the `@/*` alias.
import { revalidateHooks } from "../lib/revalidate";

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
  hooks: revalidateHooks("education"),
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
      localized: true,
    },
    {
      name: "institution",
      type: "text",
      required: true,
      // Universities publish their own Arabic name, so this is translated
      // rather than transliterated.
      localized: true,
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
