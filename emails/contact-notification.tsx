import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "react-email";

import { emailTailwindConfig } from "./theme";

export interface ContactNotificationProps {
  visitorName: string;
  visitorEmail: string;
  /**
   * Pre-escaped HTML, with newlines already converted to <br />. Built by
   * toHtmlParagraph() in src/lib/email.ts — it is injected as raw HTML below,
   * so it must never carry unescaped visitor input.
   */
  visitorMessage: string;
  submittedAt: string;
  siteUrl: string;
}

export function ContactNotification({
  visitorName,
  visitorEmail,
  visitorMessage,
  submittedAt,
  siteUrl,
}: ContactNotificationProps) {
  return (
    <Html lang="en">
      <Tailwind config={emailTailwindConfig}>
        <Head />
        <Body className="bg-page m-0 p-0 font-sans">
          <Preview>{`New message from ${visitorName}`}</Preview>

          <Container className="mx-auto w-full max-w-[600px] px-6 py-10">
            <Text className="text-muted m-0 mb-6 font-mono text-[11px] tracking-[2px] uppercase">
              Portfolio · New enquiry
            </Text>

            <Section className="border-line bg-card rounded-[8px] border border-solid">
              {/* Teal rule across the top of the card, echoing the site accent.
                  A zero-font-size cell is the reliable way to draw a thin bar —
                  an empty table cell collapses in Outlook. */}
              <Section className="bg-brand rounded-t-[8px]">
                <Text className="m-0 text-[0px] leading-[4px]">&nbsp;</Text>
              </Section>

              <Section className="px-8 pt-8 pb-2">
                <Heading
                  as="h1"
                  className="text-ink m-0 text-[24px] leading-[32px] font-semibold"
                >
                  {visitorName}
                </Heading>
                <Link
                  href={`mailto:${visitorEmail}`}
                  className="text-brand mt-1 inline-block font-mono text-[13px] no-underline"
                >
                  {visitorEmail}
                </Link>
              </Section>

              <Section className="px-8 py-4">
                <Text className="text-muted m-0 mb-3 font-mono text-[10px] tracking-[1.6px] uppercase">
                  Message
                </Text>
                {/* A left rule rather than a filled box — lighter, and closer to
                    the site's quiet cards. Other sides are reset first because
                    email clients don't inherit border-style. */}
                <Section className="border-line border-none border-l-[3px] border-solid pl-4">
                  {/* The value is HTML-escaped by toHtmlParagraph() upstream, so
                      the only markup left is the <br /> tags it inserts.
                      Rendering as text would print those tags literally. */}
                  <Text
                    className="text-ink m-0 text-[15px] leading-[26px]"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: escaped upstream by toHtmlParagraph()
                    dangerouslySetInnerHTML={{ __html: visitorMessage }}
                  />
                </Section>
              </Section>

              <Section className="px-8">
                <Hr className="border-line m-0 my-4 w-full border-t border-solid" />
              </Section>

              <Section className="px-8 pb-8">
                <Row>
                  <Column className="w-1/2 align-top">
                    <Text className="text-muted m-0 mb-1 font-mono text-[10px] tracking-[1.6px] uppercase">
                      Received
                    </Text>
                    <Text className="text-ink m-0 text-[13px]">
                      {submittedAt}
                    </Text>
                  </Column>
                  <Column className="w-1/2 align-top">
                    <Text className="text-muted m-0 mb-1 font-mono text-[10px] tracking-[1.6px] uppercase">
                      Reply to
                    </Text>
                    <Text className="m-0 text-[13px]">
                      <Link
                        href={`mailto:${visitorEmail}`}
                        className="text-brand no-underline"
                      >
                        {visitorEmail}
                      </Link>
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>

            <Text className="text-muted m-0 mt-6 text-center text-[12px] leading-[20px]">
              Hitting reply answers {visitorName} directly.
              <br />
              Sent from the contact form at{" "}
              <Link href={siteUrl} className="text-muted underline">
                {siteUrl.replace(/^https?:\/\//, "")}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

ContactNotification.PreviewProps = {
  visitorName: "Jane Doe",
  visitorEmail: "jane@company.com",
  visitorMessage:
    "Hi Abdalla — we're rebuilding our checkout and payouts flow and need someone who has shipped this before.<br /><br />Budget is flexible for the right person. Are you taking on work in Q3?",
  submittedAt: "23 July 2026 at 15:42 UTC",
  siteUrl: "https://abdalla.futuresolve.net",
} satisfies ContactNotificationProps;

export default ContactNotification;
