import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";

const emptyProject = {
  title: "",
  description: "",
  techStack: "",
  keyFeatures: "",
  videoUrl: "",
  images: [""],
  liveUrl: "",
  githubUrl: "",
  featured: true,
  order: 0,
};

export default function ProjectForm({ initialValue, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyProject);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm(
      initialValue
        ? {
            ...initialValue,
            techStack: initialValue.techStack?.join(", ") || "",
            keyFeatures: initialValue.keyFeatures?.join("\n") || "",
            images:
              initialValue.images?.length > 0
                ? initialValue.images
                : initialValue.image
                  ? [initialValue.image]
                  : [""],
          }
        : emptyProject
    );
  }, [initialValue]);

  const handleChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateImageAt = (index, value) => {
    setForm((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) => (imageIndex === index ? value : image)),
    }));
  };

  const addImageSlot = () => {
    setForm((current) => ({
      ...current,
      images: current.images.length >= 5 ? current.images : [...current.images, ""],
    }));
  };

  const removeImageAt = (index) => {
    setForm((current) => {
      const next = current.images.filter((_, imageIndex) => imageIndex !== index);

      return {
        ...current,
        images: next.length > 0 ? next : [""],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const images = form.images.map((image) => image.trim()).filter(Boolean).slice(0, 5);

      await onSubmit({
        ...form,
        techStack: form.techStack,
        keyFeatures: form.keyFeatures,
        videoUrl: form.videoUrl,
        images,
        image: images[0] || "",
        order: Number(form.order) || 0,
        featured: Boolean(form.featured),
      });
      setForm(emptyProject);
    } finally {
      setIsSubmitting(false);
    }
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
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-ink">Key Features</span>
        <p className="text-xs text-muted">Add one feature per line.</p>
        <textarea
          rows={4}
          value={form.keyFeatures}
          onChange={(event) => handleChange("keyFeatures", event.target.value)}
          placeholder="User authentication&#10;Responsive design"
          className="w-full rounded-3xl border-line bg-canvas"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-ink">Video Demo URL</span>
        <input
          type="url"
          value={form.videoUrl}
          onChange={(event) => handleChange("videoUrl", event.target.value)}
          placeholder="https://youtube.com/watch?v=..."
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
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">Project gallery</p>
            <p className="mt-1 text-sm text-muted">Add up to five project photos. The first one becomes the cover image.</p>
          </div>
          <button
            type="button"
            onClick={addImageSlot}
            disabled={form.images.length >= 5}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={16} />
            Add photo
          </button>
        </div>
        <div className="space-y-4">
          {form.images.map((image, index) => (
            <div key={`${index}-${image}`} className="rounded-[1.5rem] border border-line bg-white p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-ink">
                  Photo {index + 1}
                  {index === 0 ? " (cover)" : ""}
                </p>
                {form.images.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeImageAt(index)}
                    className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm font-semibold text-muted"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                ) : null}
              </div>
              <ImageUploader
                value={image}
                onChange={(url) => updateImageAt(index, url)}
                label={`Image slot ${index + 1}`}
                helperText="Upload or paste the project image URL. Reorder by moving your preferred cover image into slot 1."
              />
            </div>
          ))}
        </div>
      </div>
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
          disabled={isSubmitting}
          className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : initialValue ? "Update project" : "Add project"}
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
