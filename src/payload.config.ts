import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { resendAdapter } from "@payloadcms/email-resend";
import { mcpPlugin } from "@payloadcms/plugin-mcp";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { s3Storage } from "@payloadcms/storage-s3";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Services } from "./collections/Services";
import { Skills } from "./collections/Skills";
import { Experience } from "./collections/Experience";
import { Education } from "./collections/Education";
import { CaseStudies } from "./collections/CaseStudies";
import { Testimonials } from "./collections/Testimonials";
import { ContactFailures } from "./collections/ContactFailures";
import { Profile } from "./globals/Profile";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Enable cloud media only when an S3-compatible bucket is configured.
// Works with any S3-compatible provider (AWS S3, Cloudflare R2, DigitalOcean
// Spaces, MinIO, ...) via a custom endpoint. Until then, media stays on local disk.
const s3Enabled = Boolean(process.env.S3_BUCKET && process.env.S3_ENDPOINT);

// Payload sends its own account mail (password resets, verification). Without an
// adapter it writes them to the console and warns on every boot. It reuses the
// sending-scoped Resend key — the same one the contact route uses.
//
// NOTE: parsed inline rather than imported from src/lib/email.ts because this
// file is also loaded by the Payload CLI through tsx, which does not resolve the
// `@/*` tsconfig path alias.
const emailApiKey =
  process.env.RESEND_API_KEY_SEND || process.env.RESEND_API_KEY;

/** `"Name <a@b.c>"` -> `{ name, address }`; a bare address also works. */
function parseFromAddress(raw: string | undefined) {
  const value = raw?.trim() ?? "";
  const withName = value.match(/^(.*?)\s*<([^>]+)>$/);
  if (withName?.[2]) {
    return {
      name: withName[1]?.trim() || "Portfolio",
      address: withName[2],
    };
  }
  return { name: "Portfolio", address: value || "onboarding@resend.dev" };
}

const from = parseFromAddress(process.env.RESEND_FROM_EMAIL);

// Same resolution as src/lib/social.ts consumers and the sitemap. Inlined for
// the same tsx/alias reason as parseFromAddress above.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Public base URL of the R2 bucket (the r2.dev domain or a custom one). When
// present, media documents get URLs that point straight at the CDN instead of
// being proxied through Payload's own /api/media/file route — faster, cached,
// and what src/lib/media.ts and next/image expect. Trailing slash stripped so
// the join below never doubles up.
const MEDIA_PUBLIC_URL = process.env.NEXT_PUBLIC_MEDIA_URL?.replace(/\/+$/, "");

