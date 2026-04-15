import { ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "../../api/client";

export default function ImageUploader({
  value,
  onChange,
  label = "Upload image",
  helperText = "Upload from your device or paste an image URL.",
}) {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value || "");

  useEffect(() => {
    setPreviewUrl(value || "");
  }, [value]);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    const formData = new FormData();
    formData.append("image", file);
    setPreviewUrl(localPreview);
    setIsUploading(true);

    try {
      const { data } = await api.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPreviewUrl(data.url);
      onChange(data.url);
    } finally {
      URL.revokeObjectURL(localPreview);
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const clearValue = () => {
    setPreviewUrl("");
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">{label}</p>
          <p className="mt-1 text-sm text-muted">{helperText}</p>
        </div>
        {previewUrl ? (
          <button
            type="button"
            onClick={clearValue}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted"
          >
            <Trash2 size={14} />
            Remove
          </button>
        ) : null}
      </div>
      <div className="overflow-hidden rounded-[1.75rem] border border-dashed border-line bg-canvas">
        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
            >
              {isUploading ? <UploadCloud size={16} /> : <ImagePlus size={16} />}
              {isUploading ? "Uploading image..." : "Choose from device"}
            </button>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <input
              type="url"
              value={value || ""}
              onChange={(event) => {
                setPreviewUrl(event.target.value);
                onChange(event.target.value);
              }}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-2xl border-line bg-white"
            />
          </div>
          <div className="overflow-hidden rounded-[1.5rem] border border-line bg-white">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-48 w-full object-cover" />
            ) : (
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-accent/50 to-sand/90 text-sm font-semibold uppercase tracking-[0.24em] text-muted">
                Image preview
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
