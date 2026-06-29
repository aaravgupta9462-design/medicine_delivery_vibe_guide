'use client';

import React, { useState } from 'react';

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallback?: string;
}

export default function ProductImage({
  src,
  alt,
  className,
  fallback = 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=300&q=80',
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        setImgSrc(fallback);
      }}
    />
  );
}
