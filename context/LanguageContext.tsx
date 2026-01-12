
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
    
    // Helper to get nested value
    const getValue = (lang: Language, keys: string[]) => {
      let current: any = translations[lang];
      for (const key of keys) {
        if (current === undefined || current[key] === undefined) return undefined;
        current = current[key];
      }
      return current;
    };

    // Try current language
    const result = getValue(language, keys);
    if (result !== undefined) return result;

    // Fallback to FR if not FR
    if (language !== 'FR') {
      const fallback = getValue('FR', keys);
      if (fallback !== undefined) return fallback;
    }

    // Return the path itself if all fails
    console.warn(`Translation missing for key: ${path} in language: ${language}`);
    return path;
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
