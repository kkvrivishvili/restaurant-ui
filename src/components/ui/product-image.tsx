'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
}

export function ProductImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  fill = false,
}: ProductImageProps) {
  const imageSrc = src || '/images/placeholder.png';

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={imageSrc}
        alt={alt}
        className="object-cover"
        width={width}
        height={height}
        priority={priority}
        fill={fill}
        sizes={fill ? '(max-width: 768px) 100vw, 50vw' : undefined}
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = '/images/placeholder.png';
        }}
      />
    </div>
  );
}
