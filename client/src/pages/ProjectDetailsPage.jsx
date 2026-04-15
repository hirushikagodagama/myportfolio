import { ArrowLeft, ArrowUpRight, Github, PlayCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";

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

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-muted bg-glow">Loading project details...</div>;
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-ink bg-glow gap-4">
        <p>Could not load project.</p>
        <Link to="/" className="text-muted hover:text-ink underline">Return home</Link>
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
    <div className="min-h-screen bg-glow text-ink pb-24">
      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <button
            onClick={() => setActiveImage(null)}
            className="absolute right-6 top-6 text-white/70 hover:text-white"
          >
            <X size={32} />
          </button>
          <img
            src={activeImage}
            className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
            alt="Full screen preview"
          />
        </div>
      )}

      <header className="mx-auto flex max-w-5xl items-center px-6 py-8 lg:px-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink">
          <ArrowLeft size={18} />
          Back to Portfolio
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="mb-12 space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-ink md:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {project.techStack?.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-line bg-canvas px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted shadow-soft"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          <div className="space-y-12">
            <div className="prose prose-lg text-muted max-w-none prose-p:leading-8">
              {project.description.split('\n').map((paragraph, index) => (
                <p key={index} className="min-h-[1.5rem]">{paragraph}</p>
              ))}
            </div>

            {project.keyFeatures?.length > 0 && (
              <div className="space-y-5 rounded-[2rem] border border-white/60 bg-white/50 p-8 shadow-soft backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-ink">Key Features</h2>
                <ul className="space-y-3 text-muted">
                  {project.keyFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-ink/40" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.videoUrl && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold text-ink inline-flex items-center gap-2 pr-2">
                  <PlayCircle size={24} /> Demo Video
                </h2>
                <div className="overflow-hidden rounded-[2rem] border border-white/60 shadow-soft aspect-video bg-black/5">
                  {isIframe ? (
                    <iframe
                      src={embedUrl}
                      title={`${project.title} Demo`}
                      className="h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={project.videoUrl}
                      controls
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </div>
            )}

            {project.images?.length > 0 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold text-ink">Gallery</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {project.images.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setActiveImage(image)}
                      className="group relative cursor-zoom-in overflow-hidden rounded-[1.5rem] border border-white/60 bg-sand shadow-soft"
                    >
                      <img
                        src={image}
                        alt={`${project.title} screenshot ${index + 1}`}
                        className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/10" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="sticky top-8 rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-soft backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted">Project Links</h3>
              <div className="space-y-3">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 rounded-xl bg-ink px-5 py-4 text-sm font-bold text-white transition hover:bg-ink/90 shadow-sm"
                  >
                    Visit Live Demo
                    <ArrowUpRight size={18} />
                  </a>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-line bg-canvas/50 px-5 py-4 text-sm font-semibold text-muted">
                    No Live Demo Available
                  </div>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-5 py-4 text-sm font-bold text-ink transition hover:bg-canvas shadow-sm"
                  >
                    View Source Code
                    <Github size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
