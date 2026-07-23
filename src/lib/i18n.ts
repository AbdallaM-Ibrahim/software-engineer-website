import type { Locale } from "@/lib/site";

/**
 * UI strings.
 *
 * These are chrome — labels, headings, button text — not content. Content lives
 * in Payload and is translated there; putting these in the CMS too would mean
 * editing a database row to rename a button.
 *
 * Counts are functions rather than templates because Arabic does not pluralise
 * the way English does: it has singular, dual and plural forms, and "3 case
 * studies" is not a substitution away from "1 case study".
 *
 * The Arabic is written in a clear, neutral register (العربية البيضاء) — plain
 * Modern Standard Arabic, no dialect or heavy classical phrasing. Give it a
 * native proofread before ticking `translationReviewed`, which is what lifts the
 * /ar pages out of noindex.
 */
export type Dictionary = {
  nav: {
    home: string;
    about: string;
    skills: string;
    experience: string;
    education: string;
    work: string;
    testimonials: string;
    contact: string;
    services: string;
    openMenu: string;
    backToTop: string;
  };
  hero: {
    viewWork: string;
    getInTouch: string;
    whatsapp: string;
    linkedin: string;
  };
  about: {
    eyebrow: string;
    title: string;
    count: (n: number) => string;
  };
  skills: {
    eyebrow: string;
    title: string;
    description: string;
    count: (n: number) => string;
    howIWork: string;
    techStack: string;
  };
  experience: {
    eyebrow: string;
    title: string;
    count: (n: number) => string;
  };
  education: {
    eyebrow: string;
    title: string;
    count: (n: number) => string;
  };
  whereIWork: {
    eyebrow: string;
    title: string;
    regions: string;
    hours: string;
    openTo: string;
    languages: string;
    engagement: Record<
      "full-time" | "contract" | "project" | "consultation",
      string
    >;
    proficiency: Record<"native" | "professional" | "conversational", string>;
  };
  work: {
    eyebrow: string;
    title: string;
    description: string;
    count: (n: number) => string;
    openCaseStudy: string;
    visit: string;
    star: {
      result: string;
      situation: string;
      task: string;
      action: string;
    };
  };
  testimonials: {
    eyebrow: string;
    title: string;
    count: (n: number) => string;
  };
  services: {
    eyebrow: string;
    title: string;
    description: string;
    count: (n: number) => string;
    readMore: string;
    faqTitle: string;
    relatedTitle: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaWhatsapp: string;
    ctaEmail: string;
    breadcrumbHome: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    email: string;
    phone: string;
    whatsapp: string;
    startChat: string;
  };
  form: {
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    inquiryType: string;
    inquiryTypes: Record<"project" | "consultation" | "job" | "other", string>;
    service: string;
    servicePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    preferredChannel: string;
    channels: Record<"email" | "whatsapp" | "phone", string>;
    optional: string;
    submit: string;
    sending: string;
    successTitle: string;
    successBody: string;
    genericError: string;
  };
  footer: {
    copyright: (year: number, name: string) => string;
  };
  common: {
    present: string;
    switchLanguage: string;
  };
};

