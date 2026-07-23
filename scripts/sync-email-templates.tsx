/**
 * Renders the React Email templates in ./emails and uploads them to Resend as
 * published Templates.
 *
 * React Email is the authoring layer; Resend Templates is the serving layer.
 * The runtime never renders an email — it sends `template: { id, variables }`,
 * so copy can be edited in the Resend dashboard without a redeploy.
 *
 * The mustache placeholders are passed as *prop values* at render time (never
 * written into the JSX), which keeps the components normal typed React and lets
 * `pnpm email` preview them with realistic sample data.
 *
 * Idempotent — re-run after every template edit.
 *
 *   pnpm email:sync              upload + publish
 *   pnpm email:sync --emit <dir> render to <dir> instead, no network calls
 *
 * NOTE: uploading needs a FULL ACCESS Resend API key. A sending-only key
 * returns 401 restricted_api_key on /templates. `--emit` needs no key at all.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "react-email";
import type { CreateTemplateOptions, Resend } from "resend";

import {
  ContactAutoReply,
  type ContactAutoReplyProps,
} from "../emails/contact-auto-reply";
import {
  ContactNotification,
  type ContactNotificationProps,
} from "../emails/contact-notification";
import {
  CONTACT_AUTO_REPLY_TEMPLATE,
  CONTACT_NOTIFICATION_TEMPLATE,
  getManagementResend,
  OWNER_NAME,
  SITE_URL,
} from "../src/lib/email";

type Variables = NonNullable<CreateTemplateOptions["variables"]>;

interface TemplateSpec {
  alias: string;
  name: string;
  subject: string;
  /** Rendered to HTML. Gets the escaped-context variables. */
  htmlElement: React.ReactElement;
  /** Rendered to plain text. Gets the raw *_TEXT variables. */
  textElement: React.ReactElement;
  variables: Variables;
}

/**
 * Resend substitutes one variable into three different contexts — subject line,
 * HTML body, plain-text body — but escaping is only correct in the HTML one. A
 * single escaped variable produces `Jane &lt;b&gt;Doe&lt;/b&gt;` in the subject
 * and literal `<br />` tags in the plain-text part.
 *
 * So visitor-supplied fields get two variables each: the plain `KEY` (escaped,
 * HTML body only) and `KEY_TEXT` (raw, subject and plain-text body). The
 * component is rendered twice, once per token set.
 */
const specs: TemplateSpec[] = [
  {
    alias: CONTACT_NOTIFICATION_TEMPLATE,
    name: "Contact — notification",
    subject: "New message from {{{VISITOR_NAME_TEXT}}}",
    htmlElement: (
      <ContactNotification
        {...({
          visitorName: "{{{VISITOR_NAME}}}",
          visitorEmail: "{{{VISITOR_EMAIL}}}",
          visitorMessage: "{{{VISITOR_MESSAGE}}}",
          submittedAt: "{{{SUBMITTED_AT}}}",
          siteUrl: SITE_URL,
        } satisfies ContactNotificationProps)}
      />
    ),
    textElement: (
      <ContactNotification
        {...({
          visitorName: "{{{VISITOR_NAME_TEXT}}}",
          visitorEmail: "{{{VISITOR_EMAIL_TEXT}}}",
          visitorMessage: "{{{VISITOR_MESSAGE_TEXT}}}",
          submittedAt: "{{{SUBMITTED_AT}}}",
          siteUrl: SITE_URL,
        } satisfies ContactNotificationProps)}
      />
    ),
    variables: [
      { key: "VISITOR_NAME", type: "string", fallbackValue: "A visitor" },
      { key: "VISITOR_NAME_TEXT", type: "string", fallbackValue: "A visitor" },
      { key: "VISITOR_EMAIL", type: "string", fallbackValue: "" },
      { key: "VISITOR_EMAIL_TEXT", type: "string", fallbackValue: "" },
      // No fallback: a notification with no message body is useless, so a send
      // that omits it should fail loudly (422) rather than arrive empty.
      { key: "VISITOR_MESSAGE", type: "string" },
      { key: "VISITOR_MESSAGE_TEXT", type: "string" },
      // Server-generated, so there is nothing to escape and one variable does.
      { key: "SUBMITTED_AT", type: "string", fallbackValue: "" },
    ],
  },
  {
    alias: CONTACT_AUTO_REPLY_TEMPLATE,
    name: "Contact — auto-reply",
    subject: "Thanks for reaching out, {{{VISITOR_NAME_TEXT}}}",
    htmlElement: (
      <ContactAutoReply
        {...({
          visitorName: "{{{VISITOR_NAME}}}",
          ownerName: "{{{OWNER_NAME}}}",
          siteUrl: SITE_URL,
        } satisfies ContactAutoReplyProps)}
      />
    ),
    textElement: (
      <ContactAutoReply
        {...({
          visitorName: "{{{VISITOR_NAME_TEXT}}}",
          ownerName: "{{{OWNER_NAME}}}",
          siteUrl: SITE_URL,
        } satisfies ContactAutoReplyProps)}
      />
    ),
    variables: [
      { key: "VISITOR_NAME", type: "string", fallbackValue: "there" },
      { key: "VISITOR_NAME_TEXT", type: "string", fallbackValue: "there" },
      { key: "OWNER_NAME", type: "string", fallbackValue: OWNER_NAME },
    ],
  },
];

