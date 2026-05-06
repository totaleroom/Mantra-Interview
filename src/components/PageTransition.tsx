import React from 'react';
import { useSwipeBack } from '@/hooks/useSwipeBack';
import { useIsMobile } from '@/hooks/use-mobile';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const { containerRef, progress, isSwiping } = useSwipeBack({ enabled: isMobile });

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        transform: isMobile && progress > 0 ? `translateX(${progress * 100}%)` : undefined,
        transition: isSwiping && progress === 0 ? 'transform 300ms ease' : 
                    !isSwiping && progress === 1 ? 'transform 200ms ease' : 'none',
        touchAction: 'pan-y',
      }}
    >
      {/* Shadow overlay on left edge during swipe */}
      {isMobile && progress > 0 && (
        <div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: `linear-gradient(to right, rgba(0,0,0,${0.3 * (1 - progress)}) 0%, transparent 30%)`,
            transform: `translateX(-${progress * 100}%)`,
          }}
        />
      )}
      {children}
    </div>
  );
};

export default PageTransition;
