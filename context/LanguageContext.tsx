import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations } from '../translations';

type Language = 'FR' | 'EN' | 'SW';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('FR');

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = translations[language];
    
    if (!current) return path;

    for (const key of keys) {
      if (!current || current[key] === undefined) {
        console.warn(`Translation missing for key: ${path} in language: ${language}`);
        // Fallback to FR if current language is missing key
        if (language !== 'FR') {
          let frCurrent: any = translations['FR'];
          for (const frKey of keys) {
            if (!frCurrent || frCurrent[frKey] === undefined) return path;
            frCurrent = frCurrent[frKey];
          }
          return frCurrent;
        }
        return path;
      }
      current = current[key];
    }
    
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};