export default buildConfig({
  // Service pages carry long-form copy, so a rich-text editor is required. This
  // reverses an earlier decision to keep @lexical out of the module graph over
  // a circular-import bug — if `pnpm build` ever fails inside @lexical, that is
  // what regressed, not the page that happens to be compiling.
  editor: lexicalEditor(),
  // English is served unprefixed and Arabic under /ar. `fallback` means an
  // untranslated Arabic field renders its English value rather than a blank —
  // which is why /ar pages stay noindex until `translationReviewed` is ticked.
  localization: {
    locales: [
      { code: "en", label: "English" },
      { code: "ar", label: "العربية", rtl: true },
    ],
    defaultLocale: "en",
    fallback: true,
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // Live preview renders the real site in an iframe beside the editor. It is
    // a single-page portfolio, so every document previews the same URL — the
    // section being edited is simply visible on it.
    livePreview: {
      url: SITE_URL,
      collections: [
        "services",
        "skills",
        "experience",
        "education",
        "case-studies",
        "testimonials",
      ],
      globals: ["profile"],
      breakpoints: [
        { name: "mobile", label: "Mobile", width: 390, height: 844 },
        { name: "tablet", label: "Tablet", width: 834, height: 1112 },
        { name: "desktop", label: "Desktop", width: 1440, height: 900 },
      ],
    },
  },
  // Sidebar order follows this array, grouped by each entity's `admin.group`.
  // Reads top-to-bottom in the order the page itself does: what I offer, what I
  // know, where I've been, what I shipped, what people said — then the library
  // and the account admin, which are tooling rather than content.
  collections: [
    Services,
    Skills,
    Experience,
    Education,
    CaseStudies,
    Testimonials,
    Media,
    ContactFailures,
    Users,
  ],
  globals: [Profile],
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    // MONGO_URL_DIRECT (non-SRV) wins when present, for environments where the
    // SRV DNS lookup fails; otherwise the standard SRV MONGO_URL is used.
    url:
      process.env.MONGO_URL_DIRECT ||
      process.env.MONGO_URL ||
      process.env.DATABASE_URI ||
      "",
    connectOptions: {
      dbName: process.env.MONGO_DB_NAME || "portfolio",
    },
  }),
  sharp,
  // Falls back to Payload's console transport when no key is configured, which
  // is the right behaviour for a fresh clone with an empty .env.
  ...(emailApiKey
    ? {
        email: resendAdapter({
          defaultFromAddress: from.address,
          defaultFromName: from.name,
          apiKey: emailApiKey,
        }),
      }
    : {}),
  plugins: [
    // Exposes the content as MCP resources at /api/mcp, so an MCP
    // client can read and edit the portfolio.
    //
    // Reads are open across content; writes are limited to create/update. No
    // collection grants `delete`, and `users` and `media` are omitted entirely —
    // an MCP client has no business touching credentials or binary uploads.
    // The experimental tools that rewrite collection and config *source files*
    // are left off; they are off by default and should stay that way.
    //
    // Access is gated by the API keys collection the plugin adds — no key, no
    // access. Mint one in the admin panel under MCP. Two gotchas: the endpoint
    // wants `Authorization: Bearer <key>` rather than Payload's usual
    // `<slug> API-Key <key>` header, and every permission on a key starts
    // unticked, so a fresh key lists zero tools until they are granted.
    mcpPlugin({
      collections: {
        services: {
          description: '"How I can help" service cards on the About section.',
          enabled: { find: true, create: true, update: true },
        },
        skills: {
          description: "Soft skills and tech stack entries.",
          enabled: { find: true, create: true, update: true },
        },
        experience: {
          description: "Employment history entries.",
          enabled: { find: true, create: true, update: true },
        },
        education: {
          description: "Education history entries.",
          enabled: { find: true, create: true, update: true },
        },
        "case-studies": {
          description:
            "Project case studies with STAR breakdowns. Drafts are supported.",
          enabled: { find: true, create: true, update: true },
        },
        testimonials: {
          description: "Client testimonials.",
          enabled: { find: true, create: true, update: true },
        },
      },
      globals: {
        profile: {
          description:
            "Identity, bio and contact details, including the contact links list.",
          enabled: { find: true, update: true },
        },
      },
    }),
    // Adds a Meta tab (title, description, image, preview, length meters) to
    // the documents that become their own indexable page, plus the Profile
    // global which supplies the home page's. The fields are localized along
    // with everything else, so each locale gets its own title and description.
    seoPlugin({
      collections: ["services"],
      globals: ["profile"],
      uploadsCollection: "media",
      tabbedUI: true,
      generateTitle: ({ doc }: { doc?: Record<string, unknown> }) =>
        (doc?.title as string) ?? (doc?.headline as string) ?? "",
      generateDescription: ({ doc }: { doc?: Record<string, unknown> }) =>
        (doc?.teaser as string) ??
        (doc?.description as string) ??
        (doc?.about as string)?.split("\n")[0] ??
        "",
      generateURL: ({
        doc,
        locale,
      }: {
        doc?: Record<string, unknown>;
        locale?: string;
      }) => {
        const prefix = locale && locale !== "en" ? `/${locale}` : "";
        const slug = doc?.slug as string | undefined;
        return slug
          ? `${SITE_URL}${prefix}/services/${slug}`
          : `${SITE_URL}${prefix || "/"}`;
      },
    }),
    ...(s3Enabled
      ? [
          s3Storage({
            collections: {
              media: MEDIA_PUBLIC_URL
                ? {
                    // Serve the file straight from the public bucket URL rather
                    // than streaming it through Payload. Media is already
                    // `access.read: () => true`, so nothing is being exposed
                    // that wasn't public.
                    disablePayloadAccessControl: true,
                    generateFileURL: ({
                      filename,
                      prefix,
                    }: {
                      filename: string;
                      prefix?: string;
                    }) =>
                      `${MEDIA_PUBLIC_URL}/${prefix ? `${prefix}/` : ""}${filename}`,
                  }
                : true,
            },
            bucket: process.env.S3_BUCKET as string,
            config: {
              endpoint: process.env.S3_ENDPOINT,
              // "auto" suits Cloudflare R2; set S3_REGION for providers that need it.
              region: process.env.S3_REGION || "auto",
              // Virtual-hosted style (false) fits R2 / Spaces; set true for MinIO.
              forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
              },
            },
          }),
        ]
      : []),
  ],
});
