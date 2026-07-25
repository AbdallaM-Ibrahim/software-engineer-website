import { Mail, Phone } from "lucide-react";
import type * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SocialIcon } from "@/components/social-icon";
import { WhatsAppIcon } from "@/components/icons";
import { ContactForm } from "@/components/sections/contact-form";
import { contactLinks, resolveWhatsappInfo } from "@/lib/contact-links";
import type { Dictionary } from "@/lib/i18n";
import { handleFrom } from "@/lib/social";
import type { Profile, Service } from "@/payload-types";

type Entry = {
  key: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  external: boolean;
  /**
   * When the WhatsApp number is the phone number itself, the phone card carries
   * a small WhatsApp badge linking to the chat instead of a second card for the
   * same number. This is that badge's URL.
   */
  whatsapp?: string;
};

export function Contact({
  profile,
  services,
  dict,
}: {
  profile: Profile;
  services: Service[];
  dict: Dictionary;
}) {
  const c = profile.contact ?? {};
  const whatsapp = resolveWhatsappInfo(profile);

  const entries: Entry[] = [];

  if (c.email) {
    entries.push({
      key: "email",
      icon: <Mail className="size-5" />,
      label: dict.contact.email,
      value: c.email,
      href: `mailto:${c.email}`,
      external: false,
    });
  }

  if (c.phone) {
    entries.push({
      key: "phone",
      icon: <Phone className="size-5" />,
      label: dict.contact.phone,
      value: c.phone,
      href: `tel:${c.phone}`,
      external: false,
      // Same number on WhatsApp: the card gets a chat badge, so tapping the row
      // still calls while the badge opens WhatsApp — one card, two intents.
      whatsapp: whatsapp?.fromPhone ? whatsapp.url : undefined,
    });
  }

  // A standalone WhatsApp card only earns its place when it is a *different*
  // number than the phone — otherwise it would repeat the same digits. It
  // carries that number rather than a generic "start a chat".
  if (whatsapp && !whatsapp.fromPhone) {
    entries.push({
      key: "whatsapp",
      icon: <WhatsAppIcon className="size-5" />,
      label: dict.contact.whatsapp,
      value: whatsapp.number ?? dict.contact.startChat,
      href: whatsapp.url,
      external: true,
    });
  }

  // Everything the editor added, in their order. The hero surfaces LinkedIn and
  // GitHub as shortcuts; this stays the complete directory.
  for (const link of contactLinks(profile)) {
    if (link.platform === "whatsapp") continue; // rendered above
    entries.push({
      key: link.id,
      icon: <SocialIcon platform={link.platform} className="size-5" />,
      label: link.label,
      value: handleFrom(link.url),
      href: link.url,
      external: true,
    });
  }

  return (
    <section
      id="contact"
      className="scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={dict.contact.eyebrow}
          title={dict.contact.title}
          description={dict.contact.description}
        />

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="grid gap-3">
              {entries.map((entry) =>
                entry.whatsapp ? (
                  // A card that isn't a single link: the row calls, the badge
                  // chats. Two sibling anchors inside the card, not nested.
                  <Card
                    key={entry.key}
                    className="group relative py-4 transition-colors hover:border-primary/50"
                  >
                    <a href={entry.href} className="block">
                      <CardContent className="flex items-center gap-4 pe-14">
                        <div className="bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-lg">
                          {entry.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
                            {entry.label}
                          </p>
                          <p className="truncate font-mono text-sm">
                            {entry.value}
                          </p>
                        </div>
                      </CardContent>
                    </a>
                    <a
                      href={entry.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={dict.contact.whatsapp}
                      className="absolute end-4 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg bg-[#25D366]/10 text-[#25D366] transition-colors hover:bg-[#25D366]/20"
                    >
                      <WhatsAppIcon className="size-5" />
                    </a>
                  </Card>
                ) : (
                  <a
                    key={entry.key}
                    href={entry.href}
                    target={entry.external ? "_blank" : undefined}
                    rel={entry.external ? "noopener noreferrer" : undefined}
                    className="group"
                  >
                    <Card className="py-4 transition-colors group-hover:border-primary/50">
                      <CardContent className="flex items-center gap-4">
                        <div className="bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-lg">
                          {entry.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
                            {entry.label}
                          </p>
                          <p className="truncate font-mono text-sm">
                            {entry.value}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ),
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <Card>
              <CardContent>
                <ContactForm t={dict.form} services={services} />
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
