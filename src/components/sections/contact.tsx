import type * as React from "react";
import { Mail, Phone } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { ContactForm } from "@/components/sections/contact-form";
import type { Profile } from "@/payload-types";

/** "https://linkedin.com/in/foo/" -> "in/foo" */
function handleFrom(url: string): string {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/^[^/]+\//, "")
    .replace(/\/$/, "");
}

export function Contact({ profile }: { profile: Profile }) {
  const c = profile.contact ?? {};

  const links = [
    c.email && {
      icon: Mail,
      label: "Email",
      value: c.email,
      href: `mailto:${c.email}`,
    },
    c.phone && {
      icon: Phone,
      label: "Phone",
      value: c.phone,
      href: `tel:${c.phone}`,
    },
    c.linkedin && {
      icon: LinkedInIcon,
      label: "LinkedIn",
      // Derived from the URL so editing it in /admin can't leave a stale handle.
      value: handleFrom(c.linkedin),
      href: c.linkedin,
    },
    c.github && {
      icon: GitHubIcon,
      label: "GitHub",
      value: handleFrom(c.github),
      href: c.github,
    },
  ].filter(Boolean) as {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    href: string;
  }[];

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
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group"
                >
                  <Card className="py-4 transition-colors group-hover:border-primary/50">
                    <CardContent className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-lg">
                        <link.icon className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
                          {link.label}
                        </p>
                        <p className="truncate font-mono text-sm">
                          {link.value}
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
