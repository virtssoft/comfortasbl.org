
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        api.getSettings(),
        api.getProjects(),
        api.getBlogPosts(),
        api.getPartners(),
        api.getStats(),
        api.getBulletins(),
        api.getTeam(),
        api.getTestimonials()
      ]);

      if (results[0].status === 'fulfilled') setSettings(results[0].value);
      if (results[1].status === 'fulfilled') setProjects(results[1].value || []);
      if (results[2].status === 'fulfilled') setBlogPosts(results[2].value || []);
      if (results[3].status === 'fulfilled') setPartners(results[3].value || []);
      if (results[4].status === 'fulfilled') setStats(results[4].value);
      if (results[5].status === 'fulfilled') setBulletins(results[5].value || []);
      if (results[6].status === 'fulfilled') setTeamMembers(results[6].value || []);
      if (results[7].status === 'fulfilled') setTestimonials(results[7].value || []);

      // Pré-chargement des images critiques (Carousel)
      if (results[2].status === 'fulfilled' && results[2].value) {
        const topImages = results[2].value.slice(0, 3).map(p => p.image).filter(i => !!i);
        await Promise.all(topImages.map(url => preloadImage(url)));
      }

    } catch (error) {
      console.error("Erreur de chargement des données", error);
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
