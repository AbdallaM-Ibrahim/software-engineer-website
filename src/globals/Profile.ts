import type { GlobalConfig } from "payload";

export const Profile: GlobalConfig = {
  slug: "profile",
  access: {
    read: () => true,
  },
  admin: {
    group: "Content",
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
          admin: { width: "60%" },
        },
        {
          name: "age",
          type: "number",
          admin: { width: "40%" },
        },
      ],
    },
    {
      name: "headline",
      type: "text",
      required: true,
      admin: {
        description: 'Short role tagline, e.g. "Senior Software Engineer".',
      },
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Hero photo. Falls back to a silhouette placeholder if empty.",
      },
    },
    {
      name: "about",
      type: "textarea",
      required: true,
      admin: { description: "Narrative bio. Blank lines separate paragraphs." },
    },
    {
      name: "services",
      type: "array",
      label: "How I can help",
      admin: { description: "Service cards shown in the About section." },
      fields: [
        {
          name: "icon",
          type: "select",
          defaultValue: "code",
          options: [
            { label: "Web / Code", value: "code" },
            { label: "Automation", value: "automation" },
            { label: "Payments", value: "payments" },
            { label: "Data / Insights", value: "data" },
          ],
        },
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
      ],
    },
    {
      name: "skills",
      type: "array",
      label: "Soft skills",
      fields: [{ name: "skill", type: "text", required: true }],
    },
    {
      name: "techStack",
      type: "array",
      label: "Tech stack",
      admin: { description: "Technologies / services used across projects." },
      fields: [{ name: "name", type: "text", required: true }],
    },
    {
      name: "contact",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            { name: "email", type: "email", admin: { width: "50%" } },
            { name: "phone", type: "text", admin: { width: "50%" } },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "linkedin", type: "text", admin: { width: "50%" } },
            { name: "github", type: "text", admin: { width: "50%" } },
          ],
        },
      ],
    },
  ],
};
