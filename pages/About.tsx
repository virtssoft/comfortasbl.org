import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { CONTACT_INFO, TEAM_MEMBERS } from './constants';
import { 
  ArrowRight, UserPlus, CheckCircle, FileText, 
  Mail, Phone, MapPin, Shield, Heart, Globe 
} from 'lucide-react';
import { api } from '../services/api';

const About: React.FC = () => {
  const { t } = useLanguage();
  const { settings, loading } = useData();

  // État du formulaire aligné sur les colonnes de ta DB et les $_POST du PHP
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

    // Préparation des données pour benevoles.php
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

      if (response.user_id || response.message === "Candidature envoyée") {
        setIsSuccess(true);
        setFormState({ 
          nom_complet: '', email: '', telephone: '', 
          adresse_physique: '', message_motivation: '', cv: null 
        });
      } else {
        setError(response.error || "Une erreur est survenue lors de l'envoi.");
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
            src="https://images.unsplash.com/photo-1524069290683-0457abfe42c3?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover opacity-30 grayscale" 
            alt="Humanitarian" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-comfort-dark/60 to-comfort-dark"></div>
        </div>
        <div className="container relative z-10 mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 animate-fade-in">
            {t('about_page.hero_title') || "Notre Engagement"}
          </h1>
          <div className="h-1.5 w-24 bg-comfort-gold mx-auto rounded-full"></div>
        </div>
      </section>

      {/* 🏛️ VALEURS & MISSION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="p-8 border border-gray-100 rounded-lg hover:shadow-xl transition-shadow">
              <Heart size={40} className="text-comfort-gold mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-4">Solidarité</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Nous œuvrons pour le bien-être collectif et le soutien aux plus démunis.</p>
            </div>
            <div className="p-8 border border-gray-100 rounded-lg hover:shadow-xl transition-shadow">
              <Shield size={40} className="text-comfort-gold mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-4">Intégrité</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Une gestion transparente et éthique de chaque projet humanitaire.</p>
            </div>
            <div className="p-8 border border-gray-100 rounded-lg hover:shadow-xl transition-shadow">
              <Globe size={40} className="text-comfort-gold mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-4">Impact Global</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Des actions concrètes pour transformer durablement les communautés.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🏛️ FORMULAIRE D'ADHÉSION (SYNCHRONISÉ PHP) */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-sm flex flex-col lg:flex-row overflow-hidden border border-gray-100">
            
            {/* Sidebar info */}
            <div className="lg:w-1/3 bg-comfort-blue p-12 text-white flex flex-col justify-between">
              <div>
                <UserPlus size={48} className="text-comfort-gold mb-8" />
                <h2 className="text-3xl font-serif font-bold mb-6">Devenir membre</h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Rejoignez-nous en remplissant ce formulaire. Un compte bénévole sera automatiquement créé après validation de vos informations.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-xs uppercase tracking-widest text-comfort-gold">
                  <CheckCircle size={14} /> <span>Traitement sous 48h</span>
                </div>
              </div>
            </div>

            {/* Formulaire effectif */}
            <div className="lg:w-2/3 p-12 bg-white">
              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-comfort-blue">Candidature reçue !</h3>
                  <p className="text-gray-500">Votre profil est en cours d'examen. Vous recevrez prochainement vos accès par email.</p>
                  <button onClick={() => setIsSuccess(false)} className="text-comfort-gold font-bold uppercase text-xs hover:underline">Soumettre une autre demande</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold uppercase">{error}</div>}

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
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Message de Motivation</label>
                    <textarea 
                      required
                      value={formState.message_motivation}
                      onChange={(e) => setFormState({...formState, message_motivation: e.target.value})}
                      rows={4}
                      className="w-full bg-gray-50 border-b border-gray-200 p-4 outline-none focus:border-comfort-gold text-sm resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Curriculum Vitae (PDF)</label>
                    <div className="relative group border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center hover:border-comfort-gold transition-all cursor-pointer">
                      <input 
                        type="file" accept=".pdf" required
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
                    className="w-full bg-comfort-blue text-white py-5 font-bold uppercase tracking-[0.2em] hover:bg-comfort-gold transition-all duration-500 disabled:opacity-50 flex items-center justify-center space-x-4"
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

      {/* 🏛️ EQUIPE */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-serif font-bold text-comfort-blue mb-4">Notre Équipe</h2>
            <div className="h-1 w-16 bg-comfort-gold mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-4 gap-12">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.id} className="text-center group">
                <div className="aspect-[4/5] bg-gray-100 mb-6 overflow-hidden rounded shadow-sm grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="text-lg font-bold">{member.name}</h3>
                <p className="text-comfort-gold text-[10px] uppercase tracking-widest mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏛️ FOOTER CONTACT INFO */}
      <section className="py-24 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-around gap-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-comfort-gold"><Mail size={20} /></div>
              <div><p className="text-[10px] font-bold text-gray-400 uppercase">Email</p><p className="text-sm font-medium">{contactEmail}</p></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-comfort-gold"><Phone size={20} /></div>
              <div><p className="text-[10px] font-bold text-gray-400 uppercase">Téléphone</p><p className="text-sm font-medium">{contactPhone}</p></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-comfort-gold"><MapPin size={20} /></div>
              <div><p className="text-[10px] font-bold text-gray-400 uppercase">Adresse</p><p className="text-sm font-medium">{contactAddress}</p></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
