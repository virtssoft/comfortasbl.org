
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { ArrowRight, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
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
      
      {/* HEADER DE REVUE */}
      <section className="py-32 border-b border-gray-100">
         <div className="container mx-auto px-6">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                <span className="h-[1px] w-20 bg-comfort-gold mb-8"></span>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-comfort-blue mb-8 tracking-tight">{t('blog_page.title')}</h1>
                <p className="text-xl text-gray-500 font-light leading-relaxed">{t('blog_page.subtitle')}</p>
                <span className="h-[1px] w-20 bg-comfort-gold mt-8"></span>
            </div>
         </div>
      </section>

      {/* ARTICLES - Layout "Editorial" */}
      <section className="py-24">
        <div className="container mx-auto px-6">
            {currentPosts.length > 0 ? (
                <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16 mb-24">
                    {currentPosts.map((post, i) => (
                        <div key={post.id} className={`group ${i % 2 !== 0 ? 'md:translate-y-12' : ''} transition-all duration-700`}>
                            <div className="aspect-[4/3] overflow-hidden mb-10 shadow-sm group-hover:shadow-2xl transition-all duration-1000">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <span className="text-comfort-gold font-bold text-[10px] uppercase tracking-[0.3em]">{post.category}</span>
                                    <span className="text-gray-300 text-xs">|</span>
                                    <span className="text-gray-400 text-[10px] font-bold uppercase">{post.date}</span>
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-comfort-dark group-hover:text-comfort-blue transition-colors leading-tight">
                                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                                </h3>
                                <p className="text-gray-500 text-sm font-light leading-relaxed line-clamp-3 italic">
                                    "{post.excerpt}"
                                </p>
                                <Link to={`/blog/${post.id}`} className="inline-flex items-center text-comfort-blue font-bold text-xs uppercase tracking-widest hover:text-comfort-gold transition-colors">
                                    {t('blog_page.read_more')} <ArrowRight size={14} className="ml-3" />
                                </Link>
                            </div>
                        </div>
                    ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-4">
                            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-4 border border-gray-100 rounded-full hover:border-comfort-gold text-gray-400 hover:text-comfort-gold disabled:opacity-20 transition-all"><ChevronLeft/></button>
                            <span className="font-serif italic text-lg text-gray-400">Page {currentPage} sur {totalPages}</span>
                            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-4 border border-gray-100 rounded-full hover:border-comfort-gold text-gray-400 hover:text-comfort-gold disabled:opacity-20 transition-all"><ChevronRight/></button>
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

      {/* CTA - Institutional Minimal */}
      <section className="py-32 bg-comfort-light border-t border-gray-100">
        <div className="container mx-auto px-6 text-center max-w-3xl">
            <h2 className="text-4xl font-serif font-bold text-comfort-blue mb-8">Restez connecté à nos <span className="italic">actions</span>.</h2>
            <p className="text-gray-500 font-light mb-12">Recevez chaque mois un résumé de nos interventions et des récits de vie transformés directement par email.</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <input type="email" placeholder="Votre adresse email institutionnelle" className="px-8 py-5 bg-white border border-gray-200 flex-1 outline-none focus:border-comfort-gold transition-colors font-light" />
                <button className="bg-comfort-blue text-white px-12 py-5 font-bold uppercase tracking-widest hover:bg-comfort-gold transition-all duration-500 shadow-xl">S'abonner</button>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
