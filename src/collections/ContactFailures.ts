import type { CollectionConfig } from "payload";

/**
 * Dead-letter queue for the contact form.
 *
 * Nothing is written here on the happy path — a successful send leaves no
 * record. A row exists only because Resend rejected the notification, which
 * would otherwise mean the lead is gone with nothing but a server log to show
 * for it.
 *
 * Everything in here is visitor-supplied and unverified, so it is never public:
 * `read` requires a logged-in user, and `create` is closed to the API entirely.
 * The route handler writes through the Local API, which runs with full access.
 */
const authenticated = ({ req }: { req: { user?: unknown } }) =>
  Boolean(req.user);

export const ContactFailures: CollectionConfig = {
  slug: "contact-failures",
  labels: {
    singular: "Failed contact message",
    plural: "Failed contact messages",
  },
  access: {
    read: authenticated,
    update: authenticated,
    delete: authenticated,
    // Only the server writes here. Left open, this would be an unauthenticated
    // write endpoint on a public site.
    create: () => false,
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "inquiryType", "handled", "createdAt"],
    group: "Admin",
    description:
      "Messages that could not be emailed. Reply by hand, then tick Handled.",
  },
  defaultSort: "-createdAt",
  timestamps: true,
  fields: [
    {
      name: "handled",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Tick once you have replied.",
      },
    },
    {
      type: "row",
      fields: [
        { name: "name", type: "text", admin: { width: "50%" } },
        { name: "email", type: "email", admin: { width: "50%" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "inquiryType", type: "text", admin: { width: "34%" } },
        { name: "service", type: "text", admin: { width: "33%" } },
        { name: "preferredChannel", type: "text", admin: { width: "33%" } },
      ],
    },
    { name: "phone", type: "text" },
    { name: "message", type: "textarea" },
    {
      name: "error",
      type: "textarea",
      admin: {
        description: "What the email provider returned.",
        readOnly: true,
      },
    },
  ],
};
