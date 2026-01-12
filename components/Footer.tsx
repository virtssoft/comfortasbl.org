
import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../pages/constants';
import { Facebook, Linkedin, Instagram } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const XIcon = ({ size = 18, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-black text-white pt-20 pb-10 font-sans">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 border-b border-gray-800 pb-12">
          {/* Col 1 */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-6 text-white border-l-4 border-comfort-blue pl-4">{t('footer.about_title')}</h3>
            <p className="text-gray-400 text-sm leading-7 mb-6">{t('footer.about_text')}</p>
            <Link to="/about" className="text-comfort-blue text-sm font-bold hover:underline tracking-wide uppercase">{t('footer.history')}</Link>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-6 text-white pl-4">{t('footer.nav_title')}</h3>
            <ul className="space-y-3 text-sm text-gray-400 pl-4">
              <li><Link to="/" className="hover:text-white transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">{t('nav.domains')}</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">{t('nav.projects')}</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">{t('nav.blog')}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</Link></li>
              <li><Link to="/donate" className="hover:text-comfort-blue text-white font-bold transition-colors">{t('nav.donate')}</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-6 text-white pl-4">{t('footer.info_title')}</h3>
            <div className="space-y-4 text-sm text-gray-400 pl-4">
              <div className="text-xs uppercase font-bold tracking-wider text-gray-600">{t('contact.address')}</div>
              <div className="mb-2">{CONTACT_INFO.address}</div>
              <div className="text-xs uppercase font-bold tracking-wider text-gray-600">{t('contact.email')}</div>
              <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors block mb-2">{CONTACT_INFO.email}</a>
            </div>
          </div>

          {/* Col 4 */}
          <div>
             <h3 className="text-xl font-serif font-bold mb-6 text-white pl-4">{t('footer.follow_title')}</h3>
             <div className="flex space-x-4 pl-4 mb-8">
               <a href="https://www.facebook.com/photo/?fbid=122103347780826664" target="_blank" className="bg-gray-800 p-3 rounded-full hover:bg-comfort-blue transition-all"><Facebook size={18} /></a>
               <a href="https://x.com/AsblComfor44668" target="_blank" className="bg-gray-800 p-3 rounded-full hover:bg-comfort-blue transition-all"><XIcon size={18} /></a>
               <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-comfort-blue transition-all"><Linkedin size={18} /></a>
               <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-comfort-blue transition-all"><Instagram size={18} /></a>
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>&copy; 2025 Comfort Asbl. {t('footer.rights')}</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
             <Link to="/privacy" className="hover:text-gray-400 transition-colors">{t('footer.privacy')}</Link>
             <Link to="/terms" className="hover:text-gray-400 transition-colors">{t('footer.terms')}</Link>
             <span className="text-gray-700">|</span>
             <Link to="/virtssoft-impact" className="text-gray-500 hover:text-white font-medium">{t('footer.powered')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
