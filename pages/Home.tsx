import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Heart, BookOpen, HandCoins, Wheat, Palette, 
  ChevronLeft, ChevronRight, Calendar, User, MapPin, Mail, 
  Phone, Clock, Facebook, Copy, CheckCircle2, 
  Quote, Newspaper, Download 
} from 'lucide-react';
import { DOMAINS, CONTACT_INFO } from './constants';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { HeroSkeleton, CardSkeleton } from '../components/Skeletons';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const { projects, partners, blogPosts, testimonials, bulletins, loading } = useData();
  
  const [currentHero, setCurrentHero] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [copied, setCopied] = useState(false);

  const contactAddress = CONTACT_INFO?.address || "Goma, Nord-Kivu, RDC";
  const contactEmail = CONTACT_INFO?.email || "contact@comfortasbl.org";
  const contactPhone = CONTACT_INFO?.phone || "+243 000 000 000";

  const heroItems = useMemo(() => blogPosts.slice(0, 5), [blogPosts]);
  const yearsOfExistence = new Date().getFullYear() - 2019;

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

  useEffect(() => {
    if (testimonials.length > 1) {
      const timer = setInterval(() => {
        setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [testimonials.length]);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('00017220062000003346537');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop";
  };

  if (loading) return (
    <div className="bg-white">
      <HeroSkeleton />
      <div className="container mx-auto px-6 py-24 grid md:grid-cols-3 gap-12"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
    </div>
  );

  const getIcon = (id: string) => {
    const props = { size: 36, strokeWidth: 1.5, className: "text-comfort-gold" };
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
      
      {/* 🏛️ SECTION 1: HERO OPTIMISÉ */}
      <section className="relative h-[85vh] md:h-[90vh] bg-comfort-dark overflow-hidden">
        {heroItems.map((post, idx) => (
          <div key={post.id} className={`absolute inset-0 transition-opacity duration-[2000ms] ${idx === currentHero ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <div className="absolute inset-0">
               <img src={post.image} alt={post.title} className="w-full h-full object-cover animate-ken-burns" />
               {/* Overlay renforcé pour la lisibilité */}
               <div className="absolute inset-0 bg-comfort-dark/40"></div>
               <div className="absolute inset-0 bg-gradient-to-r from-comfort-dark/90 via-comfort-dark/40 to-transparent"></div>
            </div>
            <div className="container relative z-20 mx-auto h-full flex items-center px-6 lg:px-12">
              <div className="max-w-3xl animate-fade-in-up">
                <div className="flex items-center space-x-3 mb-6">
                   <span className="h-[2px] w-12 bg-comfort-gold"></span>
                   <span className="text-comfort-gold font-bold tracking-[0.4em] uppercase text-[10px]">{post.category}</span>
                </div>
                {/* Typographie ajustée pour éviter l'effet "bloc" illisible */}
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 leading-[1.1] drop-shadow-lg">
                  {post.title}
                </h1>
                <p className="text-base md:text-lg text-gray-200 mb-10 font-light border-l-2 border-comfort-gold/50 pl-6 line-clamp-2 max-w-xl">
                  {post.excerpt}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={`/blog/${post.id}`} className="bg-comfort-gold text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-comfort-dark transition-all text-center text-[10px]">{t('common.more')}</Link>
                  <Link to="/donate" className="border border-white/30 text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-center text-[10px]">{t('nav.donate')}</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-12 right-12 z-30 flex items-center space-x-6">
            <button onClick={prevHero} className="text-white/50 hover:text-white border border-white/20 p-4 rounded-full transition-colors"><ChevronLeft size={24} /></button>
            <button onClick={nextHero} className="text-white/50 hover:text-white border border-white/20 p-4 rounded-full transition-colors"><ChevronRight size={24} /></button>
        </div>
      </section>

      {/* 🏛️ SECTION 2: MISSION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <p className="text-comfort-gold font-bold uppercase tracking-[0.4em] mb-4 text-[10px]">{t('about_section.tag')}</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-comfort-blue mb-8 leading-tight">L'intégrité au service de <span className="italic font-light text-comfort-gold">l'humanité</span>.</h2>
              <p className="text-lg text-gray-600 font-light leading-relaxed mb-12">{t('about_page.who_text')}</p>
              <Link to="/about" className="inline-flex items-center text-comfort-blue font-bold uppercase tracking-widest group text-xs">
                {t('footer.history')} <ArrowRight className="ml-4 group-hover:translate-x-3 transition-transform text-comfort-gold" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-6 pt-12">
                  <img src="https://api.comfortasbl.org/assets/images/about-who.jpg" className="aspect-[3/4] object-cover rounded-sm shadow-2xl" alt="Action" />
                  <div className="p-8 bg-comfort-blue text-white rounded-sm shadow-xl">
                    <h4 className="text-5xl font-serif font-bold mb-2">{projects.length}+</h4>
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-80">Programmes</p>
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="p-8 bg-comfort-gold text-white rounded-sm shadow-xl">
                    <h4 className="text-5xl font-serif font-bold mb-2">{yearsOfExistence}</h4>
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-80">Années d'impact</p>
                  </div>
                  <img src="https://api.comfortasbl.org/assets/images/about-hero.jpg" className="aspect-[3/4] object-cover rounded-sm shadow-2xl" alt="Impact" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏛️ SECTION 3: DOMAINES */}
      <section className="py-24 bg-comfort-light border-y border-gray-100">
        <div className="container mx-auto px-6">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl font-serif font-bold text-comfort-blue mb-6">{t('nav.domains')}</h2>
              <p className="text-gray-500 font-light text-lg">{t('about_page.objectives_intro')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 border border-gray-100 shadow-sm">
              {DOMAINS.map((domain) => (
                <div key={domain.id} className="group p-10 bg-white border-r border-b border-gray-100 hover:bg-comfort-blue transition-all duration-700 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-0 bg-comfort-gold group-hover:h-full transition-all duration-700"></div>
                   <div className="mb-8 group-hover:-translate-y-2 transition-transform">{getIcon(domain.id)}</div>
                   <h3 className="text-xs font-bold text-comfort-dark group-hover:text-white mb-4 uppercase tracking-widest">{t(`domains.${domain.id}.title`)}</h3>
                   <p className="text-[11px] text-gray-400 group-hover:text-gray-300 font-light leading-relaxed">{t(`domains.${domain.id}.desc`)}</p>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* 🏛️ SECTION 4: ACTUALITÉS (BLOG) */}
      <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                  <div>
                      <h2 className="text-3xl font-serif font-bold text-comfort-blue mb-4">{t('blog_page.title')}</h2>
                      <p className="text-gray-600">{t('blog_page.subtitle')}</p>
                  </div>
                  <Link to="/blog" className="text-comfort-blue font-bold tracking-wide uppercase hover:underline flex items-center mt-4 md:mt-0 text-xs">
                      {t('nav.blog')} <ArrowRight size={16} className="ml-2" />
                  </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                  {blogPosts.slice(0, 3).map((post) => (
                      <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                          <div className="relative h-48 overflow-hidden">
                              <img src={post.image} alt={post.title} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="p-6">
                              <div className="flex items-center text-[10px] text-gray-400 mb-3 space-x-4 uppercase font-bold">
                                  <span className="flex items-center"><Calendar size={12} className="mr-1"/> {post.date}</span>
                                  <span className="flex items-center"><User size={12} className="mr-1"/> {post.author}</span>
                              </div>
                              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-comfort-blue transition-colors leading-snug">
                                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                              </h3>
                              <Link to={`/blog/${post.id}`} className="text-comfort-blue font-bold text-[10px] uppercase flex items-center hover:underline">
                                  {t('common.more')} <ArrowRight size={14} className="ml-2" />
                              </Link>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 🏛️ SECTION 5: TÉMOIGNAGES */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-center text-3xl font-serif font-bold text-comfort-blue mb-12">{t('home.testimonials_title')}</h2>
            <div className="bg-comfort-light p-12 relative border border-gray-50 rounded-sm">
               <Quote size={60} className="absolute top-10 right-10 text-comfort-gold opacity-10" />
               <p className="text-xl md:text-2xl font-serif italic text-comfort-blue mb-12">"{testimonials[currentTestimonial].message}"</p>
               <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-comfort-blue rounded-full flex items-center justify-center text-white font-bold">{testimonials[currentTestimonial].nom_complet.charAt(0)}</div>
                  <div><h4 className="font-bold text-comfort-blue uppercase tracking-widest text-xs">{testimonials[currentTestimonial].nom_complet}</h4></div>
               </div>
            </div>
          </div>
        </section>
      )}

      {/* 🏛️ SECTION 6: PARTENAIRES MARQUEE */}
      <section className="py-16 bg-white border-t border-gray-100 overflow-hidden relative">
         <div className="container mx-auto px-4 mb-8 text-center">
             <h3 className="text-[10px] font-serif font-bold text-gray-400 uppercase tracking-[0.5em]">{t('nav.partners')}</h3>
         </div>
         <div className="flex w-max animate-marquee items-center py-4">
            {[...partners, ...partners].map((p, idx) => (
                <div key={idx} className="w-48 flex items-center justify-center shrink-0 mx-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <img src={p.logo} alt={p.name} className="max-h-12 w-auto object-contain" />
                </div>
            ))}
         </div>
         <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-marquee { animation: marquee 30s linear infinite; }`}</style>
      </section>

      {/* 🏛️ SECTION 7: CTA DONATION */}
      <section className="py-32 relative flex items-center justify-center text-center">
         <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop" alt="Don" className="absolute inset-0 w-full h-full object-cover" />
         <div className="absolute inset-0 bg-comfort-blue/85 mix-blend-multiply"></div>
         <div className="container relative z-10 px-4 text-white">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-10 leading-tight">{t('about_page.mission_title')}</h2>
            <Link to="/donate" className="inline-block bg-white text-comfort-blue px-12 py-5 rounded-sm text-xs font-bold uppercase tracking-[0.2em] hover:bg-comfort-gold hover:text-white transition-all shadow-2xl">
              {t('nav.donate')}
            </Link>
         </div>
      </section>

      {/* 🏛️ SECTION 8: CONTACT & BANQUE */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
           <div className="grid lg:grid-cols-2 gap-20">
              <div>
                 <h2 className="text-3xl font-serif font-bold text-comfort-blue mb-6">{t('contact.title')}</h2>
                 <p className="text-gray-600 mb-10 text-lg leading-relaxed font-light">{t('contact.subtitle')}</p>
                 <div className="space-y-8">
                    <div className="flex items-start"><MapPin className="text-comfort-gold mt-1 mr-6" size={24} /><div><h4 className="font-bold text-gray-900 uppercase text-[10px] tracking-widest mb-1">{t('contact.address')}</h4><p className="text-gray-600 text-sm">{contactAddress}</p></div></div>
                    <div className="flex items-start"><Mail className="text-comfort-gold mt-1 mr-6" size={24} /><div><h4 className="font-bold text-gray-900 uppercase text-[10px] tracking-widest mb-1">{t('contact.email')}</h4><p className="text-gray-600 text-sm">{contactEmail}</p></div></div>
                    <div className="flex items-start"><Phone className="text-comfort-gold mt-1 mr-6" size={24} /><div><h4 className="font-bold text-gray-900 uppercase text-[10px] tracking-widest mb-1">{t('contact.phone')}</h4><p className="text-gray-600 text-sm">{contactPhone}</p></div></div>
                 </div>
              </div>

              <div className="bg-gray-50 p-10 rounded-sm border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-bold mb-10 text-gray-900 uppercase tracking-widest text-center">Support Institutionnel</h3>
                  <div className="space-y-4 mb-12">
                      <a href={`mailto:${contactEmail}`} className="flex items-center justify-center w-full bg-comfort-blue text-white font-bold py-4 rounded-sm uppercase text-[10px] tracking-widest hover:bg-comfort-dark transition-colors"><Mail className="mr-3" size={16} /> {t('contact.send')}</a>
                  </div>

                  <div className="pt-10 border-t border-gray-200">
                      <h4 className="text-[10px] font-bold text-comfort-blue uppercase tracking-[0.2em] mb-6 flex items-center"><HandCoins size={18} className="mr-3 text-comfort-gold" /> Coordonnées Bancaires</h4>
                      <div className="bg-white p-6 rounded-sm border border-dashed border-gray-300 space-y-4">
                          <div className="flex justify-between items-end">
                              <div><p className="text-[8px] uppercase text-gray-400 font-bold mb-1">Intitulé</p><p className="text-xs font-bold text-gray-800">COMFORT ASBL</p></div>
                              <div className="text-right"><p className="text-[8px] uppercase text-gray-400 font-bold mb-1">Banque</p><p className="text-xs text-gray-800">TMB S.A.</p></div>
                          </div>
                          <div>
                              <p className="text-[8px] uppercase text-gray-400 font-bold mb-1">Numéro de compte (USD)</p>
                              <div className="flex items-center justify-between bg-gray-50 p-3 rounded mt-1 border border-gray-100">
                                  <code className="text-xs font-mono text-comfort-blue font-bold">00017220062000003346537</code>
                                  <button onClick={handleCopyAccount} className="text-comfort-gold hover:scale-110 transition-transform">{copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
