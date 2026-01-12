
import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../pages/constants';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-black text-white pt-20 pb-10 font-sans">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 border-b border-gray-800 pb-12">
          {/* Col 1: À propos */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-6 text-white border-l-4 border-comfort-blue pl-4">{t('footer.about_title')}</h3>
            <p className="text-gray-400 text-sm leading-7 mb-6">
              {t('footer.about_text')}
            </p>
            <Link to="/about" className="text-comfort-blue text-sm font-bold hover:underline tracking-wide uppercase">
              {t('footer.history')}
            </Link>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-6 text-white pl-4">{t('footer.nav_title')}</h3>
            <ul className="space-y-3 text-sm text-gray-400 pl-4">
              <li><Link to="/" className="hover:text-white transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">{t('nav.domains')}</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">{t('nav.projects')}</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">{t('nav.blog')}</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">{t('nav.contact')}</Link></li>
              <li><Link to="/donate" className="hover:text-comfort-blue text-white font-bold transition-colors">{t('nav.donate')}</Link></li>
            </ul>
          </div>

          {/* Col 3: Informations */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-6 text-white pl-4">{t('footer.info_title')}</h3>
            <div className="space-y-4 text-sm text-gray-400 pl-4">
              <div>
                <span className="block text-gray-600 text-xs uppercase font-bold tracking-wider mb-1">{t('contact.address')}</span>
                {CONTACT_INFO.address}
              </div>
              <div>
                <span className="block text-gray-600 text-xs uppercase font-bold tracking-wider mb-1">{t('contact.email')}</span>
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors">{CONTACT_INFO.email}</a>
              </div>
              <div>
                <span className="block text-gray-600 text-xs uppercase font-bold tracking-wider mb-1">{t('contact.phone')}</span>
                <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-white transition-colors">{CONTACT_INFO.phone}</a>
              </div>
              <div>
                 <span className="block text-gray-600 text-xs uppercase font-bold tracking-wider mb-1">{t('contact.hours')}</span>
                 {CONTACT_INFO.hours}
              </div>
            </div>
          </div>

          {/* Col 4: Réseaux Sociaux */}
          <div>
             <h3 className="text-xl font-serif font-bold mb-6 text-white pl-4">{t('footer.follow_title')}</h3>
             <div className="flex space-x-4 pl-4 mb-8">
               <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-comfort-blue hover:text-white transition-all text-gray-400"><Facebook size={18} /></a>
               <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-comfort-blue hover:text-white transition-all text-gray-400"><Twitter size={18} /></a>
               <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-comfort-blue hover:text-white transition-all text-gray-400"><Linkedin size={18} /></a>
               <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-comfort-blue hover:text-white transition-all text-gray-400"><Instagram size={18} /></a>
             </div>
             
             <p className="text-xs text-gray-500 pl-4">{t('footer.newsletter_text')}</p>
             <form className="mt-4 pl-4 flex flex-col space-y-2">
                <input type="email" placeholder="Email" className="bg-gray-900 border border-gray-800 px-4 py-2 text-sm rounded focus:border-comfort-blue focus:outline-none text-white" />
                <button className="bg-comfort-blue text-white py-2 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-comfort-blue transition-colors rounded">{t('footer.subscribe')}</button>
             </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} Comfort-Impact20. {t('footer.rights')}</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
             <Link to="/privacy" className="hover:text-gray-400 transition-colors">{t('footer.privacy')}</Link>
             <Link to="/terms" className="hover:text-gray-400 transition-colors">{t('footer.terms')}</Link>
             <span className="text-gray-700">|</span>
             <a href="#" className="text-gray-500 hover:text-white transition-colors font-medium">{t('footer.powered')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
