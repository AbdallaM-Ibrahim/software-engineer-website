/**
 * Uploads the GitHub profile avatar into the Media collection (→ R2) and sets
 * it as the Profile hero photo. One-off, but idempotent: an existing upload of
 * the same filename is reused, and re-running just re-points heroImage at it.
 *
 *   pnpm tsx --env-file=.env scripts/upload-hero-image.ts
 */
import { getPayload } from "payload";
import config from "@payload-config";

// GitHub serves any user's avatar at github.com/<login>.png; ?size scales it.
const AVATAR_URL = "https://github.com/abdallam-ibrahim.png?size=800";
const FILENAME = "abdalla-mostafa.jpg";
const ALT = "Abdalla Mostafa";

const run = async () => {
  const payload = await getPayload({ config });

  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: FILENAME } },
    limit: 1,
    depth: 0,
  });

  let mediaId = existing.docs[0]?.id;

  if (mediaId) {
    payload.logger.info(`Avatar already uploaded (${mediaId}) — reusing`);
  } else {
    const res = await fetch(AVATAR_URL);
    if (!res.ok) throw new Error(`avatar fetch failed: ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const created = await payload.create({
      collection: "media",
      data: { alt: ALT },
      file: {
        data: buffer,
        mimetype: "image/jpeg",
        name: FILENAME,
        size: buffer.length,
      },
    });
    mediaId = created.id;
    payload.logger.info(`Uploaded avatar → media ${mediaId} (${created.url})`);
  }

  await payload.updateGlobal({
    slug: "profile",
    data: { heroImage: mediaId },
  });
  payload.logger.info("Profile.heroImage set");
  payload.logger.info("✅ Hero image ready");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
