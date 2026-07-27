import type { Locale } from "@/shared/site";

import { ar } from "./ar";
import { en } from "./en";
import type { CaseStudyStrings, Dictionary } from "./types";

export type {
  CaseStudyStrings,
  Dictionary,
  FormStrings,
  NavStrings,
} from "./types";

const DICTIONARIES: Record<Locale, Dictionary> = { en, ar };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES.en;
}

/** The strings CaseStudyCard needs, without the `count` function on `work`. */
export function caseStudyStrings(dict: Dictionary): CaseStudyStrings {
  return {
    openCaseStudy: dict.work.openCaseStudy,
    visit: dict.work.visit,
    star: dict.work.star,
  };
}
