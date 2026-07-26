/**
 * Fills the Arabic (`ar`) locale for every localized document: the Profile
 * global, the Services, the Case Studies, the Experience entries and the
 * Education entry. The English (`en`) values are untouched, and
 * `translationReviewed` is left as-is — so the /ar pages stay noindex until a
 * human ticks that flag after proofreading.
 *
 * House style, matching how Arabic technical sites (أكاديمية حسوب, إي عربي)
 * actually write:
 *   - Clear, neutral Modern Standard Arabic (العربية البيضاء) — short sentences,
 *     no classical flourishes, no dialect.
 *   - Brand and product names (Stripe, Apple Pay, Cregis, …) stay in Latin
 *     script; that is how Arabic copy writes them.
 *   - A technical term is given in Arabic with the English in parentheses on
 *     first use — "طوابير الرسائل (Message Queues)" — then Arabic alone.
 *   - Figures stay in Western digits, matching the metric strip.
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
  headline: "مهندس برمجيات أوّل",
  tagline:
    "أبني منصّات ويب قابلة للتوسّع، وحلول أتمتة للعمليات، وأنظمة دفع موثوقة تساعد الشركات على العمل بسلاسة.",
  about:
    "أنا عبد الله مصطفى، مهندس برمجيات أوّل. بدأ شغفي بالتقنية مع أول حاسوب امتلكته عام 2000، وتحوّل الفضول سريعًا إلى شغف ببناء أدوات تحلّ مشكلات حقيقية.\n\nأنقل الحماس نفسه إلى كل مشروع أعمل عليه. خلال السنوات الثلاث الماضية شاركت في تسليم أكثر من 20 مشروعًا، وكان تركيزي دائمًا على تجربة سلسة تبسّط طريقة عمل الشركة. أؤمن بأن التقنية يجب أن تعمل لصالحك لا العكس، لذلك أبني أنظمة توفّر الوقت، وتعطيك بيانات واضحة تتّخذ بها قرارك، وتترك لدى عميلك تجربة أفضل.",
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
      "أبني أنظمة دفع سريعة وموثوقة تشجّع العميل على إتمام الشراء وتُغنيك عن المتابعة اليدوية — من بوابات البطاقات إلى Apple Pay وGoogle Pay وPayPal والعملات الرقمية، مع تسوية محاسبية تُبقي دفاترك دقيقة.",
  },
  "process-automation": {
    title: "أتمتة العمليات",
    serviceType: "أتمتة العمليات التجارية",
    teaser: "أنظمة خلفية وأدوات داخلية تريح فريقك من العمل المتكرّر.",
    description:
      "أبني أنظمة خلفية وأدوات داخلية تتولّى العمل اليومي المتكرّر — الاستيراد والمزامنة والإشعارات وسير عمل الإدارة الداخلية — ليتفرّغ فريقك للنمو بدل الإدخال اليدوي.",
  },
  "web-development": {
    title: "تطوير الويب",
    serviceType: "تطوير تطبيقات الويب",
    teaser: "مواقع ومنصّات تربطك بعملائك وتفتح أبواب مبيعات جديدة.",
    description:
      "أصمّم وأبني منصّات ويب تربطك بعملائك مباشرة وتفتح أبواب مبيعات جديدة — من الموقع التعريفي إلى متجر إلكتروني أو نظام حجز متكامل، مبنيّ ليتحمّل التوسّع.",
  },
  "data-driven-insights": {
    title: "رؤى مبنيّة على البيانات",
    serviceType: "تحليل البيانات وإعداد التقارير",
    teaser: "أنظمة تعطيك البيانات التي تحتاجها لاتخاذ قرار واثق.",
    description:
      "بخلفيتي في علم البيانات، أحرص على أن يُخرج كل نظام البيانات التي تحتاجها لاتخاذ قرار واثق ومدروس — لوحات المعلومات والتقارير والبنية التي تغذّيها.",
  },
};

type CaseStudyAr = {
  title: string;
  metricLabel: string;
  situation: string;
  task: string;
  /** One line per bullet, matching the English. */
  action: string;
  result: string;
};

