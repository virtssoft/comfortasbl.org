
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Check, AlertTriangle, Shield, Key, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const Account: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, login, logout, isAuthenticated } = useAuth();

  const [view, setView] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await api.login(email, password);
    if (res.success) login(res.user);
    else setError(res.error || "Identifiants non reconnus.");
    setLoading(false);
  };

  if (isAuthenticated && user) {
      return (
          <div className="min-h-screen bg-white py-32 px-6 font-sans">
              <div className="container mx-auto max-w-5xl">
                  <div className="flex flex-col md:flex-row gap-20 items-start">
                      {/* PROFIL - Minimalist */}
                      <div className="w-full md:w-1/3">
                          <div className="aspect-square bg-comfort-light border border-gray-100 mb-8 flex items-center justify-center relative overflow-hidden group">
                              <User size={100} strokeWidth={0.5} className="text-gray-200 group-hover:scale-110 transition-transform duration-700" />
                              <div className="absolute top-4 right-4 bg-comfort-gold text-white text-[10px] px-3 py-1 font-bold uppercase tracking-widest">{user.role}</div>
                          </div>
                          <h1 className="text-3xl font-serif font-bold text-comfort-blue mb-2">{user.username}</h1>
                          <p className="text-gray-400 font-light mb-10">{user.email}</p>
                          <button onClick={() => logout()} className="flex items-center text-xs font-bold text-red-400 uppercase tracking-[0.2em] hover:text-red-600 transition-colors">
                              <LogOut size={14} className="mr-3" /> Terminer la session
                          </button>
                      </div>

                      {/* DASHBOARD - Structured */}
                      <div className="flex-1 space-y-20">
                          <div>
                              <h2 className="text-xl font-serif font-bold text-comfort-blue mb-8 border-b border-gray-100 pb-4 flex items-center">
                                  <History size={20} className="mr-4 text-comfort-gold" />
                                  Historique des engagements
                              </h2>
                              <div className="bg-comfort-light p-12 text-center border border-gray-100">
                                  <p className="text-gray-400 italic font-light">Aucune transaction enregistrée ce trimestre.</p>
                                  <button onClick={() => navigate('/donate')} className="mt-6 text-comfort-gold font-bold text-xs uppercase tracking-widest hover:underline">Faire un geste maintenant</button>
                              </div>
                          </div>

                          <div>
                              <h2 className="text-xl font-serif font-bold text-comfort-blue mb-8 border-b border-gray-100 pb-4 flex items-center">
                                  <Shield size={20} className="mr-4 text-comfort-gold" />
                                  Sécurité du compte
                              </h2>
                              <div className="grid md:grid-cols-2 gap-8">
                                  <div className="p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Authentification</p>
                                      <p className="text-sm text-gray-600 font-light mb-6">Mise à jour régulière conseillée (tous les 90 jours).</p>
                                      <button className="text-comfort-blue font-bold text-xs uppercase tracking-widest flex items-center"><Key size={14} className="mr-2"/> Modifier le pass</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-comfort-light flex flex-col justify-center py-20 px-6 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-10">
        <span className="text-comfort-gold font-bold uppercase tracking-[0.5em] text-[10px] block mb-6">Portail Institutionnel</span>
        <h2 className="text-4xl font-serif font-bold text-comfort-blue">{view === 'login' ? "Accès Membre" : "Rejoindre la Fondation"}</h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-10 shadow-2xl border border-gray-100">
          {error && <div className="text-red-600 text-[10px] font-bold uppercase tracking-widest bg-red-50 p-4 mb-8 border-l-2 border-red-500 flex items-center"><AlertTriangle size={14} className="mr-3"/> {error}</div>}
          
          <form className="space-y-8" onSubmit={handleLogin}>
                <div className="relative">
                    <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent border-b border-gray-200 py-4 outline-none focus:border-comfort-gold transition-colors font-light text-sm" 
                        placeholder="Identifiant ou Email"
                    />
                </div>
                <div className="relative">
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent border-b border-gray-200 py-4 outline-none focus:border-comfort-gold transition-colors font-light text-sm" 
                        placeholder="Code d'accès sécurisé"
                    />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-comfort-blue text-white py-5 font-bold uppercase tracking-widest hover:bg-comfort-gold transition-all duration-700 shadow-xl disabled:opacity-50">
                    {loading ? "Vérification..." : "Se Connecter"}
                </button>
          </form>

          <div className="mt-12 text-center border-t border-gray-50 pt-8">
                <button onClick={() => setView(view === 'login' ? 'register' : 'login')} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-comfort-gold transition-colors">
                    {view === 'login' ? "Créer un profil institutionnel" : "Retour à l'accès membre"}
                </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
