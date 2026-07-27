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
    /** Accessible name for the <nav> landmark itself. */
    primary: string;
    skipToContent: string;
    toggleTheme: string;
    /** Accessible name for the breadcrumb trail on a service page. */
    breadcrumb: string;
  };
  hero: {
    viewWork: string;
    getInTouch: string;
    linkedin: string;
    github: string;
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
    /** Heading for the in-page table of contents. */
    onThisPage: string;
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
