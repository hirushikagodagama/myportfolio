import { ImagePlus } from "lucide-react";
import { useRef, useState } from "react";
import { api } from "../../api/client";

export default function ImageUploader({ value, onChange, label = "Upload image" }) {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setIsUploading(true);

    try {
      const { data } = await api.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
        >
          <ImagePlus size={16} />
          {isUploading ? "Uploading..." : "Select image"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <input
          type="url"
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Or paste an image URL"
          className="w-full rounded-2xl border-line bg-canvas"
        />
      </div>
      {value ? (
        <div className="overflow-hidden rounded-[1.5rem] border border-line bg-canvas">
          <img src={value} alt="Preview" className="h-48 w-full object-cover" />
        </div>
      ) : null}
    </div>
  );
}
