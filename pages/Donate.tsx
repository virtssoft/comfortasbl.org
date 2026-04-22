import React, { useState } from 'react';
import { Heart, Lock, CheckCircle, CreditCard, Phone, Smartphone, ShieldCheck, Copy, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

const Donate: React.FC = () => {
  const { t } = useLanguage();
  
  const [amount, setAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState('Carte');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setAmount(null);
  };

  const getFinalAmount = () => amount ? amount.toString() : customAmount;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('00017220062000003346537');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);
      const finalAmount = getFinalAmount();

      if (!finalAmount || parseFloat(finalAmount) <= 0) {
          setError("Veuillez entrer un montant symbolique valide.");
          setLoading(false);
          return;
      }

      try {
          const result = await api.sendDonation({
              donateur_nom: name,
              email: email,
              montant: finalAmount,
              methode: method,
              message: message,
              status: 'en_attente'
          });
          if (result.success) setSuccess(true);
          else setError(result.error || "Erreur de transmission.");
      } catch (err) {
          setError("Erreur de connexion.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="py-24 bg-white min-h-screen font-sans">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* EN-TETE SOLENNELLE */}
        <div className="text-center mb-24 animate-fade-in-up">
          <span className="text-comfort-gold font-bold uppercase tracking-[0.4em] text-xs mb-6 block">Acte de Solidarité</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-comfort-blue mb-8 leading-tight">{t('donate.title')}</h1>
          <div className="h-1 w-20 bg-comfort-gold mx-auto mb-8"></div>
          <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed italic">
            "Soutenir COMFORT, c'est investir dans la dignité de ceux qui n'ont que leur résilience pour avancer."
          </p>
        </div>

        {success ? (
          <div className="max-w-2xl mx-auto text-center py-20 bg-comfort-light border border-gray-100 shadow-2xl animate-in zoom-in duration-500">
             <div className="bg-comfort-gold/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10">
                <CheckCircle className="text-comfort-gold" size={48} />
             </div>
             <h2 className="text-3xl font-serif font-bold text-comfort-blue mb-6">Merci pour votre noblesse, {name}.</h2>
             <p className="text-gray-600 mb-12 font-light">Votre promesse de don de <span className="font-bold text-comfort-blue">{getFinalAmount()}$</span> est enregistrée. Veuillez finaliser via votre application bancaire ou mobile.</p>
             <button onClick={() => setSuccess(false)} className="text-comfort-gold font-bold uppercase tracking-widest hover:underline">Faire un nouvel acte</button>
          </div>
        ) : (
        <div className="grid lg:grid-cols-12 gap-20">
          
          {/* FORMULAIRE */}
          <div className="lg:col-span-7 bg-white">
            <h2 className="text-2xl font-serif font-bold text-comfort-blue mb-12 flex items-center">
              <span className="w-8 h-[1px] bg-comfort-gold mr-4"></span>
              {t('donate.choose_amount')}
            </h2>
            
            <div className="grid grid-cols-3 gap-6 mb-12">
              {[25, 50, 100, 250, 500, 1000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => { setAmount(val); setCustomAmount(''); }}
                  className={`py-6 border font-bold transition-all duration-500 tracking-widest ${
                    amount === val 
                      ? 'bg-comfort-blue text-white border-comfort-blue shadow-xl scale-105' 
                      : 'bg-white text-gray-400 border-gray-100 hover:border-comfort-gold hover:text-comfort-gold'
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>

            <div className="mb-16">
              <input 
                type="number" 
                value={customAmount}
                onChange={handleCustomChange}
                className="w-full bg-transparent border-b-2 border-gray-100 py-6 text-2xl font-light outline-none focus:border-comfort-gold transition-colors"
                placeholder="Ou entrez un autre montant libre ($)"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <h2 className="text-2xl font-serif font-bold text-comfort-blue mb-12 flex items-center">
                    <span className="w-8 h-[1px] bg-comfort-gold mr-4"></span>
                    Vos Coordonnées
                </h2>
                
                {error && <div className="bg-red-50 text-red-600 p-4 font-bold text-sm border-l-4 border-red-500 mb-6">{error}</div>}

                <div className="grid md:grid-cols-2 gap-8">
                    <input 
                        type="text" required value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Nom Complet institutionnel" 
                        className="w-full bg-comfort-light border-b border-gray-200 p-5 outline-none focus:border-comfort-gold transition-all font-light" 
                    />
                    <input 
                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="Adresse Email de contact" 
                        className="w-full bg-comfort-light border-b border-gray-200 p-5 outline-none focus:border-comfort-gold transition-all font-light" 
                    />
                </div>

                <textarea 
                    value={message} onChange={(e) => setMessage(e.target.value)}
                    placeholder="Un message pour nos équipes (optionnel)..." 
                    rows={3}
                    className="w-full bg-comfort-light border-b border-gray-200 p-5 outline-none focus:border-comfort-gold transition-all font-light resize-none" 
                />

                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Méthode de paiement</label>
                    <select 
                        value={method} onChange={(e) => setMethod(e.target.value)}
                        className="w-full bg-comfort-light border-b border-gray-200 p-5 outline-none focus:border-comfort-gold transition-all font-bold text-sm uppercase tracking-widest bg-white"
                    >
                        <option value="Carte">Virement / Carte Bancaire</option>
                        <option value="Airtel Money">Airtel Money (Recommandé)</option>
                        <option value="M-Pesa">M-Pesa</option>
                    </select>

                    {/* AFFICHAGE DYNAMIQUE DES COORDONNÉES TMB */}
                    {method === 'Carte' && (
                        <div className="mt-6 p-8 bg-gray-50 border border-dashed border-gray-300 rounded-sm animate-in fade-in slide-in-from-top-2 duration-500">
                            <div className="flex justify-between items-start mb-6">
                                <h4 className="text-[10px] font-bold text-comfort-blue uppercase tracking-[0.2em]">Détails du compte institutionnel</h4>
                                <span className="text-[10px] bg-comfort-blue text-white px-2 py-1 font-bold">RDC - GOMA</span>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <p className="text-[9px] uppercase text-gray-400 font-bold mb-1">Intitulé de compte</p>
                                    <p className="text-sm font-bold text-gray-800">COMFORT ASBL</p>
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase text-gray-400 font-bold mb-1">Banque</p>
                                    <p className="text-sm font-bold text-gray-800">Trust Merchant Bank S.A. (TMB)</p>
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase text-gray-400 font-bold mb-1">Devise</p>
                                    <p className="text-sm font-bold text-comfort-blue uppercase">USD</p>
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase text-gray-400 font-bold mb-1">Swift / BIC</p>
                                    <p className="text-sm font-bold text-gray-800 tracking-widest">TRMSCD3L</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-[9px] uppercase text-gray-400 font-bold mb-2">Numéro de compte</p>
                                <div className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded-sm">
                                    <code className="text-xs font-mono font-bold text-comfort-blue tracking-tighter">00017220062000003346537</code>
                                    <button 
                                        type="button"
                                        onClick={handleCopyAccount}
                                        className="text-comfort-gold hover:scale-110 transition-transform"
                                    >
                                        {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    type="submit" disabled={loading}
                    className="w-full bg-comfort-blue text-white py-6 font-bold uppercase tracking-[0.3em] hover:bg-comfort-gold transition-all duration-700 shadow-2xl disabled:opacity-50"
                >
                    {loading ? "Transmission..." : `Confirmer l'acte de don : ${getFinalAmount() || '0'}$`}
                </button>
                
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] text-center flex items-center justify-center">
                    <Lock size={12} className="mr-3 text-comfort-gold" /> Protocole de sécurité institutionnel actif
                </p>
            </form>
          </div>

          {/* SIDEBAR IMPACT */}
          <div className="lg:col-span-5">
             <div className="bg-comfort-dark text-white p-12 shadow-2xl sticky top-32">
               <ShieldCheck size={40} className="text-comfort-gold mb-8" />
               <h3 className="text-2xl font-serif font-bold mb-8">Transparence & Garantie</h3>
               <ul className="space-y-8 text-gray-300 font-light text-sm">
                 <li className="flex items-start">
                   <span className="w-2 h-2 bg-comfort-gold rounded-full mt-1.5 mr-4 flex-shrink-0"></span>
                   100% de votre contribution est allouée aux programmes de terrain.
                 </li>
                 <li className="flex items-start">
                   <span className="w-2 h-2 bg-comfort-gold rounded-full mt-1.5 mr-4 flex-shrink-0"></span>
                   Chaque don est suivi d'un rapport d'impact annuel détaillé.
                 </li>
               </ul>
               <div className="mt-12 pt-12 border-t border-white/10">
                   <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Assistance Donateur</p>
                   <a href="mailto:donations@comfortasbl.org" className="text-comfort-gold font-bold hover:underline block text-lg mb-2">donations@comfortasbl.org</a>
                   <p className="text-sm text-gray-400">+243 994 280 037</p>
               </div>
             </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Donate;