const CASE_STUDY_AR: Record<string, CaseStudyAr> = {
  westbazaar: {
    title: "Westbazaar (منصّة تجارة إلكترونية عالمية)",
    metricLabel: "استيراد منتجات / يوم",
    situation:
      "Westbazaar منصّة تجارة إلكترونية تشحن منتجاتها إلى العالم كله، لكن نموّها كان مقيّدًا بشيفرة قديمة وواجهة استخدام جامدة. توسّع المخزون كان محصورًا: سقف الكتالوج 70,000 منتج، وطاقة الاستيراد 200 منتج جديد في اليوم فقط.",
    task: "لإطلاق طاقة المنصّة، كان عليّ تحديث النظام ليعمل على نطاق أكبر بكثير: رفع طاقة الاستيراد اليومية، وإعادة بناء واجهة وتجربة المستخدم لرحلة شراء سلسة، وإضافة الدفع بالعملات الرقمية لخدمة العملاء حول العالم.",
    action: [
      "توسيع البنية: أعدت بناء مسار استيراد البيانات باستخدام طوابير الرسائل (Message Queues) وعُمّال خوادم ديناميكيين، فصار النظام يعالج البيانات بشكل غير متزامن.",
      "تحسين تدفّق البيانات: أعدت هندسة التعامل مع حدود معدّل الطلبات في واجهات الطرف الثالث (API Rate Limits)، فزادت كفاءة سحب البيانات دون الاصطدام بالحظر المؤقّت.",
      "تحديث التجربة: قدت الانتقال من واجهة ثقيلة إلى واجهة وتجربة استخدام حديثة تزيل العوائق من طريق الشراء.",
      "توسيع خيارات الدفع: دمجت Cregis في مسار إتمام الشراء لتفعيل الدفع بالعملات الرقمية بأمان وسلاسة.",
    ].join("\n"),
    result: [
      "قفز استيراد المنتجات من 200 إلى 13,000 منتج في اليوم.",
      "اتّسع الكتالوج النشط إلى أكثر من 400,000 منتج.",
      "تضاعف تحويل العملاء، بزيادة 100% في الطلبات الشهرية.",
    ].join("\n"),
  },
  jobsolv: {
    title: "JobSolv (منصّة توظيف ذكية)",
    metricLabel: "زمن دورة التوظيف",
    situation:
      "كان سير عمل التوظيف في JobSolv مُعطَّلًا بفرز يدوي بطيء: يقضي أخصائيو التوظيف ساعات طويلة في مراجعة آلاف الطلبات بأنفسهم. وخلّف هذا العبء الإداري نتائج ثقيلة — تسرّب كبير للمرشّحين، وارتفاع في نسبة الانقطاع، وفرص تعيين ضائعة.",
    task: "كان الهدف بناء منصّة واحدة مؤتمتة تتولّى العبء الأكبر من الفرز، فتُنهي الاختناق اليدوي وتطابق بسرعة ودقّة بين المرشّحين المتميّزين والوظائف عالية الأجر.",
    action: [
      "محلّل مدعوم بتعلّم الآلة (Machine Learning): طوّرت محلّلًا لتتبّع المتقدّمين يستخرج المهارات والخبرات الأساسية من السير الذاتية تلقائيًا.",
      "تقييم فوري: بنيت محرّك تقييم في الواجهة الخلفية يمنح كل مرشّح درجة أمام متطلّبات الوظيفة لحظة تقديمه.",
      "تبسيط عمل أخصائي التوظيف: صمّمت النظام ليُبرز أفضل المتقدّمين فورًا، مع إظهار نقاط التطابق بين ملف المرشّح ومتطلّبات الوظيفة، ليُتّخذ القرار في ثوانٍ وعن دراية.",
    ].join("\n"),
    result: [
      "انخفض زمن دورة التوظيف الكاملة بنسبة 60%.",
      "ارتفعت دقّة الترشيحات، وتحسّنت جودة المطابقة بنسبة 45%.",
      "توفّرت آلاف الساعات من المراجعة اليدوية، فارتفعت إنتاجية فريق التوظيف بنسبة 80%.",
    ].join("\n"),
  },
  easygo: {
    title: "EasyGo Holiday Homes (منصّة تأجير عقارات)",
    metricLabel: "زيادة في الحجوزات",
    situation:
      "EasyGo Holiday Homes شركة تأجير عقارات كانت تستعدّ لإطلاق خدماتها في دبي. الموقع كان يعمل، لكن التجربة بدت قديمة وبطيئة: الدفع مقصور على البطاقات الائتمانية، وإدارة حسابات العملاء تجري عبر سلاسل بريد إلكتروني مرهقة، وهو ما أضاف عناءً بلا داعٍ.",
    task: "كان هدفي تحديث المنصّة بالكامل وتبسيطها، وتصميم رحلة مستخدم متكاملة: من تصفّح العقارات، إلى اختيار الخدمة، إلى دفع آمن، ثم متابعة الحجوزات السابقة والقادمة في مكان واحد.",
    action: [
      "تصفّح عبر خريطة تفاعلية: صمّمت مسارًا يعتمد على الخريطة ليستكشف العميل عقارات دبي بصريًا ويختار منها.",
      "بوابات دفع مرنة: أعدت بناء مسار إتمام الشراء بخيارات حديثة — Apple Pay وGoogle Pay وPayPal وروابط الدفع — فصار الحجز أسهل على المسافرين من خارج الدولة.",
      "لوحة حساب المستخدم: بنيت قسمًا متكاملًا يدير فيه العميل حجوزاته السابقة والقادمة ويراجعها بسهولة.",
      "محتوى يجذب الزوّار: أضفت قسم «مقالات» عن دبي ومعالمها، لجذب المستخدمين وترسيخ حضور العلامة.",
    ].join("\n"),
    result: [
      "ارتفعت حجوزات المستخدمين بنسبة 80% بعد إزالة العوائق من مسار الحجز.",
      "حسّن قسم المقالات ظهور المنصّة في محرّكات البحث (SEO)، فزادت الزيارات المجانية.",
      "ومع التجربة الأسلس، زادت التقييمات الإيجابية من العملاء بنسبة 20%.",
    ].join("\n"),
  },
};

