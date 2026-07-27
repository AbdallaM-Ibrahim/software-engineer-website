import { z } from "zod";

// Shared by the client form (src/components/sections/contact-form.tsx) and the
// route handler (src/app/(frontend)/api/contact/route.ts) so a payload that
// passes in the browser can never be rejected by the server for a different
// reason — the browser check is UX, this is the one that's authoritative.

export const INQUIRY_TYPES = [
  "project",
  "consultation",
  "job",
  "other",
] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const CONTACT_CHANNELS = ["email", "whatsapp", "phone"] as const;
export type ContactChannel = (typeof CONTACT_CHANNELS)[number];

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name.").max(100),
  email: z.string().email("Please enter a valid email."),
  // 2000 is Resend's hard cap on a single string template variable, so it is a
  // real limit rather than a taste judgement — a longer message would 422.
  message: z
    .string()
    .min(10, "Message should be at least 10 characters.")
    .max(2000, "Message should be under 2000 characters."),
  // The only new required field: it routes the lead and titles the email.
  inquiryType: z.enum(INQUIRY_TYPES),
  // Optional. A slug, validated against the real Services list on the server —
  // a <select> value is still attacker-controlled, so an unknown slug is
  // dropped rather than trusted (see the route handler).
  service: z.string().max(100).optional(),
  phone: z.string().max(40).optional(),
  preferredChannel: z.enum(CONTACT_CHANNELS).optional(),
  // Honeypot. Hidden from real users, so anything here means a bot filled the
  // form blind. Optional and unvalidated — the route decides what to do with it.
  company: z.string().optional(),
});

export type ContactValues = z.infer<typeof contactSchema>;
