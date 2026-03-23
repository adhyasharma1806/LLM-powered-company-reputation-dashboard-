'use client';

import type { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';

interface RootProvidersProps {
  children: ReactNode;
}

export function RootProviders({ children }: RootProvidersProps) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}

