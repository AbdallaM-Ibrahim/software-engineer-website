import type { CollectionConfig } from "payload";

// Relative import: the Payload CLI loads this through tsx, which does not
// resolve the `@/*` alias.
import { revalidateHooks } from "../lib/revalidate";

// Public-readable media. Files are stored on local disk by default (public/media).
// When S3-compatible env vars are set, the storage-s3 plugin in payload.config.ts
// transparently redirects uploads to the bucket instead — no field changes needed.
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  admin: {
    // Its own group: uploads are a library the content links to, not a section
    // of the page like Services or Experience.
    group: "Library",
  },
  hooks: revalidateHooks("media"),
  upload: {
    // Relative to the project root. Ignored when a cloud storage adapter is active.
    staticDir: "public/media",
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      label: "Alt text",
      // Alt text is prose read aloud by a screen reader, so it belongs in the
      // reader's language.
      localized: true,
    },
  ],
};