async function sync(resend: Resend, spec: TemplateSpec): Promise<void> {
  const html = await render(spec.htmlElement);
  const text = await render(spec.textElement, { plainText: true });

  // The SDK returns { data, error } and does not throw, so every call is
  // checked explicitly.
  const existing = await resend.templates.get(spec.alias);

  let id: string;

  if (existing.data) {
    const updated = await resend.templates.update(existing.data.id, {
      name: spec.name,
      subject: spec.subject,
      html,
      text,
      variables: spec.variables,
    });
    if (updated.error) {
      throw new Error(`update ${spec.alias}: ${updated.error.message}`);
    }
    id = existing.data.id;
    console.log(`  updated  ${spec.alias} (${id})`);
  } else {
    const created = await resend.templates.create({
      name: spec.name,
      alias: spec.alias,
      subject: spec.subject,
      html,
      text,
      variables: spec.variables,
    });
    if (created.error || !created.data) {
      throw new Error(
        `create ${spec.alias}: ${created.error?.message ?? "no data returned"}`,
      );
    }
    id = created.data.id;
    console.log(`  created  ${spec.alias} (${id})`);
  }

  // Editing a published template leaves a draft behind — the previously
  // published version keeps sending until this runs. Drafts cannot send at all.
  const published = await resend.templates.publish(id);
  if (published.error) {
    throw new Error(`publish ${spec.alias}: ${published.error.message}`);
  }
  console.log(`  published ${spec.alias}`);
}

/** Write the rendered output to disk instead of uploading. No API key needed. */
async function emit(dir: string): Promise<void> {
  mkdirSync(dir, { recursive: true });
  for (const spec of specs) {
    const html = await render(spec.htmlElement);
    const text = await render(spec.textElement, { plainText: true });
    writeFileSync(join(dir, `${spec.alias}.html`), html, "utf8");
    writeFileSync(join(dir, `${spec.alias}.txt`), text, "utf8");
    writeFileSync(
      join(dir, `${spec.alias}.json`),
      JSON.stringify(
        {
          name: spec.name,
          alias: spec.alias,
          subject: spec.subject,
          variables: spec.variables,
        },
        null,
        2,
      ),
      "utf8",
    );
    console.log(`  emitted ${spec.alias} → ${dir}`);
  }
}

async function main(): Promise<void> {
  const emitFlag = process.argv.indexOf("--emit");
  if (emitFlag !== -1) {
    const dir = process.argv[emitFlag + 1];
    if (!dir) throw new Error("--emit requires a target directory");
    await emit(dir);
    console.log("Done.");
    return;
  }

  const resend = getManagementResend();
  console.log(`Syncing ${specs.length} templates to Resend…`);
  for (const spec of specs) {
    await sync(resend, spec);
  }
  console.log("Done.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
