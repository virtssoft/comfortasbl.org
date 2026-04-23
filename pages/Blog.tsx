import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { ArrowRight, ChevronLeft, ChevronRight, Bookmark, Calendar, Tag } from 'lucide-react';
import { CardSkeleton } from '../components/Skeletons';

const Blog: React.FC = () => {
  const { t } = useLanguage();
  const { blogPosts, loading } = useData();

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
        <div className="bg-white min-h-screen py-32">
            <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
                <CardSkeleton /><CardSkeleton /><CardSkeleton />
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white animate-in fade-in duration-700">
      
      {/* HEADER - Épuré pour éviter les chevauchements */}
      <section className="py-24 md:py-32 bg-comfort-blue relative overflow-hidden text-white">
          <div className="absolute inset-0 opacity-10">
              <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070" alt="background" className="w-full h-full object-cover" />
          </div>
          <div className="container relative z-10 mx-auto px-6">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                <span className="inline-block px-4 py-1 bg-comfort-gold text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-8">
                   Archives & Impact
                </span>
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight">
                    {t('blog_page.title')}
                </h1>
                <p className="text-lg md:text-xl text-blue-100 font-light leading-relaxed max-w-2xl">
                    {t('blog_page.subtitle')}
                </p>
            </div>
          </div>
      </section>

      {/* ARTICLES - Layout "Grille Propre" */}
      <section className="py-24">
        <div className="container mx-auto px-6">
            {currentPosts.length > 0 ? (
                <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 mb-24">
                    {currentPosts.map((post) => (
                        <div key={post.id} className="group flex flex-col h-full bg-white border border-gray-50 hover:shadow-xl transition-all duration-500">
                            {/* Image de l'article */}
                            <div className="aspect-[16/10] overflow-hidden mb-8 relative">
                                <img 
                                  src={post.image} 
                                  alt={post.title} 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" 
                                />
                                <div className="absolute top-4 left-4 bg-comfort-gold text-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest">
                                    {post.category}
                                </div>
                            </div>

                            {/* Contenu de l'article */}
                            <div className="px-6 pb-8 flex flex-col flex-grow">
                                <div className="flex items-center text-gray-400 text-[10px] font-bold uppercase mb-4 space-x-4">
                                    <span className="flex items-center"><Calendar size={12} className="mr-2 text-comfort-gold" /> {post.date}</span>
                                    <span className="flex items-center"><User size={12} className="mr-2 text-comfort-gold" /> {post.author}</span>
                                </div>
                                
                                <h3 className="text-xl font-serif font-bold text-comfort-dark group-hover:text-comfort-blue transition-colors leading-snug mb-4">
                                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                                </h3>

                                <p className="text-gray-500 text-sm font-light leading-relaxed line-clamp-3 mb-8 italic">
                                    "{post.excerpt}"
                                </p>

                                <div className="mt-auto">
                                    <Link 
                                        to={`/blog/${post.id}`} 
                                        className="inline-flex items-center text-comfort-blue font-bold text-[11px] uppercase tracking-widest border-b-2 border-transparent hover:border-comfort-gold transition-all"
                                    >
                                        {t('blog_page.read_more')} <ArrowRight size={14} className="ml-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-6 pt-12 border-t border-gray-100">
                            <button 
                                onClick={() => paginate(currentPage - 1)} 
                                disabled={currentPage === 1} 
                                className="p-3 border border-gray-200 rounded-full hover:bg-comfort-blue hover:text-white disabled:opacity-20 transition-all"
                            >
                                <ChevronLeft size={20}/>
                            </button>
                            <span className="font-serif italic text-lg text-gray-400">
                                {currentPage} <span className="mx-2">/</span> {totalPages}
                            </span>
                            <button 
                                onClick={() => paginate(currentPage + 1)} 
                                disabled={currentPage === totalPages} 
                                className="p-3 border border-gray-200 rounded-full hover:bg-comfort-blue hover:text-white disabled:opacity-20 transition-all"
                            >
                                <ChevronRight size={20}/>
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-40">
                    <Bookmark size={40} className="mx-auto text-gray-200 mb-6" />
                    <p className="text-gray-400 font-serif italic text-xl">Le journal est actuellement vide.</p>
                </div>
            )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
