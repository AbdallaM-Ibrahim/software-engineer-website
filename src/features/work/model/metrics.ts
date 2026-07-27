import type { CaseStudy } from "./types";
import type { Metric } from "@/features/profile/ui";

/**
 * The outcomes the hero leads with, pulled from the case studies themselves so
 * editing one in /admin updates both the hero strip and the study.
 *
 * Lived inline in the home page until the work feature existed to own it —
 * which meant a view knew how a case study stores its headline number.
 */
export function caseStudyMetrics(caseStudies: CaseStudy[]): Metric[] {
  return caseStudies
    .filter((study) => study.metric?.value)
    .map((study) => ({
      before: study.metric?.before,
      value: study.metric!.value!,
      direction: study.metric?.direction,
      label: study.metric?.label,
      source: study.shortName,
    }));
}
