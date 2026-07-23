import {
  getProfile,
  getServices,
  getSkills,
  getExperience,
  getEducation,
  getCaseStudies,
  getTestimonials,
} from "@/lib/data";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Education } from "@/components/sections/education";
import { Work } from "@/components/sections/work";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { RefreshOnSave } from "@/components/refresh-on-save";

// Where the admin panel posts live-preview messages from. Same origin as the
// site itself, so this is also the value livePreview.url resolves to.
const SERVER_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Content comes from MongoDB via Payload at request time.
export const dynamic = "force-dynamic";

function EmptyState() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-2xl font-bold">No content yet</h1>
        <p className="text-muted-foreground">
          The database has no profile data. Run the seed script to import your
          portfolio, then reload:
        </p>
        <pre className="bg-muted rounded-md p-3 text-left text-sm">
          pnpm seed
        </pre>
        <p className="text-muted-foreground text-sm">
          Or add content manually in the{" "}
          {/* Hard link — /admin is served by the Payload route group, not a Next page. */}
          <a href="/admin" className="text-primary hover:underline">
            admin panel
          </a>
          .
        </p>
      </div>
    </main>
  );
}

export default async function Home() {
  const profile = await getProfile();

  if (!profile) {
    return <EmptyState />;
  }

  const [services, skills, experience, education, caseStudies, testimonials] =
    await Promise.all([
      getServices(),
      getSkills(),
      getExperience(),
      getEducation(),
      getCaseStudies(),
      getTestimonials(),
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

  return (
    <>
      {/* No-op outside the admin's preview iframe. */}
      <RefreshOnSave serverURL={SERVER_URL} />
      <Navbar
        name={profile.name}
        hasTestimonials={realTestimonials.length > 0}
      />
      <main className="flex-1">
        <Hero profile={profile} metrics={metrics} />
        <About profile={profile} services={services} />
        <Skills skills={skills} />
        <Experience items={experience} />
        <Education items={education} />
        <Work items={caseStudies} />
        <Testimonials items={testimonials} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
