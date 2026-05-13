import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';
import { Project, BlogPost, Partner, TeamMember, Testimonial, SiteSettings } from '../types';

interface DataContextType {
  settings: SiteSettings | null;
  projects: Project[];
  blogPosts: BlogPost[];
  partners: Partner[];
  teamMembers: TeamMember[]; // Utilisé pour l'équipe
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
  const [partners, setPartners] = useState<Partner[]>([]);
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
        api.getTeam(), // Appelle team.php via ton service api
        api.getTestimonials()
      ]);

      if (results[0].status === 'fulfilled') setSettings(results[0].value);
      if (results[1].status === 'fulfilled') setProjects(results[1].value || []);
      
      let posts: BlogPost[] = [];
      if (results[2].status === 'fulfilled') {
        posts = results[2].value || [];
        setBlogPosts(posts);
      }
      
      if (results[3].status === 'fulfilled') setPartners(results[3].value || []);
      
      // Mise à jour des membres de l'équipe
      if (results[4].status === 'fulfilled') {
        setTeamMembers(results[4].value || []);
      }
      
      if (results[5].status === 'fulfilled') setTestimonials(results[5].value || []);

      // Pré-chargement des images critiques
      const topImages = posts.slice(0, 3).map(p => p.image).filter(i => !!i);
      await Promise.all(topImages.map(url => preloadImage(url)));

    } catch (error) {
      console.error("Erreur globale lors du chargement des données", error);
    } finally {
      // Le délai de 2s permet d'éviter les flashs visuels si l'API répond trop vite
      setTimeout(() => setLoading(false), 2000);
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
      partners,
      teamMembers, // On exporte teamMembers
      loading,
      refreshData: loadData,
      testimonials
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
