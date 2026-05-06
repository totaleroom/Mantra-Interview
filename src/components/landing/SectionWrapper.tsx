import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, className = '', id }) => {
  return (
    <section id={id} className={`px-5 py-12 md:py-20 max-w-lg mx-auto md:max-w-2xl lg:max-w-4xl ${className}`}>
      {children}
    </section>
  );
};
