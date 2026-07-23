/**
 * Migrates the case-study screenshots from public/case-studies/ into the Media
 * collection, which — with S3/R2 configured — stores them in the bucket and
 * serves them from the public CDN URL.
 *
 * The screenshots stay in public/ as the render-time fallback (see
 * case-study-card.tsx), so this is additive: it makes the bucket the primary
 * source without removing the safety net.
 *
 * Idempotent: a screenshot already uploaded (matched by filename) is reused
 * rather than duplicated, so re-running only fills gaps.
 *
 *   pnpm tsx --env-file=.env scripts/migrate-media.ts
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { getPayload } from "payload";
import config from "@payload-config";

// slug in public/case-studies/<slug>.jpg → the case study slug it belongs to.
// They match today, but keeping the map explicit means a screenshot rename
// can't silently detach it from its case study.
const SCREENSHOTS: { file: string; caseStudySlug: string }[] = [
  { file: "westbazaar.jpg", caseStudySlug: "westbazaar" },
  { file: "jobsolv.jpg", caseStudySlug: "jobsolv" },
  { file: "easygo.jpg", caseStudySlug: "easygo" },
];

const migrate = async () => {
  const payload = await getPayload({ config });

  for (const { file, caseStudySlug } of SCREENSHOTS) {
    // Resolve the case study first — no point uploading an orphan image.
    const found = await payload.find({
      collection: "case-studies",
      where: { slug: { equals: caseStudySlug } },
      limit: 1,
      depth: 0,
    });
    const study = found.docs[0];
    if (!study) {
      payload.logger.warn(
        `No case study with slug "${caseStudySlug}" — skipping ${file}`,
      );
      continue;
    }

    const name = study.shortName || study.title;
    const alt = `${name} home page`;

    // Reuse an existing upload rather than creating a duplicate on re-run.
    const existing = await payload.find({
      collection: "media",
      where: { filename: { equals: file } },
      limit: 1,
      depth: 0,
    });

    let mediaId = existing.docs[0]?.id;

    if (mediaId) {
      payload.logger.info(
        `Media ${file} already uploaded (${mediaId}) — reusing`,
      );
    } else {
      const buffer = readFileSync(
        join(process.cwd(), "public", "case-studies", file),
      );
      const created = await payload.create({
        collection: "media",
        data: { alt },
        file: {
          data: buffer,
          mimetype: "image/jpeg",
          name: file,
          size: buffer.length,
        },
      });
      mediaId = created.id;
      payload.logger.info(
        `Uploaded ${file} → media ${mediaId} (${created.url})`,
      );
    }

    // Attach as the thumbnail. `_status: published` keeps the live version live
    // — case studies have drafts enabled, so a bare update could strand this on
    // a draft that never reaches the page.
    await payload.update({
      collection: "case-studies",
      id: study.id,
      data: { thumbnail: mediaId, _status: "published" },
    });
    payload.logger.info(`Attached ${file} to case study "${caseStudySlug}"`);
  }

  payload.logger.info("✅ Media migration complete");
  process.exit(0);
};

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
