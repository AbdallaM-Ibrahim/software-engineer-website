/**
 * The contact feature's pure surface: the submission contract, the labels the
 * notification is built from, and the Resend template aliases.
 *
 * Free of `@/*` imports on purpose — `scripts/sync-email-templates.tsx` imports
 * this barrel under tsx, which does not resolve the alias.
 */

export {
  CONTACT_CHANNELS,
  type ContactChannel,
  type ContactValues,
  contactSchema,
  INQUIRY_TYPES,
  type InquiryType,
} from "./contact-schema";
export { escapeHtml, toHtmlParagraph } from "./html";
export { CHANNEL_LABELS, INQUIRY_LABELS } from "./labels";
export {
  CONTACT_AUTO_REPLY_TEMPLATE,
  CONTACT_NOTIFICATION_TEMPLATE,
  OWNER_NAME,
  SITE_URL,
} from "./templates";
