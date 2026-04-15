import DOMPurify from "dompurify";
import {
  ArrowRight,
  BriefcaseBusiness,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import ProjectCard from "../components/public/ProjectCard";
import SectionHeading from "../components/public/SectionHeading";

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  link: ArrowRight,
};

export default function HomePage() {
  const [content, setContent] = useState({
    profile: null,
    projects: [],
    skills: [],
    links: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/public/content")
      .then(({ data }) => setContent(data))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-muted">Loading portfolio...</div>;
  }

  const { profile, projects, skills, links } = content;

  return (
    <div className="min-h-screen bg-glow text-ink">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a href="#top" className="text-lg font-extrabold tracking-tight">
          {profile?.name || "Portfolio"}
        </a>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-muted md:flex">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
          <a href="/admin/login" className="rounded-full border border-line px-4 py-2 text-ink">
            Admin
          </a>
        </nav>
      </header>

      <main id="top" className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <section className="grid items-center gap-10 py-12 md:grid-cols-[1.2fr_0.8fr] md:py-20">
          <div className="space-y-8">
            <span className="inline-flex items-center rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted backdrop-blur">
              Available for selected work
            </span>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight text-ink sm:text-6xl">
                {profile?.title || "Full-Stack Developer"}
              </h1>
              <p className="max-w-2xl text-xl leading-9 text-muted">{profile?.intro}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
              >
                View Projects <ArrowRight size={16} />
              </a>
              <a
                href={`mailto:${profile?.email || ""}`}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-6 py-3 text-sm font-semibold text-ink backdrop-blur"
              >
                <Mail size={16} />
                Contact Me
              </a>
            </div>
            <div className="flex flex-wrap gap-5 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} />
                {profile?.location}
              </span>
              <span className="inline-flex items-center gap-2">
                <BriefcaseBusiness size={16} />
                Product-minded engineering
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -rotate-6 rounded-[2.5rem] bg-accent/40 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-surface p-4 shadow-soft">
              {profile?.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="aspect-[4/5] w-full rounded-[2rem] object-cover"
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center rounded-[2rem] bg-gradient-to-br from-accent to-sand text-6xl font-extrabold text-ink/60">
                  {profile?.name
                    ?.split(" ")
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("") || "HG"}
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="about" className="py-16">
          <SectionHeading
            eyebrow="About Me"
            title={profile?.name || "About"}
            description={profile?.bio || "A concise introduction to your experience and approach."}
          />
          <div className="rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-soft backdrop-blur">
            <div
              className="prose prose-slate max-w-none prose-headings:text-ink prose-p:text-muted prose-strong:text-ink"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(profile?.aboutHtml || ""),
              }}
            />
          </div>
        </section>

        <section id="projects" className="py-16">
          <SectionHeading
            eyebrow="Selected Projects"
            title="Recent work with a sharp focus on clarity"
            description="A curated set of projects that combine clean interfaces, maintainable systems, and thoughtful execution."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </section>

        <section id="skills" className="py-16">
          <SectionHeading
            eyebrow="Skills"
            title="Capabilities across product, code, and delivery"
            description="Grouped expertise presented in a simple structure that stays easy to edit from the admin dashboard."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {skills.map((category) => (
              <div key={category._id} className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft">
                <h3 className="text-xl font-bold text-ink">{category.name}</h3>
                <div className="mt-5 flex flex-wrap gap-3">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-line bg-canvas px-4 py-2 text-sm font-medium text-muted"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="py-16">
          <div className="grid gap-8 rounded-[2.5rem] border border-white/60 bg-white/75 p-8 shadow-soft backdrop-blur lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <SectionHeading
                eyebrow="Contact"
                title="Let's build something thoughtful"
                description="Use the links below or send a direct email. Every field in this section is editable from the admin panel."
              />
              <a href={`mailto:${profile?.email || ""}`} className="text-xl font-bold text-ink">
                {profile?.email}
              </a>
            </div>
            <div className="flex flex-wrap gap-3">
              {links.map((link) => {
                const Icon = iconMap[link.icon?.toLowerCase()] || ArrowRight;

                return (
                  <a
                    key={link._id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-5 py-3 text-sm font-semibold text-ink"
                  >
                    <Icon size={16} />
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
