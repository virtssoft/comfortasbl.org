
import { Project, BlogPost, Domain, Testimonial, Partner, TeamMember } from './types';

export const CONTACT_INFO = {
  phone: "+243 999 000 000",
  email: "contact@comfort-asbl.org",
  address: "123 Avenue de la Paix, Goma, RDC",
  hours: "Lun - Ven: 8h00 - 17h00"
};

export const DOMAINS: Domain[] = [
  { 
    id: 'health', 
    title: '', // Loaded via translation
    description: '', // Loaded via translation
    icon: 'Heart' 
  },
  { 
    id: 'education', 
    title: '', 
    description: '', 
    icon: 'BookOpen' 
  },
  { 
    id: 'socio_eco', 
    title: '', 
    description: '', 
    icon: 'HandCoins' 
  },
  { 
    id: 'food', 
    title: '', 
    description: '', 
    icon: 'Wheat' 
  },
  { 
    id: 'culture', 
    title: '', 
    description: '', 
    icon: 'Palette' 
  },
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: "Construction d'une école à Masisi",
    category: "Éducation",
    description: "Un projet ambitieux pour offrir un cadre d'apprentissage sécurisé à 500 enfants déplacés, garantissant leur droit fondamental à l'éducation.",
    image: "https://drive.google.com/file/d/1x16mtkYU7QwQv8yUeHRQDQVp0xXLqmtC/view?usp=drive_link, ",
    date: "2023-10-15",
    status: "Ongoing",
    goal: 50000,
    raised: 35000
  },
  {
    id: '2',
    title: "Eau potable pour Kibumba",
    category: "Santé & Eau",
    description: "Installation de 5 bornes fontaines alimentées par l'énergie solaire pour éradiquer les maladies hydriques dans la région.",
    image: "https://lh3.googleusercontent.com/d/1Jzx0_losVW1JqbjVmKUWX6TZLeaCXDEl",
    date: "2023-08-01",
    status: "Completed",
    goal: 15000,
    raised: 15000
  },
  {
    id: '3',
    title: "Autonomisation des femmes",
    category: "Dév. Économique",
    description: "Programme de formation professionnelle et micro-crédit pour 200 femmes chefs de ménage.",
    image: "https://lh3.googleusercontent.com/d/1W798svhjcGI1lex5RxaWc5L9Lu5gpdX1",
    date: "2023-12-01",
    status: "Ongoing",
    goal: 25000,
    raised: 12000
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: "L'impact de l'éducation sur la paix",
    excerpt: "Comment l'accès à l'école réduit les conflits communautaires sur le long terme.",
    author: "Dr. Jean Amani",
    date: "12 Oct 2023",
    category: "Analyse",
    image: "https://lh3.googleusercontent.com/d/1CFNrGbElT6Hf66r2lXpSzWypeCEX8-hy"
  },
  {
    id: '2',
    title: "Rapport annuel 2023",
    excerpt: "Découvrez nos réalisations et nos défis durant l'année écoulée.",
    author: "COMFORT Team",
    date: "05 Nov 2023",
    category: "News",
    image: "https://lh3.googleusercontent.com/d/1VVxbR50Ltfdm47uGcfFH4cXEqse4dzUx"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: "Marie Kahindo",
    role: "Bénéficiaire, Masisi",
    content: "Grâce à COMFORT, mes enfants peuvent enfin aller à l'école en toute sécurité. C'est un espoir qui renaît pour toute notre famille.",
    image: "https://picsum.photos/seed/person1/200/200"
  },
  {
    id: '2',
    name: "Dr. Pierre Dubois",
    role: "Partenaire International",
    content: "Une organisation transparente et efficace sur le terrain. COMFORT Asbl est un modèle de gestion humanitaire locale.",
    image: "https://picsum.photos/seed/person2/200/200"
  },
  {
    id: '3',
    name: "Sarah M.",
    role: "Bénévole",
    content: "Voir l'impact direct de nos actions sur les sourires des enfants est la plus belle des récompenses. Rejoignez-nous !",
    image: "https://picsum.photos/seed/person3/200/200"
  }
];

export const PARTNERS: Partner[] = [
  {
    id: '1',
    name: 'Fondation Virunga',
    logo: 'https://placehold.co/300x150/01217d/ffffff?text=Virunga',
    description: "Collaboration pour la conservation de l'environnement et le développement durable autour du parc.",
    type: 'NGO'
  },
  {
    id: '2',
    name: 'Ministère de la Santé RDC',
    logo: 'https://placehold.co/300x150/cecece/000000?text=MinSante',
    description: "Partenariat stratégique pour l'accès aux soins de santé primaire dans les zones reculées.",
    type: 'Government'
  },
  {
    id: '3',
    name: 'Tech for Good Congo',
    logo: 'https://placehold.co/300x150/e2e8f0/1e293b?text=TechGood',
    description: "Soutien technique et logistique pour la digitalisation de nos programmes éducatifs.",
    type: 'Corporate'
  },
  {
    id: '4',
    name: 'Association des Femmes Vaillantes',
    logo: 'https://placehold.co/300x150/f8fafc/01217d?text=Femmes+V',
    description: "Réseau de bénévoles locaux mobilisés pour l'autonomisation économique des femmes.",
    type: 'Volunteer'
  },
  {
    id: '5',
    name: 'Global Water Aid',
    logo: 'https://placehold.co/300x150/0ea5e9/ffffff?text=WaterAid',
    description: "Financement et expertise technique pour nos projets d'adduction d'eau potable.",
    type: 'NGO'
  },
  {
    id: '6',
    name: 'Banque Locale de Goma',
    logo: 'https://placehold.co/300x150/16a34a/ffffff?text=Banque',
    description: "Mécénat d'entreprise soutenant nos initiatives de micro-crédit.",
    type: 'Corporate'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Jean Amani',
    role: 'Directeur Exécutif',
    bio: 'Médecin de santé publique avec 15 ans d\'expérience dans l\'humanitaire en RDC.',
    image: 'https://picsum.photos/seed/team1/300/300'
  },
  {
    id: '2',
    name: 'Sarah Kabuya',
    role: 'Responsable Programmes',
    bio: 'Experte en développement communautaire et gestion de projets éducatifs.',
    image: 'https://picsum.photos/seed/team2/300/300'
  },
  {
    id: '3',
    name: 'Michel Kasongo',
    role: 'Coordinateur Logistique',
    bio: 'Spécialiste de la chaîne d\'approvisionnement en zones difficiles d\'accès.',
    image: 'https://picsum.photos/seed/team3/300/300'
  },
  {
    id: '4',
    name: 'Aline Mwamba',
    role: 'Responsable Partenariats',
    bio: 'Passionnée par la mobilisation de ressources et le plaidoyer international.',
    image: 'https://picsum.photos/seed/team4/300/300'
  }
];
