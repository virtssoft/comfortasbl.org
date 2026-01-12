
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Handshake, Globe, ExternalLink } from 'lucide-react';

type FilterType = 'All' | 'Corporate' | 'NGO' | 'Volunteer' | 'Government';

const Partners: React.FC = () => {
  const { t } = useLanguage();
  const { partners, loading } = useData();
  const [filter, setFilter] = useState<FilterType>('All');

  const filteredPartners = filter === 'All' 
    ? partners 
    : partners.filter(p => p.type === filter);

  if (loading) return <div className="min-h-screen bg-white py-40 animate-pulse"></div>;

  return (
    <div className="py-32 bg-white min-h-screen font-sans">
      <div className="container mx-auto px-6">
        
        {/* HEADER INSTITUTIONNEL */}
        <div className="max-w-4xl mx-auto text-center mb-24 animate-fade-in-up">
          <span className="text-comfort-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Le Réseau Global</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-comfort-blue mb-8 leading-tight">
            Alliances & <span className="italic font-light">Partenariats</span>
          </h1>
          <div className="h-1 w-20 bg-comfort-gold mx-auto mb-10"></div>
          <p className="text-xl text-gray-500 font-light leading-relaxed">
            Nous bâtissons des synergies avec des institutions locales et internationales pour décupler notre impact sur le terrain.
          </p>
        </div>

        {/* FILTRES ÉPURÉS */}
        <div className="flex flex-wrap justify-center gap-8 mb-24">
          {['All', 'NGO', 'Government', 'Corporate', 'Volunteer'].map((type) => {
             let label = t('partners.filter_all');
             if (type === 'NGO') label = t('partners.filter_ngo');
             if (type === 'Government') label = t('partners.filter_gov');
             if (type === 'Corporate') label = t('partners.filter_corp');
             if (type === 'Volunteer') label = t('partners.filter_vol');

             return (
              <button
                key={type}
                onClick={() => setFilter(type as FilterType)}
                className={`text-[10px] font-bold uppercase tracking-[0.3em] pb-2 transition-all border-b-2 ${
                  filter === type 
                    ? 'border-comfort-gold text-comfort-blue' 
                    : 'border-transparent text-gray-300 hover:text-comfort-blue'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* PARTNERS GRID - Style Galerie d'Art */}
        <div className="grid md:grid-cols-3 gap-0 border border-gray-100">
          {filteredPartners.map((partner) => (
            <div key={partner.id} className="group p-12 bg-white border-r border-b border-gray-100 hover:bg-comfort-blue transition-all duration-700 relative overflow-hidden flex flex-col items-center text-center">
              <div className="absolute top-0 left-0 w-1 h-0 bg-comfort-gold group-hover:h-full transition-all duration-700"></div>
              
              <div className="h-32 w-full flex items-center justify-center mb-10 p-6 bg-comfort-light rounded-sm group-hover:bg-white transition-colors">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="max-h-full max-w-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 transform group-hover:scale-110"
                />
              </div>
              
              <span className="text-comfort-gold text-[9px] font-bold uppercase tracking-[0.2em] mb-4 opacity-70 group-hover:opacity-100">
                {partner.type || 'Institution'}
              </span>

              <h3 className="text-xl font-serif font-bold text-comfort-dark group-hover:text-white mb-6 transition-colors tracking-tight">
                {partner.name}
              </h3>
              
              <p className="text-sm text-gray-400 group-hover:text-gray-300 leading-relaxed font-light mb-8 line-clamp-3">
                {partner.description}
              </p>

              <button className="text-comfort-gold group-hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-500">
                <Globe size={18} strokeWidth={1} />
              </button>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredPartners.length === 0 && (
           <div className="text-center py-32 border border-dashed border-gray-100 rounded-sm">
             <p className="text-gray-300 font-serif italic text-xl">Aucun partenaire ne correspond à cette sélection.</p>
           </div>
        )}

        {/* CALL TO ACTION - Signature Fondation */}
        <div className="mt-32 bg-comfort-dark text-white p-12 md:p-24 relative overflow-hidden rounded-sm shadow-2xl">
           <div className="absolute top-0 right-0 w-1/4 h-full bg-comfort-gold/5 skew-x-12 translate-x-1/3"></div>
           <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h3 className="text-4xl font-serif font-bold mb-6">Rejoindre le <span className="italic font-light">Cercle COMFORT</span></h3>
                <p className="text-gray-400 font-light leading-relaxed text-lg">
                  Chaque alliance stratégique renforce notre capacité d'intervention. Devenez un pilier de notre action humanitaire.
                </p>
              </div>
              <div className="flex justify-start lg:justify-end">
                <a 
                  href="mailto:partenariat@comfortasbl.org" 
                  className="bg-comfort-gold text-white px-12 py-5 font-bold uppercase tracking-widest hover:bg-white hover:text-comfort-dark transition-all duration-500 shadow-xl"
                >
                  Initier un partenariat
                </a>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
