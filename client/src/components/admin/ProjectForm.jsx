import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";

const emptyProject = {
  title: "",
  description: "",
  techStack: "",
  image: "",
  liveUrl: "",
  githubUrl: "",
  featured: true,
  order: 0,
};

export default function ProjectForm({ initialValue, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyProject);

  useEffect(() => {
    setForm(
      initialValue
        ? {
            ...initialValue,
            techStack: initialValue.techStack?.join(", ") || "",
          }
        : emptyProject
    );
  }, [initialValue]);

  const handleChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      ...form,
      techStack: form.techStack,
      order: Number(form.order) || 0,
      featured: Boolean(form.featured),
    });
    setForm(emptyProject);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">Project title</span>
          <input
            required
            value={form.title}
            onChange={(event) => handleChange("title", event.target.value)}
            className="w-full rounded-2xl border-line bg-canvas"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">Display order</span>
          <input
            type="number"
            value={form.order}
            onChange={(event) => handleChange("order", event.target.value)}
            className="w-full rounded-2xl border-line bg-canvas"
          />
        </label>
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-ink">Description</span>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(event) => handleChange("description", event.target.value)}
          className="w-full rounded-3xl border-line bg-canvas"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-ink">Tech stack</span>
        <input
          value={form.techStack}
          onChange={(event) => handleChange("techStack", event.target.value)}
          placeholder="React, Tailwind CSS, Express"
          className="w-full rounded-2xl border-line bg-canvas"
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">Live URL</span>
          <input
            type="url"
            value={form.liveUrl}
            onChange={(event) => handleChange("liveUrl", event.target.value)}
            className="w-full rounded-2xl border-line bg-canvas"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">GitHub URL</span>
          <input
            type="url"
            value={form.githubUrl}
            onChange={(event) => handleChange("githubUrl", event.target.value)}
            className="w-full rounded-2xl border-line bg-canvas"
          />
        </label>
      </div>
      <ImageUploader value={form.image} onChange={(url) => handleChange("image", url)} label="Project image" />
      <label className="inline-flex items-center gap-3 rounded-full border border-line bg-canvas px-4 py-3">
        <input
          type="checkbox"
          checked={Boolean(form.featured)}
          onChange={(event) => handleChange("featured", event.target.checked)}
          className="rounded border-line text-ink"
        />
        <span className="text-sm font-semibold text-ink">Featured project</span>
      </label>
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
        >
          {initialValue ? "Update project" : "Add project"}
        </button>
        {initialValue ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
