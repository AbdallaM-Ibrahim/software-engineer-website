import type { GlobalConfig } from "payload";

// Relative imports, not `@/lib/social`: the Payload CLI loads this config
// through tsx, which does not resolve the `@/*` tsconfig path alias.
import { SOCIAL_PLATFORM_OPTIONS } from "../lib/social";
import { revalidateGlobalHooks } from "../lib/revalidate";
import { translationReviewed } from "../fields/translation-reviewed";

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
  hooks: revalidateGlobalHooks("profile"),
  fields: [
    translationReviewed,
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
      localized: true,
      admin: {
        description: 'Short role tagline, e.g. "Senior Software Engineer".',
      },
    },
    {
      name: "tagline",
      type: "textarea",
      localized: true,
      maxLength: 200,
      admin: {
        description:
          "The sentence under your name in the hero, and the fallback meta description.",
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
      localized: true,
      admin: { description: "Narrative bio. Blank lines separate paragraphs." },
    },
    {
      name: "availability",
      type: "group",
      label: "Where I work",
      admin: {
        description:
          "Regions, hours and engagement types. Also what fills areaServed and knowsLanguage in the page's structured data, which is how a search engine learns you work in a place without a doorway page for each city.",
      },
      fields: [
        {
          name: "intro",
          type: "textarea",
          localized: true,
          admin: {
            description: "Optional line above the details.",
          },
        },
        {
          name: "regions",
          type: "array",
          label: "Regions",
          admin: {
            initCollapsed: true,
            description:
              "Countries or regions you actually work in. Keep it honest — this is a claim, not a keyword list.",
          },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "name",
                  type: "text",
                  required: true,
                  localized: true,
                  admin: {
                    width: "40%",
                    description: 'e.g. "United Arab Emirates".',
                  },
                },
                {
                  name: "code",
                  type: "text",
                  admin: {
                    width: "20%",
                    description: "ISO country code, e.g. AE. Used in schema.",
                  },
                },
                {
                  name: "note",
                  type: "text",
                  localized: true,
                  admin: {
                    width: "40%",
                    description: 'e.g. "on site quarterly".',
                  },
                },
              ],
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "timezone",
              type: "text",
              admin: {
                width: "50%",
                description: 'e.g. "EET (UTC+2)".',
              },
            },
            {
              name: "overlapHours",
              type: "text",
              localized: true,
              admin: {
                width: "50%",
                description:
                  'e.g. "full overlap with the Gulf, 4h with US East".',
              },
            },
          ],
        },
        {
          name: "engagementTypes",
          type: "select",
          hasMany: true,
          admin: {
            description: "What you are open to.",
          },
          options: [
            { label: "Full-time", value: "full-time" },
            { label: "Contract", value: "contract" },
            { label: "Project-based", value: "project" },
            { label: "Consultation", value: "consultation" },
          ],
        },
        {
          name: "languages",
          type: "array",
          label: "Languages",
          admin: {
            initCollapsed: true,
            description: "Feeds knowsLanguage in the Person structured data.",
          },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "name",
                  type: "text",
                  required: true,
                  localized: true,
                  admin: { width: "40%", description: 'e.g. "Arabic".' },
                },
                {
                  name: "code",
                  type: "text",
                  admin: {
                    width: "20%",
                    description: "BCP 47 tag, e.g. ar. Used in schema.",
                  },
                },
                {
                  name: "proficiency",
                  type: "select",
                  admin: { width: "40%" },
                  options: [
                    { label: "Native", value: "native" },
                    { label: "Professional", value: "professional" },
                    { label: "Conversational", value: "conversational" },
                  ],
                },
              ],
            },
          ],
        },
      ],
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
