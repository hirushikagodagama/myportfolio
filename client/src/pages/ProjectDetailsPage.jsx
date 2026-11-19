import { ArrowLeft, ArrowUpRight, Github, PlayCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import useReveal from "../hooks/useReveal";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/public/projects/${id}`)
      .then((res) => {
        setProject(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!activeImage) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setActiveImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeImage]);

  useReveal([isLoading, project]);

  if (isLoading) {
    return (
      <div className="fx-shell flex min-h-screen items-center justify-center">
        <p className="fx-label">
          Loading project data<span className="fx-caret">_</span>
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="fx-shell flex min-h-screen flex-col items-center justify-center gap-5">
        <p className="fx-label !text-ember-300">Error // project not found</p>
        <Link to="/" className="fx-btn fx-btn-ghost">
          <ArrowLeft size={15} /> Return home
        </Link>
      </div>
    );
  }

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url;
  };

  const embedUrl = getEmbedUrl(project.videoUrl);
  const isIframe = embedUrl && (embedUrl.includes("youtube") || embedUrl.includes("vimeo"));

  return (
    <div className="fx-shell min-h-screen overflow-x-clip pb-24">
      <div className="pointer-events-none fixed -right-40 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-ember/40 blur-[140px]" />

      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/95 p-4 backdrop-blur-md"
          onClick={() => setActiveImage(null)}
        >
          <button
            onClick={() => setActiveImage(null)}
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-sm border border-white/10 text-haze/70 transition-colors hover:border-ember-400 hover:text-haze"
            aria-label="Close preview"
          >
            <X size={22} />
          </button>
          <img
            src={activeImage}
            onClick={(event) => event.stopPropagation()}
            className="fx-corners max-h-[90vh] max-w-full rounded-sm border border-white/10 object-contain shadow-2xl"
            alt="Full screen preview"
          />
        </div>
      )}

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 lg:px-10">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-fog transition-colors hover:text-haze"
        >
          <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Portfolio
        </Link>
        <span className="fx-label hidden sm:block">Case file // {project._id?.slice(-6)}</span>
      </header>

      <main className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="mb-14 space-y-7 border-b border-white/5 pb-12">
          <p className="reveal fx-label flex items-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-ember-400 to-transparent" /> Project
          </p>
          <h1
            className="reveal font-display text-5xl font-semibold leading-[1] tracking-[-0.03em] md:text-6xl lg:text-7xl"
            style={{ "--reveal-delay": "60ms" }}
          >
            <span className="fx-gradient-text">{project.title}</span>
          </h1>
          <div className="reveal flex flex-wrap gap-2" style={{ "--reveal-delay": "120ms" }}>
            {project.techStack?.map((tech) => (
              <span key={tech} className="fx-chip">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          <div className="space-y-14">
            <div className="reveal space-y-5 text-lg leading-8 text-fog">
              {project.description.split("\n").map((paragraph, index) => (
                <p key={index} className="min-h-[1.5rem]">
                  {paragraph}
                </p>
              ))}
            </div>

            {project.keyFeatures?.length > 0 && (
              <div className="reveal fx-panel fx-corners space-y-6 rounded-sm p-8">
                <h2 className="flex items-center gap-3 font-display text-2xl font-semibold text-haze">
                  <span className="font-mono text-xs text-ember-400">//</span> Key Features
                </h2>
                <ul className="grid gap-4 text-fog sm:grid-cols-2">
                  {project.keyFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 border-l border-ember-400/40 pl-4">
                      <span className="font-mono text-xs leading-7 text-ember-400">{String(idx + 1).padStart(2, "0")}</span>
                      <span className="leading-7">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.videoUrl && (
              <div className="reveal space-y-5">
                <h2 className="inline-flex items-center gap-3 font-display text-2xl font-semibold text-haze">
                  <PlayCircle size={22} className="text-ember-400" /> Demo Video
                </h2>
                <div className="fx-corners aspect-video overflow-hidden rounded-sm border border-white/10 bg-carbon">
                  {isIframe ? (
                    <iframe
                      src={embedUrl}
                      title={`${project.title} Demo`}
                      className="h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={project.videoUrl} controls className="h-full w-full object-cover" />
                  )}
                </div>
              </div>
            )}

            {project.images?.length > 0 && (
              <div className="space-y-5">
                <h2 className="reveal font-display text-2xl font-semibold text-haze">Gallery</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {project.images.map((image, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setActiveImage(image)}
                      className="reveal fx-card group relative cursor-zoom-in overflow-hidden rounded-sm border border-white/10 bg-steel text-left"
                      style={{ "--reveal-delay": `${(index % 2) * 70}ms` }}
                    >
                      <img
                        src={image}
                        alt={`${project.title} screenshot ${index + 1}`}
                        className="aspect-video w-full object-cover opacity-90 transition duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100"
                      />
                      <span className="absolute bottom-3 left-3 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-haze/80">
                        IMG_{String(index + 1).padStart(2, "0")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="reveal fx-panel fx-corners sticky top-8 rounded-sm p-6">
              <h3 className="fx-label mb-5">Project Links</h3>
              <div className="space-y-3">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="fx-btn fx-btn-primary w-full !justify-between"
                  >
                    Visit Live Demo
                    <ArrowUpRight size={16} />
                  </a>
                ) : (
                  <div className="rounded-sm border border-dashed border-white/15 px-5 py-4 font-mono text-xs uppercase tracking-[0.14em] text-fog">
                    No live demo available
                  </div>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="fx-btn fx-btn-ghost w-full !justify-between"
                  >
                    View Source Code
                    <Github size={16} />
                  </a>
                )}
              </div>

              {project.techStack?.length > 0 ? (
                <div className="mt-6 border-t border-white/5 pt-5">
                  <p className="fx-label mb-3 !text-[0.62rem]">Stack</p>
                  <p className="text-sm leading-6 text-haze/80">{project.techStack.join(" · ")}</p>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
