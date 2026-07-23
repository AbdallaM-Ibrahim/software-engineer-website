import { Globe, Link2 } from "lucide-react";
import type * as React from "react";

import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MediumIcon,
  StackOverflowIcon,
  TelegramIcon,
  WhatsAppIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons";
import type { SocialPlatform } from "@/lib/social";

type IconComponent = React.ComponentType<{
  className?: string;
  style?: React.CSSProperties;
}>;

// Keyed by the same values the Payload select offers (src/lib/social.ts), so a
// platform can never be pickable without a glyph to render it.
const ICONS: Record<SocialPlatform, IconComponent> = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  whatsapp: WhatsAppIcon,
  x: XIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  telegram: TelegramIcon,
  stackoverflow: StackOverflowIcon,
  medium: MediumIcon,
  website: Globe,
  other: Link2,
};

/** Glyph for a contact link. Unknown or missing platforms fall back to a link icon. */
export function socialIcon(platform: string | null | undefined): IconComponent {
  return ICONS[platform as SocialPlatform] ?? Link2;
}

export function SocialIcon({
  platform,
  className,
  style,
}: {
  platform: string | null | undefined;
  className?: string;
  style?: React.CSSProperties;
}) {
  const Icon = socialIcon(platform);
  return <Icon className={className} style={style} />;
}
