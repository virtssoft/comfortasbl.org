import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Heart, BookOpen, HandCoins, Wheat, Palette, 
  ChevronLeft, ChevronRight, Calendar, User, Mail, 
  Phone, Copy, CheckCircle2, Quote, MessageSquare, Send, Newspaper, Download, Facebook
} from 'lucide-react';
import { DOMAINS, CONTACT_INFO } from './constants';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { HeroSkeleton, CardSkeleton } from '../components/Skeletons';

const Home: React.FC = () => {
  const { t } = useLanguage();
  // On ajoute des tableaux vides par défaut pour éviter le "Blanc" si le context est incomplet
  const { 
    projects = [], 
    partners = [], 
    blogPosts = [], 
    bulletins = [], 
    testimonials = [], 
    loading 
  } = useData();
  
  const [currentHero, setCurrentHero] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [copied, setCopied] = useState(false);

  // Fallbacks de contact
  const contactAddress = CONTACT_INFO?.address || "Goma, Nord-Kivu, RDC";
  const contactEmail = CONTACT_INFO?.email || "contact@comfortasbl.org";
  const contactPhone = CONTACT_INFO?.phone || "+243 000 000 000";

  const heroItems = blogPosts.slice(0, 5);
  const yearsOfExistence = new Date().getFullYear() - 2019;

  // Navigation Hero
  const nextHero = useCallback(() => {
    if (heroItems.length === 0) return;
    setCurrentHero(prev => (prev + 1) % heroItems.length);
  }, [heroItems.length]);

  const prevHero = useCallback(() => {
    if (heroItems.length === 0) return;
    setCurrentHero(prev => (prev - 1 + heroItems.length) % heroItems.length);
  }, [heroItems.length]);

  // Navigation Témoignages
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

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('00017220062000003346537');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  if (loading) return (
    <div className="bg-white">
      <HeroSkeleton />
      <div className="container mx-auto px-6 py-24 grid md:grid-cols-3 gap-12">
        <CardSkeleton /><CardSkeleton /><CardSkeleton />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans overflow-x-hidden">
      
      {/* 🏛️ SECTION 1: HERO CAROUSEL */}
      <section className="relative h-[85vh] md:h-[90vh] bg-comfort-dark overflow-hidden">
        {heroItems.map((post, idx) => (
          <div key={post.id} className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${idx === currentHero ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <div className="absolute inset-0">
               <img src={post.image} alt={post.title} className="w-full h-full object-cover animate-ken-burns" />
               <div className="absolute inset-0 bg-gradient-to-r from-comfort-dark/95 via-comfort-dark/70 to-transparent"></div>
            </div>
            <div className="container relative z-20 mx-auto h-full flex items-center px-6 lg:px-12">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">{post.title}</h1>
                <p className="text-lg md:text-xl text-gray-300 mb-10 font-light border-l-2 border-white/20 pl-6 line-clamp-3">{post.excerpt}</p>
                <div className="flex gap-4">
                  <Link to={`/blog/${post.id}`} className="bg-comfort-gold text-white px-8 py-4 font-bold uppercase tracking-widest text-xs">Découvrir</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 🏛️ SECTION 2: MISSION & STATS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-comfort-blue mb-8">L'intégrité au service de l'humanité.</h2>
              <Link to="/about" className="inline-flex items-center text-comfort-blue font-bold uppercase tracking-widest text-sm">
                Notre charte <ArrowRight className="ml-4 text-comfort-gold" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="p-8 bg-comfort-blue text-white rounded-sm shadow-xl">
                 <h4 className="text-5xl font-serif font-bold">{projects.length}+</h4>
                 <p className="text-[10px] uppercase tracking-widest font-bold">Programmes</p>
               </div>
               <div className="p-8 bg-comfort-gold text-white rounded-sm shadow-xl">
                 <h4 className="text-5xl font-serif font-bold">{yearsOfExistence}</h4>
                 <p className="text-[10px] uppercase tracking-widest font-bold">Années d'impact</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏛️ SECTION 3: DOMAINES */}
      <section className="py-24 bg-comfort-light border-y border-gray-100">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-5 border border-gray-100">
              {DOMAINS.map((domain) => (
                <div key={domain.id} className="group p-10 bg-white border-r border-gray-100 hover:bg-comfort-blue transition-all duration-500">
                   <div className="mb-8">{getIcon(domain.id)}</div>
                   <h3 className="text-sm font-bold text-comfort-dark group-hover:text-white uppercase tracking-widest">{t(`domains.${domain.id}.title`)}</h3>
                </div>
              ))}
            </div>
        </div>
      </section>

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

      {/* 🏛️ SECTION 6: CONTACT & BANQUE (STABLE) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-3xl font-serif font-bold text-comfort-blue mb-6">Contactez-nous</h2>
            <div className="space-y-6">
               <div className="flex items-center"><Mail className="text-comfort-gold mr-4" /> {contactEmail}</div>
               <div className="flex items-center"><Phone className="text-comfort-gold mr-4" /> {contactPhone}</div>
            </div>
          </div>

          <div className="bg-gray-50 p-10 border border-gray-100">
             <h4 className="text-xs font-bold text-comfort-blue uppercase tracking-widest mb-6 flex items-center">
               <HandCoins size={18} className="mr-3 text-comfort-gold" /> Coordonnées Bancaires
             </h4>
             <div className="bg-white p-6 border border-dashed border-gray-300">
                <p className="text-[9px] uppercase text-gray-400 font-bold mb-1">Numéro de compte (USD)</p>
                <div className="flex items-center justify-between bg-gray-50 p-3">
                   <code className="text-xs font-mono text-comfort-blue font-bold">00017220062000003346537</code>
                   <button onClick={handleCopyAccount} className="text-comfort-gold">
                      {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                   </button>
                </div>
                <p className="text-[10px] mt-4 font-bold text-gray-500">TMB S.A. | SWIFT: TRMSCD3L</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
