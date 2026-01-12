
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, AlertCircle, Cpu, Globe, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
// Fix: Import GoogleGenAI as per @google/genai guidelines
import { GoogleGenAI } from "@google/genai";

const ChatBot: React.FC = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<'none' | 'config' | 'api' | 'network'>('none');
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    { fr: "Comment faire un don ?", en: "How to donate?", sw: "Jinsi ya kutoa msaada?" },
    { fr: "Quels sont vos projets ?", en: "What are your projects?", sw: "Miradi yenu ni gani?" },
    { fr: "Où se trouve votre siège ?", en: "Where is your head office?", sw: "Ofisi yenu iko wapi?" }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async (customMessage?: string) => {
    const messageToSend = (customMessage || input).trim();
    if (!messageToSend || isLoading) return;

    // Fix: Validate API key existence in process.env
    const apiKey = process.env.API_KEY?.trim(); 

    if (!apiKey || apiKey === "undefined" || apiKey === "") {
      setErrorStatus('config');
      setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "⚙️ ERREUR : La clé API Gemini n'est pas configurée." 
      }]);
      setInput('');
      return;
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    setIsLoading(true);
    setErrorStatus('none');

    try {
      // Fix: Initialize Gemini API client and call generateContent
      const ai = new GoogleGenAI({ apiKey });
      const langFull = language === 'FR' ? 'Français' : language === 'EN' ? 'English' : 'Kiswahili';
      const systemInstruction = `Tu es l'assistant IA officiel de COMFORT Asbl (Goma, RDC). 
      Réponds toujours en ${langFull}.
      Ton ton : Professionnel, chaleureux, digne d'une grande fondation internationale.
      Contexte : Nous intervenons en santé, éducation, et développement socio-économique en RDC.
      Contact : contact@comfortasbl.org. Siège : Katindo, Goma.
      Consigne : Sois concis et utile.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: messageToSend,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
          topP: 0.9,
        },
      });

      // Fix: Access response text using the .text property as defined in guidelines
      const botText = response.text || "Je suis à votre écoute. Comment COMFORT peut-il vous aider aujourd'hui ?";

      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: botText 
      }]);
      
    } catch (error: any) {
      console.error("ChatBot API Error:", error);
      
      if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
        setErrorStatus('network');
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: "🌐 Impossible de contacter le serveur IA. Vérifiez votre connexion." 
        }]);
      } else {
        setErrorStatus('api');
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: `⚠️ Erreur technique : ${error.message}.` 
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getQuestionByLang = (q: any) => {
    if (language === 'EN') return q.en;
    if (language === 'SW') return q.sw;
    return q.fr;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[400px] h-[70vh] sm:h-[600px] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
          {/* Header */}
          <div className="bg-comfort-blue p-6 flex justify-between items-center text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="flex items-center space-x-4 relative z-10">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                <Bot size={22} className="text-comfort-gold" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs uppercase tracking-widest">{t('chatbot.title')}</span>
                <span className="text-[10px] opacity-70 flex items-center">
                  <span className={`w-1.5 h-1.5 rounded-full mr-2 ${isLoading ? 'bg-comfort-gold animate-pulse' : 'bg-green-400'}`}></span>
                  {isLoading ? t('chatbot.typing') : t('chatbot.status')}
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors">
              <X size={20} />
            </button>
          </div>
          
          {/* Chat area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30 no-scrollbar">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in duration-1000">
                <div className="p-4 bg-comfort-blue/5 rounded-full">
                  <Sparkles size={32} className="text-comfort-blue opacity-20" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-comfort-blue font-serif font-bold text-lg">Bienvenue chez COMFORT</h4>
                  <p className="text-gray-400 text-xs px-8 leading-relaxed">
                    Je suis là pour vous informer sur nos missions humanitaires en RDC.
                  </p>
                </div>
                
                {/* Quick Actions */}
                <div className="grid gap-3 w-full px-4">
                  {quickQuestions.map((q, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSend(getQuestionByLang(q))}
                      className="text-left px-4 py-3 bg-white border border-gray-100 rounded-xl text-[11px] text-gray-600 hover:border-comfort-gold hover:text-comfort-blue transition-all flex items-center justify-between group shadow-sm"
                    >
                      {getQuestionByLang(q)}
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[12px] shadow-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-comfort-blue text-white rounded-tr-none' 
                    : errorStatus !== 'none' 
                      ? 'bg-red-50 text-red-600 border border-red-100 rounded-tl-none'
                      : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 px-5 py-3 rounded-2xl rounded-tl-none flex space-x-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-comfort-gold/40 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-comfort-gold/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-comfort-gold rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {errorStatus !== 'none' && (
            <div className="px-6 py-2 bg-amber-50 text-[9px] text-amber-700 flex items-center border-t border-amber-100 font-bold uppercase tracking-tighter">
              <AlertCircle size={12} className="mr-2" /> 
              {errorStatus === 'config' ? "Clé API non configurée" : "Erreur de connexion"}
            </div>
          )}
          
          {/* Input area */}
          <div className="p-6 bg-white border-t border-gray-50 flex items-center space-x-3">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs outline-none focus:ring-2 ring-comfort-gold/20 focus:bg-white transition-all pr-12" 
                placeholder={t('chatbot.placeholder')} 
                disabled={isLoading}
              />
            </div>
            <button 
              onClick={() => handleSend()} 
              disabled={isLoading || !input.trim()}
              className="bg-comfort-blue text-white p-4 rounded-2xl hover:bg-comfort-gold disabled:opacity-30 disabled:grayscale transition-all shadow-lg active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
          
          <div className="bg-gray-50 py-3 text-center border-t border-gray-100">
             <span className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.2em] flex items-center justify-center">
               <Cpu size={10} className="mr-2" /> IA COMFORT • Gemini 3
             </span>
          </div>
        </div>
      )}
      
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="bg-comfort-blue text-white w-16 h-16 rounded-2xl shadow-[0_15px_30px_rgba(1,33,125,0.3)] flex items-center justify-center border-2 border-white/20 hover:scale-105 transition-all active:scale-95 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-comfort-blue to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute top-0 right-0 w-6 h-6 bg-comfort-gold rounded-full border-4 border-white -translate-y-2 translate-x-2 z-20"></div>
        {isOpen ? <X size={28} className="relative z-10" /> : <MessageSquare size={28} className="relative z-10 group-hover:rotate-6 transition-transform" />}
      </button>
    </div>
  );
};

export default ChatBot;
