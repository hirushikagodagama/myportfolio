export default function SectionHeading({ index, eyebrow, title, description }) {
  return (
    <div className="reveal mb-12 max-w-3xl">
      <div className="mb-5 flex items-center gap-4">
        {index ? <span className="font-mono text-xs text-ember-400">{index}</span> : null}
        <span className="h-px w-10 bg-gradient-to-r from-ember-400 to-transparent" />
        <p className="fx-label">{eyebrow}</p>
      </div>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-haze md:text-5xl md:leading-[1.05]">
        {title}
      </h2>
      {description ? <p className="mt-5 max-w-2xl text-lg leading-8 text-fog">{description}</p> : null}
    </div>
  );
}
