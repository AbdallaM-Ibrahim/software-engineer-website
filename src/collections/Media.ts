import type { CollectionConfig } from "payload";

// Public-readable media. Files are stored on local disk by default (public/media).
// When S3-compatible env vars are set, the storage-s3 plugin in payload.config.ts
// transparently redirects uploads to the bucket instead — no field changes needed.
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  admin: {
    group: "Content",
  },
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
    },
  ],
};
