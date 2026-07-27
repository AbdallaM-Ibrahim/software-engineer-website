import type { ContactChannel, InquiryType } from "./contact-schema";

/**
 * Human-readable labels for the owner's notification email.
 *
 * Kept in English on purpose: this is the owner's inbox, not the visitor-facing
 * site, so it does not follow the page locale.
 *
 * Typed as a total `Record` over each union, so adding a member to
 * `INQUIRY_TYPES` or `CONTACT_CHANNELS` is a tsc error here rather than an
 * `undefined` that reaches the inbox as a blank line.
 */

export const INQUIRY_LABELS: Record<InquiryType, string> = {
  project: "Project inquiry",
  consultation: "Consultation call",
  job: "Job opportunity",
  other: "New enquiry",
};

export const CHANNEL_LABELS: Record<ContactChannel, string> = {
  email: "Email",
  whatsapp: "WhatsApp",
  phone: "Phone",
};