// Keyed by the English job title; company names are proper nouns and shared.
const EXPERIENCE_AR: Record<string, { title: string; description: string }> = {
  "Software Engineer": {
    title: "مهندس برمجيات",
    description: [
      "تطوير برمجيات قابلة للتوسّع وسهلة الصيانة في مجالات أعمال مختلفة",
      "تحمّل المسؤولية الكاملة عن الميزات وعن تطبيقات بأكملها",
      "التعاون مع أصحاب المصلحة في تخطيط المراحل",
      "عمل جماعي متعاون وبيئة فريق صحّية",
      "وضع التصميم المعماري المناسب وتتبّع نقاط الاختناق",
    ].join("\n"),
  },
  "Backend Developer": {
    title: "مطوّر أنظمة خلفية",
    description: [
      "بناء واجهات REST البرمجية ودمج خدمات خارجية متنوّعة",
      "منها: Stripe وPaymob وTypesense وS3 Buckets وCloudflare R2 وDigitalOcean Spaces",
      "وGoogle Maps API وAWS Lambda وMailgun وMailSend وTwilio وOpenAI (ChatGPT)",
      "العمل ضمن فريق في الواجهة الأمامية وDevOps والأتمتة واختبار الجودة",
      "بناء حلول نظيفة قابلة للتوسّع",
    ].join("\n"),
  },
};

// Display labels for the Skills, keyed by the canonical (unique, unlocalized)
// name. Brand and product names — Stripe, Paymob, AWS Lambda — are deliberately
// absent: they are written in Latin script in Arabic copy, and an empty label
// falls back to the name. Only the soft skills and the generic technical terms
// get an Arabic label.
const SKILL_LABEL_AR: Record<string, string> = {
  "Clear Communication": "تواصل واضح",
  "Feature Customization": "تخصيص الميزات",
  "Problem Solving": "حل المشكلات",
  "Process Automation": "أتمتة العمليات",
  "Machine Learning": "تعلّم الآلة",
  "Message Queues": "طوابير الرسائل",
  "REST APIs": "واجهات REST البرمجية",
};

