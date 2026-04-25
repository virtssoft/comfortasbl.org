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

// --- UTILITAIRE : Scroll en haut ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- COMPOSANT : Détail Dynamique (SEO & Traduction optimisés) ---
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
                        // SEO : Mise à jour dynamique du titre du document
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
                console.error("Erreur de chargement:", error);
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
            {/* Hero Image Detail */}
            <div className="relative h-[55vh] md:h-[70vh] w-full bg-comfort-dark overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-50 scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-comfort-dark/20 to-transparent"></div>
                
                <div className="container absolute bottom-0 left-1/2 -translate-x-1/2 px-6 pb-12 z-10">
                    <Link to={type === 'project' ? "/projects" : "/blog"} className="inline-flex items-center text-comfort-blue font-bold text-[10px] uppercase tracking-[0.3em] mb-8 hover:text-comfort-gold transition-colors">
                        <ArrowLeft size={14} className="mr-3" /> {t('common.back')}
                    </Link>
                    
                    <div className="flex items-center gap-6 mb-6">
                        <span className="bg-comfort-gold text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-xl">
                            {item.category}
                        </span>
                        <span className="flex items-center text-comfort-blue font-bold text-[10px] uppercase tracking-widest">
                            <Calendar size={14} className="mr-2 text-comfort-gold" /> {item.date}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-comfort-blue leading-[1.1] max-w-5xl">
                        {item.title}
                    </h1>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-6 mt-20">
                <div className="grid lg:grid-cols-12 gap-20">
                    <div className="lg:col-span-8">
                        <div 
                            className="prose prose-lg md:prose-xl max-w-none text-gray-700 font-light leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:text-comfort-gold first-letter:mr-3 first-letter:float-left"
                            dangerouslySetInnerHTML={{ __html: displayContent }}
                        />
                        
                        {fetching && (
                            <div className="mt-12 flex items-center space-x-3 text-comfort-gold">
                                <div className="w-4 h-4 border-2 border-comfort-gold border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Sync...</span>
                            </div>
                        )}
                    </div>

                    <aside className="lg:col-span-4">
                        <div className="bg-comfort-light p-10 sticky top-32 border-t-4 border-comfort-gold">
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

// --- ROUTER & LAYOUT ---
const AppContent = () => {
    const { loading } = useData();
    const { t } = useLanguage();

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
                        
                        {/* ROUTES SEO-READY AVEC SLUG OPTIONNEL */}
                        <Route path="/projects/:id" element={<DetailPage type="project" />} />
                        <Route path="/projects/:id/:slug" element={<DetailPage type="project" />} />
                        
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:id" element={<DetailPage type="blog" />} />
                        <Route path="/blog/:id/:slug" element={<DetailPage type="blog" />} />
                        
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
