import { getPayloadClient } from "@/lib/payload";

// Server-side data access for the portfolio frontend. Each helper reads through
// the Payload Local API (no HTTP round-trip) and tolerates an unseeded /
// unreachable DB — `getPayloadClient()` itself throws when Mongo is down, so it
// has to sit inside the try, otherwise the page 500s instead of rendering the
// EmptyState it has for exactly this case.

export async function getProfile() {
  try {
    const payload = await getPayloadClient();
    return await payload.findGlobal({ slug: "profile", depth: 1 });
  } catch {
    return null;
  }
}

export async function getServices() {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "services",
      sort: "order",
      limit: 100,
      depth: 0,
    });
    return res.docs;
  } catch {
    return [];
  }
}

export async function getSkills() {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "skills",
      // Category first so the two blocks come back already partitioned; `order`
      // then controls the sequence within each.
      sort: ["category", "order"],
      limit: 200,
      depth: 0,
    });
    return res.docs;
  } catch {
    return [];
  }
}

export async function getExperience() {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "experience",
      sort: "order",
      limit: 100,
      depth: 0,
    });
    return res.docs;
  } catch {
    return [];
  }
}

export async function getEducation() {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "education",
      sort: "order",
      limit: 100,
      depth: 0,
    });
    return res.docs;
  } catch {
    return [];
  }
}

export async function getCaseStudies() {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "case-studies",
      sort: "order",
      limit: 100,
      depth: 1,
      // Published only. The Local API runs with full access unless told
      // otherwise, so overrideAccess:false is what makes the collection's
      // draft filter actually apply here.
      draft: false,
      overrideAccess: false,
    });
    return res.docs;
  } catch {
    return [];
  }
}

export async function getTestimonials() {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "testimonials",
      sort: "order",
      limit: 100,
      depth: 0,
    });
    return res.docs;
  } catch {
    return [];
  }
}
