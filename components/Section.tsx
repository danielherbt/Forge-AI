
import React from 'react';

interface SectionProps {
  id: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, title, subtitle, children }) => {
  return (
    <section id={id} className="py-16 sm:py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">{title}</h2>
        <p className="mt-4 text-lg text-slate-400">{subtitle}</p>
      </div>
      {children}
    </section>
  );
};

export default Section;
