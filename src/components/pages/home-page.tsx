import {
  getProfile,
  getServices,
  getSkills,
  getExperience,
  getEducation,
  getCaseStudies,
  getTestimonials,
} from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { JsonLd } from "@/components/json-ld";
import {
  buildBreadcrumbs,
  buildGraph,
  buildPerson,
  buildProfilePage,
  buildWebSite,
} from "@/lib/schema";
import type { Locale } from "@/lib/site";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Education } from "@/components/sections/education";
import { WhereIWork } from "@/components/sections/where-i-work";
import { Work } from "@/components/sections/work";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
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

  // The hero leads with the outcomes these projects are remembered by, pulled
  // from the case studies themselves so editing one in /admin updates both.
  const metrics = caseStudies
    .filter((c) => c.metric?.value)
    .map((c) => ({
      before: c.metric?.before,
      value: c.metric!.value!,
      direction: c.metric?.direction,
      label: c.metric?.label,
      source: c.shortName,
    }));

  const realTestimonials = testimonials.filter((t) => !t.isPlaceholder);

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
      <Navbar
        name={profile.name}
        nav={dict.nav}
        switchLabel={dict.common.switchLanguage}
        locale={locale}
        hasTestimonials={realTestimonials.length > 0}
      />
      <main className="flex-1">
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
