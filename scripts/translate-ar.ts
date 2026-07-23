/**
 * Fills the Arabic (`ar`) locale for the Profile global and the Services with
 * clear, neutral Modern Standard Arabic (العربية البيضاء). The English (`en`)
 * values are untouched, and `translationReviewed` is left as-is — so the /ar
 * pages stay noindex until a human ticks that flag after proofreading.
 *
 * Brand and product names (Stripe, Apple Pay, …) stay in Latin script on
 * purpose — that is how they are written in Arabic copy too.
 *
 *   pnpm tsx --env-file=.env scripts/translate-ar.ts
 *
 * Idempotent: re-running just overwrites the ar values.
 */
import { getPayload } from "payload";
import config from "@payload-config";

// Region and language rows are matched to their Arabic by the English name, so
// a reordering in the admin can't misalign the translation.
const REGION_AR: Record<string, { name: string; note?: string }> = {
  Egypt: { name: "مصر", note: "مقرّي الإسكندرية" },
  "United Arab Emirates": { name: "الإمارات العربية المتحدة" },
  "Saudi Arabia": { name: "المملكة العربية السعودية" },
  "United States": { name: "الولايات المتحدة", note: "عن بُعد" },
  Europe: { name: "أوروبا", note: "عن بُعد" },
};

const LANGUAGE_AR: Record<string, string> = {
  Arabic: "العربية",
  English: "الإنجليزية",
};

const PROFILE_AR = {
  headline: "مهندس برمجيات أول",
  tagline:
    "أبني منصّات ويب قابلة للتوسّع، وحلول أتمتة للعمليات، وأنظمة دفع موثوقة تساعد الشركات على العمل بسلاسة.",
  about:
    "أنا عبد الله مصطفى، مهندس برمجيات أول. شغفتُ بالتقنية منذ حصلت على أول حاسوب لي عام 2000، وسرعان ما تحوّل هذا الفضول البسيط إلى شغفٍ ببناء أدوات مخصّصة وفعّالة تحلّ مشكلات واقعية.\n\nأنقل اليوم الحماس نفسه إلى كل مشروع أتولّاه. على مدى السنوات الثلاث الماضية، ساهمتُ في تسليم أكثر من 20 مشروعًا، مع التركيز على تجارب سلسة تبسّط طريقة عمل الشركات. أؤمن بأن التقنية يجب أن تعمل لصالحك لا العكس، وهدفي دائمًا بناء أنظمة توفّر الوقت، وتقدّم بيانات واضحة لاتخاذ قرارات أفضل، وتخلق تجربة أسلس لعملائك.",
  availabilityIntro:
    "أعمل مع فرق في الشرق الأوسط، وعن بُعد مع الولايات المتحدة وأوروبا.",
  overlapHours:
    "تداخل كامل مع توقيت الخليج، ونحو 4 ساعات مع شرق الولايات المتحدة.",
};

const SERVICE_AR: Record<
  string,
  { title: string; serviceType: string; teaser: string; description: string }
> = {
  "payment-integration": {
    title: "تكامل المدفوعات",
    serviceType: "دمج بوابات الدفع",
    teaser: "دفع سريع وموثوق — Stripe وPaymob وApple Pay وGoogle Pay وPayPal.",
    description:
      "أبني أنظمة دفع سريعة وموثوقة تشجّع العملاء على الشراء وتُغني عن التتبّع اليدوي — من بوابات البطاقات إلى Apple Pay وGoogle Pay وPayPal والعملات الرقمية، مع تسويةٍ محاسبية تحافظ على دقّة الدفاتر.",
  },
  "process-automation": {
    title: "أتمتة العمليات",
    serviceType: "أتمتة العمليات التجارية",
    teaser: "حلول خادمية وأدوات داخلية تخفّف عن فريقك الأعمال المتكرّرة.",
    description:
      "أُعِدّ حلولًا خادمية وأدوات داخلية تتولّى الأعمال اليومية المتكرّرة — من الاستيراد والمزامنة إلى الإشعارات وسير عمل المكتب الخلفي — لِيُركّز فريقك على النمو بدل العمل اليدوي.",
  },
  "web-development": {
    title: "تطوير الويب",
    serviceType: "تطوير تطبيقات الويب",
    teaser: "مواقع ومنصّات تربطك بعملائك وتفتح أبواب مبيعات جديدة.",
    description:
      "أصمّم وأبني منصّات ويب تربطك مباشرةً بعملائك وتفتح أبواب مبيعات جديدة — من المواقع التعريفية إلى منصّات التجارة الإلكترونية وأنظمة الحجز الكاملة، مبنيّة للتوسّع.",
  },
  "data-driven-insights": {
    title: "رؤى معتمدة على البيانات",
    serviceType: "تحليل البيانات وإعداد التقارير",
    teaser: "أنظمة تنتج البيانات التي تحتاجها لاتخاذ قرارات واثقة.",
    description:
      "بخلفيتي في علم البيانات، أحرص على أن يُنتج كل نظام البيانات التي تحتاجها لاتخاذ قرارات واثقة ومدروسة — لوحات معلومات وتقارير والبُنى التي تغذّيها.",
  },
};

const run = async () => {
  const payload = await getPayload({ config });

  // Read the English profile to reuse the array row ids and non-localized
  // fields — a localized field inside a non-localized array is updated per row,
  // so the ids have to come along or Payload treats them as new rows.
  const en = await payload.findGlobal({
    slug: "profile",
    locale: "en",
    depth: 0,
  });

  const regions = (en.availability?.regions ?? []).map((r) => ({
    id: r.id,
    code: r.code,
    name: REGION_AR[r.name ?? ""]?.name ?? r.name,
    note: REGION_AR[r.name ?? ""]?.note ?? undefined,
  }));

  const languages = (en.availability?.languages ?? []).map((l) => ({
    id: l.id,
    code: l.code,
    proficiency: l.proficiency,
    name: LANGUAGE_AR[l.name ?? ""] ?? l.name,
  }));

  await payload.updateGlobal({
    slug: "profile",
    locale: "ar",
    data: {
      headline: PROFILE_AR.headline,
      tagline: PROFILE_AR.tagline,
      about: PROFILE_AR.about,
      availability: {
        intro: PROFILE_AR.availabilityIntro,
        overlapHours: PROFILE_AR.overlapHours,
        regions,
        languages,
      },
    },
  });
  payload.logger.info("Profile: Arabic locale written");

  const services = await payload.find({
    collection: "services",
    locale: "en",
    depth: 0,
    limit: 100,
  });

  for (const service of services.docs) {
    const ar = service.slug ? SERVICE_AR[service.slug] : undefined;
    if (!ar) {
      payload.logger.warn(`No Arabic for service "${service.slug}" — skipped`);
      continue;
    }
    await payload.update({
      collection: "services",
      id: service.id,
      locale: "ar",
      // Keep the live version published — a drafts-enabled collection would
      // otherwise strand the Arabic edit on a draft the public page never reads.
      data: { ...ar, _status: "published" },
    });
    payload.logger.info(`Service "${service.slug}": Arabic locale written`);
  }

  payload.logger.info(
    "✅ Arabic content complete (still noindex until reviewed)",
  );
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
