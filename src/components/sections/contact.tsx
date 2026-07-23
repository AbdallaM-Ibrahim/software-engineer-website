import { Mail, MessageCircle, Phone } from "lucide-react";
import type * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SocialIcon } from "@/components/social-icon";
import { ContactForm } from "@/components/sections/contact-form";
import { contactLinks, resolveWhatsapp } from "@/lib/contact-links";
import { handleFrom } from "@/lib/social";
import type { Profile } from "@/payload-types";

type Entry = {
  key: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  external: boolean;
};

export function Contact({ profile }: { profile: Profile }) {
  const c = profile.contact ?? {};
  const whatsapp = resolveWhatsapp(profile);

  const entries: Entry[] = [];

  if (c.email) {
    entries.push({
      key: "email",
      icon: <Mail className="size-5" />,
      label: "Email",
      value: c.email,
      href: `mailto:${c.email}`,
      external: false,
    });
  }

  if (c.phone) {
    entries.push({
      key: "phone",
      icon: <Phone className="size-5" />,
      label: "Phone",
      value: c.phone,
      href: `tel:${c.phone}`,
      external: false,
    });
  }

  // The chat link is worth its own row even though the number may already be
  // listed above — tapping "Phone" starts a call, which is a different ask.
  if (whatsapp) {
    entries.push({
      key: "whatsapp",
      icon: <MessageCircle className="size-5" />,
      label: "WhatsApp",
      value: "Start a chat",
      href: whatsapp,
      external: true,
    });
  }

  // Everything the editor added, in their order. The hero surfaces LinkedIn and
  // WhatsApp as shortcuts; this stays the complete directory.
  for (const link of contactLinks(profile)) {
    if (link.platform === "whatsapp") continue; // already rendered above
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
          eyebrow="Contact"
          title="Let's build something together"
          description="Have a project or an idea? Email me directly, or send a message below."
        />

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="grid gap-3">
              {entries.map((entry) => (
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
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <Card>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
