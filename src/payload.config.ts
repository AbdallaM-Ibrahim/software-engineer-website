import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { resendAdapter } from "@payloadcms/email-resend";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";
// NOTE: No rich-text fields are used, so no editor is configured. This keeps
// @lexical out of the module graph (it has a circular-import bug under some
// runtimes). Add `@payloadcms/richtext-lexical`'s lexicalEditor() here if a
// richText field is ever introduced.

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Experience } from "./collections/Experience";
import { Education } from "./collections/Education";
import { CaseStudies } from "./collections/CaseStudies";
import { Testimonials } from "./collections/Testimonials";
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

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Experience, Education, CaseStudies, Testimonials],
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
    ...(s3Enabled
      ? [
          s3Storage({
            collections: { media: true },
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
