
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, ChevronDown, Menu, X, Facebook, Twitter, Linkedin, Search, User } from 'lucide-react';
import { CONTACT_INFO } from '../pages/constants';
import { useLanguage } from '../context/LanguageContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  // Combined Menu Order based on new specification
  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' }, // About + Domains
    { name: t('nav.projects'), path: '/projects' }, // Projects + Testimonials
    { name: t('nav.blog'), path: '/blog' }, // Blog + Partners + Contact
    { name: t('nav.account'), path: '/account', icon: <User size={16} className="inline-block mr-1" /> },
  ];

  return (
    <header className="w-full shadow-sm z-50 relative font-sans sticky top-0">
      {/* 🟦 TOPBAR - Minimalist White */}
      <div className="bg-white border-b border-gray-100 py-2 hidden md:block">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center text-xs text-gray-500 font-medium">
          <div className="flex items-center space-x-6">
            <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center hover:text-comfort-blue transition-colors">
              <Mail size={14} className="mr-2" />
              {CONTACT_INFO.email}
            </a>
            <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center hover:text-comfort-blue transition-colors">
              <Phone size={14} className="mr-2" />
              {CONTACT_INFO.phone}
            </a>
          </div>
          <div className="flex items-center space-x-6">
            {/* Social Icons - Monochrome Blue */}
            <div className="flex space-x-4">
              <a href="#" className="text-comfort-blue hover:opacity-80 transition-opacity"><Facebook size={14} /></a>
              <a href="#" className="text-comfort-blue hover:opacity-80 transition-opacity"><Twitter size={14} /></a>
              <a href="#" className="text-comfort-blue hover:opacity-80 transition-opacity"><Linkedin size={14} /></a>
            </div>
            
            {/* Language Selector */}
            <div className="relative group cursor-pointer flex items-center border-l border-gray-200 pl-4">
              <span className="hover:text-comfort-blue transition-colors">{language}</span>
              <ChevronDown size={12} className="ml-1" />
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-100 shadow-lg rounded hidden group-hover:block z-50 w-20">
                {['FR', 'EN', 'SW'].map((lang) => (
                  <button 
                    key={lang} 
                    onClick={() => setLanguage(lang as any)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🟩 MAIN HEADER - "Foundation" Style */}
      <div className="bg-white py-4 lg:py-6 shadow-md">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-3 z-50 group">
            <img 
              src="https://placehold.co/120x120/01217d/ffffff/png?text=Logo" 
              alt="COMFORT Asbl Logo" 
              className="h-14 w-auto object-contain" 
            />
            <div className="flex flex-col">
              <span className="text-comfort-blue font-serif font-bold text-2xl md:text-3xl tracking-tight leading-none">
                COMFORT <span className="text-sm font-sans font-normal ml-1 text-gray-500 uppercase tracking-widest align-middle">Asbl</span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-1">Shield, aid, train and inform.</span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden xl:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`text-sm font-medium tracking-wide transition-all duration-300 relative group flex items-center ${
                  isActive(link.path) ? 'text-comfort-blue' : 'text-comfort-blue/80 hover:text-comfort-blue'
                }`}
              >
                {link.icon && link.icon}
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-comfort-blue transition-all duration-300 group-hover:w-full ${isActive(link.path) ? 'w-full' : ''}`}></span>
              </Link>
            ))}
            
            <Link 
              to="/donate" 
              className="bg-comfort-blue text-white px-6 py-3 rounded-sm text-sm font-bold hover:bg-[#001860] transition-colors shadow-sm tracking-wide uppercase"
            >
              {t('nav.donate')}
            </Link>
          </nav>

          {/* MOBILE TOGGLE */}
          <div className="xl:hidden flex items-center z-50 space-x-4">
             {/* Mobile language toggle */}
             <button onClick={() => setLanguage(language === 'FR' ? 'EN' : language === 'EN' ? 'SW' : 'FR')} className="text-xs font-bold text-comfort-blue border border-comfort-blue rounded px-2 py-1">
                {language}
             </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-comfort-blue p-2 focus:outline-none"
            >
              {isMenuOpen ? <X size={32} strokeWidth={1.5} /> : <Menu size={32} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* 🟧 MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 xl:hidden flex flex-col pt-32 px-6 overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="flex flex-col space-y-6 text-center">
             <Link 
              to="/donate" 
              onClick={() => setIsMenuOpen(false)}
              className="bg-comfort-blue text-white px-6 py-4 rounded-sm text-lg font-bold w-full shadow-lg uppercase tracking-wide mb-6"
            >
              {t('nav.donate')}
            </Link>
            
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsMenuOpen(false)}
                className={`text-xl font-serif font-medium py-3 border-b border-gray-50 flex items-center justify-center ${
                  isActive(link.path) ? 'text-comfort-blue' : 'text-gray-800'
                }`}
              >
                 {link.icon && <span className="mr-2">{link.icon}</span>}
                {link.name}
              </Link>
            ))}
            
            <div className="pt-8 flex justify-center space-x-4 mt-auto pb-12">
               {['FR', 'EN', 'SW'].map((lang) => (
                  <button 
                    key={lang} 
                    onClick={() => setLanguage(lang as any)}
                    className={`px-4 py-2 rounded border ${language === lang ? 'bg-comfort-blue text-white border-comfort-blue' : 'bg-transparent text-gray-500 border-gray-200'}`}
                  >
                    {lang}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
