import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface ComicImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClass?: string;
  fallbackLabel?: string;
}

export function ComicImage({
  src,
  alt,
  className = '',
  aspectClass = 'aspect-[4/3]',
  fallbackLabel,
}: ComicImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-[#f3f0e6] border-2 border-zinc-900 text-zinc-700 p-6 text-center overflow-hidden ${aspectClass} ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          viewBox="0 0 120 90"
          className="w-24 h-20 mb-3 text-blue-700/80"
          fill="none"
          aria-hidden="true"
        >
          <rect x="10" y="12" width="100" height="66" rx="4" stroke="currentColor" strokeWidth="3" fill="#ffffff" />
          <circle cx="44" cy="40" r="12" stroke="currentColor" strokeWidth="2.5" fill="#fef08a" />
          <path d="M56 38 L94 38 C98 38 98 44 94 44 L56 44" stroke="currentColor" strokeWidth="2.5" fill="#fecaca" />
          <path d="M32 66 C32 54 56 54 56 66" stroke="currentColor" strokeWidth="2.5" fill="#bfdbfe" />
        </svg>
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
          <BookOpen className="w-4 h-4 text-blue-700 shrink-0" />
          <span>{fallbackLabel || alt}</span>
        </div>
        <p className="mt-1 text-xs text-zinc-500">Illustration panel</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#f3f0e6] ${aspectClass} ${className}`}>
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-[#ede9dc] animate-pulse"
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-contain transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
