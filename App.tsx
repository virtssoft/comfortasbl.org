import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useParams, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Donate from './pages/Donate';
import Projects from './pages/Projects';
import Blog from './pages/Blog'; 
import Bulletins from './pages/Bulletins'; 
import Account from './pages/Account'; 
import AdminDashboard from './pages/AdminDashboard'; 
import GenericPage from './pages/GenericPage';
import PartnersPage from './pages/Partners';
import VirtssoftImpact from './pages/VirtssoftImpact';
import ScrollToTopButton from './components/ScrollToTopButton';
import LoadingOverlay from './components/LoadingOverlay';
import ChatBot from './components/ChatBot';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { DataProvider, useData } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { Calendar, Tag, ArrowLeft, Eye } from 'lucide-react';
import { api } from './services/api';
import { BlogPost, Project } from './types';

// --- UTILITAIRE : Scroll en haut lors du changement de page ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- COMPOSANT : Détail Dynamique (Projets & Blog) ---
const DetailPage = ({ type }: { type: 'project' | 'blog' }) => {
    const { id } = useParams<{ id: string }>();
    const { projects, blogPosts, loading: contextLoading } = useData();
    const { t } = useLanguage();

    // État local pour le contenu complet (évite les coupures)
    const [fullItem, setFullItem] = useState<any>(null);
    const [localLoading, setLocalLoading] = useState(true);

    useEffect(() => {
        const fetchFullContent = async () => {
            if (!id) return;
            setLocalLoading(true);
            try {
                if (type === 'blog') {
                    const data = await api.getBlogPostsById(id);
                    if (data) setFullItem(data);
                } else {
                    // Pour les projets, on cherche dans le contexte ou on pourrait créer api.getProjectById
                    const proj = projects.find(p => p.id === id);
                    if (proj) setFullItem(proj);
                }
            } catch (error) {
                console.error("Erreur lors du chargement du détail:", error);
            } finally {
                setLocalLoading(false);
            }
        };

        fetchFullContent();
    }, [id, type, projects]);

    // On cherche d'abord dans le contexte pour un affichage immédiat
    const contextItem = type === 'project' 
        ? projects.find(p => p.id === id) 
        : blogPosts.find(b => b.id === id);

    // L'item final est soit la version complète de l'API, soit celle du contexte en attendant
    const item = fullItem || contextItem;

    if (contextLoading && !item) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-comfort-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!item) return (
        <div className="min-h-screen bg-white py-40 text-center">
            <h2 className="text-3xl font-serif font-bold text-comfort-blue mb-6">Contenu non trouvé</h2>
            <Link to="/" className="text-comfort-gold font-bold uppercase tracking-widest hover:underline">Retourner à l'accueil</Link>
        </div>
    );

    // On récupère le contenu sans le couper
    // Note: Dans ton api.ts, assure-toi que getBlogPostsById renvoie le texte complet dans 'excerpt' ou 'content'
    const fullContent = item.content || item.description || item.excerpt;

    return (
        <div className="bg-white min-h-screen pb-32">
            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-comfort-dark">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="container absolute bottom-0 left-1/2 -translate-x-1/2 px-6 pb-12 z-10">
                    <Link to={type === 'project' ? "/projects" : "/blog"} className="inline-flex items-center text-comfort-dark font-bold uppercase tracking-widest text-[10px] mb-8 hover:text-comfort-gold transition-colors">
                        <ArrowLeft size={14} className="mr-3" /> {t('common.back')}
                    </Link>
                    <div className="flex flex-wrap items-center gap-6 mb-6">
                        <span className="bg-comfort-gold text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl">
                            {item.category}
                        </span>
                        <span className="flex items-center text-comfort-dark font-bold text-[10px] uppercase tracking-widest">
                            <Calendar size={14} className="mr-2 text-comfort-gold" /> {item.date}
                        </span>
                        {type === 'blog' && (
                            <span className="flex items-center text-comfort-dark font-bold text-[10px] uppercase tracking-widest">
                                <eye size={14} className="mr-2 text-comfort-gold" /> {item.views || 0} lectures
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-comfort-blue leading-tight max-w-5xl">
                        {item.title}
                    </h1>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-6 mt-16 md:mt-24">
                <div className="grid lg:grid-cols-12 gap-20">
                    <div className="lg:col-span-8">
                        <div 
                            className="prose prose-xl prose-headings:font-serif prose-headings:text-comfort-blue text-gray-600 font-light leading-relaxed max-w-none whitespace-pre-line"
                            dangerouslySetInnerHTML={{ __html: fullContent || "Chargement du contenu détaillé..." }}
                        />
                    </div>
                    
                    {/* Sidebar */}
                    <aside className="lg:col-span-4">
                        <div className="bg-comfort-light p-10 border border-gray-100 shadow-sm sticky top-32">
                            <h4 className="text-xl font-serif font-bold text-comfort-blue mb-8 border-b border-gray-200 pb-4">Informations Clés</h4>
                            <div className="space-y-8">
                                <div>
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Entité</span>
                                    <p className="text-sm font-bold text-comfort-dark">COMFORT Asbl</p>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Domaine</span>
                                    <div className="flex items-center text-comfort-blue font-bold text-xs">
                                        <Tag size={14} className="mr-2 text-comfort-gold" /> {item.category}
                                    </div>
                                </div>
                                <div className="pt-8 border-t border-gray-100">
                                   <Link to="/donate" className="bg-comfort-blue text-white w-full py-4 flex items-center justify-center font-bold uppercase text-[10px] tracking-widest hover:bg-comfort-gold transition-all shadow-xl">
                                      Soutenir ce projet
                                   </Link>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

// --- COMPOSANT : Structure de l'App ---
const AppContent = () => {
    const { loading } = useData();
    return (
        <>
            {loading && <LoadingOverlay />}
            <ScrollToTop />
            <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                <Header />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/projects/:id" element={<DetailPage type="project" />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:id" element={<DetailPage type="blog" />} />
                        <Route path="/bulletins" element={<Bulletins />} />
                        <Route path="/partners" element={<PartnersPage />} />
                        <Route path="/donate" element={<Donate />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/virtssoft-impact" element={<VirtssoftImpact />} />
                        <Route path="*" element={<Home />} />
                    </Routes>
                </main>
                <Footer />
                <ChatBot />
                <ScrollToTopButton />
            </div>
        </>
    );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
            <Router>
                <div className="flex flex-col min-h-screen font-sans antialiased text-gray-800 selection:bg-comfort-gold/30">
                    <AppContent />
                </div>
            </Router>
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
