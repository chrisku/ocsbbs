import { useRef, useState } from 'react';
import { uploadFile } from '../api/files';

interface Props {
  value:      string;
  onChange:   (url: string) => void;
  subfolder?: string;
}

const ImageUpload = ({ value, onChange, subfolder }: Props) => {
  const inputRef                   = useRef<HTMLInputElement>(null);
  const [uploading, setUploading]  = useState(false);
  const [error, setError]          = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      const url = await uploadFile(file, subfolder);
      onChange(url);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">

      {/* URL input + upload button */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Image URL"
          className="flex-1 px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 text-sm font-medium rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.webp"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {/* Error */}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Preview */}
      {value && !uploading && (
        <img
          src={value}
          alt="Preview"
          className="mt-1 h-32 w-auto rounded border border-neutral-200 object-contain"
        />
      )}

    </div>
  );
};

export default ImageUpload;