import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, DollarSign, Activity, Bell, Mail, Plus, Edit, Trash2, Handshake, Briefcase, X, Check, Eye, UploadCloud, ChevronLeft, ChevronRight, ShieldCheck, TrendingUp, Heart, Key, AtSign, Newspaper, Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api, API_BASE_URL, ApiUser, ApiAction, ApiArticle, ApiDonation, ApiPartner } from '../services/api';
import { Testimonial, Bulletin } from '../types';

/* --- IMAGE UPLOAD COMPONENT --- */
interface ImageUploadProps {
    label: string;
    value: string;
    folder: string;
    onChange: (path: string) => void;
}

const ImageUploader: React.FC<ImageUploadProps> = ({ label, value, folder, onChange }) => {
    const [uploading, setUploading] = useState(false);
    
    const previewUrl = value 
        ? (value.startsWith('http') ? value : `${API_BASE_URL}/${value.startsWith('/') ? value.substring(1) : value}`) 
        : null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploading(true);
            const file = e.target.files[0];
            const result = await api.uploadFile(file, folder);
            setUploading(false);
            if (result.success && result.path) onChange(result.path);
            else alert("Erreur d'upload : " + (result.error || "Problème serveur"));
        }
    };

    return (
        <div className="mb-6">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
            <div className="border border-gray-100 rounded-sm p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:shadow-xl transition-all relative h-48 group cursor-pointer overflow-hidden">
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-sm" />
                ) : (
                    <div className="text-center opacity-40">
                        <UploadCloud className="mx-auto mb-2" size={32} />
                        <span className="text-xs font-bold uppercase tracking-widest">Choisir un média</span>
                    </div>
                )}
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                />
            </div>
        </div>
    );
};

/* --- MODAL COMPONENT --- */
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSave: () => void;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, onSave }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-comfort-dark/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
                <div className="flex justify-between items-center p-8 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="text-2xl font-serif font-bold text-comfort-blue">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-comfort-gold transition-colors"><X size={24}/></button>
                </div>
                <div className="p-10 space-y-8">
                    {children}
                </div>
                <div className="p-8 border-t border-gray-50 flex justify-end space-x-4 bg-gray-50/50">
                    <button onClick={onClose} className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-comfort-dark transition-colors">Fermer</button>
                    <button onClick={onSave} className="px-10 py-3 bg-comfort-blue text-white font-bold uppercase tracking-widest hover:bg-comfort-gold transition-all shadow-xl">
                        Enregistrer
                    </button>
                </div>
            </div>
        </div>
    );
}

