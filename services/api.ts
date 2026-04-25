import { Project, BlogPost, Partner, TeamMember, Testimonial, SiteSettings, Bulletin, SiteStats } from '../types';

export const API_BASE_URL = 'https://api.comfortasbl.org'; 

// --- Interfaces ---

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
  titre: string;
  contenu: string;
  auteur?: string;
  categorie?: string;
  image_url?: string;
  status?: string;
  created_at?: string;
  views: number;
}

// --- Helpers ---

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

/**
 * Sender universel amélioré : 
 * Gère automatiquement le JSON ou le FormData (pour les fichiers)
 */
async function sendData(endpoint: string, method: 'POST' | 'PUT' | 'DELETE', data?: any) {
    const isFormData = data instanceof FormData;
    
    // Initialisation des options de la requête
    const options: RequestInit = {
        method: method,
        // CRITIQUE : Si c'est du FormData, on laisse le navigateur définir le Content-Type
        // pour qu'il inclue le "boundary" correct.
        headers: isFormData ? {} : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    if (data) {
        options.body = isFormData ? data : JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
        
        // On vérifie d'abord si la réponse est du JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        } else {
            const text = await response.text();
            return { success: response.ok, message: text };
        }
    } catch (e) {
        console.error("API Error:", e);
        return { success: false, error: "Impossible de joindre le serveur. Vérifiez votre connexion." };
    }
}

// --- API Object ---

export const api = {
  // Authentication
  login: (loginInput: string, passwordInput: string) => 
    sendData('login.php', 'POST', { login: loginInput, password: passwordInput }),

  // Chatbot
  askChatbot: (question: string) => sendData('chatbot.php', 'POST', { question }),

  // --- FORMULAIRES (Adhésions / Bénévoles) ---
  // Ces méthodes acceptent désormais le FormData envoyé par About.tsx
  joinAssociation: (data: FormData | any) => sendData('adhesions.php', 'POST', data),
  
  joinVolunteer: (formData: FormData) => sendData('benevoles.php', 'POST', formData),

  // Media & Uploads
  uploadFile: (file: File, folder: string = 'uploads') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder); 
      return sendData('upload.php', 'POST', formData);
  },

  // Data Retrieval
  getStats: () => fetchData<SiteStats>('stats.php'),

  // Projets
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

  // Blog (Grille)
  getBlogPosts: async (): Promise<BlogPost[]> => {
    const articles = await fetchData<any[]>('articles.php');
    if (!articles || !Array.isArray(articles)) return [];
    return articles.map(a => ({
      id: String(a.id),
      title: a.titre || a.title,
      excerpt: a.contenu ? a.contenu.substring(0, 150) + '...' : '',
      author: a.auteur || a.author || 'Admin',
      date: a.created_at?.split(' ')[0] || '',
      category: a.categorie || 'Actualité',
      image: getAbsoluteUrl(a.image_url),
      views: a.views || 0
    }));
  },

  // Blog (Détail complet)
  getBlogPostsById: async (id: string): Promise<BlogPost | null> => {
    const a = await fetchData<any>(`articles.php?id=${id}&t=${new Date().getTime()}`);
    if (!a) return null;
    
    const longContent = a.contenu || a.content || '';
    return {
      id: String(a.id),
      title: a.titre || a.title,
      excerpt: longContent,
      content: longContent,
      author: a.auteur || a.author || 'Admin',
      date: a.created_at?.split(' ')[0] || '',
      category: a.categorie || 'Actualité',
      image: getAbsoluteUrl(a.image_url),
      views: a.views || 0
    };
  },

  getBulletins: async (): Promise<Bulletin[]> => {
    const res = await fetchData<Bulletin[]>('bulletins.php');
    return res || [];
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

  // Admin / Management
  sendDonation: (data: any) => sendData('donations.php', 'POST', data),
  getDonations: () => fetchData<any[]>('donations.php').then(d => d || []),
  deleteDonation: (id: string) => sendData(`donations.php?id=${id}`, 'DELETE'),
  updateDonationStatus: (id: string, status: string) => sendData(`donations.php?id=${id}`, 'PUT', { status }),

  getUsers: () => fetchData<ApiUser[]>('users.php').then(d => d || []),
  deleteUser: (id: string) => sendData(`users.php?id=${id}`, 'DELETE'),
  updateUser: (id: string, data: any) => sendData(`users.php?id=${id}`, 'PUT', data),
  createUser: (data: any) => sendData('users.php', 'POST', data),

  deleteAction: (id: string) => sendData(`actions.php?id=${id}`, 'DELETE'),
  updateAction: (id: string, data: any) => sendData(`actions.php?id=${id}`, 'PUT', data),
  createAction: (data: any) => sendData('actions.php', 'POST', data),
  
  deleteArticle: (id: string) => sendData(`articles.php?id=${id}`, 'DELETE'),
  updateArticle: (id: string, data: any) => sendData(`articles.php?id=${id}`, 'PUT', data),
  createArticle: (data: any) => sendData('articles.php', 'POST', data),
  
  deletePartner: (id: string) => sendData(`partners.php?id=${id}`, 'DELETE'),
  updatePartner: (id: string, data: any) => sendData(`partners.php?id=${id}`, 'PUT', data),
  createPartner: (data: any) => sendData('partners.php', 'POST', data),

  deleteBulletin: (id: string) => sendData(`bulletins.php?id=${id}`, 'DELETE'),
  updateBulletin: (id: string, data: any) => sendData(`bulletins.php?id=${id}`, 'PUT', data),
  createBulletin: (formData: FormData) => sendData('bulletins.php', 'POST', formData),

  getTestimonials: () => fetchData<Testimonial[]>('testimonials.php').then(d => d || []),
  deleteTestimonial: (id: string) => sendData(`testimonials.php?id=${id}`, 'DELETE'),
  updateTestimonial: (id: string, data: any) => sendData(`testimonials.php?id=${id}`, 'PUT', data),

  getRawActions: () => fetchData<ApiAction[]>('actions.php').then(d => d || []),
  getRawArticles: () => fetchData<ApiArticle[]>('articles.php').then(d => d || []),
  getRawPartners: () => fetchData<any[]>('partners.php').then(d => d || []),
  
  getSettings: () => fetchData<SiteSettings>('settings.php'),
  getTeam: () => fetchData<TeamMember[]>('team.php').then(d => d || []),

  sendData 
};
