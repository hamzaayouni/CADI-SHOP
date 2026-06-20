import React, { useRef, useState } from 'react';
import { compressImage, validateImageFile } from '../utils/upload';
import { useStore } from '../context/StoreContext';

interface ImageUploadProps {
  currentImage: string;
  onImageChange: (dataUrl: string) => void;
  label?: string;
  compact?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onImageChange, label, compact = false }) => {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      setUploading(true);
      const dataUrl = await compressImage(file, 800);
      onImageChange(dataUrl);
    } catch {
      setError('فشل في رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            isDark ? 'glass-gold text-morocco-gold hover:bg-morocco-gold/20' : 'bg-morocco-gold/10 text-morocco-gold hover:bg-morocco-gold/20 border border-morocco-gold/20'
          } ${uploading ? 'opacity-50' : ''}`}
        >
          {uploading ? '⏳' : '📷'} رفع صورة
        </button>
        {error && <span className="text-red-400 text-xs">{error}</span>}
      </div>
    );
  }

  return (
    <div>
      {label && <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</label>}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-xl overflow-hidden cursor-pointer transition-all border-2 border-dashed ${
          dragOver
            ? 'border-morocco-gold bg-morocco-gold/10 scale-[1.02]'
            : isDark ? 'border-white/10 hover:border-morocco-gold/30' : 'border-gray-200 hover:border-morocco-gold/40'
        }`}
      >
        {currentImage ? (
          <div className="relative group">
            <img
              src={currentImage}
              alt="preview"
              className={`w-full object-cover ${compact ? 'h-20' : 'h-40'}`}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-3xl mb-1">📷</div>
                <div className="text-sm font-bold">اضغط أو اسحب لتغيير الصورة</div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`flex flex-col items-center justify-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <div className="text-4xl mb-2">📷</div>
            <div className="text-sm font-bold">اضغط أو اسحب صورة هنا</div>
            <div className="text-xs mt-1">JPG, PNG, GIF, WebP — حد أقصى 5MB</div>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-white text-sm font-bold animate-pulse">⏳ جاري الرفع...</div>
          </div>
        )}
      </div>
      {error && (
        <div className={`mt-2 text-xs font-bold ${isDark ? 'text-red-400' : 'text-red-500'}`}>❌ {error}</div>
      )}
    </div>
  );
};

export default ImageUpload;