// Alt text is localized too — it is what a screen reader reads out on /ar.
// Keyed by filename; the product name inside stays Latin.
const MEDIA_ALT_AR: Record<string, string> = {
  "abdalla-mostafa.jpg": "عبد الله مصطفى",
  "westbazaar.jpg": "الصفحة الرئيسية لمنصّة Westbazaar",
  "jobsolv.jpg": "الصفحة الرئيسية لمنصّة JobSolv",
  "easygo.jpg": "الصفحة الرئيسية لموقع EasyGo Holiday Homes",
};

// Keyed by the English degree. The university publishes its own Arabic name,
// so the institution is translated, not transliterated.
const EDUCATION_AR: Record<string, { degree: string; institution: string }> = {
  "Bachelor in Computing and Data Science": {
    degree: "بكالوريوس في الحوسبة وعلوم البيانات",
    institution: "كلية الحاسبات وعلوم البيانات، جامعة الإسكندرية",
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

  const caseStudies = await payload.find({
    collection: "case-studies",
    locale: "en",
    depth: 0,
    limit: 100,
  });

  for (const study of caseStudies.docs) {
    const ar = study.slug ? CASE_STUDY_AR[study.slug] : undefined;
    if (!ar) {
      payload.logger.warn(`No Arabic for case study "${study.slug}" — skipped`);
      continue;
    }
    await payload.update({
      collection: "case-studies",
      id: study.id,
      locale: "ar",
      data: {
        title: ar.title,
        // The metric group carries non-localized siblings; send them back with
        // the translated label so a partial group write can't drop the figures.
        metric: { ...study.metric, label: ar.metricLabel },
        star: {
          situation: ar.situation,
          task: ar.task,
          action: ar.action,
          result: ar.result,
        },
        _status: "published",
      },
    });
    payload.logger.info(`Case study "${study.slug}": Arabic locale written`);
  }

  const experience = await payload.find({
    collection: "experience",
    locale: "en",
    depth: 0,
    limit: 100,
  });

  for (const role of experience.docs) {
    const ar = EXPERIENCE_AR[role.title];
    if (!ar) {
      payload.logger.warn(`No Arabic for role "${role.title}" — skipped`);
      continue;
    }
    await payload.update({
      collection: "experience",
      id: role.id,
      locale: "ar",
      data: ar,
    });
    payload.logger.info(`Experience "${role.title}": Arabic locale written`);
  }

  const education = await payload.find({
    collection: "education",
    locale: "en",
    depth: 0,
    limit: 100,
  });

  for (const entry of education.docs) {
    const ar = EDUCATION_AR[entry.degree];
    if (!ar) {
      payload.logger.warn(`No Arabic for degree "${entry.degree}" — skipped`);
      continue;
    }
    await payload.update({
      collection: "education",
      id: entry.id,
      locale: "ar",
      data: ar,
    });
    payload.logger.info(`Education "${entry.degree}": Arabic locale written`);
  }

  const skills = await payload.find({
    collection: "skills",
    locale: "en",
    depth: 0,
    limit: 200,
  });

  for (const skill of skills.docs) {
    const label = SKILL_LABEL_AR[skill.name];
    if (!label) continue; // brand name — shown in Latin in both locales
    await payload.update({
      collection: "skills",
      id: skill.id,
      locale: "ar",
      data: { label },
    });
    payload.logger.info(`Skill "${skill.name}": Arabic label written`);
  }

  const media = await payload.find({
    collection: "media",
    locale: "en",
    depth: 0,
    limit: 200,
  });

  for (const file of media.docs) {
    const alt = file.filename ? MEDIA_ALT_AR[file.filename] : undefined;
    if (!alt) {
      payload.logger.warn(`No Arabic alt for "${file.filename}" — skipped`);
      continue;
    }
    await payload.update({
      collection: "media",
      id: file.id,
      locale: "ar",
      data: { alt },
    });
    payload.logger.info(`Media "${file.filename}": Arabic alt written`);
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
