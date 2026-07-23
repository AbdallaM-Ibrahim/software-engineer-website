import { Button } from "@/components/ui/button";
import { SocialIcon } from "@/components/social-icon";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { contactLinks } from "@/lib/contact-links";
import type { Dictionary } from "@/lib/i18n";
import { type Locale, sectionHref } from "@/lib/site";
import type { Profile } from "@/payload-types";

export function Footer({
  profile,
  dict,
  locale,
}: {
  profile: Profile;
  dict: Dictionary;
  locale: Locale;
}) {
  const year = new Date().getFullYear();
  const links = contactLinks(profile);

  return (
    <footer className="border-t px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-center sm:text-start">
          <a
            href={sectionHref("top", locale)}
            className="font-display font-bold"
          >
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

        <div className="flex items-center gap-4">
          {/* Also in the navbar. hreflang is what tells a crawler the other
              language exists; this is for the reader who scrolled to the end. */}
          <LocaleSwitcher
            locale={locale}
            label={dict.common.switchLanguage}
            variant="text"
          />
          <p className="text-muted-foreground font-mono text-xs">
            {dict.footer.copyright(year, profile.name)}
          </p>
        </div>
      </div>
    </footer>
  );
}
