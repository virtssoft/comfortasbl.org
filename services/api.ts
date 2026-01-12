import { Project, BlogPost, Partner, TeamMember, Testimonial, SiteSettings, Bulletin, SiteStats } from '../types';

export const API_BASE_URL = 'https://api.comfortasbl.org'; 

export interface ApiUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'editor' | 'superadmin';
  password?: string;
}

export interface ApiAction {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  statut: 'en_cours' | 'termine';
  image_url: string;
  date_debut: string;
  date_fin?: string;
}

export interface ApiArticle {
  id: string;
  title: string;
  content: string;
  author?: string;
  categorie?: string;
  image_url?: string;
  status?: string;
  created_at?: string;
  views: number;
}

export interface ApiDonation {
  id: string;
  montant: string;
  donateur_nom: string;
  email?: string;
  methode?: string;
  message?: string;
  status: 'en_attente' | 'confirmé' | 'annulé';
  created_at?: string;
}

export interface ApiPartner {
  id: string;
  nom: string;
  description: string;
  site_web?: string;
  logo_url: string;
  type: string;
}

const getAbsoluteUrl = (path: string | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};

async function fetchData<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function sendData(endpoint: string, method: 'POST' | 'PUT' | 'DELETE', data?: any) {
    const options: RequestInit = {
        method: method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (data) options.body = JSON.stringify(data);

    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return { success: response.ok, message: text };
        }
    } catch (e) {
        return { success: false, error: "Erreur de connexion" };
    }
}

