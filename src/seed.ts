import fs from "node:fs";
import path from "node:path";

import { getPayload } from "payload";
import config from "@payload-config";

type PortfolioJson = {
  name: string;
  age: number;
  about: string;
  contact: {
    email: string;
    phone: string;
    social: { linkedin: string; github: string };
  };
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    website?: string;
    from: string;
    to?: string | null;
    isPresent?: boolean;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    from: string;
    to?: string | null;
  }>;
  case_studies: Array<{
    title: string;
    link: string;
    star_factors: {
      situation: string;
      task: string;
      action: string;
      result: string;
    };
  }>;
};

// Split a "- bullet" blob into clean lines. Bullet markers are a dash followed by
// whitespace (real hyphenated words like "high-value" have no space, so they survive).
const toBullets = (text: string): string =>
  text
    .split(/\n?\s*-\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .join("\n");

// Manually curated service cards (extracted from the "How I can help" bio section).
const SERVICES: {
  icon: "code" | "automation" | "payments" | "data";
  title: string;
  description: string;
}[] = [
  {
    icon: "code",
    title: "Web Development",
    description:
      "I design and build websites that connect you directly to your customers and open new doors for sales.",
  },
  {
    icon: "automation",
    title: "Process Automation",
    description:
      "I set up server solutions and internal tools that handle repetitive daily tasks, freeing up your time to focus on growth.",
  },
  {
    icon: "payments",
    title: "Payment Integration",
    description:
      "I implement fast, reliable payment systems that encourage customer purchases and eliminate the need for manual tracking.",
  },
  {
    icon: "data",
    title: "Data-Driven Insights",
    description:
      "With a background in Data Science, I ensure every system produces the data you need to make confident, informed business decisions.",
  },
];

// Curated from the experience descriptions in portofolio.json.
const TECH_STACK = [
  "REST APIs",
  "Stripe",
  "Paymob",
  "Cregis",
  "Apple Pay",
  "Google Pay",
  "PayPal",
  "Typesense",
  "AWS S3",
  "AWS Lambda",
  "Cloudflare R2",
  "DigitalOcean Spaces",
  "Google Maps API",
  "Mailgun",
  "MailerSend",
  "Twilio",
  "OpenAI",
  "Message Queues",
  "Machine Learning",
];

// No testimonials are seeded. Fabricated quotes labelled "placeholder" read as an
// unfinished site and cost more credibility than an absent section — the
// Testimonials section hides itself until real ones are added in /admin.

// Presentation metadata that isn't derivable from portofolio.json. Keyed by the
// case study's live URL so reordering the JSON can't misalign it. Each headline
// metric is lifted verbatim from that project's own result bullets.
const CASE_META: Record<
  string,
  {
    shortName: string;
    slug: string;
    metric: {
      before?: string;
      value: string;
      direction: "up" | "down";
      label: string;
    };
  }
> = {
  "https://www.westbazaar.com": {
    shortName: "Westbazaar",
    slug: "westbazaar",
    metric: {
      before: "200",
      value: "13,000",
      direction: "up",
      label: "product imports / day",
    },
  },
  "https://jobsolv.com/": {
    shortName: "JobSolv",
    slug: "jobsolv",
    metric: {
      value: "60%",
      direction: "down",
      label: "recruitment cycle time",
    },
  },
  "https://easygoholidayhomes.com": {
    shortName: "EasyGo Holiday Homes",
    slug: "easygo",
    metric: {
      value: "80%",
      direction: "up",
      label: "more reservations",
    },
  },
};

const seed = async () => {
  const payload = await getPayload({ config });

  const json: PortfolioJson = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "portofolio.json"), "utf-8"),
  );

  // --- Admin user (idempotent) ---
  const existingUsers = await payload.find({
    collection: "users",
    where: { email: { equals: "admin@admin.com" } },
    limit: 1,
  });
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: "users",
      data: {
        email: "admin@admin.com",
        password: "admin",
        name: json.name,
      },
    });
    payload.logger.info("Created admin user admin@admin.com");
  } else {
    payload.logger.info("Admin user already exists — skipping");
  }

  // --- Profile global ---
  // String.split always yields at least one element, but the type doesn't say so.
  const aboutIntro = (
    json.about.split(/How I can help your business:/i)[0] ?? json.about
  ).trim();
  await payload.updateGlobal({
    slug: "profile",
    data: {
      name: json.name,
      age: json.age,
      headline: "Senior Software Engineer",
      about: aboutIntro,
      services: SERVICES,
      skills: json.skills.map((skill) => ({ skill })),
      techStack: TECH_STACK.map((name) => ({ name })),
      contact: {
        email: json.contact.email,
        phone: json.contact.phone,
        linkedin: json.contact.social.linkedin,
        github: json.contact.social.github,
      },
    },
  });
  payload.logger.info("Updated Profile global");

  // Retry helper for MongoDB transient transaction errors (catalog changes when
  // collections are first created during seeding).
  const withRetry = async <T>(
    fn: () => Promise<T>,
    attempts = 5,
  ): Promise<T> => {
    let lastErr: unknown;
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (err) {
        lastErr = err;
        const msg = err instanceof Error ? err.message : String(err);
        if (!/Transient|catalog changes|please retry/i.test(msg)) throw err;
        await new Promise((r) => setTimeout(r, 300 * (i + 1)));
      }
    }
    throw lastErr;
  };

  // --- Collections: wipe + reseed for idempotency (serialized to avoid
  // concurrent catalog-change transaction conflicts) ---
  const collections = [
    "experience",
    "education",
    "case-studies",
    "testimonials",
  ] as const;
  for (const collection of collections) {
    await withRetry(() => payload.delete({ collection, where: {} }));
  }

  for (const [i, e] of json.experience.entries()) {
    await withRetry(() =>
      payload.create({
        collection: "experience",
        data: {
          order: i,
          title: e.title,
          company: e.company,
          website: e.website,
          from: e.from,
          isPresent: Boolean(e.isPresent),
          to: e.isPresent ? undefined : e.to || undefined,
          description: toBullets(e.description),
        },
      }),
    );
  }
  payload.logger.info(`Created ${json.experience.length} experience entries`);

  for (const [i, ed] of json.education.entries()) {
    await withRetry(() =>
      payload.create({
        collection: "education",
        data: {
          order: i,
          degree: ed.degree,
          institution: ed.institution,
          from: ed.from,
          to: ed.to || undefined,
        },
      }),
    );
  }
  payload.logger.info(`Created ${json.education.length} education entries`);

  for (const [i, c] of json.case_studies.entries()) {
    const meta = CASE_META[c.link];
    if (!meta) {
      payload.logger.warn(
        `No CASE_META entry for ${c.link} — seeding without metric or screenshot.`,
      );
    }
    await withRetry(() =>
      payload.create({
        collection: "case-studies",
        data: {
          order: i,
          title: c.title,
          shortName: meta?.shortName,
          slug: meta?.slug,
          link: c.link,
          metric: meta?.metric,
          star: {
            situation: c.star_factors.situation.trim(),
            task: c.star_factors.task.trim(),
            action: toBullets(c.star_factors.action),
            result: toBullets(c.star_factors.result),
          },
        },
      }),
    );
  }
  payload.logger.info(`Created ${json.case_studies.length} case studies`);
  payload.logger.info("Skipped testimonials — add real ones in /admin");

  payload.logger.info("✅ Seed complete");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