const en: Dictionary = {
  nav: {
    home: "Home",
    about: "About",
    skills: "Skills",
    experience: "Experience",
    education: "Education",
    work: "Work",
    testimonials: "Testimonials",
    contact: "Contact",
    services: "Services",
    openMenu: "Open menu",
    backToTop: "Back to top",
  },
  hero: {
    viewWork: "View my work",
    getInTouch: "Get in touch",
    whatsapp: "Chat on WhatsApp",
    linkedin: "LinkedIn",
  },
  about: {
    eyebrow: "About",
    title: "Turning complex operations into simple workflows",
    count: (n) => `${n} ${n === 1 ? "service" : "services"}`,
  },
  skills: {
    eyebrow: "Skills",
    title: "What I bring to the table",
    description:
      "Engineering depth, and the working habits that keep projects on track.",
    count: (n) => `${n} ${n === 1 ? "tool" : "tools"}`,
    howIWork: "How I work",
    techStack: "Tech stack",
  },
  experience: {
    eyebrow: "Experience",
    title: "Where I've worked",
    count: (n) => `${n} ${n === 1 ? "role" : "roles"}`,
  },
  education: {
    eyebrow: "Education",
    title: "Academic background",
    count: (n) => `${n} ${n === 1 ? "degree" : "degrees"}`,
  },
  whereIWork: {
    eyebrow: "Availability",
    title: "Where I work",
    regions: "Regions",
    hours: "Hours",
    openTo: "Open to",
    languages: "Languages",
    engagement: {
      "full-time": "Full-time",
      contract: "Contract",
      project: "Project-based",
      consultation: "Consultation",
    },
    proficiency: {
      native: "Native",
      professional: "Professional",
      conversational: "Conversational",
    },
  },
  work: {
    eyebrow: "Work",
    title: "Selected case studies",
    description:
      "Real projects and the numbers they moved. Open any card for the full breakdown.",
    count: (n) => `${n} case ${n === 1 ? "study" : "studies"}`,
    openCaseStudy: "Case study",
    visit: "Visit",
    star: {
      result: "Result",
      situation: "Situation",
      task: "Task",
      action: "Action",
    },
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "What clients say",
    count: (n) => `${n} ${n === 1 ? "quote" : "quotes"}`,
  },
  services: {
    eyebrow: "Services",
    title: "How I can help your business",
    description:
      "Four ways I work with teams — each backed by projects that shipped.",
    count: (n) => `${n} ${n === 1 ? "service" : "services"}`,
    readMore: "Read more",
    faqTitle: "Common questions",
    relatedTitle: "Proof",
    ctaTitle: "Start a conversation",
    ctaDescription:
      "Tell me what you're building. A short message is enough to start.",
    ctaWhatsapp: "Message on WhatsApp",
    ctaEmail: "Send an email",
    breadcrumbHome: "Home",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's build something together",
    description:
      "Have a project or an idea? Email me directly, or send a message below.",
    email: "Email",
    phone: "Phone",
    whatsapp: "WhatsApp",
    startChat: "Start a chat",
  },
  form: {
    name: "Name",
    namePlaceholder: "Jane Doe",
    email: "Email",
    emailPlaceholder: "jane@company.com",
    message: "Message",
    messagePlaceholder: "Tell me about your project…",
    inquiryType: "What is this about?",
    inquiryTypes: {
      project: "Project inquiry",
      consultation: "Consultation call",
      job: "Job opportunity",
      other: "Something else",
    },
    service: "Service",
    servicePlaceholder: "Which service?",
    phone: "Phone / WhatsApp",
    phonePlaceholder: "+20 112 846 8458",
    preferredChannel: "Reach me on",
    channels: {
      email: "Email",
      whatsapp: "WhatsApp",
      phone: "Phone",
    },
    optional: "optional",
    submit: "Send message",
    sending: "Sending…",
    successTitle: "Message sent.",
    successBody: "Thanks for reaching out — I'll reply shortly.",
    genericError: "Something went wrong. Please try again.",
  },
  footer: {
    copyright: (year, name) => `© ${year} ${name}`,
  },
  common: {
    present: "Present",
    switchLanguage: "العربية",
  },
};

// Arabic in a clear, neutral register (العربية البيضاء): plain Modern Standard
// Arabic that reads naturally to any Arabic speaker — no dialect, no heavy
// classical constructions. Kept professional and concise to match the English.
const ar: Dictionary = {
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
  },
  hero: {
    viewWork: "استعرض أعمالي",
    getInTouch: "تواصل معي",
    whatsapp: "تحدّث عبر واتساب",
    linkedin: "لينكدإن",
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
    eyebrow: "التوفّر",
    title: "أين أعمل",
    regions: "المناطق",
    hours: "ساعات العمل",
    openTo: "منفتح على",
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

const DICTIONARIES: Record<Locale, Dictionary> = { en, ar };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES.en;
}

// The `count` and `copyright` entries are functions, which cannot cross the
// server→client prop boundary. They are only ever used in server components, so
// the fix is to never hand a whole Dictionary to a client component — pass one
// of these plain-string subsets instead.

export type NavStrings = Dictionary["nav"];
export type FormStrings = Dictionary["form"];

export type CaseStudyStrings = {
  openCaseStudy: string;
  visit: string;
  star: Dictionary["work"]["star"];
};

/** The strings CaseStudyCard needs, without the `count` function on `work`. */
export function caseStudyStrings(dict: Dictionary): CaseStudyStrings {
  return {
    openCaseStudy: dict.work.openCaseStudy,
    visit: dict.work.visit,
    star: dict.work.star,
  };
}
