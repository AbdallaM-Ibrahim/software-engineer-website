import { Button } from "@/components/ui/button";
import { SocialIcon } from "@/components/social-icon";
import { contactLinks } from "@/lib/contact-links";
import type { Profile } from "@/payload-types";

export function Footer({ profile }: { profile: Profile }) {
  const year = new Date().getFullYear();
  const links = contactLinks(profile);

  return (
    <footer className="border-t px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-center sm:text-left">
          <a href="#top" className="font-display font-bold">
            {profile.name}
          </a>
          <p className="text-muted-foreground font-mono text-xs">
            {profile.headline}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Button
              key={link.id}
              asChild
              variant="ghost"
              size="icon"
              aria-label={link.label}
            >
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <SocialIcon platform={link.platform} className="size-5" />
              </a>
            </Button>
          ))}
        </div>

        <p className="text-muted-foreground font-mono text-xs">
          © {year} {profile.name}
        </p>
      </div>
    </footer>
  );
}
