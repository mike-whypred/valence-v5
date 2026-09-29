import Image from 'next/image';
import type { ReactNode } from 'react';
import { Brand } from '@/components/brand';
import { photo } from '@/lib/demo-data';

export function AuthShell({
  children,
  image = 195,
  caption,
}: {
  children: ReactNode;
  image?: number;
  caption: string;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-4 py-6 sm:px-10">
        <Brand />
        <main id="main" className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          {children}
        </main>
      </div>
      <div className="relative hidden p-3 lg:block">
        <div className="relative h-full overflow-hidden rounded-3xl">
          <Image src={photo(image, 1200, 1500)} alt="" fill priority sizes="50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <p className="absolute right-10 bottom-10 left-10 max-w-md text-2xl leading-snug font-medium tracking-tight text-white">
            {caption}
          </p>
        </div>
      </div>
    </div>
  );
}
