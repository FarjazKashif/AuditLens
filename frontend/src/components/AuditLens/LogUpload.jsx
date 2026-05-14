// Uploads security evidence files to the Express AuditLens ingest proxy.
import { useRef, useState } from "react";
import { Upload } from "lucide-react";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function LogUpload() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setStatus(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${apiBaseUrl}/auditlens/ingest`, {
        method: "POST",
        body: formData
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || "Upload failed");
      }

      setStatus(`Indexed ${result.chunks} chunks and normalized ${result.normalizedEvents || 0} events from ${result.filename}`);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <section className="rounded border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-2">
        <Upload size={18} className="text-cyan" />
        <h3 className="font-semibold">Evidence upload</h3>
      </div>
      <p className="mt-2 text-sm text-muted">Index .log, .txt, .json, .md, and .csv evidence through the internal AuditLens service.</p>
      <label className="mt-4 flex cursor-pointer items-center justify-center rounded border border-dashed border-cyan/40 bg-cyan/5 px-4 py-8 text-center text-sm text-cyanSoft hover:bg-cyan/10">
        <input
          ref={inputRef}
          type="file"
          accept=".log,.txt,.json,.md,.csv"
          className="sr-only"
          disabled={uploading}
          onChange={handleFileChange}
        />
        {uploading ? "Indexing evidence..." : "Choose a log or document"}
      </label>
      {status && <p className="mt-3 text-sm text-green-400">{status}</p>}
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
    </section>
  );
}
