import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

import { contactSchema } from "@/lib/contact-schema";
import {
  CONTACT_AUTO_REPLY_TEMPLATE,
  CONTACT_NOTIFICATION_TEMPLATE,
  OWNER_NAME,
  autoReplyEnabled,
  escapeHtml,
  getFromAddress,
  getSendingResend,
  resolveRecipient,
  toHtmlParagraph,
} from "@/lib/email";

// Templates render HTML server-side and the rate limiter keeps in-process
// state, so this must not be statically evaluated at build time.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;

// Best-effort only: per-process and lost on redeploy, and a serverless
// deployment gives each instance its own copy. It exists to blunt a naive
// flood, not as real abuse protection — put a WAF in front for that.
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400 },
    );
  }

  const { name, email, message, company } = parsed.data;

  // Honeypot: the field is hidden, so a value means a bot filled the form
  // blind. Answer 200 so it can't tell it was caught.
  if (company && company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (isRateLimited(clientIp(request))) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 },
    );
  }

  const resend = getSendingResend();
  const to = await resolveRecipient();
  const from = getFromAddress();

  const submittedAt = new Date().toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "UTC",
  });

  // Collapses accidental double-submits inside Resend's 24h idempotency window
  // without suppressing a genuinely different message.
  const fingerprint = createHash("sha256")
    .update(`${email}:${message}`)
    .digest("hex")
    .slice(0, 32);

  // Resend interpolates with triple mustache, which does not escape — so the
  // HTML body gets escaped values. The subject line and plain-text body are not
  // HTML, where escaping would instead surface literal `&lt;` and `<br />`, so
  // they read the raw *_TEXT variables. See scripts/sync-email-templates.tsx.
  const { data, error } = await resend.emails.send(
    {
      from,
      to: [to],
      // Reply in the inbox goes to the visitor, not back to the site.
      replyTo: email,
      template: {
        id: CONTACT_NOTIFICATION_TEMPLATE,
        variables: {
          VISITOR_NAME: escapeHtml(name),
          VISITOR_NAME_TEXT: name,
          VISITOR_EMAIL: escapeHtml(email),
          VISITOR_EMAIL_TEXT: email,
          VISITOR_MESSAGE: toHtmlParagraph(message),
          VISITOR_MESSAGE_TEXT: message,
          SUBMITTED_AT: `${submittedAt} UTC`,
        },
      },
    },
    { idempotencyKey: `contact-notify/${fingerprint}` },
  );

  // The Node SDK resolves with { data, error } instead of throwing.
  if (error) {
    console.error("[contact] notification failed:", error);
    return NextResponse.json(
      { error: "Could not send your message. Please try again." },
      { status: 502 },
    );
  }

  // Off until a domain is verified — the sandbox sender can only deliver to the
  // account owner, so a reply to an arbitrary visitor 403s. Its failure must
  // never fail the request: the owner's copy has already been accepted.
  if (autoReplyEnabled()) {
    const firstName = name.split(" ")[0] || name;
    try {
      const reply = await resend.emails.send(
        {
          from,
          to: [email],
          template: {
            id: CONTACT_AUTO_REPLY_TEMPLATE,
            // SITE_URL is baked into the template at render time, not a
            // variable — only declared variables may be sent.
            variables: {
              VISITOR_NAME: escapeHtml(firstName),
              VISITOR_NAME_TEXT: firstName,
              OWNER_NAME: OWNER_NAME,
            },
          },
        },
        { idempotencyKey: `contact-reply/${fingerprint}` },
      );
      if (reply.error) {
        console.error("[contact] auto-reply failed:", reply.error);
      }
    } catch (replyError) {
      console.error("[contact] auto-reply threw:", replyError);
    }
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
