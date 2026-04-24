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

    // État pour stocker la version complète (sans coupure)
    const [fullItem, setFullItem] = useState<any>(null);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        const loadFullData = async () => {
            if (!id) return;
            setFetching(true);
            try {
                if (type === 'blog') {
                    // Appel à la méthode qui récupère le MEDIUMTEXT sans limite
                    const data = await api.getBlogPostsById(id);
                    if (data) setFullItem(data);
                } else {
                    // Pour les projets, on cherche dans la liste existante
                    const proj = projects.find(p => p.id === id);
                    if (proj) setFullItem(proj);
                }
            } catch (error) {
                console.error("Erreur de chargement du contenu:", error);
            } finally {
                setFetching(false);
            }
        };

        loadFullData();
    }, [id, type, projects]);

    // On utilise l'item complet en priorité, sinon celui du contexte en attendant
    const contextItem = type === 'project' 
        ? projects.find(p => p.id === id) 
        : blogPosts.find(b => b.id === id);

    const item = fullItem || contextItem;

    if (contextLoading && !item) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-comfort-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!item) return (
        <div className="min-h-screen py-40 text-center">
            <h2 className="text-2xl font-serif text-comfort-blue mb-4">Contenu introuvable</h2>
            <Link to="/" className="text-comfort-gold underline">Retour à l'accueil</Link>
        </div>
    );

    // Récupération du contenu (on vérifie toutes les clés possibles envoyées par l'API)
    const displayContent = item.content || item.excerpt || item.description || "";

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header Image */}
            <div className="relative h-[50vh] md:h-[65vh] w-full bg-comfort-dark">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent"></div>
                <div className="container absolute bottom-0 left-1/2 -translate-x-1/2 px-6 pb-10 z-10">
                    <Link to={type === 'project' ? "/projects" : "/blog"} className="inline-flex items-center text-comfort-dark font-bold text-[10px] uppercase tracking-widest mb-6 hover:text-comfort-gold transition-colors">
                        <ArrowLeft size={14} className="mr-2" /> {t('common.back')}
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="bg-comfort-gold text-white px-3 py-1 text-[9px] font-bold uppercase tracking-tighter">
                            {item.category}
                        </span>
                        <span className="flex items-center text-comfort-dark font-semibold text-[10px] uppercase">
                            <Calendar size={12} className="mr-1.5 text-comfort-gold" /> {item.date}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-comfort-blue leading-tight">
                        {item.title}
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 mt-12">
                <div className="grid lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8">
                        {/* DANGEROUSLY SET INNER HTML :
                           C'est ici que le texte complet s'affiche. 
                           Le whitespace-pre-line permet de garder les retours à la ligne si ce n'est pas du HTML.
                        */}
                        <div 
                            className="prose prose-lg md:prose-xl max-w-none text-gray-700 font-light leading-relaxed whitespace-pre-line"
                            dangerouslySetInnerHTML={{ __html: displayContent }}
                        />
                        
                        {fetching && (
                            <p className="mt-4 text-comfort-gold animate-pulse text-sm">Mise à jour du contenu...</p>
                        )}
                    </div>

                    <aside className="lg:col-span-4">
                        <div className="bg-gray-50 p-8 border border-gray-100 sticky top-28">
                            <h4 className="font-serif font-bold text-comfort-blue mb-6 border-b pb-2">Détails</h4>
                            <div className="space-y-6">
                                <div>
                                    <span className="text-[10px] uppercase text-gray-400 font-bold block mb-1">Organisation</span>
                                    <p className="text-sm font-bold">COMFORT ASBL</p>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase text-gray-400 font-bold block mb-1">Vues</span>
                                    <p className="text-sm font-bold flex items-center">
                                        <Eye size={14} className="mr-2 text-comfort-gold" /> {item.views || 0}
                                    </p>
                                </div>
                                <Link to="/donate" className="block w-full bg-comfort-blue text-white text-center py-4 font-bold uppercase text-[10px] tracking-widest hover:bg-comfort-gold transition-all">
                                    Faire un don
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

// --- ROUTER & LAYOUT ---
const AppContent = () => {
    const { loading } = useData();
    return (
        <>
            {loading && <LoadingOverlay />}
            <ScrollToTop />
            <div className={`transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
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
                <div className="flex flex-col min-h-screen">
                    <AppContent />
                </div>
            </Router>
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
