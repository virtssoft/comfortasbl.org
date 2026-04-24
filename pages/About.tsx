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

  // Membership Form State complet selon tes spécifications
  // Note: id, user_id, status et created_at sont généralement gérés côté backend
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

    // Utilisation de FormData pour le transport du fichier et des textes
    const formData = new FormData();
    formData.append('full_name', formState.full_name);
    formData.append('email', formState.email);
    formData.append('telephone', formState.telephone);
    formData.append('adresse_physique', formState.adresse_physique);
    formData.append('motivation', formState.motivation);
    formData.append('status', 'en_attente'); 
    
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

      {/* 🏛️ HISTOIRE & MISSION (Sections simplifiées pour le code complet) */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-serif font-bold text-comfort-blue mb-8">{t('about_page.who_title')}</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-6">{t('about_page.who_text')}</p>
          </div>
          <div className="bg-gray-100 aspect-video rounded shadow-inner flex items-center justify-center">
             <img src="https://api.comfortasbl.org/assets/images/about-who.jpg" className="w-full h-full object-cover rounded shadow-2xl" alt="Impact" />
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
                <h2 className="text-3xl font-serif font-bold mb-6">{t('join_section.title')}</h2>
                <p className="text-gray-300 font-light leading-relaxed mb-8">
                  Rejoignez notre réseau de solidarité. Votre expertise et votre motivation sont les moteurs de notre changement.
                </p>
                <div className="space-y-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={16} className="text-comfort-gold" />
                    <span>Traitement confidentiel</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={16} className="text-comfort-gold" />
                    <span>Réponse sous 48h-72h</span>
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
                  <p className="text-gray-500 max-w-xs">Votre dossier a été transmis avec succès au comité d'administration.</p>
                  <button onClick={() => setIsSuccess(false)} className="text-comfort-gold font-bold uppercase text-xs tracking-widest hover:underline">Faire une autre demande</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold uppercase">{error}</div>}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Nom Complet (full_name)</label>
                      <input 
                        type="text" required
                        value={formState.full_name}
                        onChange={(e) => setFormState({...formState, full_name: e.target.value})}
                        className="w-full bg-gray-50 border-b border-gray-200 p-4 outline-none focus:border-comfort-gold text-sm"
                        placeholder="Ex: Traore Hakeem"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                      <input 
                        type="email" required
                        value={formState.email}
                        onChange={(e) => setFormState({...formState, email: e.target.value})}
                        className="w-full bg-gray-50 border-b border-gray-200 p-4 outline-none focus:border-comfort-gold text-sm"
                        placeholder="hakeem@virtssoft.com"
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
                        placeholder="+243 ..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Adresse Physique</label>
                      <input 
                        type="text" required
                        value={formState.adresse_physique}
                        onChange={(e) => setFormState({...formState, adresse_physique: e.target.value})}
                        className="w-full bg-gray-50 border-b border-gray-200 p-4 outline-none focus:border-comfort-gold text-sm"
                        placeholder="Goma, Nord-Kivu, RDC"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Motivation</label>
                    <textarea 
                      required
                      value={formState.motivation}
                      onChange={(e) => setFormState({...formState, motivation: e.target.value})}
                      rows={4}
                      className="w-full bg-gray-50 border-b border-gray-200 p-4 outline-none focus:border-comfort-gold text-sm resize-none"
                      placeholder="Décrivez vos motivations pour rejoindre la fondation..."
                    />
                  </div>

                  {/* Champ CV (cv_path) */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Curriculum Vitae (PDF)</label>
                    <div className="relative group border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center hover:border-comfort-gold transition-all">
                      <input 
                        type="file" 
                        accept=".pdf"
                        onChange={(e) => setFormState({...formState, cv: e.target.files ? e.target.files[0] : null})}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <FileText size={32} className={`mb-2 ${formState.cv ? 'text-comfort-gold' : 'text-gray-300'}`} />
                      <span className="text-xs text-gray-500 font-medium">
                        {formState.cv ? formState.cv.name : "Cliquez ou glissez votre CV ici"}
                      </span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-comfort-blue text-white py-5 font-bold uppercase tracking-widest hover:bg-comfort-gold transition-all duration-500 shadow-xl disabled:opacity-50 flex items-center justify-center space-x-4"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Envoyer ma candidature</span>
                        <ArrowRight size={18} />
                      </>
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
            <h2 className="text-4xl font-serif font-bold mb-4">{t('about_page.team_title')}</h2>
            <div className="h-1 w-16 bg-comfort-gold mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-4 gap-12">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.id} className="group">
                <div className="aspect-square bg-gray-800 overflow-hidden mb-6 grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-serif font-bold">{member.name}</h3>
                <p className="text-comfort-gold text-xs uppercase tracking-widest mt-2">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏛️ FINAL CONTACT */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-comfort-blue mb-8">{t('about_page.contact_prompt')}</h2>
          <div className="flex flex-wrap justify-center gap-12 text-gray-500">
            <div className="flex items-center space-x-3"><Phone size={20} className="text-comfort-gold" /><span>{contactPhone}</span></div>
            <div className="flex items-center space-x-3"><Mail size={20} className="text-comfort-gold" /><span>{contactEmail}</span></div>
            <div className="flex items-center space-x-3"><MapPin size={20} className="text-comfort-gold" /><span>{contactAddress}</span></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
