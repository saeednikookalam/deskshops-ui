import Image from 'next/image';
import { PieChart } from '@/components/Layouts/sidebar/icons';

interface DynamicIconProps {
  src?: string;
  className?: string;
  alt?: string;
}

export function DynamicIcon({ src, className = "size-6 shrink-0", alt = "Plugin icon" }: DynamicIconProps) {
  // If no src provided, use default plugin icon
  if (!src) {
    return <PieChart className={className} aria-hidden="true" />;
  }

  // If src is a URL (starts with http or data:), use Image
  if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('/')) {
    return (
      <div className="relative">
        <Image
          src={src}
          width={24}
          height={24}
          alt={alt}
          className={className}
          aria-hidden="true"
          onError={(e) => {
            // Hide image and show fallback
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon') as HTMLElement;
            if (fallback) {
              fallback.style.display = 'block';
            }
          }}
        />
        <PieChart
          className={`${className} fallback-icon hidden`}
          aria-hidden="true"
        />
      </div>
    );
  }

  // For SVG strings or other formats, render as default icon
  return <PieChart className={className} aria-hidden="true" />;
}