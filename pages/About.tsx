import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { TEAM_MEMBERS, CONTACT_INFO } from './constants';
import { 
  Heart, Shield, TrendingUp, Users, MapPin, 
  Mail, Phone, ArrowRight, UserPlus, CheckCircle, Info 
} from 'lucide-react';
import { api } from '../services/api';

const About: React.FC = () => {
  const { t } = useLanguage();
  const { settings, loading } = useData();

  // Membership Form State
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    type: '',
    message: ''
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

    try {
      const response = await api.joinAssociation({
        nom: formState.name,
        email: formState.email,
        type_membre: formState.type,
        motivation: formState.message,
        status: 'en_attente'
      });

      if (response.success) {
        setIsSuccess(true);
        setFormState({ name: '', email: '', type: '', message: '' });
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
      
      {/* 🏛️ HERO - Style Fondation */}
      <section className="relative h-[50vh] flex items-center overflow-hidden bg-comfort-dark">
        <div className="absolute inset-0">
          <img 
            src="https://api.comfortasbl.org/assets/images/about-hero.jpg"
            alt="Humanitarian Impact" 
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-comfort-dark/80 to-comfort-dark"></div>
        </div>
        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-3xl animate-fade-in-up">
            <span className="text-comfort-gold font-bold uppercase tracking-[0.4em] text-xs mb-4 block">
              {t('about_page.identity_title')}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              {t('about_page.hero_title')}
            </h1>
            <div className="h-1 w-24 bg-comfort-gold"></div>
          </div>
        </div>
      </section>

      {/* 🏛️ HISTOIRE */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7 prose prose-lg">
              <h2 className="text-4xl font-serif font-bold text-comfort-blue mb-10 leading-tight">
                {t('about_page.who_title')}
              </h2>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-8 first-letter:text-6xl first-letter:font-serif first-letter:text-comfort-gold first-letter:mr-3 first-letter:float-left">
                {t('about_page.who_text')}
              </p>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden shadow-2xl rounded-sm">
                <img src="https://api.comfortasbl.org/assets/images/about-who.jpg" className="w-full h-full object-cover" alt="COMFORT in action" />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-comfort-gold p-10 text-white shadow-xl hidden md:block">
                 <p className="font-serif italic text-2xl">{t('about_page.identity_slogan')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏛️ VISION & MISSION */}
      <section className="py-32 bg-comfort-light border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-0 border border-gray-100 shadow-sm">
            <div className="p-16 bg-white border-r border-gray-100">
               <span className="text-comfort-gold font-bold uppercase tracking-widest text-xs mb-6 block">VISION</span>
               <h3 className="text-3xl font-serif font-bold text-comfort-blue mb-6">{t('about_page.vision_title')}</h3>
               <p className="text-gray-500 font-light leading-relaxed">{t('about_page.vision_text')}</p>
            </div>
            <div className="p-16 bg-white">
               <span className="text-comfort-gold font-bold uppercase tracking-widest text-xs mb-6 block">MISSION</span>
               <h3 className="text-3xl font-serif font-bold text-comfort-blue mb-6">{t('about_page.mission_title')}</h3>
               <p className="text-gray-500 font-light leading-relaxed">{t('about_page.mission_text')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🏛️ REJOINDRE COMFORT (Section Formulaire Adaptée) */}
      <section className="py-32 bg-comfort-light border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto bg-white shadow-2xl overflow-hidden rounded-sm flex flex-col md:flex-row border border-gray-100">
            {/* Colonne d'information */}
            <div className="md:w-2/5 bg-comfort-blue p-12 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
              <UserPlus size={48} className="text-comfort-gold mb-10" />
              <h2 className="text-3xl font-serif font-bold mb-6">{t('join_section.title')}</h2>
              <p className="text-gray-300 font-light leading-relaxed mb-8">
                {t('join_section.subtitle')}
              </p>
              
              <div className="space-y-6 mt-12">
                <div className="flex items-start space-x-4">
                  <div className="mt-1"><Info size={18} className="text-comfort-gold" /></div>
                  <p className="text-xs text-gray-400 font-light leading-tight">
                    {t('join_section.legal_note')}
                  </p>
                </div>
              </div>
            </div>

            {/* Colonne Formulaire */}
            <div className="md:w-3/5 p-12 bg-white">
              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-comfort-blue">{t('join_section.success_title')}</h3>
                  <p className="text-gray-500 font-light max-w-sm">
                    {t('join_section.success_text')}
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="text-comfort-gold font-bold uppercase tracking-widest text-xs hover:underline mt-8"
                  >
                    {t('join_section.another_request')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold uppercase tracking-widest">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                        {t('join_section.name_label')}
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({...formState, name: e.target.value})}
                        className="w-full bg-gray-50 border-b border-gray-200 p-4 outline-none focus:border-comfort-gold transition-all font-light text-sm"
                        placeholder="Ex: Gabriel Muruwa"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                        {t('join_section.email_label')}
                      </label>
                      <input 
                        type="email" 
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({...formState, email: e.target.value})}
                        className="w-full bg-gray-50 border-b border-gray-200 p-4 outline-none focus:border-comfort-gold transition-all font-light text-sm"
                        placeholder="email@exemple.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                      {t('join_section.type_label')}
                    </label>
                    <select 
                      required
                      value={formState.type}
                      onChange={(e) => setFormState({...formState, type: e.target.value})}
                      className="w-full bg-gray-50 border-b border-gray-200 p-4 outline-none focus:border-comfort-gold transition-all font-bold text-xs uppercase tracking-widest bg-white"
                    >
                      <option value="">{t('join_section.type_placeholder')}</option>
                      <option value="adhérent">{t('join_section.type_adh')}</option>
                      <option value="sympathisant">{t('join_section.type_sym')}</option>
                      <option value="honneur">{t('join_section.type_hon')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                      {t('join_section.message_label')}
                    </label>
                    <textarea 
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({...formState, message: e.target.value})}
                      rows={4}
                      className="w-full bg-gray-50 border-b border-gray-200 p-4 outline-none focus:border-comfort-gold transition-all font-light text-sm resize-none"
                      placeholder={t('join_section.message_placeholder')}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-comfort-blue text-white py-5 font-bold uppercase tracking-widest hover:bg-comfort-gold transition-all duration-700 shadow-xl disabled:opacity-50 flex items-center justify-center space-x-4"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>{t('join_section.submit_btn')}</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 🏛️ EQUIPE */}
      <section className="py-32 bg-comfort-dark text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-serif font-bold mb-4">{t('about_page.team_title')}</h2>
            <p className="text-gray-400 font-light">{t('about_page.team_desc')}</p>
          </div>
          <div className="grid md:grid-cols-4 gap-12">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.id} className="group">
                <div className="aspect-square bg-gray-800 overflow-hidden mb-8 relative">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 border-[10px] border-white/0 group-hover:border-white/10 transition-all duration-500"></div>
                </div>
                <h3 className="text-xl font-serif font-bold mb-1">{member.name}</h3>
                <span className="text-comfort-gold text-xs font-bold uppercase tracking-widest block mb-4">{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏛️ CONTACT */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="bg-white border border-gray-100 shadow-2xl p-12 md:p-24 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
               <h2 className="text-4xl font-serif font-bold text-comfort-blue mb-8">{t('about_page.contact_prompt')}</h2>
               <div className="space-y-6">
                  <div className="flex items-center text-gray-500">
                     <MapPin size={20} className="mr-6 text-comfort-gold" />
                     <span className="font-light tracking-wide">{contactAddress}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                     <Mail size={20} className="mr-6 text-comfort-gold" />
                     <span className="font-light tracking-wide">{contactEmail}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                     <Phone size={20} className="mr-6 text-comfort-gold" />
                     <span className="font-light tracking-wide">{contactPhone}</span>
                  </div>
               </div>
            </div>
            <div className="w-full md:w-auto">
               <a href={`mailto:${contactEmail}`} className="inline-block bg-comfort-blue text-white px-12 py-5 font-bold uppercase tracking-widest hover:bg-comfort-gold transition-all duration-500 shadow-xl">
                 {t('about_page.contact_cta')}
               </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
