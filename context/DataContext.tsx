import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '../services/api';
import { Project, BlogPost, Partner, TeamMember, Testimonial, SiteSettings, Bulletin, SiteStats } from '../types';

interface DataContextType {
  settings: SiteSettings | null;
  projects: Project[];
  blogPosts: BlogPost[];
  bulletins: Bulletin[];
  partners: Partner[];
  stats: SiteStats | null;
  teamMembers: TeamMember[];
  testimonials: Testimonial[];
  loading: boolean;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Fonction utilitaire pour précharger les images (Carousel)
  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve();
      img.onerror = () => resolve(); // On résout quand même pour ne pas bloquer le loading
    });
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        api.getSettings(),    // 0
        api.getProjects(),    // 1
        api.getBlogPosts(),   // 2
        api.getPartners(),    // 3
        api.getStats(),       // 4
        api.getBulletins(),   // 5
        api.getTeam(),        // 6
        api.getTestimonials() // 7
      ]);

      // Extraction sécurisée des données
      if (results[0].status === 'fulfilled') setSettings(results[0].value);
      if (results[1].status === 'fulfilled') setProjects(results[1].value || []);
      if (results[2].status === 'fulfilled') setBlogPosts(results[2].value || []);
      if (results[3].status === 'fulfilled') setPartners(results[3].value || []);
      if (results[4].status === 'fulfilled') setStats(results[4].value);
      if (results[5].status === 'fulfilled') setBulletins(results[5].value || []);
      if (results[6].status === 'fulfilled') setTeamMembers(results[6].value || []);
      if (results[7].status === 'fulfilled') setTestimonials(results[7].value || []);

      // Pré-chargement des images du carousel (les 3 premières)
      if (results[2].status === 'fulfilled' && results[2].value) {
        const topImages = results[2].value
          .slice(0, 3)
          .map((p: BlogPost) => p.image)
          .filter((url: string) => !!url);
        await Promise.all(topImages.map(preloadImage));
      }

    } catch (error) {
      console.error("Erreur critique lors du chargement des données:", error);
    } finally {
      // Un petit délai pour garantir que les transitions CSS du Skeleton sont fluides
      setTimeout(() => setLoading(false), 800);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <DataContext.Provider value={{
      settings,
      projects,
      blogPosts,
      bulletins,
      partners,
      stats,
      teamMembers,
      testimonials,
      loading,
      refreshData: loadData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
