
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { ArrowRight, Calendar, Bookmark } from 'lucide-react';
import { CardSkeleton } from '../components/Skeletons';

const Projects: React.FC = () => {
  const { t } = useLanguage();
  const { projects, loading } = useData();
  
  const getFirstSentence = (text: string) => {
      if (!text) return "";
      const match = text.match(/([^\.!\?]+[\.!\?]+)/);
      return match ? match[1] : text;
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* HEADER INSTITUTIONNEL */}
      <div className="py-32 bg-comfort-light border-b border-gray-100">
        <div className="container mx-auto px-6">
            <div className="max-w-3xl">
              <span className="text-comfort-gold font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Archive des Actions</span>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-comfort-blue mb-8 leading-tight">Nos Engagements & Impact Réel</h1>
              <p className="text-xl text-gray-500 font-light leading-relaxed">
                Consultez nos rapports d'intervention classés par catégorie. Chaque projet est une promesse tenue envers les communautés vulnérables.
              </p>
            </div>
        </div>
      </div>

      {/* PROJECTS GRID - Style Grille de Fondation */}
      <div className="py-24">
        <div className="container mx-auto px-6">
            {loading ? (
                <div className="grid md:grid-cols-3 gap-12">
                  <CardSkeleton /><CardSkeleton /><CardSkeleton />
                </div>
            ) : projects.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
                {projects.map((project) => (
                    <div key={project.id} className="group border-b border-gray-100 pb-12 transition-all duration-500">
                        <div className="aspect-[16/10] overflow-hidden mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-700 rounded-sm">
                            <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1500ms]"
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-comfort-gold font-bold text-[10px] uppercase tracking-[0.2em]">{project.category}</span>
                                <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase">
                                    <Calendar size={12} className="mr-2" /> {project.date}
                                </div>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-comfort-blue leading-tight group-hover:text-comfort-gold transition-colors">
                                <Link to={`/projects/${project.id}`}>{project.title}</Link>
                            </h3>
                            <p className="text-gray-500 text-sm font-light leading-relaxed line-clamp-3">
                                {project.description}
                            </p>
                            <Link to={`/projects/${project.id}`} className="inline-flex items-center text-comfort-blue font-bold text-xs uppercase tracking-widest group/btn">
                                {t('projects.view_details')} <ArrowRight size={14} className="ml-3 group-hover/btn:translate-x-3 transition-transform text-comfort-gold" />
                            </Link>
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="text-center py-40 border-2 border-dashed border-gray-100 rounded-lg">
                    <Bookmark size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-serif italic text-xl">Aucun rapport d'action disponible pour le moment.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
