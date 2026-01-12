import { Project, BlogPost, Domain, Testimonial, Partner, TeamMember } from '../types';

export const CONTACT_INFO = {
  phone: "+243 994 280 037",
  email: "contact@comfortasbl.org",
  address: "Katindo Beni 108, Goma, RDC",
  hours: "Lun - Ven: 8h00 - 17h00"
};

export const DOMAINS: Domain[] = [
  { 
    id: 'health', 
    title: '', 
    description: '', 
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
    image: "https://drive.google.com/file/d/1x16mtkYU7QwQv8yUeHRQDQVp0xXLqmtC/view?usp=drive_link",
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
    nom_complet: "John K. Biloto",
    email: "john@example.com",
    telephone: "+243 000 000 000",
    role: "Partenaire institutionnel",
    organisation: "Institution X",
    message: "Collaborer avec COMFORT Asbl a transformé notre manière d’intervenir sur le terrain. Leur approche centrée sur la dignité humaine et l’impact durable nous a permis de soutenir des communautés qui étaient jusque-là difficiles d’accès.",
    status: "publié",
    created_at: "2023-09-15"
  },
  {
    id: '2',
    nom_complet: "Charle Landa",
    email: "charle@example.com",
    telephone: "+243 111 111 111",
    role: "Internaute / Observateur engagé",
    organisation: null,
    message: "J’ai découvert COMFORT Asbl à travers leurs actions publiées en ligne, et j’ai été profondément marqué par leur engagement réel.",
    status: "publié",
    created_at: "2023-10-10"
  },
  {
    id: '3',
    nom_complet: "Gabriel Muruwa",
    email: "gabriel@example.com",
    telephone: "+243 222 222 222",
    role: "Coordinateur COMFORT Asbl",
    organisation: "COMFORT Asbl",
    message: "À COMFORT Asbl, notre priorité est de servir les populations les plus vulnérables avec intégrité et responsabilité.",
    status: "publié",
    created_at: "2023-11-05"
  }
];

export const PARTNERS: Partner[] = [
  {
    id: '1',
    name: 'Fondation Virunga',
    logo: 'https://api.comfortasbl.org/assets/images/partners/partners1.jpg',
    description: "Collaboration pour la conservation de l'environnement et le développement durable.",
    type: 'NGO'
  },
  {
    id: '2',
    name: 'Ministère de la Santé RDC',
    logo: 'https://api.comfortasbl.org/assets/images/partners/partners2.jpg',
    description: "Partenariat stratégique pour l'accès aux soins de santé primaire.",
    type: 'Government'
  },
  {
    id: '3',
    name: 'Tech for Good Congo',
    logo: 'https://api.comfortasbl.org/assets/images/partners/partners3.jpg',
    description: "Soutien technique pour la digitalisation de nos programmes.",
    type: 'Corporate'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Athanase Habimana',
    role: 'Conseiller',
    bio: "Membre expérimenté apportant une vision stratégique.",
    image: 'https://api.comfortasbl.org/assets/images/teams/athanase.jpg'
  },
  {
    id: '2',
    name: 'Luris Rachidi',
    role: 'Trésorière',
    bio: "Gestionnaire rigoureuse assurant la transparence financière.",
    image: 'https://api.comfortasbl.org/assets/images/teams/luris.jpg'
  },
  {
    id: '3',
    name: 'Celine Ndemesi',
    role: 'Responsable Média',
    bio: "Experte en communication.",
    image: 'https://api.comfortasbl.org/assets/images/teams/celine.jpg'
  },
  {
    id: '4',
    name: 'Divani Mwimanyi',
    role: 'Superviseur Médical',
    bio: "Professionnel de santé coordonnant nos interventions.",
    image: 'https://api.comfortasbl.org/assets/images/teams/divani.jpg'
  }
];