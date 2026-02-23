import Link from 'next/link';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';

export function Logo() {
  const logo = IMAGES.logo;
  return (
    <Link href="/" className="nav-logo">
      <span className="nav-logo-mark" aria-hidden>
        <Image
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          className="nav-logo-image"
          style={{ objectFit: 'contain' }}
        />
      </span>
      <span className="nav-logo-text">Mine Performance</span>
    </Link>
  );
}
