import { Button } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import type { Profile } from "@/payload-types";

export function Footer({ profile }: { profile: Profile }) {
  const year = new Date().getFullYear();
  const c = profile.contact ?? {};

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
          {c.github ? (
            <Button asChild variant="ghost" size="icon" aria-label="GitHub">
              <a href={c.github} target="_blank" rel="noopener noreferrer">
                <GitHubIcon className="size-5" />
              </a>
            </Button>
          ) : null}
          {c.linkedin ? (
            <Button asChild variant="ghost" size="icon" aria-label="LinkedIn">
              <a href={c.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedInIcon className="size-5" />
              </a>
            </Button>
          ) : null}
        </div>

        <p className="text-muted-foreground font-mono text-xs">
          © {year} {profile.name}
        </p>
      </div>
    </footer>
  );
}