/* --- FIELD HELPER --- */
const FormField = ({ label, value, onChange, type = "text", options = [], icon: Icon }: any) => (
    <div className="relative">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
        <div className="relative">
            {Icon && <Icon size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-comfort-gold" />}
            {type === 'textarea' ? (
                <textarea className={`w-full bg-transparent border-b border-gray-200 py-4 outline-none focus:border-comfort-gold transition-all font-light text-sm min-h-[120px] ${Icon ? 'pl-8' : ''}`} value={value} onChange={e => onChange(e.target.value)} />
            ) : type === 'select' ? (
                <select className={`w-full bg-transparent border-b border-gray-200 py-4 outline-none focus:border-comfort-gold transition-all font-bold text-xs uppercase tracking-widest bg-white ${Icon ? 'pl-8' : ''}`} value={value} onChange={e => onChange(e.target.value)}>
                    {options.map((opt:any) => (
                        <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                            {typeof opt === 'string' ? opt : opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input type={type} className={`w-full bg-transparent border-b border-gray-200 py-4 outline-none focus:border-comfort-gold transition-all font-light text-sm ${Icon ? 'pl-8' : ''}`} value={value} onChange={e => onChange(e.target.value)} />
            )}
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [donations, setDonations] = useState<ApiDonation[]>([]);
  const [projects, setProjects] = useState<ApiAction[]>([]);
  const [blogs, setBlogs] = useState<ApiArticle[]>([]);
  const [partners, setPartners] = useState<ApiPartner[]>([]);
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'project'|'blog'|'partner'|'user'|'donation'|'bulletin'|'testimonial'>('project');
  const [editingItem, setEditingItem] = useState<any>(null);

  const loadAllData = async () => {
        setUsers(await api.getUsers());
        setDonations(await api.getDonations());
        setProjects(await api.getRawActions());
        setBlogs(await api.getRawArticles());
        setPartners(await api.getRawPartners());
        setBulletins(await api.getBulletins());
        setTestimonials(await api.getTestimonials());
        setStats(await api.getStats());
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'superadmin') loadAllData();
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout(); 
    navigate('/');
  };

  const handleEdit = (type: any, item: any) => {
      setModalType(type);
      setEditingItem(item);
      setIsModalOpen(true);
  };

  const handleCreate = (type: any) => {
      setModalType(type);
      let defaultItem = {};
      if (type === 'project') defaultItem = { titre: '', description: '', categorie: 'Éducation', statut: 'en_cours', image_url: '', date_debut: new Date().toISOString().split('T')[0] };
      else if (type === 'blog') defaultItem = { title: '', content: '', author: user?.username || 'Admin', categorie: 'Actualité', image_url: '', status: 'publié' };
      else if (type === 'partner') defaultItem = { nom: '', description: '', site_web: '', logo_url: '', type: 'Corporate' };
      else if (type === 'user') defaultItem = { username: '', email: '', password: '', role: 'user' };
      else if (type === 'bulletin') defaultItem = { title: '', summary: '', pdf_link: '', slug: '' };
      setEditingItem(defaultItem); 
      setIsModalOpen(true);
  };

  const handleDelete = async (type: string, id: string) => {
      if (!window.confirm("Action irréversible. Confirmer la suppression ?")) return;
      let res;
      if (type === 'project') res = await api.deleteAction(id);
      if (type === 'blog') res = await api.deleteArticle(id);
      if (type === 'partner') res = await api.deletePartner(id);
      if (type === 'user') res = await api.deleteUser(id);
      if (type === 'donation') res = await api.deleteDonation(id);
      if (type === 'bulletin') res = await api.deleteBulletin(id);
      if (type === 'testimonial') res = await api.deleteTestimonial(id);
      if (res.success) loadAllData();
  };

  const handleSaveModal = async () => {
      const id = editingItem.id;
      let res;
      let payload: any = {};

      if (modalType === 'project') {
          payload = { titre: editingItem.titre, description: editingItem.description, categorie: editingItem.categorie, statut: editingItem.statut, image_url: editingItem.image_url, date_debut: editingItem.date_debut };
          res = id ? await api.updateAction(id, payload) : await api.createAction(payload);
      } else if (modalType === 'blog') {
          // RESPECT DE LA STRUCTURE PHP : title, content
          payload = { title: editingItem.title, content: editingItem.content, author: editingItem.author, categorie: editingItem.categorie, image_url: editingItem.image_url, status: editingItem.status };
          res = id ? await api.updateArticle(id, payload) : await api.createArticle(payload);
      } else if (modalType === 'partner') {
          payload = { nom: editingItem.nom, description: editingItem.description, logo_url: editingItem.logo_url, type: editingItem.type };
          res = id ? await api.updatePartner(id, payload) : await api.createPartner(payload);
      } else if (modalType === 'user') {
          payload = { username: editingItem.username, email: editingItem.email, role: editingItem.role };
          if (!id || editingItem.password) payload.password = editingItem.password;
          res = id ? await api.updateUser(id, payload) : await api.createUser(payload);
      } else if (modalType === 'bulletin') {
          payload = { title: editingItem.title, summary: editingItem.summary, pdf_link: editingItem.pdf_link, slug: editingItem.slug };
          res = id ? await api.updateBulletin(id, payload) : await api.createBulletin(payload);
      } else if (modalType === 'testimonial') {
          res = await api.updateTestimonial(id, { status: editingItem.status });
      }

      if (res?.success || res?.user || res?.message?.includes('succès')) { 
          setIsModalOpen(false); 
          loadAllData(); 
      } else {
          alert("Erreur: " + (res?.error || "Problème serveur lors de l'enregistrement."));
      }
  };

  if (!isAuthenticated || user?.role !== 'superadmin') return null;

  return (
    <div className="flex h-screen bg-comfort-light font-sans text-comfort-dark overflow-hidden">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem?.id ? "Mise à jour institutionnelle" : "Nouvelle entrée système"} onSave={handleSaveModal}>
          {editingItem && (
             modalType === 'project' ? (
                <>
                    <ImageUploader label="Support Visuel" value={editingItem.image_url} folder="actions" onChange={p => setEditingItem({...editingItem, image_url: p})} />
                    <FormField label="Titre Institutionnel" value={editingItem.titre} onChange={v => setEditingItem({...editingItem, titre: v})} />
                    <FormField label="Résumé de l'Action" type="textarea" value={editingItem.description} onChange={v => setEditingItem({...editingItem, description: v})} />
                    <div className="grid grid-cols-2 gap-6">
                        <FormField label="Catégorie" value={editingItem.categorie} onChange={v => setEditingItem({...editingItem, categorie: v})} />
                        <FormField label="Statut" type="select" options={[{label:'En Cours', value:'en_cours'}, {label:'Achevé', value:'termine'}]} value={editingItem.statut} onChange={v => setEditingItem({...editingItem, statut: v})} />
                    </div>
                </>
             ) : modalType === 'blog' ? (
                <>
                    <ImageUploader label="Illustration" value={editingItem.image_url} folder="blog" onChange={p => setEditingItem({...editingItem, image_url: p})} />
                    <FormField label="Titre de la Gazette" value={editingItem.title} onChange={v => setEditingItem({...editingItem, title: v})} />
                    <FormField label="Corps de l'Article" type="textarea" value={editingItem.content} onChange={v => setEditingItem({...editingItem, content: v})} />
                    <div className="grid grid-cols-2 gap-6">
                        <FormField label="Catégorie" value={editingItem.categorie} onChange={v => setEditingItem({...editingItem, categorie: v})} />
                        <FormField label="Statut" type="select" options={['publié', 'brouillon']} value={editingItem.status} onChange={v => setEditingItem({...editingItem, status: v})} />
                    </div>
                </>
             ) : modalType === 'user' ? (
                <>
                    <FormField label="Nom d'utilisateur" icon={Users} value={editingItem.username} onChange={v => setEditingItem({...editingItem, username: v})} />
                    <FormField label="Adresse Email Officielle" icon={AtSign} type="email" value={editingItem.email} onChange={v => setEditingItem({...editingItem, email: v})} />
                    <FormField label="Habilitation" icon={ShieldCheck} type="select" options={['user', 'editor', 'superadmin']} value={editingItem.role} onChange={v => setEditingItem({...editingItem, role: v})} />
                    <FormField label={editingItem.id ? "Nouveau mot de passe (laisser vide pour inchangé)" : "Mot de passe sécurisé"} icon={Key} type="password" value={editingItem.password} onChange={v => setEditingItem({...editingItem, password: v})} />
                </>
             ) : modalType === 'bulletin' ? (
                <>
                    <FormField label="Titre du Bulletin" value={editingItem.title} onChange={v => setEditingItem({...editingItem, title: v})} />
                    <FormField label="Résumé" type="textarea" value={editingItem.summary} onChange={v => setEditingItem({...editingItem, summary: v})} />
                    <FormField label="Lien PDF (Relatif ou Absolu)" value={editingItem.pdf_link} onChange={v => setEditingItem({...editingItem, pdf_link: v})} />
                </>
             ) : modalType === 'testimonial' ? (
                <FormField label="Statut de Publication" type="select" options={['actif', 'en_attente', 'supprimé']} value={editingItem.status} onChange={v => setEditingItem({...editingItem, status: v})} />
             ) : null
          )}
      </Modal>

      {/* SIDEBAR */}
      <aside className="w-72 bg-comfort-dark text-white flex flex-col z-20 shadow-2xl">
        <div className="p-10 border-b border-white/5">
           <h2 className="text-2xl font-serif font-bold tracking-tight">COMFORT <span className="text-comfort-gold text-[10px] block uppercase tracking-[0.4em] mt-3">Gouvernance</span></h2>
        </div>
        <nav className="flex-1 py-10 px-6 space-y-4">
           {[
               { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
               { id: 'users', icon: Users, label: 'Utilisateurs' },
               { id: 'content', icon: FileText, label: 'Actions Terrain' },
               { id: 'blog', icon: Newspaper, label: 'Actualités & Vues' },
               { id: 'bulletins', icon: Newspaper, label: 'Bulletins PDF' },
               { id: 'testimonials', icon: Quote, label: 'Témoignages' },
               { id: 'finances', icon: DollarSign, label: 'Dons Reçus' },
           ].map(item => (
                <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)} 
                    className={`w-full flex items-center px-6 py-4 rounded-sm transition-all duration-300 font-bold uppercase tracking-widest text-[10px] ${activeTab === item.id ? 'bg-comfort-blue text-white shadow-xl' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                    <item.icon size={18} className="mr-4 text-comfort-gold" /> {item.label}
                </button>
           ))}
        </nav>
        <div className="p-8 border-t border-white/5">
           <button onClick={handleLogout} className="flex items-center text-red-400 hover:text-white transition-colors uppercase tracking-[0.2em] text-[10px] font-bold">
              <LogOut size={16} className="mr-3" /> Déconnexion
           </button>
        </div>
      </aside>

      {/* MAIN PORTAL */}
      <main className="flex-1 overflow-y-auto bg-white">
        <header className="bg-white/80 backdrop-blur-md py-6 px-12 flex justify-between items-center sticky top-0 z-10 border-b border-gray-50">
           <h1 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400">Administration : <span className="text-comfort-blue">{activeTab}</span></h1>
           <div className="flex items-center space-x-6">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{user?.username}</span>
              <div className="h-10 w-10 rounded-full bg-comfort-blue text-white flex items-center justify-center font-bold shadow-xl border-2 border-white uppercase">
                  {user?.username.charAt(0)}
              </div>
           </div>
        </header>

        <div className="p-12 max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
                <div className="space-y-12 animate-in fade-in duration-700">
                    <div className="bg-comfort-light p-10 border border-gray-100 shadow-sm space-y-10 rounded-sm">
                       <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Statistiques Consolidées</h4>
                          <TrendingUp size={16} className="text-comfort-gold" />
                       </div>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                          <div className="flex flex-col">
                             <span className="text-comfort-blue font-serif font-bold text-3xl mb-1">{stats?.visitors || 0}</span>
                             <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Visiteurs</span>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-comfort-blue font-serif font-bold text-3xl mb-1">{users.length}</span>
                             <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Gestionnaires</span>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-comfort-blue font-serif font-bold text-3xl mb-1">{projects.length}</span>
                             <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Actions</span>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-comfort-blue font-serif font-bold text-3xl mb-1">{blogs.reduce((acc, curr) => acc + (curr.views || 0), 0)}</span>
                             <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Lectures d'Impact</span>
                          </div>
                       </div>
                    </div>
                </div>
            )}

            {activeTab !== 'dashboard' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-serif font-bold text-comfort-blue capitalize">{activeTab}</h2>
                        </div>
                        {activeTab !== 'finances' && activeTab !== 'testimonials' && (
                            <button onClick={() => handleCreate(activeTab === 'users' ? 'user' : activeTab === 'content' ? 'project' : activeTab === 'blog' ? 'blog' : activeTab === 'bulletins' ? 'bulletin' : 'project')} 
                                    className="bg-comfort-blue text-white px-8 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-comfort-gold transition-all shadow-xl">
                                <Plus size={16} className="inline mr-2" /> Créer
                            </button>
                        )}
                    </div>

                    <div className="overflow-hidden border border-gray-50 shadow-sm rounded-sm">
                        <table className="min-w-full divide-y divide-gray-50">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Détails</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Statut</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {activeTab === 'users' && users.map(u => (
                                    <tr key={u.id}>
                                        <td className="px-8 py-6 font-bold text-comfort-blue">{u.username} <span className="block text-xs font-light text-gray-400">{u.email}</span></td>
                                        <td className="px-8 py-6 uppercase text-[10px] font-bold">{u.role}</td>
                                        <td className="px-8 py-6 text-right flex justify-end space-x-4">
                                            <button onClick={() => handleEdit('user', u)} className="text-gray-400 hover:text-comfort-gold transition-colors"><Edit size={18}/></button>
                                            <button onClick={() => handleDelete('user', u.id)} className="text-red-300 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                                        </td>
                                    </tr>
                                ))}
                                {activeTab === 'blog' && blogs.map(a => (
                                    <tr key={a.id}>
                                        <td className="px-8 py-6 font-bold text-comfort-blue">{a.title} <span className="block text-[10px] text-gray-400 font-bold uppercase mt-1 flex items-center"><Eye size={10} className="mr-2" /> {a.views} vues</span></td>
                                        <td className="px-8 py-6 uppercase text-[10px] font-bold">{a.status}</td>
                                        <td className="px-8 py-6 text-right flex justify-end space-x-4">
                                            <button onClick={() => handleEdit('blog', a)} className="text-gray-400 hover:text-comfort-gold transition-colors"><Edit size={18}/></button>
                                            <button onClick={() => handleDelete('blog', a.id)} className="text-red-300 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                                        </td>
                                    </tr>
                                ))}
                                {activeTab === 'bulletins' && bulletins.map(b => (
                                    <tr key={b.id}>
                                        <td className="px-8 py-6 font-bold text-comfort-blue">{b.title}</td>
                                        <td className="px-8 py-6 text-[10px] text-gray-400">{b.date}</td>
                                        <td className="px-8 py-6 text-right flex justify-end space-x-4">
                                            <button onClick={() => handleEdit('bulletin', b)} className="text-gray-400 hover:text-comfort-gold transition-colors"><Edit size={18}/></button>
                                            <button onClick={() => handleDelete('bulletin', b.id)} className="text-red-300 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                                        </td>
                                    </tr>
                                ))}
                                {activeTab === 'testimonials' && testimonials.map(t => (
                                    <tr key={t.id}>
                                        <td className="px-8 py-6 font-bold text-comfort-blue">{t.nom_complet} <span className="block text-xs font-light text-gray-400 truncate max-w-xs">{t.message}</span></td>
                                        <td className="px-8 py-6 uppercase text-[10px] font-bold">{t.status}</td>
                                        <td className="px-8 py-6 text-right flex justify-end space-x-4">
                                            <button onClick={() => handleEdit('testimonial', t)} className="text-gray-400 hover:text-comfort-gold transition-colors"><Edit size={18}/></button>
                                            <button onClick={() => handleDelete('testimonial', t.id)} className="text-red-300 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                                        </td>
                                    </tr>
                                ))}
                                {activeTab === 'finances' && donations.map(d => (
                                    <tr key={d.id}>
                                        <td className="px-8 py-6 font-serif font-bold text-comfort-blue text-lg">${d.montant} <span className="block text-[10px] font-sans font-bold text-gray-400 uppercase tracking-widest mt-1">{d.donateur_nom}</span></td>
                                        <td className="px-8 py-6"><span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${d.status === 'confirmé' ? 'bg-comfort-gold text-white' : 'bg-gray-100 text-gray-400'}`}>{d.status}</span></td>
                                        <td className="px-8 py-6 text-right"><button onClick={() => handleEdit('donation', d)} className="text-comfort-blue font-bold uppercase text-[10px] tracking-widest border border-comfort-blue/20 px-4 py-2 hover:bg-comfort-blue hover:text-white transition-all">Gérer</button></td>
                                    </tr>
                                ))}
                                {activeTab === 'content' && projects.map(p => (
                                    <tr key={p.id}>
                                        <td className="px-8 py-6 font-bold text-comfort-blue max-w-md truncate">{p.titre}</td>
                                        <td className="px-8 py-6 uppercase text-[10px] font-bold text-comfort-gold">{p.statut}</td>
                                        <td className="px-8 py-6 text-right flex justify-end space-x-4">
                                            <button onClick={() => handleEdit('project', p)} className="text-gray-400 hover:text-comfort-gold transition-colors"><Edit size={18}/></button>
                                            <button onClick={() => handleDelete('project', p.id)} className="text-red-300 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;