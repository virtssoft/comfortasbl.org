import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { ArrowRight, Calendar, Bookmark, LayoutGrid, Clock } from 'lucide-react';
import { CardSkeleton } from '../components/Skeletons';

const Projects: React.FC = () => {
  const { t } = useLanguage();
  const { projects, loading } = useData();
  
  // Utilitaire pour extraire l'accroche (première phrase) de la description
  const getFirstSentence = (text: string) => {
      if (!text) return "";
      const match = text.match(/([^\.!\?]+[\.!\?]+)/);
      return match ? match[1] : text;
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* 🏛️ HEADER INSTITUTIONNEL - Archive des Actions */}
      <div className="py-32 bg-comfort-light border-b border-gray-100">
        <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <span className="text-comfort-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block animate-fade-in">
                {t('projects.archive_title')}
              </span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-comfort-blue mb-8 leading-tight">
                {t('projects.archive_subtitle')}
              </h1>
              <p className="text-xl text-gray-500 font-light leading-relaxed max-w-2xl">
                {t('projects.archive_description')}
              </p>
            </div>
        </div>
      </div>

      {/* 🏛️ SECTION GRILLE DE PROJETS */}
      <div className="py-24">
        <div className="container mx-auto px-6">
            
            {loading ? (
                /* ÉTAT DE CHARGEMENT */
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
                  <CardSkeleton /><CardSkeleton /><CardSkeleton />
                </div>
            ) : projects && projects.length > 0 ? (
                /* AFFICHAGE DES PROJETS */
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                {projects.map((project) => (
                    <article key={project.id} className="group flex flex-col h-full border-b border-gray-50 pb-12 transition-all duration-500">
                        
                        {/* Image avec effet zoom au survol */}
                        <div className="relative aspect-[16/10] overflow-hidden mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-700 rounded-sm bg-gray-100">
                            <img 
                                src={project.image} 
                                alt={project.title} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1500ms] ease-out"
                            />
                            {/* Badge Catégorie */}
                            <div className="absolute top-4 left-4 bg-white px-3 py-1 shadow-sm">
                                <span className="text-comfort-blue font-bold text-[9px] uppercase tracking-widest">
                                    {project.category}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col flex-grow space-y-4">
                            <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                <Calendar size={12} className="mr-2 text-comfort-gold" /> 
                                {project.date}
                                <span className="mx-3 text-gray-200">|</span>
                                <Clock size={12} className="mr-2 text-comfort-gold" />
                                {project.status === 'completed' ? t('common.status_completed') : t('common.status_ongoing')}
                            </div>

                            <h3 className="text-2xl font-serif font-bold text-comfort-blue leading-tight group-hover:text-comfort-gold transition-colors duration-300">
                                <Link to={`/projects/${project.id}`}>{project.title}</Link>
                            </h3>

                            <p className="text-gray-500 text-sm font-light leading-relaxed line-clamp-3 flex-grow">
                                {project.description}
                            </p>

                            <div className="pt-4">
                                <Link 
                                    to={`/projects/${project.id}`} 
                                    className="inline-flex items-center text-comfort-blue font-bold text-[11px] uppercase tracking-[0.2em] group/btn"
                                >
                                    {t('projects.view_details')} 
                                    <ArrowRight size={14} className="ml-3 group-hover/btn:translate-x-3 transition-transform duration-300 text-comfort-gold" />
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
                </div>
            ) : (
                /* ÉTAT VIDE - Aucun projet trouvé */
                <div className="text-center py-40 border-2 border-dashed border-gray-100 rounded-lg max-w-4xl mx-auto">
                    <Bookmark size={48} className="mx-auto text-gray-200 mb-6" />
                    <h2 className="text-2xl font-serif font-bold text-comfort-blue mb-2">
                        {t('common.not_found')}
                    </h2>
                    <p className="text-gray-400 font-light">
                        De nouvelles actions de terrain sont en cours de documentation.
                    </p>
                </div>
            )}
        </div>
      </div>

      {/* 🏛️ CALL TO ACTION - Bas de page */}
      <section className="bg-comfort-blue py-24 text-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-serif font-bold mb-8">Soutenir nos initiatives sur le terrain</h2>
            <Link 
                to="/donate" 
                className="inline-block bg-comfort-gold text-white px-10 py-4 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-comfort-blue transition-all duration-300"
            >
                {t('common.support_comfort')}
            </Link>
        </div>
      </section>
    </div>
  );
};

export default Projects;
