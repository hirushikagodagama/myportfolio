import DOMPurify from "dompurify";
import {
  ArrowRight,
  ArrowUpRight,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";
import ProjectCard from "../components/public/ProjectCard";
import SectionHeading from "../components/public/SectionHeading";
import useReveal from "../hooks/useReveal";

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  link: ArrowRight,
};

const PUBLIC_SYNC_KEY = "portfolio_content_updated_at";

const NAV_ITEMS = [
  { href: "#about", label: "About", index: "01" },
  { href: "#projects", label: "Projects", index: "02" },
  { href: "#skills", label: "Skills", index: "03" },
  { href: "#contact", label: "Contact", index: "04" },
];

const getInitials = (name) =>
  name
    ?.split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("") || "HG";

function LoadingScreen() {
  return (
    <div className="fx-shell flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="relative h-16 w-16">
        <div className="fx-orbit absolute inset-0 rounded-full border border-ember-400/20 border-t-ember-400" />
        <div className="absolute inset-4 rounded-full bg-ember/60 blur-md" />
      </div>
      <p className="fx-label">
        Initializing portfolio<span className="fx-caret">_</span>
      </p>
    </div>
  );
}

export default function HomePage() {
  const [content, setContent] = useState({
    profile: null,
    projects: [],
    skills: [],
    links: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const loadContent = useCallback(async () => {
    const { data } = await api.get("/public/content", {
      params: { t: Date.now() },
    });
    setContent(data);
  }, []);

  useEffect(() => {
    loadContent()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));

    const handleStorage = (event) => {
      if (event.key === PUBLIC_SYNC_KEY) {
        loadContent().catch(() => {});
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadContent().catch(() => {});
      }
    };

    const handleFocus = () => {
      loadContent().catch(() => {});
    };

    const handleScroll = () => setScrolled(window.scrollY > 24);

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [loadContent]);

  useReveal([isLoading, content]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const { profile, projects, skills, links } = content;
  const allSkills = skills.flatMap((category) => category.items);
  const marqueeItems = allSkills.length > 0 ? allSkills : ["Design", "Engineering", "Systems"];
  const year = new Date().getFullYear();

  return (
    <div className="fx-shell min-h-screen overflow-x-clip font-sans">
      {/* Ambient ember glows */}
      <div className="pointer-events-none fixed -left-40 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-ember/40 blur-[140px]" />
      <div className="pointer-events-none fixed -right-40 top-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-steel blur-[120px]" />

      {/* ───────── Header ───────── */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled || menuOpen
            ? "border-b border-white/5 bg-void/75 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <a href="#top" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-ember-400/40 bg-ember/30 font-mono text-xs font-medium text-ember-300">
              {getInitials(profile?.name)}
            </span>
            <span className="font-display text-base font-semibold tracking-tight text-haze">
              {profile?.name || "Portfolio"}
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} className="fx-nav-link font-mono text-xs uppercase tracking-[0.18em] text-fog">
                <span className="mr-1.5 text-ember-400">{item.index}</span>
                {item.label}
              </a>
            ))}
            <a href="/admin/login" className="fx-btn fx-btn-ghost !px-4 !py-2.5">
              Admin
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 text-haze md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen ? (
          <nav className="border-t border-white/5 px-6 pb-6 pt-2 md:hidden">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-white/5 py-4 font-display text-xl text-haze"
              >
                {item.label}
                <span className="font-mono text-xs text-ember-400">{item.index}</span>
              </a>
            ))}
            <a href="/admin/login" className="mt-4 block font-mono text-xs uppercase tracking-[0.18em] text-fog">
              Admin →
            </a>
          </nav>
        ) : null}
      </header>

      <main id="top" className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* ───────── Hero ───────── */}
        <section className="grid min-h-[100svh] items-center gap-14 pb-16 pt-32 md:grid-cols-[1.25fr_0.75fr] md:pt-28">
          <div className="space-y-9">
            <div className="reveal inline-flex items-center gap-3 rounded-sm border border-white/10 bg-steel/50 px-4 py-2 backdrop-blur">
              <span className="fx-pulse h-2 w-2 rounded-full bg-ember-400" />
              <span className="fx-label !text-haze/80">Available for selected work</span>
            </div>

            <div className="space-y-6">
              <p className="reveal fx-label" style={{ "--reveal-delay": "60ms" }}>
                // {profile?.name || "Portfolio"}
              </p>
              <h1
                className="reveal max-w-4xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.03em] sm:text-7xl lg:text-[5.5rem]"
                style={{ "--reveal-delay": "120ms" }}
              >
                <span className="fx-gradient-text">{profile?.title || "Full-Stack Developer"}</span>
              </h1>
              <p
                className="reveal max-w-2xl text-lg leading-8 text-fog sm:text-xl sm:leading-9"
                style={{ "--reveal-delay": "180ms" }}
              >
                {profile?.intro}
              </p>
            </div>

            <div className="reveal flex flex-wrap gap-4" style={{ "--reveal-delay": "240ms" }}>
              <a href="#projects" className="fx-btn fx-btn-primary">
                View Projects <ArrowRight size={15} />
              </a>
              <a href={`mailto:${profile?.email || ""}`} className="fx-btn fx-btn-ghost">
                <Mail size={15} />
                Contact Me
              </a>
            </div>

            <div
              className="reveal grid max-w-xl grid-cols-3 divide-x divide-white/10 border-y border-white/10"
              style={{ "--reveal-delay": "300ms" }}
            >
              <div className="py-4 pr-4">
                <p className="font-display text-3xl font-semibold text-haze">{String(projects.length).padStart(2, "0")}</p>
                <p className="fx-label mt-1 !text-[0.62rem]">Projects</p>
              </div>
              <div className="px-4 py-4">
                <p className="font-display text-3xl font-semibold text-haze">{String(allSkills.length).padStart(2, "0")}</p>
                <p className="fx-label mt-1 !text-[0.62rem]">Skills</p>
              </div>
              <div className="py-4 pl-4">
                <p className="flex items-center gap-1.5 truncate pt-2 font-display text-base font-medium text-haze">
                  <MapPin size={14} className="flex-none text-ember-400" />
                  <span className="truncate">{profile?.location || "Remote"}</span>
                </p>
                <p className="fx-label mt-2 !text-[0.62rem]">Location</p>
              </div>
            </div>
          </div>

          {/* Portrait in orbital HUD */}
          <div className="reveal relative mx-auto w-full max-w-sm" style={{ "--reveal-delay": "200ms" }}>
            <div className="pointer-events-none absolute -inset-10 rounded-full border border-dashed border-fog/15 fx-orbit" />
            <div className="pointer-events-none absolute -inset-4 rounded-full border border-ember-400/20 fx-orbit-reverse">
              <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-ember-400 shadow-[0_0_14px_4px_rgba(200,113,74,0.6)]" />
            </div>
            <div className="absolute inset-6 rounded-full bg-ember/50 blur-3xl" />

            <div className="fx-panel fx-corners relative overflow-hidden rounded-sm p-3">
              <div className="relative overflow-hidden rounded-sm">
                {profile?.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="aspect-[4/5] w-full object-cover grayscale-[35%] contrast-110"
                  />
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center bg-[radial-gradient(circle_at_50%_30%,rgba(200,113,74,0.45),transparent_60%),linear-gradient(170deg,#1A2324,#020403)] font-display text-7xl font-semibold text-haze/70">
                    {getInitials(profile?.name)}
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-ember/10" />
                <div className="fx-scanbar pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent via-ember-300/10 to-transparent" />
              </div>
              <div className="flex items-center justify-between px-1 pb-1 pt-3 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-fog">
                <span>ID // {getInitials(profile?.name)}-{year}</span>
                <span className="flex items-center gap-1.5 text-ember-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember-400" /> Online
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ───────── Skill marquee ───────── */}
      <div className="relative border-y border-white/5 bg-carbon/60 py-5" aria-hidden="true">
        <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          <div className="fx-marquee flex w-max gap-10">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={`${item}-${i}`} className="flex items-center gap-10 font-display text-2xl font-medium text-haze/40">
                {item}
                <span className="text-sm text-ember-400">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-12 lg:px-10">
        {/* ───────── About ───────── */}
        <section id="about" className="scroll-mt-24 py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading
              index="01"
              eyebrow="About Me"
              title={profile?.name || "About"}
              description={profile?.bio || "A concise introduction to your experience and approach."}
            />
            <div className="reveal fx-panel fx-corners rounded-sm p-8 md:p-10">
              <div className="mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-ember-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-fog/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-fog/30" />
                <span className="fx-label ml-3 !text-[0.62rem]">about.md</span>
              </div>
              <div
                className="prose prose-invert max-w-none prose-p:text-lg prose-p:leading-8 prose-p:text-fog prose-headings:font-display prose-headings:text-haze prose-strong:text-haze prose-a:text-ember-300"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(profile?.aboutHtml || ""),
                }}
              />
            </div>
          </div>
        </section>

        {/* ───────── Projects ───────── */}
        <section id="projects" className="scroll-mt-24 py-24">
          <SectionHeading
            index="02"
            eyebrow="Selected Projects"
            title="Recent work with a sharp focus on clarity"
            description="A curated set of projects that combine clean interfaces, maintainable systems, and thoughtful execution."
          />
          {projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project, index) => (
                <ProjectCard key={project._id} project={project} index={index} />
              ))}
            </div>
          ) : (
            <div className="fx-panel rounded-sm p-10 text-center">
              <p className="fx-label">No projects deployed yet</p>
            </div>
          )}
        </section>

        {/* ───────── Skills ───────── */}
        <section id="skills" className="scroll-mt-24 py-24">
          <SectionHeading
            index="03"
            eyebrow="Skills"
            title="Capabilities across product, code, and delivery"
            description="Grouped expertise presented in a simple structure that stays easy to edit from the admin dashboard."
          />
          <div className="grid gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 lg:grid-cols-3">
            {skills.map((category, i) => (
              <div
                key={category._id}
                className="reveal group relative bg-carbon p-8 transition-colors duration-300 hover:bg-steel"
                style={{ "--reveal-delay": `${i * 70}ms` }}
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-mono text-xs text-ember-400">
                    {String(i + 1).padStart(2, "0")} / {String(skills.length).padStart(2, "0")}
                  </span>
                  <span className="fx-label !text-[0.62rem]">{category.items.length} modules</span>
                </div>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-haze">{category.name}</h3>
                <ul className="mt-6 space-y-3">
                  {category.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-fog">
                      <span className="h-px w-4 bg-ember-400/70 transition-all duration-300 group-hover:w-6" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ember-400/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </section>

        {/* ───────── Contact ───────── */}
        <section id="contact" className="scroll-mt-24 py-24">
          <div className="reveal fx-panel fx-corners relative overflow-hidden rounded-sm p-8 md:p-14">
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-ember/50 blur-[100px]" />
            <div className="relative grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="mb-5 flex items-center gap-4">
                  <span className="font-mono text-xs text-ember-400">04</span>
                  <span className="h-px w-10 bg-gradient-to-r from-ember-400 to-transparent" />
                  <p className="fx-label">Contact</p>
                </div>
                <h2 className="max-w-2xl font-display text-4xl font-semibold leading-[1.02] tracking-tight text-haze md:text-6xl">
                  Let's build something <span className="fx-gradient-text">thoughtful</span>.
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-8 text-fog">
                  Use the links below or send a direct email — I usually reply within a day.
                </p>
                {profile?.email ? (
                  <a
                    href={`mailto:${profile.email}`}
                    className="group mt-8 inline-flex items-center gap-3 font-display text-2xl font-medium text-haze md:text-3xl"
                  >
                    {profile.email}
                    <ArrowUpRight className="text-ember-400 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </a>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3 lg:flex-col">
                {links.map((link) => {
                  const Icon = iconMap[link.icon?.toLowerCase()] || ArrowRight;

                  return (
                    <a
                      key={link._id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="fx-btn fx-btn-ghost justify-between lg:min-w-[220px]"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon size={15} />
                        {link.label}
                      </span>
                      <ArrowUpRight size={14} className="text-ember-400" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ───────── Footer ───────── */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-fog/70 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <span>
            © {year} {profile?.name || "Portfolio"}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-ember-400" /> All systems nominal
          </span>
        </div>
      </footer>
    </div>
  );
}