export const api = {
  // Authentication
  login: (loginInput: string, passwordInput: string) => 
    sendData('login.php', 'POST', { login: loginInput, password: passwordInput }),

  // Chatbot interne PHP
  askChatbot: (question: string) => sendData('chatbot.php', 'POST', { question }),

  // Forms and Submissions
  joinAssociation: (data: any) => sendData('adhesions.php', 'POST', data),
  
  // Volunteer dossier submission (POST /benevoles.php)
  joinVolunteer: async (formData: FormData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/benevoles.php`, {
            method: 'POST',
            body: formData
        });
        return await response.json();
    } catch (e) {
        return { success: false, error: "Erreur d'envoi du dossier" };
    }
  },

  // Media Management
  uploadFile: async (file: File, folder: string = 'uploads') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder); 
      try {
          const response = await fetch(`${API_BASE_URL}/upload.php`, {
              method: 'POST',
              body: formData
          });
          return await response.json();
      } catch (e) {
          return { success: false, error: "Erreur upload" };
      }
  },

  // Data Retrieval
  getStats: () => fetchData<SiteStats>('stats.php'),

  getProjects: async (): Promise<Project[]> => {
    const actions = await fetchData<any[]>('actions.php');
    if (!actions || !Array.isArray(actions)) return [];
    return actions.map(a => ({
      id: String(a.id),
      title: a.titre,
      category: a.categorie,
      description: a.description,
      image: getAbsoluteUrl(a.image_url),
      date: a.date_debut,
      status: a.statut === 'termine' ? 'Completed' : 'Ongoing',
      goal: 0, raised: 0
    }));
  },

  getBlogPosts: async (): Promise<BlogPost[]> => {
    const articles = await fetchData<any[]>('articles.php');
    if (!articles || !Array.isArray(articles)) return [];
    return articles.map(a => ({
      id: String(a.id),
      title: a.title || a.titre,
      excerpt: a.content ? a.content.substring(0, 150) + '...' : (a.contenu ? a.contenu.substring(0, 150) + '...' : ''),
      author: a.author || a.auteur || 'Admin',
      date: a.created_at?.split(' ')[0] || '',
      category: a.categorie || 'Actualité',
      image: getAbsoluteUrl(a.image_url),
      views: a.views || 0
    }));
  },

  getBlogPostsById: async (id: string): Promise<BlogPost | null> => {
    const a = await fetchData<any>(`articles.php?id=${id}`);
    if (!a) return null;
    return {
      id: String(a.id),
      title: a.title || a.titre,
      excerpt: a.content || a.contenu || '',
      author: a.author || a.auteur || 'Admin',
      date: a.created_at?.split(' ')[0] || '',
      category: a.categorie || 'Actualité',
      image: getAbsoluteUrl(a.image_url),
      views: a.views || 0
    };
  },

  getBulletins: async (): Promise<Bulletin[]> => {
    const bulletins = await fetchData<any[]>('bulletins.php');
    if (!bulletins || !Array.isArray(bulletins)) return [];
    return bulletins.map(b => ({
      id: String(b.id),
      title: b.title,
      slug: b.slug,
      summary: b.summary,
      pdfLink: getAbsoluteUrl(b.pdf_link),
      date: b.created_at?.split(' ')[0] || ''
    }));
  },

  getPartners: async (): Promise<Partner[]> => {
    const partners = await fetchData<any[]>('partners.php');
    if (!partners || !Array.isArray(partners)) return [];
    return partners.map(p => ({
      id: String(p.id),
      name: p.nom,
      logo: getAbsoluteUrl(p.logo_url),
      description: p.description,
      type: p.type || 'Corporate'
    }));
  },

  // Added methods for donations
  sendDonation: (data: any) => sendData('donations.php', 'POST', data),
  getDonations: () => fetchData<ApiDonation[]>('donations.php').then(d => d || []),
  deleteDonation: (id: string) => sendData(`donations.php?id=${id}`, 'DELETE'),
  updateDonationStatus: (id: string, status: string) => sendData(`donations.php?id=${id}`, 'PUT', { status }),

  // Added methods for user management
  getUsers: () => fetchData<ApiUser[]>('users.php').then(d => d || []),
  deleteUser: (id: string) => sendData(`users.php?id=${id}`, 'DELETE'),
  updateUser: (id: string, data: any) => sendData(`users.php?id=${id}`, 'PUT', data),
  createUser: (data: any) => sendData('users.php', 'POST', data),

  // Added methods for actions/projects management
  deleteAction: (id: string) => sendData(`actions.php?id=${id}`, 'DELETE'),
  updateAction: (id: string, data: any) => sendData(`actions.php?id=${id}`, 'PUT', data),
  createAction: (data: any) => sendData('actions.php', 'POST', data),
  
  // Added methods for articles/blog management (Udpated for views support)
  deleteArticle: (id: string) => sendData(`articles.php?id=${id}`, 'DELETE'),
  updateArticle: (id: string, data: any) => sendData(`articles.php?id=${id}`, 'PUT', data),
  createArticle: (data: any) => sendData('articles.php', 'POST', data),
  
  // Added methods for partners management
  deletePartner: (id: string) => sendData(`partners.php?id=${id}`, 'DELETE'),
  updatePartner: (id: string, data: any) => sendData(`partners.php?id=${id}`, 'PUT', data),
  createPartner: (data: any) => sendData('partners.php', 'POST', data),

  // Bulletins & Testimonials
  deleteBulletin: (id: string) => sendData(`bulletins.php?id=${id}`, 'DELETE'),
  updateBulletin: (id: string, data: any) => sendData(`bulletins.php?id=${id}`, 'PUT', data),
  createBulletin: (data: any) => sendData('bulletins.php', 'POST', data),

  getTestimonials: () => fetchData<Testimonial[]>('testimonials.php').then(d => d || []),
  deleteTestimonial: (id: string) => sendData(`testimonials.php?id=${id}`, 'DELETE'),
  updateTestimonial: (id: string, data: any) => sendData(`testimonials.php?id=${id}`, 'PUT', data),

  getRawActions: () => fetchData<ApiAction[]>('actions.php').then(d => d || []),
  getRawArticles: () => fetchData<ApiArticle[]>('articles.php').then(d => d || []),
  getRawPartners: () => fetchData<ApiPartner[]>('partners.php').then(d => d || []),
  
  getSettings: () => fetchData<SiteSettings>('settings.php'),
  getTeam: () => fetchData<TeamMember[]>('team.php').then(d => d || []),

  sendData
};