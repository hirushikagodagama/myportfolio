import { ArrowUpRight, Github, Images } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  const gallery = project.images?.length > 0 ? project.images : project.image ? [project.image] : [];
  const coverImage = gallery[0];

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/80 bg-surface shadow-soft transition duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        {coverImage ? (
          <img
            src={coverImage}
            alt={project.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent/70 to-sand text-sm font-semibold uppercase tracking-[0.3em] text-ink/60">
            Project Preview
          </div>
        )}
        {gallery.length > 1 ? (
          <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink backdrop-blur">
            <Images size={14} />
            {gallery.length} photos
          </div>
        ) : null}
      </div>
      <div className="space-y-5 p-6">
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-ink">{project.title}</h3>
          <p className="leading-7 text-muted line-clamp-3">{project.description}</p>
        </div>
        {gallery.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {gallery.slice(0, 5).map((image, index) => (
              <img
                key={`${project._id || project.title}-${index}`}
                src={image}
                alt={`${project.title} preview ${index + 1}`}
                className="h-14 w-14 flex-none rounded-xl object-cover"
              />
            ))}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {project.techStack?.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-line bg-canvas px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center pt-2">
          <Link
            to={`/projects/${project._id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
          >
            View Project <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
