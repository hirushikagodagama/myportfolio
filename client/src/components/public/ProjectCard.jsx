import { ArrowUpRight, Images } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectCard({ project, index = 0 }) {
  const gallery = project.images?.length > 0 ? project.images : project.image ? [project.image] : [];
  const coverImage = gallery[0];
  const serial = String(index + 1).padStart(2, "0");

  return (
    <article
      className="reveal group"
      style={{ "--reveal-delay": `${(index % 3) * 70}ms` }}
    >
      <Link
        to={`/projects/${project._id}`}
        className="fx-panel fx-card fx-corners flex h-full flex-col overflow-hidden rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-400"
      >
        <div className="relative aspect-[16/10] overflow-hidden border-b border-white/5 bg-steel">
          {coverImage ? (
            <img
              src={coverImage}
              alt={project.title}
              className="h-full w-full object-cover opacity-85 transition duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100"
            />
          ) : (
            <div className="relative flex h-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(200,113,74,0.35),transparent_55%),linear-gradient(160deg,#1A2324,#020403)]">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(142,154,152,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(142,154,152,0.08)_1px,transparent_1px)] bg-[size:24px_24px]" />
              <span className="relative font-display text-5xl font-semibold text-haze/15">{serial}</span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-haze/80">
            PRJ_{serial}
          </div>
          {gallery.length > 1 ? (
            <div className="fx-chip absolute right-4 top-4 backdrop-blur">
              <Images size={12} />
              {gallery.length}
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-haze">{project.title}</h3>
            <span className="mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-full border border-white/10 text-fog transition duration-300 group-hover:rotate-45 group-hover:border-ember-400 group-hover:text-ember-300">
              <ArrowUpRight size={16} />
            </span>
          </div>
          <p className="line-clamp-3 leading-7 text-fog">{project.description}</p>

          {gallery.length > 1 ? (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {gallery.slice(0, 5).map((image, i) => (
                <img
                  key={`${project._id || project.title}-${i}`}
                  src={image}
                  alt={`${project.title} preview ${i + 1}`}
                  className="h-12 w-12 flex-none rounded-sm border border-white/10 object-cover"
                />
              ))}
            </div>
          ) : null}

          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {project.techStack?.map((tech) => (
              <span key={tech} className="fx-chip">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
