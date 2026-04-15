import { ArrowUpRight, Github } from "lucide-react";

export default function ProjectCard({ project }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/80 bg-surface shadow-soft transition duration-300 hover:-translate-y-1">
      <div className="aspect-[4/3] overflow-hidden bg-sand">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent/70 to-sand text-sm font-semibold uppercase tracking-[0.3em] text-ink/60">
            Project Preview
          </div>
        )}
      </div>
      <div className="space-y-5 p-6">
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-ink">{project.title}</h3>
          <p className="leading-7 text-muted">{project.description}</p>
        </div>
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
        <div className="flex items-center gap-4 text-sm font-semibold text-ink">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2"
            >
              Live Demo <ArrowUpRight size={16} />
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2"
            >
              Source <Github size={16} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
