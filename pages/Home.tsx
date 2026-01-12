
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, BookOpen, HandCoins, Wheat, Palette, ChevronLeft, ChevronRight, Eye, Users, MousePointer2, TrendingUp, Download, Mail, CheckCircle, Newspaper } from 'lucide-react';
import { DOMAINS } from './constants';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { HeroSkeleton, CardSkeleton } from '../components/Skeletons';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const { projects, blogPosts, bulletins, stats, loading } = useData();
  
  const [currentHero, setCurrentHero] = useState(0);
  const heroItems = blogPosts.slice(0, 5);

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  const nextHero = useCallback(() => {
    if (heroItems.length === 0) return;
    setCurrentHero(prev => (prev + 1) % heroItems.length);
  }, [heroItems.length]);

  const prevHero = useCallback(() => {
    if (heroItems.length === 0) return;
    setCurrentHero(prev => (prev - 1 + heroItems.length) % heroItems.length);
  }, [heroItems.length]);

  useEffect(() => {
    if (heroItems.length > 1) {
      const timer = setInterval(nextHero, 10000);
      return () => clearInterval(timer);
    }
  }, [heroItems.length, nextHero]);

  if (loading) {
    return (
      <div className="bg-white">
        <HeroSkeleton />
        <div className="container mx-auto px-6 py-24 grid md:grid-cols-3 gap-12">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      </div>
    );
  }

  const getIcon = (id: string) => {
    const props = { size: 36, strokeWidth: 1.5, className: "text-comfort-gold group-hover:text-white transition-colors duration-500" };
    switch(id) {
      case 'health': return <Heart {...props} />;
      case 'education': return <BookOpen {...props} />;
      case 'socio_eco': return <HandCoins {...props} />;
      case 'food': return <Wheat {...props} />;
      case 'culture': return <Palette {...props} />;
      default: return <Heart {...props} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans overflow-x-hidden">
      
      {/* 🏛️ HERO CAROUSEL */}
      <section className="relative h-[85vh] md:h-[90vh] bg-comfort-dark overflow-hidden">
        {heroItems.length > 0 ? heroItems.map((post, idx) => (
          <div 
            key={post.id}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${idx === currentHero ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0">
               <img 
                src={post.image} 
                alt={post.title} 
                className={`w-full h-full object-cover animate-ken-burns ${idx === currentHero ? '' : 'hidden'}`} 
               />
               <div className="absolute inset-0 bg-gradient-to-r from-comfort-dark/95 via-comfort-dark/70 to-comfort-dark/40"></div>
            </div>

            <div className="container relative z-20 mx-auto h-full flex items-center px-6 lg:px-12">
              <div className="max-w-4xl animate-fade-in-up">
                <div className="flex items-center space-x-3 mb-6">
                   <span className="h-[2px] w-12 bg-comfort-gold"></span>
                   <span className="text-comfort-gold font-bold tracking-[0.4em] uppercase text-xs">{post.category}</span>
                </div>
                <h1 className="text-4xl md:text-7xl font-serif font-bold text-white leading-tight mb-8 text-balance">
                  {post.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-10 font-light leading-relaxed max-w-2xl border-l-2 border-white/20 pl-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link to={`/blog/${post.id}`} className="bg-comfort-gold text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-comfort-dark transition-all duration-500 shadow-2xl text-center text-xs">
                    Découvrir l'histoire
                  </Link>
                  <Link to="/donate" className="border border-white/30 text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm text-center text-xs">
                    Soutenir l'action
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )) : null}

        <div className="absolute bottom-12 right-12 z-30 flex items-center space-x-6">
           <button onClick={prevHero} className="text-white/50 hover:text-white border border-white/20 p-4 rounded-full transition-all">
             <ChevronLeft size={24} />
           </button>
           <button onClick={nextHero} className="text-white/50 hover:text-white border border-white/20 p-4 rounded-full transition-all">
             <ChevronRight size={24} />
           </button>
        </div>
      </section>

      {/* 🏛️ INSTITUTIONAL MISSION & STATS */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <p className="text-comfort-gold font-bold uppercase tracking-[0.4em] mb-4 text-xs">
                {t('about_section.tag')}
              </p>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-comfort-blue mb-10 leading-tight">
                L'intégrité au service de <span className="italic font-light">l'humanité</span>.
              </h2>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-12">
                COMFORT Asbl bâtit des ponts entre l'urgence humanitaire et le développement durable en RDC. Notre transparence est le socle de notre engagement.
              </p>
              
              <div className="bg-comfort-light p-10 border border-gray-100 shadow-sm space-y-10">
                 <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('about_section.stats_title')}</h4>
                    <TrendingUp size={16} className="text-comfort-gold" />
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="flex flex-col">
                       <span className="text-comfort-blue font-serif font-bold text-3xl mb-1">{(stats?.visitors || 0).toLocaleString()}</span>
                       <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">{t('about_section.visitors')}</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-comfort-blue font-serif font-bold text-3xl mb-1">{(stats?.members || 0).toLocaleString()}</span>
                       <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">{t('home.stats_members')}</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-comfort-blue font-serif font-bold text-3xl mb-1">{(stats?.volunteers || 0).toLocaleString()}</span>
                       <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">{t('home.stats_volunteers')}</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-comfort-blue font-serif font-bold text-3xl mb-1">${(stats?.donations || 0).toLocaleString()}</span>
                       <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Investissement</span>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 relative">
               <div className="space-y-6 pt-12">
                  <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-2xl">
                    <img src="https://api.comfortasbl.org/assets/images/about-who.jpg" className="w-full h-full object-cover" alt="Mission" />
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="p-8 bg-comfort-gold text-white rounded-sm shadow-xl">
                    <h4 className="text-5xl font-serif font-bold mb-2">20</h4>
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-80">Ans de résilience</p>
                  </div>
                  <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-2xl">
                    <img src="https://api.comfortasbl.org/assets/images/about-hero.jpg" className="w-full h-full object-cover" alt="Impact" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏛️ PILIERS D'INTERVENTION */}
      <section className="py-32 bg-comfort-light border-y border-gray-100">
        <div className="container mx-auto px-6 text-center">
           <h2 className="text-4xl font-serif font-bold text-comfort-blue mb-20">Domaines Stratégiques</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 border border-gray-100 shadow-sm">
              {DOMAINS.map((domain) => (
                <Link key={domain.id} to="/about" className="group p-12 bg-white border-r border-b border-gray-100 hover:bg-comfort-blue transition-all duration-700 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-0 bg-comfort-gold group-hover:h-full transition-all duration-700"></div>
                   <div className="mb-8 transform group-hover:-translate-y-2 transition-transform duration-500">
                      {getIcon(domain.id)}
                   </div>
                   <h3 className="text-sm font-bold text-comfort-dark group-hover:text-white mb-4 uppercase tracking-widest">{t(`domains.${domain.id}.title`)}</h3>
                   <p className="text-xs text-gray-400 group-hover:text-gray-300 leading-relaxed font-light line-clamp-2">
                     {t(`domains.${domain.id}.desc`)}
                   </p>
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* 🏛️ BULLETIN D'INFORMATION (NEWSLETTER ARCHIVE) */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-20">
             <div>
                <h2 className="text-4xl font-serif font-bold text-comfort-blue">{t('home.newsletter_title')}</h2>
                <p className="text-gray-500 font-light mt-4">{t('home.newsletter_subtitle')}</p>
             </div>
             <Link to="/bulletins" className="hidden md:flex items-center text-comfort-gold font-bold uppercase text-[10px] tracking-widest hover:text-comfort-blue transition-all">
                Archives PDF <ArrowRight size={14} className="ml-4" />
             </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {bulletins.slice(0, 2).map((bulletin) => (
              <div key={bulletin.id} className="bg-comfort-light p-12 border border-gray-100 flex flex-col md:flex-row items-center gap-10 hover:shadow-2xl transition-all group">
                 <div className="w-24 h-24 bg-white shadow-xl flex items-center justify-center text-comfort-blue group-hover:bg-comfort-blue group-hover:text-white transition-all">
                    <Newspaper size={32} />
                 </div>
                 <div className="flex-1">
                    <span className="text-[10px] font-bold text-comfort-gold uppercase tracking-widest block mb-2">{bulletin.date}</span>
                    <h3 className="text-xl font-serif font-bold text-comfort-blue mb-4 leading-tight">{bulletin.title}</h3>
                    <p className="text-sm text-gray-500 font-light leading-relaxed line-clamp-2 mb-6">{bulletin.summary}</p>
                    <a href={bulletin.pdfLink} target="_blank" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-comfort-blue hover:text-comfort-gold transition-colors">
                        Consulter le rapport <Download size={14} className="ml-3" />
                    </a>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏛️ NEWSLETTER SIGNUP */}
      <section className="py-32 bg-comfort-blue text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-comfort-gold/5 skew-x-12 translate-x-1/2"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
             <Mail size={48} className="text-comfort-gold mx-auto mb-8" />
             <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">{t('home.subscribe_title')}</h2>
             <p className="text-xl text-blue-100 font-light mb-12 leading-relaxed">
               {t('home.subscribe_text')}
             </p>
             
             {subscribed ? (
               <div className="flex items-center justify-center space-x-4 animate-in zoom-in">
                  <CheckCircle className="text-comfort-gold" size={24} />
                  <span className="text-xl font-bold">Inscription validée ! Merci pour votre confiance.</span>
               </div>
             ) : (
               <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                 <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@institution.org"
                    className="flex-1 bg-white/10 border border-white/20 px-8 py-5 text-lg outline-none focus:bg-white/20 transition-all font-light"
                 />
                 <button className="bg-comfort-gold text-white px-12 py-5 font-bold uppercase tracking-widest hover:bg-white hover:text-comfort-blue transition-all shadow-2xl text-xs whitespace-nowrap">
                   {t('home.subscribe_btn')}
                 </button>
               </form>
             )}
          </div>
        </div>
      </section>

      {/* 🏛️ BLOG / ACTUALITÉS */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-20">
             <h2 className="text-4xl font-serif font-bold text-comfort-blue">Blog & Récits</h2>
             <Link to="/blog" className="text-comfort-gold font-bold uppercase text-[10px] tracking-widest hover:text-comfort-blue transition-all">Consulter tout le blog</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {blogPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="group border-b border-gray-50 pb-12 transition-all">
                 <div className="aspect-[16/10] relative overflow-hidden mb-8 rounded-sm shadow-sm group-hover:shadow-2xl transition-all duration-700">
                    <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={post.title} />
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[9px] font-bold text-comfort-blue flex items-center">
                       <Eye size={10} className="mr-2" /> {post.views}
                    </div>
                 </div>
                 <div className="space-y-4">
                    <span className="text-comfort-gold font-bold text-[10px] uppercase tracking-widest">{post.category}</span>
                    <h3 className="text-2xl font-serif font-bold text-comfort-dark leading-tight group-hover:text-comfort-blue transition-colors">
                      <Link to={`/blog/${post.id}`}>{post.title}</Link>
                    </h3>
                    <p className="text-gray-500 text-sm font-light leading-relaxed line-clamp-3">
                       {post.excerpt}
                    </p>
                    <Link to={`/blog/${post.id}`} className="inline-flex items-center text-comfort-blue font-bold text-[10px] uppercase tracking-widest hover:text-comfort-gold transition-all">
                       Lire l'article <ArrowRight size={14} className="ml-4" />
                    </Link>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
