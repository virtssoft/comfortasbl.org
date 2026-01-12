
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Download, Calendar, FileText, Newspaper } from 'lucide-react';

const Bulletins: React.FC = () => {
  const { t } = useLanguage();
  const { bulletins, loading } = useData();

  return (
    <div className="bg-white min-h-screen font-sans pb-32">
      {/* Header */}
      <section className="py-32 bg-comfort-light border-b border-gray-100">
         <div className="container mx-auto px-6">
            <div className="max-w-4xl">
                <span className="text-comfort-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Communication Officielle</span>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-comfort-blue mb-8 leading-tight">
                  Le Bulletin <br/> d'Information
                </h1>
                <p className="text-xl text-gray-500 font-light leading-relaxed max-w-2xl">
                  Archives institutionnelles de COMFORT Asbl. Retrouvez ici tous nos rapports d'impact et décisions stratégiques au format PDF.
                </p>
            </div>
         </div>
      </section>

      {/* Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          {loading ? (
             <div className="grid md:grid-cols-2 gap-12 animate-pulse">
                {[1,2,3,4].map(i => <div key={i} className="h-64 bg-gray-100 rounded-sm"></div>)}
             </div>
          ) : bulletins.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-12">
               {bulletins.map((bulletin) => (
                 <div key={bulletin.id} className="bg-white border border-gray-100 p-12 flex flex-col md:flex-row items-center gap-10 hover:shadow-2xl transition-all duration-700 group">
                    <div className="w-24 h-24 bg-comfort-blue/5 flex items-center justify-center text-comfort-blue group-hover:bg-comfort-blue group-hover:text-white transition-all shadow-sm">
                       <Newspaper size={36} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center space-x-4 mb-3">
                          <span className="text-[10px] font-bold text-comfort-gold uppercase tracking-widest">Officiel</span>
                          <span className="text-[10px] text-gray-300 flex items-center"><Calendar size={12} className="mr-2" /> {bulletin.date}</span>
                       </div>
                       <h3 className="text-2xl font-serif font-bold text-comfort-blue mb-4 leading-tight">{bulletin.title}</h3>
                       <p className="text-gray-500 font-light text-sm mb-8 leading-relaxed italic line-clamp-2">
                         "{bulletin.summary}"
                       </p>
                       <a 
                         href={bulletin.pdfLink} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="inline-flex items-center bg-comfort-blue text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-comfort-gold transition-all shadow-lg"
                       >
                         Télécharger le PDF <Download size={14} className="ml-4" />
                       </a>
                    </div>
                 </div>
               ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-gray-50 rounded-sm border-2 border-dashed border-gray-100">
               <FileText size={48} className="mx-auto text-gray-300 mb-6" />
               <p className="text-gray-400 font-serif italic text-xl">Aucun bulletin disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="container mx-auto px-6 mt-20">
         <div className="bg-comfort-dark text-white p-16 md:p-24 rounded-sm text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-comfort-gold/5 animate-pulse"></div>
            <div className="relative z-10">
                <h2 className="text-3xl font-serif font-bold mb-8 italic">Transparence & Redevabilité</h2>
                <p className="text-gray-400 font-light max-w-2xl mx-auto mb-12">
                   Tous nos documents sont vérifiés par notre conseil d'administration. Pour toute demande de document spécifique non listé ici, veuillez contacter notre secrétariat.
                </p>
                <a href="mailto:contact@comfortasbl.org" className="text-comfort-gold font-bold uppercase tracking-[0.4em] text-xs hover:underline">
                   Contacter le secrétariat
                </a>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Bulletins;
