
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, BookOpen, HandCoins, Wheat, Palette, ChevronLeft, ChevronRight, Eye, Download, CheckCircle, Newspaper, Quote, MessageSquare, Send, User, Briefcase, Phone, Mail } from 'lucide-react';
import { DOMAINS } from './constants';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { api, API_BASE_URL } from '../services/api';
import { HeroSkeleton, CardSkeleton } from '../components/Skeletons';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const { projects, blogPosts, bulletins, testimonials, loading } = useData();
  
  const [currentHero, setCurrentHero] = useState(0);
  const heroItems = blogPosts.slice(0, 5);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonyForm, setTestimonyForm] = useState({
    nom_complet: '',
    email: '',
    telephone: '',
    role: 'benevole',
    organisation: '',
    message: ''
  });
  const [testimonyLoading, setTestimonyLoading] = useState(false);

  const nextHero = useCallback(() => {
    if (heroItems.length === 0) return;
    setCurrentHero(prev => (prev + 1) % heroItems.length);
  }, [heroItems.length]);

  const prevHero = useCallback(() => {
    if (heroItems.length === 0) return;
    setCurrentHero(prev => (prev - 1 + heroItems.length) % heroItems.length);
  }, [heroItems.length]);

  const nextTestimonial = useCallback(() => {
    if (testimonials.length === 0) return;
    setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (heroItems.length > 1) {
      const timer = setInterval(nextHero, 10000);
      return () => clearInterval(timer);
    }
  }, [heroItems.length, nextHero]);

  useEffect(() => {
    if (testimonials.length > 1) {
      const timer = setInterval(nextTestimonial, 8000);
      return () => clearInterval(timer);
    }
  }, [testimonials.length, nextTestimonial]);

  const handleTestimonySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestimonyLoading(true);
    try {
      const res = await api.sendData('testimonials.php', 'POST', {
          nom_complet: testimonyForm.nom_complet,
          email: testimonyForm.email,
          telephone: testimonyForm.telephone,
          role: testimonyForm.role,
          organisation: testimonyForm.organisation || null,
          message: testimonyForm.message,
          status: 'actif'
      });
      
      if (res.success || res.message?.includes('succès')) {
          window.location.reload();
      }
    } catch (err) {
      console.error("Testimonial API Error:", err);
      alert("Une erreur est survenue lors de l'envoi du témoignage.");
    } finally {
      setTestimonyLoading(false);
    }
  };

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

  const getFullPdfUrl = (path: string) => {
      if (!path) return '#';
      if (path.startsWith('http')) return path;
      return `${API_BASE_URL}/${path.startsWith('/') ? path.substring(1) : path}`;
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

      {/* 🏛️ MISSION */}
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
                COMFORT Asbl bâtit des ponts entre l'urgence humanitaire et le développement durable en RDC. Notre transparence est le socle de notre engagement institutionnel au service des plus démunis.
              </p>
              <div className="flex items-center space-x-8">
                 <div className="flex flex-col">
                    <span className="text-comfort-blue font-serif font-bold text-4xl mb-1">20+</span>
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Ans de résilience</span>
                 </div>
                 <div className="h-10 w-[1px] bg-gray-100"></div>
                 <div className="flex flex-col">
                    <span className="text-comfort-blue font-serif font-bold text-4xl mb-1">500k</span>
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Vies Impactées</span>
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
                    <h4 className="text-5xl font-serif font-bold mb-2">Impact</h4>
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-80">Au cœur du terrain</p>
                  </div>
                  <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-2xl">
                    <img src="https://api.comfortasbl.org/assets/images/about-hero.jpg" className="w-full h-full object-cover" alt="Impact" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏛️ DOMAINES */}
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

      {/* 🏛️ TESTIMONIALS SECTION */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
           <div className="text-center mb-24">
              <h2 className="text-4xl font-serif font-bold text-comfort-blue mb-4">{t('home.testimonials_title')}</h2>
              <p className="text-gray-500 font-light max-w-2xl mx-auto">{t('home.testimonials_subtitle')}</p>
              <div className="h-1 w-16 bg-comfort-gold mx-auto mt-8"></div>
           </div>

           {/* Carousel */}
           <div className="relative max-w-5xl mx-auto mb-32">
              <div className="bg-comfort-light p-12 md:p-20 relative border border-gray-50 shadow-sm rounded-sm">
                 <Quote size={80} className="absolute top-10 right-10 text-comfort-gold opacity-10 pointer-events-none" />
                 
                 {testimonials.length > 0 ? (
                    <div className="relative z-10 animate-in fade-in duration-1000">
                       <p className="text-2xl md:text-3xl font-serif italic text-comfort-blue leading-relaxed mb-12">
                         "{testimonials[currentTestimonial].message}"
                       </p>
                       <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 bg-comfort-blue rounded-full flex items-center justify-center text-white text-xl font-bold shadow-xl">
                             {testimonials[currentTestimonial].nom_complet.charAt(0)}
                          </div>
                          <div>
                             <h4 className="text-lg font-bold text-comfort-blue uppercase tracking-widest">{testimonials[currentTestimonial].nom_complet}</h4>
                             <p className="text-xs text-comfort-gold font-bold uppercase tracking-widest flex items-center mt-1">
                                {testimonials[currentTestimonial].role} {testimonials[currentTestimonial].organisation && `• ${testimonials[currentTestimonial].organisation}`}
                             </p>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <p className="text-center text-gray-400 italic">Aucun témoignage disponible pour le moment.</p>
                 )}

                 <div className="absolute bottom-8 right-12 flex space-x-4">
                    <button onClick={() => setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)} className="p-3 bg-white border border-gray-100 rounded-full hover:border-comfort-gold transition-all shadow-sm">
                       <ChevronLeft size={20} className="text-comfort-blue" />
                    </button>
                    <button onClick={nextTestimonial} className="p-3 bg-white border border-gray-100 rounded-full hover:border-comfort-gold transition-all shadow-sm">
                       <ChevronRight size={20} className="text-comfort-blue" />
                    </button>
                 </div>
              </div>
           </div>

           {/* Submission Form */}
           <div className="max-w-4xl mx-auto bg-comfort-dark p-12 md:p-16 rounded-sm shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
              
              <div className="relative z-10 text-center mb-12">
                 <MessageSquare size={40} className="text-comfort-gold mx-auto mb-6" />
                 <h3 className="text-3xl font-serif font-bold text-white mb-4">{t('home.testimonial_form_title')}</h3>
                 <p className="text-gray-400 font-light italic">Votre voix compte pour mobiliser davantage d'acteurs de changement.</p>
              </div>

              <form onSubmit={handleTestimonySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Nom Complet</label>
                   <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-comfort-gold" />
                      <input type="text" required value={testimonyForm.nom_complet} onChange={e => setTestimonyForm({...testimonyForm, nom_complet: e.target.value})} className="w-full bg-white/5 border border-white/10 px-12 py-4 text-white text-sm outline-none focus:border-comfort-gold transition-all" placeholder="Jean Mukoko" />
                   </div>
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Email</label>
                   <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-comfort-gold" />
                      <input type="email" required value={testimonyForm.email} onChange={e => setTestimonyForm({...testimonyForm, email: e.target.value})} className="w-full bg-white/5 border border-white/10 px-12 py-4 text-white text-sm outline-none focus:border-comfort-gold transition-all" placeholder="jean.mukoko@gmail.com" />
                   </div>
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Téléphone</label>
                   <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-comfort-gold" />
                      <input type="tel" required value={testimonyForm.telephone} onChange={e => setTestimonyForm({...testimonyForm, telephone: e.target.value})} className="w-full bg-white/5 border border-white/10 px-12 py-4 text-white text-sm outline-none focus:border-comfort-gold transition-all" placeholder="+243..." />
                   </div>
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Rôle / Qualité</label>
                   <div className="relative">
                      <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-comfort-gold" />
                      <input type="text" required value={testimonyForm.role} onChange={e => setTestimonyForm({...testimonyForm, role: e.target.value})} className="w-full bg-white/5 border border-white/10 px-12 py-4 text-white text-sm outline-none focus:border-comfort-gold transition-all" placeholder="Bénévole, Partenaire..." />
                   </div>
                </div>
                <div className="md:col-span-2">
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Organisation (Optionnel)</label>
                   <div className="relative">
                      <HandCoins size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-comfort-gold" />
                      <input type="text" value={testimonyForm.organisation} onChange={e => setTestimonyForm({...testimonyForm, organisation: e.target.value})} className="w-full bg-white/5 border border-white/10 px-12 py-4 text-white text-sm outline-none focus:border-comfort-gold transition-all" placeholder="Association Solidarité" />
                   </div>
                </div>
                <div className="md:col-span-2">
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Votre Message</label>
                   <textarea required rows={4} value={testimonyForm.message} onChange={e => setTestimonyForm({...testimonyForm, message: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 text-white text-sm outline-none focus:border-comfort-gold transition-all resize-none" placeholder="Racontez-nous l'impact de COMFORT..." />
                </div>
                <div className="md:col-span-2 text-center">
                   <button type="submit" disabled={testimonyLoading} className="inline-flex items-center space-x-4 bg-comfort-gold text-white px-12 py-5 font-bold uppercase tracking-widest hover:bg-white hover:text-comfort-dark transition-all shadow-2xl disabled:opacity-50">
                      {testimonyLoading ? "Transmission..." : <><Send size={16} /> <span>Envoyer mon témoignage</span></>}
                   </button>
                </div>
              </form>
           </div>
        </div>
      </section>

      {/* 🏛️ GAZETTE */}
      <section className="py-32 bg-comfort-light">
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
              <div key={bulletin.id} className="bg-white p-12 border border-gray-100 flex flex-col md:flex-row items-center gap-10 hover:shadow-2xl transition-all group">
                 <div className="w-24 h-24 bg-comfort-blue/5 flex items-center justify-center text-comfort-blue group-hover:bg-comfort-blue group-hover:text-white transition-all shadow-sm">
                    <Newspaper size={32} />
                 </div>
                 <div className="flex-1">
                    <span className="text-[10px] font-bold text-comfort-gold uppercase tracking-widest block mb-2">Officiel</span>
                    <h3 className="text-xl font-serif font-bold text-comfort-blue mb-4 leading-tight">{bulletin.title}</h3>
                    <p className="text-sm text-gray-500 font-light leading-relaxed line-clamp-2 mb-6">{bulletin.resume}</p>
                    <a href={getFullPdfUrl(bulletin.pdf_path)} target="_blank" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-comfort-blue hover:text-comfort-gold transition-colors">
                        Consulter le rapport <Download size={14} className="ml-3" />
                    </a>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏛️ BLOG */}
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
