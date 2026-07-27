import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";

import { emailTailwindConfig } from "./theme";

export interface ContactAutoReplyProps {
  visitorName: string;
  ownerName: string;
  siteUrl: string;
}

export function ContactAutoReply({
  visitorName,
  ownerName,
  siteUrl,
}: ContactAutoReplyProps) {
  return (
    <Html lang="en">
      <Tailwind config={emailTailwindConfig}>
        <Head />
        <Body className="bg-page m-0 p-0 font-sans">
          <Preview>{`Thanks for reaching out — ${ownerName} has your message`}</Preview>

          <Container className="mx-auto w-full max-w-[600px] px-6 py-10">
            <Text className="text-muted m-0 mb-6 font-mono text-[11px] tracking-[2px] uppercase">
              {ownerName} · Message received
            </Text>

            <Section className="border-line bg-card rounded-[8px] border border-solid">
              <Section className="bg-brand rounded-t-[8px]">
                <Text className="m-0 text-[0px] leading-[4px]">&nbsp;</Text>
              </Section>

              <Section className="px-8 py-8">
                <Heading
                  as="h1"
                  className="text-ink m-0 mb-4 text-[24px] leading-[32px] font-semibold"
                >
                  Thanks, {visitorName}.
                </Heading>

                <Text className="text-ink m-0 mb-4 text-[15px] leading-[26px]">
                  Your message landed — I've got it and I read everything
                  personally. Expect a reply within a couple of working days.
                </Text>

                <Text className="text-ink m-0 mb-6 text-[15px] leading-[26px]">
                  If it's time-sensitive, just reply to this email and it comes
                  straight back to me.
                </Text>

                <Button
                  href={siteUrl}
                  className="bg-brand box-border rounded-[6px] px-6 py-3 text-center text-[14px] font-semibold text-white no-underline"
                >
                  Browse my work
                </Button>
              </Section>

              <Section className="px-8">
                <Hr className="border-line m-0 w-full border-t border-solid" />
              </Section>

              <Section className="px-8 py-6">
                <Text className="text-muted m-0 text-[13px] leading-[22px]">
                  — {ownerName}
                </Text>
              </Section>
            </Section>

            <Text className="text-muted m-0 mt-6 text-center text-[12px] leading-[20px]">
              You're getting this because you sent a message via{" "}
              <Link href={siteUrl} className="text-muted underline">
                {siteUrl.replace(/^https?:\/\//, "")}
              </Link>
              . No list, no follow-ups.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

ContactAutoReply.PreviewProps = {
  visitorName: "Jane",
  ownerName: "Abdalla",
  siteUrl: "https://abdalla.futuresolve.net",
} satisfies ContactAutoReplyProps;

export default ContactAutoReply;
