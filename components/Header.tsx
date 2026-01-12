
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, ChevronDown, Menu, X, Facebook, Linkedin, User, Globe, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

const XIcon = ({ size = 14, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { settings } = useData();

  const isActive = (path: string) => location.pathname === path;

  const contactEmail = settings?.contactEmail || "contact@comfortasbl.org";
  const contactPhone = settings?.contactPhone || "+243 994 280 037";
  const logoUrl = settings?.logoUrl || "https://api.comfortasbl.org/assets/images/logo1.png";

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.projects'), path: '/projects' },
    { name: t('nav.blog'), path: '/blog' },
    { name: t('nav.newsletter'), path: '/bulletins' },
    { name: t('nav.account'), path: '/account', icon: <User size={14} className="mr-1" /> },
  ];

  return (
    <header className="w-full z-[100] relative font-sans sticky top-0 transition-all duration-500 bg-white shadow-sm">
      {/* TOPBAR */}
      <div className="bg-white border-b border-gray-50 py-2.5 hidden lg:block">
        <div className="container mx-auto px-6 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          <div className="flex items-center space-x-8">
            <a href={`mailto:${contactEmail}`} className="flex items-center hover:text-comfort-gold transition-colors">
              <Mail size={12} className="mr-2 text-comfort-gold" />
              {contactEmail}
            </a>
            <a href={`tel:${contactPhone}`} className="flex items-center hover:text-comfort-gold transition-colors">
              <Phone size={12} className="mr-2 text-comfort-gold" />
              {contactPhone}
            </a>
          </div>
          <div className="flex items-center space-x-8">
            <div className="flex space-x-6 items-center">
              <a href="https://www.facebook.com/photo/?fbid=122103347780826664" target="_blank" className="hover:text-comfort-gold transition-colors"><Facebook size={12} /></a>
              <a href="https://x.com/AsblComfor44668" target="_blank" className="hover:text-comfort-gold transition-colors"><XIcon size={12} /></a>
              <a href="#" className="hover:text-comfort-gold transition-colors"><Linkedin size={12} /></a>
            </div>
            
            <div className="relative group cursor-pointer flex items-center border-l border-gray-100 pl-8">
              <Globe size={12} className="mr-2 text-comfort-gold" />
              <span>{language}</span>
              <ChevronDown size={10} className="ml-1" />
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-100 shadow-2xl rounded-sm hidden group-hover:block z-[110] w-24 overflow-hidden">
                {['FR', 'EN', 'SW'].map((lang) => (
                  <button key={lang} onClick={() => setLanguage(lang as any)} className="block w-full text-left px-5 py-3 hover:bg-gray-50 text-[10px] font-bold text-gray-700">
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="bg-white/95 backdrop-blur-md py-4 lg:py-6">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-4 z-50">
            <img src={logoUrl} alt="COMFORT" className="h-12 md:h-16 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-comfort-blue font-serif font-bold text-xl md:text-2xl leading-none">COMFORT <span className="text-[10px] font-sans font-normal text-gray-400 uppercase tracking-widest">Asbl</span></span>
              <span className="text-[8px] text-comfort-gold font-bold tracking-[0.2em] uppercase mt-1">Shield, Aid, Train & Inform.</span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`text-[11px] font-bold uppercase tracking-widest flex items-center transition-colors ${isActive(link.path) ? 'text-comfort-blue border-b-2 border-comfort-gold pb-1' : 'text-gray-400 hover:text-comfort-blue'}`}>
                {link.icon && link.icon} {link.name}
              </Link>
            ))}
            <Link to="/donate" className="bg-comfort-blue text-white px-8 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-comfort-gold transition-all shadow-lg">
              {t('nav.donate')}
            </Link>
          </nav>

          <button onClick={() => setIsMenuOpen(true)} className="xl:hidden text-comfort-blue p-2" aria-label="Menu">
            <Menu size={32} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-[200] flex flex-col animate-in fade-in slide-in-from-right duration-300">
          <div className="flex justify-between items-center p-6 border-b border-gray-50">
            <img src={logoUrl} alt="Logo" className="h-10 w-auto" />
            <button onClick={() => setIsMenuOpen(false)} className="bg-comfort-blue text-white p-3 rounded-full shadow-lg">
              <X size={28} />
            </button>
          </div>
          <div className="flex flex-col p-8 space-y-8 overflow-y-auto">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className={`text-3xl font-serif font-bold ${isActive(link.path) ? 'text-comfort-gold' : 'text-comfort-blue'}`}>
                {link.name}
              </Link>
            ))}
            <Link to="/donate" onClick={() => setIsMenuOpen(false)} className="bg-comfort-blue text-white py-5 text-center font-bold uppercase tracking-widest shadow-xl">
              {t('nav.donate')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
