import type { Dictionary } from "./types";

// Arabic in a clear, neutral register (العربية البيضاء): plain Modern Standard
// Arabic that reads naturally to any Arabic speaker — no dialect, no heavy
// classical constructions. Kept professional and concise to match the English.
export const ar: Dictionary = {
  nav: {
    home: "الرئيسية",
    about: "نبذة",
    skills: "المهارات",
    experience: "الخبرة",
    education: "التعليم",
    work: "الأعمال",
    testimonials: "آراء العملاء",
    contact: "تواصل",
    services: "الخدمات",
    openMenu: "فتح القائمة",
    backToTop: "العودة إلى الأعلى",
    primary: "التنقل الرئيسي",
    skipToContent: "تخطَّ إلى المحتوى",
    toggleTheme: "تبديل المظهر",
    breadcrumb: "مسار التنقل",
  },
  hero: {
    viewWork: "استعرض أعمالي",
    getInTouch: "تواصل معي",
    // Brand names stay in Latin script, the way Arabic copy writes them.
    linkedin: "LinkedIn",
    github: "GitHub",
  },
  about: {
    eyebrow: "نبذة",
    title: "أحوّل العمليات المعقّدة إلى مسارات عمل بسيطة",
    count: (n) => (n === 1 ? "خدمة واحدة" : n === 2 ? "خدمتان" : `${n} خدمات`),
  },
  skills: {
    eyebrow: "المهارات",
    title: "ما الذي أقدّمه",
    description:
      "خبرة هندسية عميقة، وعادات عمل تُبقي المشاريع على المسار الصحيح.",
    count: (n) => (n === 1 ? "أداة واحدة" : n === 2 ? "أداتان" : `${n} أدوات`),
    howIWork: "طريقة عملي",
    techStack: "التقنيات",
  },
  experience: {
    eyebrow: "الخبرة",
    title: "مسيرتي المهنية",
    count: (n) =>
      n === 1 ? "وظيفة واحدة" : n === 2 ? "وظيفتان" : `${n} وظائف`,
  },
  education: {
    eyebrow: "التعليم",
    title: "المؤهّلات الأكاديمية",
    count: (n) =>
      n === 1 ? "شهادة واحدة" : n === 2 ? "شهادتان" : `${n} شهادات`,
  },
  whereIWork: {
    eyebrow: "التوافر",
    title: "أين أعمل",
    regions: "المناطق",
    hours: "ساعات العمل",
    openTo: "متاح لـ",
    languages: "اللغات",
    engagement: {
      "full-time": "دوام كامل",
      contract: "عمل تعاقدي",
      project: "حسب المشروع",
      consultation: "استشارات",
    },
    proficiency: {
      native: "لغة أم",
      professional: "مستوى احترافي",
      conversational: "مستوى محادثة",
    },
  },
  work: {
    eyebrow: "الأعمال",
    title: "مختارات من دراسات الحالة",
    description:
      "مشاريع حقيقية والأرقام التي حرّكتها. افتح أي بطاقة للاطّلاع على التفاصيل.",
    count: (n) =>
      n === 1
        ? "دراسة حالة واحدة"
        : n === 2
          ? "دراستا حالة"
          : `${n} دراسات حالة`,
    openCaseStudy: "دراسة الحالة",
    visit: "زيارة الموقع",
    star: {
      result: "النتيجة",
      situation: "السياق",
      task: "المهمة",
      action: "الإجراءات",
    },
  },
  testimonials: {
    eyebrow: "آراء العملاء",
    title: "ماذا يقول العملاء",
    count: (n) => (n === 1 ? "رأي واحد" : n === 2 ? "رأيان" : `${n} آراء`),
  },
  services: {
    eyebrow: "الخدمات",
    title: "كيف أساعد عملك",
    description: "أربع طرق أعمل بها مع الفرق، كلٌّ منها مدعومة بمشاريع أنجزتها.",
    count: (n) => (n === 1 ? "خدمة واحدة" : n === 2 ? "خدمتان" : `${n} خدمات`),
    readMore: "اقرأ المزيد",
    faqTitle: "أسئلة شائعة",
    relatedTitle: "أعمال ذات صلة",
    ctaTitle: "لنبدأ الحديث",
    ctaDescription: "أخبرني بما تريد بناءه. رسالة قصيرة تكفي للبداية.",
    ctaWhatsapp: "راسلني على واتساب",
    ctaEmail: "أرسل بريدًا إلكترونيًا",
    breadcrumbHome: "الرئيسية",
    onThisPage: "في هذه الصفحة",
  },
  contact: {
    eyebrow: "تواصل",
    title: "لنبنِ شيئًا معًا",
    description:
      "لديك مشروع أو فكرة؟ راسلني مباشرة، أو أرسل رسالة عبر النموذج أدناه.",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    whatsapp: "واتساب",
    startChat: "ابدأ محادثة",
  },
  form: {
    name: "الاسم",
    namePlaceholder: "محمد أحمد",
    email: "البريد الإلكتروني",
    emailPlaceholder: "name@company.com",
    message: "الرسالة",
    messagePlaceholder: "حدّثني عن مشروعك…",
    inquiryType: "ما موضوع رسالتك؟",
    inquiryTypes: {
      project: "استفسار عن مشروع",
      consultation: "مكالمة استشارية",
      job: "فرصة عمل",
      other: "موضوع آخر",
    },
    service: "الخدمة",
    servicePlaceholder: "اختر خدمة",
    phone: "الهاتف / واتساب",
    phonePlaceholder: "+20 112 846 8458",
    preferredChannel: "قناة التواصل المفضّلة",
    channels: {
      email: "البريد الإلكتروني",
      whatsapp: "واتساب",
      phone: "الهاتف",
    },
    optional: "اختياري",
    submit: "إرسال الرسالة",
    sending: "جارٍ الإرسال…",
    successTitle: "تم إرسال رسالتك.",
    successBody: "شكرًا لتواصلك — سأرد عليك قريبًا.",
    genericError: "حدث خطأ ما. يُرجى المحاولة مرة أخرى.",
  },
  footer: {
    copyright: (year, name) => `© ${year} ${name}`,
  },
  common: {
    present: "حتى الآن",
    switchLanguage: "English",
  },
};
