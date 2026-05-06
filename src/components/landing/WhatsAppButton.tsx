import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { openWhatsApp } from '@/lib/links';

export const WhatsAppButton = React.forwardRef<HTMLButtonElement>((_, ref) => {
  const { user } = useAuth();

  if (user) return null;

  return (
    <button
      ref={ref}
      onClick={openWhatsApp}
      aria-label="Chat via WhatsApp"
      className="fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border-4 border-foreground shadow-neoSm transition-all hover:scale-110 hover:shadow-none cursor-pointer"
      style={{ backgroundColor: '#25D366' }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-7 w-7 fill-white">
        <path d="M16.004 0h-.008C7.174 0 .002 7.174.002 16c0 3.5 1.128 6.744 3.046 9.378L1.06 31.29l6.156-1.96A15.9 15.9 0 0016.004 32C24.826 32 32 24.826 32 16S24.826 0 16.004 0zm9.31 22.596c-.39 1.1-1.932 2.014-3.164 2.28-.844.18-1.946.324-5.66-1.216-4.752-1.97-7.81-6.792-8.044-7.108-.226-.316-1.894-2.524-1.894-4.814s1.198-3.416 1.624-3.882c.39-.428 1.026-.642 1.636-.642.198 0 .376.01.536.018.468.02.702.048 1.012.784.386.918 1.326 3.236 1.44 3.472.116.236.232.556.072.872-.15.324-.282.468-.518.738-.236.27-.46.476-.696.766-.216.252-.46.522-.196.99.264.462 1.174 1.936 2.52 3.136 1.732 1.544 3.192 2.024 3.644 2.248.35.174.768.136 1.042-.156.35-.372.782-.988 1.222-1.596.312-.434.706-.49 1.094-.332.394.15 2.496 1.178 2.924 1.392.428.216.712.324.816.5.106.178.106 1.026-.284 2.126z" />
      </svg>
    </button>
  );
});
WhatsAppButton.displayName = 'WhatsAppButton';
