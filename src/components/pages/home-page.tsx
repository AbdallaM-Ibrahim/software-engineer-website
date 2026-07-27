import { getServices } from "@/lib/data";
import { getProfile } from "@/features/profile/server";
import {
  getEducation,
  getExperience,
  getSkills,
} from "@/features/resume/server";
import { getCaseStudies, getTestimonials } from "@/features/work/server";
import { caseStudyMetrics } from "@/features/work/model";
import { getDictionary } from "@/shared/i18n";
import { JsonLd } from "@/components/json-ld";
import {
  buildBreadcrumbs,
  buildGraph,
  buildPerson,
  buildProfilePage,
  buildWebSite,
} from "@/lib/schema";
import type { Locale } from "@/shared/site";
import { About, Footer, Hero, WhereIWork } from "@/features/profile/ui";
import { Education, Experience, Skills } from "@/features/resume/ui";
import { Testimonials, Work } from "@/features/work/ui";
import { Contact } from "@/features/contact/ui";
import { RefreshOnSave } from "@/components/refresh-on-save";
import { EmptyState } from "@/components/pages/empty-state";

// Where the admin panel posts live-preview messages from. Same origin as the
// site itself, so this is also the value livePreview.url resolves to.
const SERVER_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * The single-page portfolio, rendered for one locale.
 *
 * Both the English route (`/`) and the Arabic route (`/ar`) render this — the
 * only difference between them is the `locale` passed in and the `draft` flag,
 * which the live-preview iframe sets to bypass the cache.
 */
export async function HomePage({
  locale,
  draft = false,
}: {
  locale: Locale;
  draft?: boolean;
}) {
  const dict = getDictionary(locale);
  const profile = await getProfile(locale, draft);

  if (!profile) return <EmptyState />;

  const [services, skills, experience, education, caseStudies, testimonials] =
    await Promise.all([
      getServices(locale, draft),
      getSkills(locale, draft),
      getExperience(locale, draft),
      getEducation(locale, draft),
      getCaseStudies(locale, draft),
      getTestimonials(locale, draft),
    ]);

  const metrics = caseStudyMetrics(caseStudies);

  const graph = buildGraph([
    buildPerson({ profile, skills, experience, education, locale }),
    buildWebSite(profile, locale),
    buildProfilePage({ profile, locale, caseStudies }),
    buildBreadcrumbs([{ name: dict.nav.home, path: "/" }], locale),
  ]);

  return (
    <>
      {/* No-op outside the admin's preview iframe. */}
      <RefreshOnSave serverURL={SERVER_URL} />
      <JsonLd data={graph} />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Hero profile={profile} metrics={metrics} dict={dict} locale={locale} />
        <About
          profile={profile}
          services={services}
          dict={dict}
          locale={locale}
        />
        <Skills skills={skills} dict={dict} />
        <Experience items={experience} dict={dict} locale={locale} />
        <Education items={education} dict={dict} locale={locale} />
        {profile.availability ? (
          <WhereIWork availability={profile.availability} dict={dict} />
        ) : null}
        <Work items={caseStudies} dict={dict} />
        <Testimonials items={testimonials} dict={dict} />
        <Contact profile={profile} services={services} dict={dict} />
      </main>
      <Footer profile={profile} dict={dict} locale={locale} />
    </>
  );
}
