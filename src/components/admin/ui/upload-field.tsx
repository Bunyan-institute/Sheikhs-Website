"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { useAdminFeedback } from "./feedback";

export interface UploadedFile {
  url: string;
  mime_type: string;
  size: number;
  width: number | null;
  height: number | null;
}

interface UploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  /** Called with details (mime type, dimensions) once a file finishes uploading. */
  onUploaded?: (file: UploadedFile) => void;
  /** Value for the file input's accept attribute, e.g. "image/*" or "audio/*". */
  accept: string;
  placeholder?: string;
  inputClassName?: string;
}

function imageSize(file: File): Promise<{ w: number; h: number } | null> {
  if (!file.type.startsWith("image/")) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  });
}

/** A URL input with an Upload button that stores the file on the server and fills in its URL. */
export function UploadField({ value, onChange, onUploaded, accept, placeholder, inputClassName }: UploadFieldProps) {
  const { toast } = useAdminFeedback();
  const fileRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const upload = async (file: File) => {
    const dims = await imageSize(file);
    const qs = new URLSearchParams({ name: file.name });
    if (dims) {
      qs.set("w", String(dims.w));
      qs.set("h", String(dims.h));
    }

    setProgress(0);
    try {
      const result = await new Promise<UploadedFile>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", `/api/admin/upload?${qs}`);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
        xhr.upload.onprogress = (e) => e.lengthComputable && setProgress(Math.round((e.loaded / e.total) * 100));
        xhr.onload = () => {
          let body: { error?: string } & Partial<UploadedFile> = {};
          try {
            body = JSON.parse(xhr.responseText);
          } catch {
            // non-JSON error body
          }
          if (xhr.status >= 200 && xhr.status < 300 && body.url) resolve(body as UploadedFile);
          else reject(new Error(body.error || `Upload failed (${xhr.status})`));
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
      });
      onChange(result.url);
      onUploaded?.(result);
      toast.success("File uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setProgress(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClassName ?? "w-full min-w-0 px-3 py-2 border border-[#E0D8CE] rounded bg-white focus:outline-none focus:border-[#1B5E20]"}
      />
      <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={progress !== null}
        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded border border-[#1B5E20] text-[#1B5E20] text-xs font-semibold hover:bg-[#E8F5E9] disabled:opacity-60"
      >
        {progress !== null ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
        <span>{progress !== null ? `${progress}%` : "Upload"}</span>
      </button>
    </div>
  );
}
