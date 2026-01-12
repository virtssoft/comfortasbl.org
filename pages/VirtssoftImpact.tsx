
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Cpu, Globe, Zap, ShieldCheck, Database, Rocket, ArrowRight, Monitor, GraduationCap, HeartHandshake } from 'lucide-react';

const VirtssoftImpact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* HERO TECH-HUMANITAIRE */}
      <section className="relative py-32 bg-comfort-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <span className="text-comfort-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Partenaire Scientifique & Technique</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 leading-tight">
              Virtssoft Technologies <br/>& <span className="italic font-light">Projet Impact</span>
            </h1>
            <div className="h-1 w-20 bg-comfort-gold mb-10"></div>
            <p className="text-xl text-gray-400 font-light leading-relaxed max-w-2xl">
              L'alliance de l'intelligence artificielle et de la solidarité pour transformer durablement les communautés de la République Démocratique du Congo.
            </p>
          </div>
        </div>
      </section>

      {/* 🚀 IMPACT20 - DÉCEMBRE EST LANCÉ */}
      <section className="py-24 bg-comfort-light border-y border-gray-100">
        <div className="container mx-auto px-6">
           <div className="bg-white p-8 md:p-20 shadow-2xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-comfort-gold text-white px-6 py-2 font-bold text-[10px] uppercase tracking-widest -rotate-0 md:rotate-45 translate-x-0 md:translate-x-10 md:translate-y-6 shadow-xl">
                 Décembre Spécial
              </div>
              
              <div className="max-w-4xl mx-auto text-center mb-16">
                 <h2 className="text-4xl md:text-6xl font-serif font-bold text-comfort-blue mb-8">IMPACT20</h2>
                 <p className="text-xl text-gray-600 font-light leading-relaxed">
                   Ce mois-ci, Virtssoft Technologies se mobilise pour soutenir les organisations humanitaires à travers 20 actions solidaires majeures.
                 </p>
              </div>

              <div className="grid md:grid-cols-3 gap-12">
                 <div className="text-center p-8 border border-gray-50 hover:shadow-xl transition-all group">
                    <Monitor size={48} className="mx-auto text-comfort-gold mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-3xl font-serif font-bold text-comfort-blue mb-2">10</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Sites Web Offerts</p>
                    <p className="text-sm text-gray-500 font-light">Pour aider les associations à mieux communiquer et toucher plus de monde.</p>
                 </div>
                 <div className="text-center p-8 border border-gray-50 hover:shadow-xl transition-all group">
                    <GraduationCap size={48} className="mx-auto text-comfort-gold mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-3xl font-serif font-bold text-comfort-blue mb-2">5</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Formations Pro</p>
                    <p className="text-sm text-gray-500 font-light">Renforcement des compétences numériques pour vos équipes opérationnelles.</p>
                 </div>
                 <div className="text-center p-8 border border-gray-50 hover:shadow-xl transition-all group">
                    <HeartHandshake size={48} className="mx-auto text-comfort-gold mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-3xl font-serif font-bold text-comfort-blue mb-2">5</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Actions Terrain</p>
                    <p className="text-sm text-gray-500 font-light">Interventions directes financées pour créer un impact immédiat.</p>
                 </div>
              </div>

              <div className="mt-16 text-center">
                 <p className="text-gray-600 mb-8 font-serif italic text-lg">Si vous faites partie d’une organisation humanitaire et que vous souhaitez bénéficier de l’une de ces actions, c’est le moment de postuler !</p>
                 <a 
                   href="https://docs.google.com/forms/d/e/1FAIpQLSeZwObtIfJ7H3P4pP1_FpC8X_Nn6E6i9kG_XjH0U6T2kL-8gQ/viewform" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="inline-flex items-center bg-comfort-blue text-white px-12 py-5 font-bold uppercase tracking-widest hover:bg-comfort-gold transition-all shadow-2xl"
                 >
                    Postuler maintenant <ArrowRight className="ml-4" size={18} />
                 </a>
                 <p className="mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Impact20 – Inspirer. Former. Transformer.</p>
              </div>
           </div>
        </div>
      </section>

      {/* MISSION VIRTTSSOFT */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
               <h2 className="text-4xl font-serif font-bold text-comfort-blue mb-8">L'Innovation au service de la <span className="italic">Dignité</span></h2>
               <div className="prose prose-lg text-gray-600 font-light leading-relaxed">
                  <p className="mb-6">
                    <strong>Virtssoft Technologies</strong> est une startup de pointe spécialisée dans les sciences et technologies. Notre mission est de rendre les technologies avancées — IA, Cloud, IoT — non seulement accessibles, mais profondément utiles au développement social.
                  </p>
                  <p>
                    Pour COMFORT Asbl, Virtssoft déploie des solutions numériques robustes garantissant la transparence des flux, la sécurité des données des donateurs et l'optimisation du suivi des programmes sur le terrain.
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-8 mt-12">
                  <div className="p-6 border border-gray-100 rounded-sm">
                     <Cpu className="text-comfort-gold mb-4" size={24} />
                     <h4 className="font-bold text-xs uppercase tracking-widest mb-2">IA & Automation</h4>
                     <p className="text-xs text-gray-400">Optimisation des processus humanitaires.</p>
                  </div>
                  <div className="p-6 border border-gray-100 rounded-sm">
                     <Database className="text-comfort-gold mb-4" size={24} />
                     <h4 className="font-bold text-xs uppercase tracking-widest mb-2">Cloud Sécurisé</h4>
                     <p className="text-xs text-gray-400">Protection souveraine des données.</p>
                  </div>
               </div>
            </div>
            <div className="relative">
                <div className="aspect-square bg-comfort-light rounded-sm flex items-center justify-center p-12 overflow-hidden shadow-2xl">
                    <img src="https://api.comfortasbl.org/assets/images/logo1.png" className="w-1/2 opacity-20 absolute grayscale" alt="COMFORT" />
                    <div className="relative z-10 text-center">
                        <Rocket size={60} className="text-comfort-blue mx-auto mb-8 animate-bounce" />
                        <h3 className="text-3xl font-serif font-bold text-comfort-blue mb-4">Projet Impact 2.0</h3>
                        <p className="text-gray-500 font-light">La plateforme de nouvelle génération pour l'humanitaire en Afrique Centrale.</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALEURS PARTAGÉES */}
      <section className="py-32 bg-comfort-light border-y border-gray-100">
         <div className="container mx-auto px-6">
            <div className="text-center mb-20">
               <span className="text-comfort-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Notre ADN Commun</span>
               <h2 className="text-4xl font-serif font-bold text-comfort-blue">Pourquoi cette collaboration ?</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
               {[
                 { icon: ShieldCheck, title: "Transparence Radicale", desc: "Chaque ligne de code est pensée pour prouver l'impact réel de chaque don." },
                 { icon: Globe, title: "Rayonnement Local", desc: "Une technologie congolaise répondant aux défis complexes du terrain congolais." },
                 { icon: Zap, title: "Efficacité Accrue", desc: "Réduire les coûts opérationnels par l'automatisation pour maximiser l'aide directe." }
               ].map((val, i) => (
                 <div key={i} className="bg-white p-12 shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 text-center">
                    <val.icon size={40} className="text-comfort-gold mx-auto mb-8" strokeWidth={1} />
                    <h4 className="text-lg font-bold text-comfort-blue uppercase tracking-widest mb-4">{val.title}</h4>
                    <p className="text-sm text-gray-500 font-light leading-relaxed">{val.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-32">
         <div className="container mx-auto px-6 text-center max-w-3xl">
            <h2 className="text-4xl font-serif font-bold text-comfort-blue mb-8">Découvrez Virtssoft Technologies</h2>
            <p className="text-gray-500 font-light mb-12">Pour en savoir plus sur nos solutions d'ingénierie, d'énergies renouvelables et d'innovation numérique, visitez notre plateforme officielle.</p>
            <a href="https://virtssoft.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-comfort-dark text-white px-12 py-5 font-bold uppercase tracking-widest hover:bg-comfort-gold transition-all shadow-xl">
               Visiter virtssoft.com <ArrowRight className="ml-4" size={18} />
            </a>
         </div>
      </section>
    </div>
  );
};

export default VirtssoftImpact;
