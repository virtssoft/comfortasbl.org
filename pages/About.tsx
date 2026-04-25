import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { TEAM_MEMBERS, CONTACT_INFO } from './constants';
import { 
  Heart, Shield, Globe, MapPin, 
  Mail, Phone, ArrowRight, UserPlus, CheckCircle, FileText 
} from 'lucide-react';
import { api } from '../services/api';

const About: React.FC = () => {
  const { t } = useLanguage();
  const { settings, loading } = useData();

  // État du formulaire aligné sur les spécifications de benevoles.php
  const [formState, setFormState] = useState({
    nom_complet: '',
    email: '',
    telephone: '',
    adresse_physique: '',
    message_motivation: '',
    cv: null as File | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const contactEmail = settings?.contactEmail || CONTACT_INFO.email;
  const contactPhone = settings?.contactPhone || CONTACT_INFO.phone;
  const contactAddress = settings?.contactAddress || CONTACT_INFO.address;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // FormData configuré pour matcher exactement ton script PHP
    const formData = new FormData();
    formData.append('nom_complet', formState.nom_complet);
    formData.append('email', formState.email);
    formData.append('telephone', formState.telephone);
    formData.append('adresse_physique', formState.adresse_physique);
    formData.append('message_motivation', formState.message_motivation);
    
    if (formState.cv) {
      formData.append('cv', formState.cv);
    } else {
      setError("Le fichier CV est requis.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.joinAssociation(formData);

      // Le backend renvoie 'user_id' en cas de succès 201
      if (response.user_id || response.message === "Candidature envoyée") {
        setIsSuccess(true);
        setFormState({ 
          nom_complet: '', email: '', telephone: '', 
          adresse_physique: '', message_motivation: '', cv: null 
        });
      } else {
        setError(response.error || "Une erreur est survenue.");
      }
    } catch (err) {
      setError("Impossible de joindre le serveur. Vérifiez votre connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="py-40 bg-white min-h-screen animate-pulse"></div>;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white overflow-x-hidden">
      
      {/* 🏛️ SECTION HERO */}
      <section className="relative h-[60vh] flex items-center bg-comfort-dark overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://api.comfortasbl.org/assets/images/about-hero.jpg" 
            className="w-full h-full object-cover opacity-30 grayscale" 
            alt="Humanitarian" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-comfort-dark/60 to-comfort-dark"></div>
        </div>
        <div className="container relative z-10 mx-auto px-6 text-center">
           <span className="text-comfort-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block animate-fade-in">
              {t('about_page.identity_title') || "Notre Identité"}
            </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
            {t('about_page.hero_title') || "Notre Engagement"}
          </h1>
          <div className="h-1.5 w-24 bg-comfort-gold mx-auto rounded-full"></div>
        </div>
      </section>

      {/* 🏛️ HISTOIRE & MISSION */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-serif font-bold text-comfort-blue">
              {t('about_page.who_title') || "Qui sommes-nous ?"}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg italic border-l-4 border-comfort-gold pl-6">
              {t('about_page.who_text') || "Une organisation dédiée au changement social et à l'appui humanitaire durable."}
            </p>
            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="text-center p-4 bg-gray-50 rounded-sm">
                <Heart className="text-comfort-gold mx-auto mb-2" size={24} />
                <span className="text-[10px] uppercase font-bold text-gray-400">Solidarité</span>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-sm">
                <Shield className="text-comfort-gold mx-auto mb-2" size={24} />
                <span className="text-[10px] uppercase font-bold text-gray-400">Intégrité</span>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-sm">
                <Globe className="text-comfort-gold mx-auto mb-2" size={24} />
                <span className="text-[10px] uppercase font-bold text-gray-400">Impact</span>
              </div>
            </div>
          </div>
          <div className="relative group">
             <div className="absolute -inset-4 bg-comfort-gold/10 rounded-sm scale-95 group-hover:scale-100 transition-transform duration-500"></div>
             <img src="https://api.comfortasbl.org/assets/images/about-who.jpg" className="relative w-full h-full object-cover rounded shadow-2xl" alt="Impact" />
          </div>
        </div>
      </section>

      {/* 🏛️ FORMULAIRE D'ADHÉSION COMPLET */}
      <section className="py-32 bg-comfort-light border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto bg-white shadow-2xl overflow-hidden rounded-sm flex flex-col lg:flex-row border border-gray-100">
            
            {/* Sidebar d'appel à l'action */}
            <div className="lg:w-1/3 bg-comfort-blue p-12 text-white relative overflow-hidden">
              <div className="relative z-10">
                <UserPlus size={48} className="text-comfort-gold mb-10" />
                <h2 className="text-3xl font-serif font-bold mb-6">{t('join_section.title') || "Devenir Membre"}</h2>
                <p className="text-gray-300 font-light leading-relaxed mb-8">
                  Votre candidature créera automatiquement un compte utilisateur "bénévole" sur notre plateforme après validation.
                </p>
                <div className="space-y-4 text-[11px] uppercase tracking-widest text-gray-400">
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={14} className="text-comfort-gold" />
                    <span>Traitement confidentiel</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={14} className="text-comfort-gold" />
                    <span>Réponse sous 72h</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-20 translate-y-20"></div>
            </div>

            {/* Corps du Formulaire */}
            <div className="lg:w-2/3 p-12 bg-white">
              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-comfort-blue">Candidature Soumise</h3>
                  <p className="text-gray-500 max-w-xs">Un compte a été généré. Nous examinons votre CV avant l'activation finale.</p>
                  <button onClick={() => setIsSuccess(false)} className="text-comfort-gold font-bold uppercase text-[10px] tracking-[0.2em] hover:underline">Faire une autre demande</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-[10px] font-bold uppercase">{error}</div>}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Nom Complet</label>
                      <input 
                        type="text" required
                        value={formState.nom_complet}
                        onChange={(e) => setFormState({...formState, nom_complet: e.target.value})}
                        className="w-full bg-gray-50 border-b border-gray-200 p-4 outline-none focus:border-comfort-gold text-sm"
                        placeholder="Ex: John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                      <input 
                        type="email" required
                        value={formState.email}
                        onChange={(e) => setFormState({...formState, email: e.target.value})}
                        className="w-full bg-gray-50 border-b border-gray-200 p-4 outline-none focus:border-comfort-gold text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Téléphone</label>
                      <input 
                        type="tel" required
                        value={formState.telephone}
                        onChange={(e) => setFormState({...formState, telephone: e.target.value})}
                        className="w-full bg-gray-50 border-b border-gray-200 p-4 outline-none focus:border-comfort-gold text-sm"
                        placeholder="+243..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Adresse Physique</label>
                      <input 
                        type="text" required
                        value={formState.adresse_physique}
                        onChange={(e) => setFormState({...formState, adresse_physique: e.target.value})}
                        className="w-full bg-gray-50 border-b border-gray-200 p-4 outline-none focus:border-comfort-gold text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Motivation</label>
                    <textarea 
                      required
                      value={formState.message_motivation}
                      onChange={(e) => setFormState({...formState, message_motivation: e.target.value})}
                      rows={4}
                      className="w-full bg-gray-50 border-b border-gray-200 p-4 outline-none focus:border-comfort-gold text-sm resize-none"
                      placeholder="Pourquoi souhaitez-vous nous rejoindre ?"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Curriculum Vitae (PDF)</label>
                    <div className="relative group border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center hover:border-comfort-gold transition-all">
                      <input 
                        type="file" accept=".pdf" required
                        onChange={(e) => setFormState({...formState, cv: e.target.files ? e.target.files[0] : null})}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <FileText size={32} className={`mb-2 ${formState.cv ? 'text-comfort-gold' : 'text-gray-300'}`} />
                      <span className="text-[11px] text-gray-500 font-medium">
                        {formState.cv ? formState.cv.name : "Cliquez ou glissez votre CV ici"}
                      </span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-comfort-blue text-white py-5 font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-comfort-gold transition-all duration-500 shadow-xl disabled:opacity-50 flex items-center justify-center space-x-4"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <><span>Envoyer ma candidature</span> <ArrowRight size={18} /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 🏛️ EQUIPE PORTRAITS */}
      <section className="py-32 bg-comfort-dark text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-serif font-bold mb-4">
              {t('about_page.team_title') || "Notre Équipe"}
            </h2>
            <div className="h-1 w-16 bg-comfort-gold mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.id} className="group text-center">
                <div className="aspect-[3/4] bg-gray-800 overflow-hidden mb-6 grayscale group-hover:grayscale-0 transition-all duration-700 rounded-sm">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h3 className="text-lg font-serif font-bold">{member.name}</h3>
                <p className="text-comfort-gold text-[9px] uppercase tracking-widest mt-2">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏛️ FINAL CONTACT */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-around gap-12 text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-comfort-gold"><Phone size={20} /></div>
              <div>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Téléphone</p>
                <p className="text-sm font-medium text-comfort-blue">{contactPhone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-comfort-gold"><Mail size={20} /></div>
              <div>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Email</p>
                <p className="text-sm font-medium text-comfort-blue">{contactEmail}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-comfort-gold"><MapPin size={20} /></div>
              <div>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Localisation</p>
                <p className="text-sm font-medium text-comfort-blue">{contactAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
