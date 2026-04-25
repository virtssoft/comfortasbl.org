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
import PartnersPage from './pages/Partners';
import VirtssoftImpact from './pages/VirtssoftImpact';
import ScrollToTopButton from './components/ScrollToTopButton';
import LoadingOverlay from './components/LoadingOverlay';
import ChatBot from './components/ChatBot';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { DataProvider, useData } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { Calendar, ArrowLeft, Eye, Bookmark } from 'lucide-react';
import { api } from './services/api';

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

    const [fullItem, setFullItem] = useState<any>(null);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        const loadFullData = async () => {
            if (!id) return;
            setFetching(true);
            try {
                if (type === 'blog') {
                    const data = await api.getBlogPostsById(id);
                    if (data) {
                        setFullItem(data);
                        document.title = `${data.title} | Blog COMFORT`;
                    }
                } else {
                    const proj = projects.find(p => p.id === id);
                    if (proj) {
                        setFullItem(proj);
                        document.title = `${proj.title} | Actions COMFORT`;
                    }
                }
            } catch (error) {
                console.error("Erreur de chargement du contenu:", error);
            } finally {
                setFetching(false);
            }
        };

        loadFullData();
    }, [id, type, projects]);

    const contextItem = type === 'project' 
        ? projects.find(p => p.id === id) 
        : blogPosts.find(b => b.id === id);

    const item = fullItem || contextItem;

    if (contextLoading && !item) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-10 h-10 border-4 border-comfort-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!item) return (
        <div className="min-h-screen py-40 text-center bg-white">
            <Bookmark size={48} className="mx-auto text-gray-200 mb-6" />
            <h2 className="text-2xl font-serif text-comfort-blue mb-4">{t('common.not_found')}</h2>
            <Link to="/" className="text-comfort-gold font-bold uppercase text-xs tracking-widest hover:underline">
                {t('nav.home')}
            </Link>
        </div>
    );

    const displayContent = item.content || item.excerpt || item.description || "";

    return (
        <div className="bg-white min-h-screen pb-20 animate-in fade-in duration-700">
            {/* Header Image Section */}
            <div className="relative h-[50vh] md:h-[65vh] w-full bg-comfort-dark overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover scale-105" />
                <div className="absolute inset-0 bg-black/30"></div>
                
                <div className="container absolute bottom-0 left-1/2 -translate-x-1/2 px-6 pb-12 z-10">
                    <Link to={type === 'project' ? "/projects" : "/blog"} className="inline-flex items-center text-white font-bold text-[10px] uppercase tracking-[0.3em] mb-6 hover:text-comfort-gold transition-colors drop-shadow-lg">
                        <ArrowLeft size={14} className="mr-3" /> {t('common.back')}
                    </Link>
                    
                    {/* Bloc Titre avec fond blanc semi-opaque */}
                    <div className="bg-white/90 backdrop-blur-md p-6 md:p-10 max-w-4xl shadow-2xl border-l-8 border-comfort-gold">
                        <div className="flex flex-wrap items-center gap-6 mb-4">
                            <span className="bg-comfort-blue text-white px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest shadow-sm">
                                {item.category}
                            </span>
                            <span className="flex items-center text-comfort-blue font-bold text-[9px] uppercase tracking-widest">
                                <Calendar size={13} className="mr-2 text-comfort-gold" /> {item.date}
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-4xl font-serif font-bold text-comfort-blue leading-tight uppercase tracking-tight">
                            {item.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 mt-16">
                <div className="grid lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8">
                        <div 
                            className="prose prose-lg md:prose-xl max-w-none text-gray-700 font-light leading-relaxed first-letter:text-6xl first-letter:font-serif first-letter:text-comfort-gold first-letter:mr-3 first-letter:float-left"
                            dangerouslySetInnerHTML={{ __html: displayContent }}
                        />
                        
                        {fetching && (
                            <div className="mt-12 flex items-center space-x-3 text-comfort-gold">
                                <div className="w-4 h-4 border-2 border-comfort-gold border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Mise à jour en cours...</span>
                            </div>
                        )}
                    </div>

                    <aside className="lg:col-span-4">
                        <div className="bg-comfort-light p-10 sticky top-32 border-t-4 border-comfort-gold shadow-sm">
                            <h4 className="font-serif font-bold text-comfort-blue text-xl mb-8 border-b border-gray-200 pb-4">
                                {t('common.impact')}
                            </h4>
                            <div className="space-y-8">
                                <div>
                                    <span className="text-[10px] uppercase text-gray-400 font-bold block mb-2 tracking-widest">Institution</span>
                                    <p className="text-sm font-bold text-comfort-blue">COMFORT ASBL</p>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase text-gray-400 font-bold block mb-2 tracking-widest">Engagement</span>
                                    <p className="text-sm font-bold flex items-center text-comfort-blue">
                                        <Eye size={16} className="mr-3 text-comfort-gold" /> {item.views || 0} vues
                                    </p>
                                </div>
                                <Link to="/donate" className="block w-full bg-comfort-blue text-white text-center py-5 font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-comfort-gold transition-all shadow-lg hover:shadow-comfort-gold/20">
                                    {t('nav.donate')}
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

// --- ROUTER & LAYOUT PRINCIPAL ---
const AppContent = () => {
    const { loading } = useData();

    return (
        <>
            {loading && <LoadingOverlay />}
            <ScrollToTop />
            <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'} flex flex-col min-h-screen`}>
                <Header />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/projects/:id/:slug?" element={<DetailPage type="project" />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:id/:slug?" element={<DetailPage type="blog" />} />
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
                <AppContent />
            </Router>
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
