import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
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
