import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Heart, BookOpen, HandCoins, Wheat, Palette, 
  ChevronLeft, ChevronRight, Calendar, User, MapPin, Mail, 
  Phone, Clock, Facebook, Copy, CheckCircle2, 
  Quote, Newspaper, Download // Ajoutés car présents dans ton return
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

  // Fallbacks de contact
  const contactAddress = CONTACT_INFO?.address || "Goma, Nord-Kivu, RDC";
  const contactEmail = CONTACT_INFO?.email || "contact@comfortasbl.org";
  const contactPhone = CONTACT_INFO?.phone || "+243 000 000 000";

  // Mémorisation des items pour éviter les changements de référence
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

  // Rotation automatique des témoignages
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
      
      {/* 🏛️ SECTION 1: HERO CAROUSEL */}
      <section className="relative h-[85vh] md:h-[90vh] bg-comfort-dark overflow-hidden">
        {heroItems.map((post, idx) => (
          <div 
            key={post.id}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${idx === currentHero ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0">
               <img src={post.image} alt={post.title} className="w-full h-full object-cover animate-ken-burns" />
               <div className="absolute inset-0 bg-gradient-to-r from-comfort-dark/95 via-comfort-dark/70 to-transparent"></div>
            </div>
            <div className="container relative z-20 mx-auto h-full flex items-center px-6 lg:px-12">
              <div className="max-w-2xl animate-fade-in-up">
                <div className="flex items-center space-x-3 mb-6">
                   <span className="h-[2px] w-12 bg-comfort-gold"></span>
                   <span className="text-comfort-gold font-bold tracking-[0.4em] uppercase text-xs">{post.category}</span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">{post.title}</h1>
                <p className="text-lg md:text-xl text-gray-300 mb-10 font-light border-l-2 border-white/20 pl-6 line-clamp-3">{post.excerpt}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={`/blog/${post.id}`} className="bg-comfort-gold text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-comfort-dark transition-all text-center text-xs">Découvrir l'histoire</Link>
                  <Link to="/donate" className="border border-white/30 text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-center text-xs">Soutenir l'action</Link>
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

      {/* 🏛️ SECTION 2: MISSION & STATS */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <p className="text-comfort-gold font-bold uppercase tracking-[0.4em] mb-4 text-xs">{t('about_section.tag')}</p>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-comfort-blue mb-8 leading-tight">
                L'intégrité au service de <span className="italic font-light">l'humanité</span>.
              </h2>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-12">
                COMFORT Asbl agit pour l'autonomisation des communautés en RDC, bâtissant des ponts durables entre l'urgence et le développement.
              </p>
              <Link to="/about" className="inline-flex items-center text-comfort-blue font-bold uppercase tracking-widest group text-sm">
                Notre charte institutionnelle <ArrowRight className="ml-4 group-hover:translate-x-3 transition-transform text-comfort-gold" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-6 pt-12">
                  <img src="https://api.comfortasbl.org/assets/images/about-who.jpg" className="aspect-[3/4] object-cover rounded-sm shadow-2xl" alt="Mission" />
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
                  <img src="https://api.comfortasbl.org/assets/images/about-hero.jpg" className="aspect-[3/4] object-cover rounded-sm shadow-2xl" alt="Vision" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏛️ SECTION 3: DOMAINES D'INTERVENTION */}
      <section className="py-24 bg-comfort-light border-y border-gray-100">
        <div className="container mx-auto px-6">
           <div className="max-w-2xl mb-16">
              <h2 className="text-4xl font-serif font-bold text-comfort-blue mb-6">Piliers d'Intervention</h2>
              <p className="text-gray-500 font-light text-lg">Une méthodologie rigoureuse au service des besoins les plus critiques.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 border border-gray-100 shadow-sm">
              {DOMAINS.map((domain) => (
                <div key={domain.id} className="group p-10 bg-white border-r border-b border-gray-100 hover:bg-comfort-blue transition-all duration-700 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-0 bg-comfort-gold group-hover:h-full transition-all duration-700"></div>
                   <div className="mb-8 group-hover:-translate-y-2 transition-transform">{getIcon(domain.id)}</div>
                   <h3 className="text-sm font-bold text-comfort-dark group-hover:text-white mb-4 uppercase tracking-widest">{t(`domains.${domain.id}.title`)}</h3>
                   <p className="text-xs text-gray-400 group-hover:text-gray-300 font-light leading-relaxed">{t(`domains.${domain.id}.desc`)}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 🟦 SECTION 4: ACTUALITÉS */}
      {blogPosts.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                  <div>
                      <h2 className="text-3xl font-serif font-bold text-comfort-blue mb-4">{t('news.title')}</h2>
                      <p className="text-gray-600">{t('news.subtitle')}</p>
                  </div>
                  <Link to="/blog" className="text-comfort-blue font-bold tracking-wide uppercase hover:underline flex items-center mt-4 md:mt-0">
                      {t('news.all')} <ArrowRight size={16} className="ml-2" />
                  </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                  {blogPosts.slice(0, 3).map((post) => (
                      <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                          <div className="relative h-48 overflow-hidden">
                              <img src={post.image} alt={post.title} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded text-[10px] font-bold text-comfort-blue uppercase">{post.category}</div>
                          </div>
                          <div className="p-6">
                              <div className="flex items-center text-[10px] text-gray-400 mb-3 space-x-4 uppercase font-bold">
                                  <span className="flex items-center"><Calendar size={12} className="mr-1"/> {post.date}</span>
                                  <span className="flex items-center"><User size={12} className="mr-1"/> {post.author}</span>
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-comfort-blue transition-colors leading-snug">
                                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                              </h3>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                              <Link to={`/blog/${post.id}`} className="text-comfort-blue font-bold text-xs uppercase flex items-center hover:underline">
                                  {t('news.read')} <ArrowRight size={14} className="ml-2" />
                              </Link>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
        </section>
      )}
  {/* 🏛️ SECTION 4: TÉMOIGNAGES (SÉCURISÉE) */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="bg-comfort-light p-12 relative border border-gray-50 rounded-sm">
               <Quote size={60} className="absolute top-10 right-10 text-comfort-gold opacity-10" />
               <p className="text-2xl font-serif italic text-comfort-blue mb-12">"{testimonials[currentTestimonial].message}"</p>
               <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-comfort-blue rounded-full flex items-center justify-center text-white font-bold">
                    {testimonials[currentTestimonial].nom_complet.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-comfort-blue uppercase tracking-widest">{testimonials[currentTestimonial].nom_complet}</h4>
                  </div>
               </div>
            </div>
          </div>
        </section>
      )}

      {/* 🏛️ SECTION 5: GAZETTE & BULLETINS */}
      {bulletins.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-serif font-bold text-comfort-blue mb-12">Gazettes & Rapports</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {bulletins.slice(0, 2).map((bulletin) => (
                <div key={bulletin.id} className="bg-white p-8 border border-gray-100 flex items-center gap-6">
                   <Newspaper className="text-comfort-gold" size={32} />
                   <div className="flex-1">
                      <h3 className="font-bold text-comfort-blue mb-2">{bulletin.title}</h3>
                      <a href={bulletin.pdf_path} target="_blank" rel="noreferrer" className="text-xs font-bold text-comfort-gold uppercase flex items-center">
                        Télécharger <Download size={14} className="ml-2" />
                      </a>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* ⬛ SECTION 5: PARTENAIRES (MARQUEE) */}
      <section className="py-16 bg-white border-t border-gray-100 overflow-hidden relative">
         <div className="container mx-auto px-4 mb-8 text-center">
             <h3 className="text-xs font-serif font-bold text-gray-400 uppercase tracking-[0.5em]">{t('partners.title')}</h3>
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

      {/* 🟩 SECTION 6: CTA PREMIUM */}
      <section className="py-32 relative flex items-center justify-center text-center">
         <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop" alt="CTA" className="absolute inset-0 w-full h-full object-cover" />
         <div className="absolute inset-0 bg-comfort-blue/85 mix-blend-multiply"></div>
         <div className="container relative z-10 px-4 text-white">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-10 leading-tight">{t('cta.title')}</h2>
            <Link to="/donate" className="inline-block bg-white text-comfort-blue px-12 py-5 rounded-sm text-sm font-bold uppercase tracking-[0.2em] hover:bg-comfort-gold hover:text-white transition-all shadow-2xl">
              {t('cta.button')}
            </Link>
         </div>
      </section>

      {/* 🟦 SECTION 7: CONTACT & BANQUE */}
      <section className="py-24 bg-white" id="contact-section">
        <div className="container mx-auto px-6">
           <div className="grid lg:grid-cols-2 gap-20">
              <div>
                 <h2 className="text-3xl font-serif font-bold text-comfort-blue mb-6">{t('contact.title')}</h2>
                 <p className="text-gray-600 mb-10 text-lg leading-relaxed">{t('contact.desc')}</p>
                 <div className="space-y-8">
                    <div className="flex items-start">
                       <MapPin className="text-comfort-gold mt-1 mr-6" size={24} />
                       <div>
                          <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest mb-1">{t('contact.address')}</h4>
                          <p className="text-gray-600">{contactAddress}</p>
                       </div>
                    </div>
                    <div className="flex items-start">
                       <Mail className="text-comfort-gold mt-1 mr-6" size={24} />
                       <div>
                          <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest mb-1">{t('contact.email')}</h4>
                          <p className="text-gray-600">{contactEmail}</p>
                       </div>
                    </div>
                    <div className="flex items-start">
                       <Phone className="text-comfort-gold mt-1 mr-6" size={24} />
                       <div>
                          <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest mb-1">{t('contact.phone')}</h4>
                          <p className="text-gray-600">{contactPhone}</p>
                       </div>
                    </div>
                 </div>
                 <div className="mt-12 h-64 bg-gray-50 rounded-sm overflow-hidden border border-gray-100">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127641.51705646199!2d29.15545293674683!3d-1.658604928230554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dd0f339890a8fb%3A0x633513364f9c636f!2sGoma!5e0!3m2!1sfr!2scd!4v1700000000000" width="100%" height="100%" style={{ border: 0 }} allowFullScreen title="Map" loading="lazy"></iframe>
                 </div>
              </div>

              <div className="bg-gray-50 p-10 md:p-14 rounded-sm border border-gray-100 shadow-sm">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Contact Direct</h3>
                  <p className="text-gray-600 mb-10">Garantir une réponse rapide et humaine sans intermédiaires.</p>
                  <div className="space-y-4 mb-12">
                      <a href={`mailto:${contactEmail}`} className="flex items-center justify-center w-full bg-comfort-blue text-white font-bold py-4 rounded-sm uppercase text-xs tracking-widest hover:bg-comfort-dark transition-colors"><Mail className="mr-3" size={18} /> Envoyer un Email</a>
                      <a href={`tel:${contactPhone}`} className="flex items-center justify-center w-full bg-white text-comfort-blue border-2 border-comfort-blue font-bold py-4 rounded-sm uppercase text-xs tracking-widest hover:bg-blue-50 transition-colors"><Phone className="mr-3" size={18} /> Appeler maintenant</a>
                  </div>

                  {/* BANQUE SECTION */}
                  <div className="pt-10 border-t border-gray-200">
                      <h4 className="text-xs font-bold text-comfort-blue uppercase tracking-[0.2em] mb-6 flex items-center"><HandCoins size={18} className="mr-3 text-comfort-gold" /> Coordonnées Bancaires</h4>
                      <div className="bg-white p-6 rounded-sm border border-dashed border-gray-300 space-y-4">
                          <div className="flex justify-between items-end">
                              <div>
                                  <p className="text-[9px] uppercase text-gray-400 font-bold mb-1">Intitulé</p>
                                  <p className="text-sm font-bold text-gray-800 tracking-tight">COMFORT ASBL</p>
                              </div>
                              <div className="text-right">
                                  <p className="text-[9px] uppercase text-gray-400 font-bold mb-1">Banque</p>
                                  <p className="text-sm text-gray-800">TMB S.A.</p>
                              </div>
                          </div>
                          <div>
                              <p className="text-[9px] uppercase text-gray-400 font-bold mb-1">Numéro de compte (USD)</p>
                              <div className="flex items-center justify-between bg-gray-50 p-3 rounded mt-1 border border-gray-100">
                                  <code className="text-xs font-mono text-comfort-blue font-bold">00017220062000003346537</code>
                                  <button onClick={handleCopyAccount} className="text-comfort-gold hover:scale-110 transition-transform">
                                      {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                                  </button>
                              </div>
                          </div>
                          <div className="flex justify-between items-center text-[10px] pt-2">
                              <span className="font-bold text-gray-400 uppercase tracking-widest">SWIFT: <span className="text-gray-800">TRMSCD3L</span></span>
                              <span className="bg-comfort-gold/10 text-comfort-gold px-2 py-0.5 rounded font-bold">DRC - GOMA</span>
                          </div>
                      </div>
                  </div>

                  <div className="mt-10 flex justify-center space-x-6 grayscale opacity-60">
                      <a href="https://x.com/AsblComfor44668" target="_blank" rel="noreferrer" className="hover:text-comfort-blue transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                      <a href="https://facebook.com/comfortasbl" target="_blank" rel="noreferrer" className="hover:text-comfort-blue transition-colors"><Facebook size={20} /></a>
                  </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

