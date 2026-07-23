import { getCaseStudies, getProfile, getServices } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

// A plain-text brief for the AI assistants that increasingly answer "who should
// I hire for X". Generated from the CMS so it never drifts from the site.
// See https://llmstxt.org — the emerging convention for this file.

export const dynamic = "force-static";
export const revalidate = 3600;

function line(label: string, value?: string | null) {
  return value ? `${label}: ${value}\n` : "";
}

export async function GET() {
  const [profile, services, caseStudies] = await Promise.all([
    getProfile("en"),
    getServices("en"),
    getCaseStudies("en"),
  ]);

  if (!profile) {
    return new Response("# Site not yet populated.\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const regions = (profile.availability?.regions ?? [])
    .map((r) => r.name)
    .filter(Boolean)
    .join(", ");

  let out = "";
  out += `# ${profile.name}\n\n`;
  out += `> ${profile.headline}. ${profile.tagline ?? ""}\n\n`;

  out += "## About\n\n";
  out += `${(profile.about ?? "").replace(/\n{2,}/g, "\n").trim()}\n\n`;

  if (services.length > 0) {
    out += "## Services\n\n";
    for (const service of services) {
      const url = service.slug
        ? ` (${absoluteUrl(`/services/${service.slug}`)})`
        : "";
      out += `- ${service.title}${url}: ${service.teaser ?? service.description}\n`;
    }
    out += "\n";
  }

  const withMetrics = caseStudies.filter((c) => c.metric?.value);
  if (withMetrics.length > 0) {
    out += "## Selected results\n\n";
    for (const study of withMetrics) {
      const m = study.metric!;
      const value = m.before ? `${m.before} → ${m.value}` : m.value;
      out += `- ${study.shortName || study.title}: ${value}${m.label ? ` ${m.label}` : ""}\n`;
    }
    out += "\n";
  }

  out += "## Availability\n\n";
  out += line("Regions", regions);
  out += line("Timezone", profile.availability?.timezone);
  out += "\n## Contact\n\n";
  out += line("Email", profile.contact?.email);
  out += line("Website", absoluteUrl("/"));
  out += line("Arabic", absoluteUrl("/", "ar"));

  return new Response(out, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
