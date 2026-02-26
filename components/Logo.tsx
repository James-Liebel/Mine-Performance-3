'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';

export function Logo() {
  const logo = IMAGES.logo;
  const [imgError, setImgError] = useState(false);

  return (
    <Link href="/" className="nav-logo" data-testid="brand-wordmark">
      <span className="nav-logo-mark" aria-hidden>
        {!imgError ? (
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="nav-logo-image"
            style={{ objectFit: 'contain' }}
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="nav-logo-fallback" aria-hidden style={{ fontSize: '1.25rem', fontWeight: 700, color: 'inherit' }}>M</span>
        )}
      </span>
      <span className="nav-logo-text">Mine Performance Academy</span>
    </Link>
  );
}
