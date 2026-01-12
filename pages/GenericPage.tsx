
import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

const GenericPage: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="py-32 bg-white min-h-[70vh] font-sans">
      <div className="container mx-auto px-6 max-w-4xl">
        <span className="text-comfort-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Information Officielle</span>
        <h1 className="text-5xl font-serif font-bold text-comfort-blue mb-12 border-b border-gray-50 pb-8 leading-tight">{title}</h1>
        <div className="prose prose-lg text-gray-600 max-w-none font-light leading-relaxed prose-headings:font-serif prose-headings:text-comfort-blue prose-headings:font-bold prose-a:text-comfort-gold">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GenericPage;
