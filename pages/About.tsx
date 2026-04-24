import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { TEAM_MEMBERS, CONTACT_INFO } from './constants';
import { 
  Heart, Shield, TrendingUp, Users, MapPin, 
  Mail, Phone, ArrowRight, UserPlus, CheckCircle, Info, FileText 
} from 'lucide-react';
import { api } from '../services/api';

const About: React.FC = () => {
  const { t } = useLanguage();
  const { settings, loading } = useData();

  // Membership Form State complet
  const [formState, setFormState] = useState({
    full_name: '',
    email: '',
    telephone: '',
    adresse_physique: '',
    motivation: '',
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

    // Utilisation de FormData pour gérer l'envoi du fichier CV
    const formData = new FormData();
    formData.append('full_name', formState.full_name);
    formData.append('email', formState.email);
    formData.append('telephone', formState.telephone);
    formData.append('adresse_physique', formState.adresse_physique);
    formData.append('motivation', formState.motivation);
    formData.append('status', 'en_attente'); // Valeur par défaut
    if (formState.cv) {
      formData.append('cv', formState.cv);
    }

    try {
      const response = await api.joinAssociation(formData);

      if (response.success) {
        setIsSuccess(true);
        setFormState({ 
          full_name: '', email: '', telephone: '', 
          adresse_physique: '', motivation: '', cv: null 
        });
      } else {
        setError(response.error || "Une erreur est survenue lors de l'envoi.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="py-40 bg-white min-h-screen animate-pulse"></div>;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white overflow-x-hidden">
      
      {/* 🏛️ HERO SECTION */}
      <section className="relative h-[50vh] flex items-center overflow-hidden bg-comfort-dark">
        <div className="absolute inset-0">
          <img 
            src="https://api.comfortasbl.org/assets/images/about-hero.jpg"
            alt="Humanitarian Impact" 
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-comfort-dark/80 to-comfort-dark"></div>
        </div>
        <div className="container relative z-10 mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <span className="text-comfort-gold font-bold uppercase tracking-[0.4em] text-xs mb-4 block">
              {t('about_page.identity_title')}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
              {t('about_page.hero_title')}
            </h1>
            <div className="h-1 w-24 bg-comfort-gold mx-auto"></div>
          </div>
        </div>
      </section>

      {/* 🏛️ REJOINDRE COMFORT (Formulaire avec tous les champs) */}
      <section className="py-32 bg-comfort-light border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto bg-white shadow-2xl overflow-hidden rounded-sm flex flex-col lg:flex-row border border-gray-100">
            
            {/* Infos Sidebar */}
            <div className="lg:w-1/3 bg-comfort-blue p-10 text-white relative">
              <UserPlus size={40} className="text-comfort-gold mb-8" />
              <h2 className="text-3xl font-serif font-bold mb-4">{t('join_section.title')}</h2>
              <p className="text-gray-300 font-light text-sm leading-relaxed mb-6">
                Devenez acteur du changement. Remplissez ce formulaire pour soumettre votre candidature au comité de la fondation.
              </p>
              <div className="space-y-4">
                 <div className="flex items-center text-xs text-gray-400">
                   <CheckCircle size={14} className="text-comfort-gold mr-3" />
                   Candidature examinée sous 48h
                 </div>
              </div>
            </div>

            {/* Formulaire Principal */}
            <div className="lg:w-2/3 p-10 bg-white">
              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-comfort-blue">Candidature Envoyée</h3>
                  <p className="text-gray-500 text-sm">Merci pour votre engagement. Nous vous contacterons très bientôt.</p>
                  <button onClick={() => setIsSuccess(false)} className="text-comfort-gold font-bold uppercase text-[10px] tracking-widest hover:underline">Nouvelle demande</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && <div className="p-3 bg-red-50 text-red-600 text-[11px] font-bold uppercase">{error}</div>}

                  {/* Nom & Email */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Nom Complet</label>
                      <input 
                        type="text" required
                        value={formState.full_name}
                        onChange={(e) => setFormState({...formState, full_name: e.target.value})}
                        className="w-full bg-gray-50 border-b border-gray-200 p-3 outline-none focus:border-comfort-gold text-sm"
                        placeholder="Ex: John K Biloto"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Email</label>
                      <input 
                        type="email" required
                        value={formState.email}
                        onChange={(e) => setFormState({...formState, email: e.target.value})}
                        className="w-full bg-gray-50 border-b border-gray-200 p-3 outline-none focus:border-comfort-gold text-sm"
                        placeholder="contact@exemple.com"
                      />
                    </div>
                  </div>

                  {/* Téléphone & Adresse */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Téléphone</label>
                      <input 
                        type="tel" required
                        value={formState.telephone}
                        onChange={(e) => setFormState({...formState, telephone: e.target.value})}
                        className="w-full bg-gray-50 border-b border-gray-200 p-3 outline-none focus:border-comfort-gold text-sm"
                        placeholder="+243..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Adresse Physique</label>
                      <input 
                        type="text" required
                        value={formState.adresse_physique}
                        onChange={(e) => setFormState({...formState, adresse_physique: e.target.value})}
                        className="w-full bg-gray-50 border-b border-gray-200 p-3 outline-none focus:border-comfort-gold text-sm"
                        placeholder="Goma, Q. Les Volcans"
                      />
                    </div>
                  </div>

                  {/* Motivation */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Motivation</label>
                    <textarea 
                      required
                      value={formState.motivation}
                      onChange={(e) => setFormState({...formState, motivation: e.target.value})}
                      rows={3}
                      className="w-full bg-gray-50 border-b border-gray-200 p-3 outline-none focus:border-comfort-gold text-sm resize-none"
                      placeholder="Pourquoi souhaitez-vous nous rejoindre ?"
                    />
                  </div>

                  {/* CV (Fichier) */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Curriculum Vitae (PDF)</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept=".pdf"
                        onChange={(e) => setFormState({...formState, cv: e.target.files ? e.target.files[0] : null})}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full border-2 border-dashed border-gray-200 p-4 flex items-center justify-center space-x-3 group-hover:border-comfort-gold transition-colors">
                        <FileText size={18} className="text-gray-400 group-hover:text-comfort-gold" />
                        <span className="text-xs text-gray-500">
                          {formState.cv ? formState.cv.name : "Cliquez ou glissez votre CV ici"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-comfort-blue text-white py-4 font-bold uppercase tracking-widest hover:bg-comfort-gold transition-all shadow-lg disabled:opacity-50 flex items-center justify-center space-x-3"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <><span>Soumettre la candidature</span> <ArrowRight size={14} /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CONTACT (Simplement pour boucler la page) */}
      <section className="py-20 text-center">
        <h3 className="text-gray-400 font-serif italic text-xl">"Agir ensemble pour un futur solidaire."</h3>
      </section>

    </div>
  );
};

export default About;
