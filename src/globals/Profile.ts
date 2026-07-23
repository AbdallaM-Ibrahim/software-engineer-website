import type { GlobalConfig } from "payload";

// Relative import, not `@/lib/social`: the Payload CLI loads this config through
// tsx, which does not resolve the `@/*` tsconfig path alias.
import { SOCIAL_PLATFORM_OPTIONS } from "../lib/social";

/**
 * Store blank text as null rather than "".
 *
 * Without this an emptied field persists an empty string, which is just truthy
 * enough in places to render a dead link or an empty row.
 */
const emptyToNull = ({ value }: { value?: unknown }) => {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed === "" ? null : trimmed;
};

export const Profile: GlobalConfig = {
  slug: "profile",
  label: "Profile",
  access: {
    read: () => true,
  },
  admin: {
    // Grouped with Content rather than given its own section. Payload renders
    // globals after collections, so a standalone "Profile" group lands beneath
    // Library/Admin/MCP — below the tooling, which reads wrong for the one
    // document edited most often.
    group: "Content",
    description:
      "Identity, bio and contact details. Services, skills and case studies each live in their own collection.",
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
      name: "contact",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "email",
              type: "email",
              admin: { width: "50%" },
            },
            {
              name: "phone",
              type: "text",
              admin: { width: "50%" },
              hooks: { beforeChange: [emptyToNull] },
            },
          ],
        },
        {
          name: "phoneIsWhatsapp",
          type: "checkbox",
          label: "This phone number is on WhatsApp",
          defaultValue: true,
          admin: {
            description:
              "Ticked, the phone number above powers the WhatsApp chat link. Untick to use a different number.",
          },
        },
        {
          type: "collapsible",
          label: "Separate WhatsApp number",
          admin: {
            initCollapsed: true,
            // Only worth showing once the phone number isn't the WhatsApp one.
            condition: (_, siblingData) => !siblingData?.phoneIsWhatsapp,
          },
          fields: [
            {
              name: "whatsapp",
              type: "text",
              label: "WhatsApp number",
              admin: {
                description:
                  "International format, e.g. +20 112 846 8458. Blank means no WhatsApp link.",
                condition: (_, siblingData) => !siblingData?.phoneIsWhatsapp,
              },
              // Blank clears the field instead of storing "".
              hooks: { beforeChange: [emptyToNull] },
            },
          ],
        },
        {
          name: "links",
          type: "array",
          label: "Links",
          admin: {
            description:
              "LinkedIn and WhatsApp also surface in the hero. Every link here is listed in the Contact section.",
            initCollapsed: true,
            components: {
              // Default collapsed label is "Link 01", which makes a list of
              // links unreadable without opening each one.
              RowLabel: "/components/admin/link-row-label#LinkRowLabel",
            },
          },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "platform",
                  type: "select",
                  required: true,
                  defaultValue: "website",
                  admin: {
                    width: "34%",
                    description: "Sets the icon and the default name.",
                  },
                  options: SOCIAL_PLATFORM_OPTIONS,
                },
                {
                  name: "platformPreview",
                  type: "ui",
                  admin: {
                    width: "16%",
                    components: {
                      Field:
                        "/components/admin/platform-icon-preview#PlatformIconPreview",
                    },
                  },
                },
                {
                  name: "label",
                  type: "text",
                  admin: {
                    width: "50%",
                    description: 'Name to show. Required for "Other".',
                    condition: (_, siblingData) =>
                      siblingData?.platform === "other",
                  },
                  hooks: { beforeChange: [emptyToNull] },
                },
              ],
            },
            {
              name: "url",
              type: "text",
              required: true,
              admin: {
                description:
                  "Full URL including https://. For WhatsApp use a wa.me link.",
              },
            },
          ],
        },
      ],
    },
  ],
};
