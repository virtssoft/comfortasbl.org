
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  date: string;
  endDate?: string;
  status: 'Ongoing' | 'Completed';
  goal: number;
  raised: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
  views?: number;
}

export interface Bulletin {
  id: string;
  title: string;
  slug: string;
  summary: string;
  pdfLink: string;
  date: string;
}

export interface SiteStats {
  visitors: number;
  members: number;
  donations: number;
  projects: number;
  volunteers: number;
}

export interface Domain {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  nom_complet: string;
  email: string;
  telephone: string;
  role: string;
  organisation?: string | null;
  message: string;
  status: string;
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  type: 'Corporate' | 'NGO' | 'Volunteer' | 'Government';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface SiteSettings {
  logoUrl: string;
  faviconUrl: string;
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}
