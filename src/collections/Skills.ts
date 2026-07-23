import type { CollectionConfig } from "payload";

// Soft skills and tech stack in one collection, split by `category`. A single
// list is easier to browse than two near-identical ones: filter or search once,
// and adding a tool is the same action wherever it belongs.
//
// `area` is optional and only meaningful for tech — it keeps a long stack
// scannable in the list view without forcing a taxonomy on every row.
export const Skills: CollectionConfig = {
  slug: "skills",
  labels: {
    singular: "Skill",
    plural: "Skills & tech stack",
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "area", "order"],
    listSearchableFields: ["name"],
    group: "Content",
    pagination: { defaultLimit: 50 },
    description:
      "How-I-work skills and the tech stack. Filter by category to see one or the other.",
  },
  defaultSort: "order",
  fields: [
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Lower numbers appear first within a category.",
        position: "sidebar",
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      defaultValue: "tech",
      admin: {
        position: "sidebar",
        description: "Which block of the Skills section this appears in.",
      },
      options: [
        { label: "How I work (soft skill)", value: "soft" },
        { label: "Tech stack (tool / service)", value: "tech" },
      ],
    },
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: 'Shown verbatim, e.g. "Stripe" or "Clear Communication".',
      },
    },
    {
      name: "area",
      type: "select",
      admin: {
        description: "Optional grouping, to keep a long tech list browsable.",
        condition: (_, siblingData) => siblingData?.category === "tech",
      },
      options: [
        { label: "Payments", value: "payments" },
        { label: "Cloud & infrastructure", value: "cloud" },
        { label: "Data & AI", value: "data" },
        { label: "Messaging & comms", value: "messaging" },
        { label: "Search", value: "search" },
        { label: "APIs & integration", value: "api" },
      ],
    },
  ],
};
