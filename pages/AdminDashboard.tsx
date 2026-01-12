
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, DollarSign, Activity, Bell, Mail, Plus, Edit, Trash2, Handshake, Briefcase, X, Check, Eye, UploadCloud, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api, API_BASE_URL, ApiUser, ApiAction, ApiArticle, ApiDonation, ApiPartner } from '../services/api';

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
const FormField = ({ label, value, onChange, type = "text", options = [] }: any) => (
    <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
        {type === 'textarea' ? (
            <textarea className="w-full bg-gray-50 border-b border-gray-200 p-4 outline-none focus:border-comfort-gold transition-all font-light text-sm min-h-[120px]" value={value} onChange={e => onChange(e.target.value)} />
        ) : type === 'select' ? (
             <select className="w-full bg-gray-50 border-b border-gray-200 p-4 outline-none focus:border-comfort-gold transition-all font-bold text-xs uppercase tracking-widest bg-white" value={value} onChange={e => onChange(e.target.value)}>
                 {options.map((opt:any) => (
                    <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                        {typeof opt === 'string' ? opt : opt.label}
                    </option>
                 ))}
             </select>
        ) : (
            <input type={type} className="w-full bg-gray-50 border-b border-gray-200 p-4 outline-none focus:border-comfort-gold transition-all font-light text-sm" value={value} onChange={e => onChange(e.target.value)} />
        )}
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
  
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const galleryImages = Array.from({ length: 10 }, (_, i) => `${API_BASE_URL}/assets/images/gallery/gallery${i + 1}.jpg`);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'project'|'blog'|'partner'|'user'|'donation'>('project');
  const [editingItem, setEditingItem] = useState<any>(null);

  const loadAllData = async () => {
        setUsers(await api.getUsers());
        setDonations(await api.getDonations());
        setProjects(await api.getRawActions());
        setBlogs(await api.getRawArticles());
        setPartners(await api.getRawPartners());
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'superadmin') loadAllData();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
        const timer = setInterval(() => {
            setCurrentGalleryIndex((prev) => (prev + 1) % galleryImages.length);
        }, 8000);
        return () => clearInterval(timer);
    }
  }, [activeTab, galleryImages.length]);

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
      else if (type === 'blog') defaultItem = { titre: '', contenu: '', auteur: user?.username || 'Admin', categorie: 'Actualité', image_url: '', status: 'publié' };
      else if (type === 'partner') defaultItem = { nom: '', description: '', site_web: '', logo_url: '', type: 'Corporate' };
      else if (type === 'user') defaultItem = { username: '', email: '', password: '', role: 'user' };
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
      if (res.success) loadAllData();
  };

  const handleSaveModal = async () => {
      const id = editingItem.id;
      let res;
      let payload: any = {};

      if (modalType === 'project') {
          payload = { titre: editingItem.titre, description: editingItem.description, categorie: editingItem.categorie, statut: editingItem.statut, image_url: editingItem.image_url, date_debut: editingItem.date_debut, date_fin: editingItem.date_fin };
          res = id ? await api.updateAction(id, payload) : await api.createAction(payload);
      } else if (modalType === 'blog') {
          payload = { titre: editingItem.titre, contenu: editingItem.contenu, auteur: editingItem.auteur, categorie: editingItem.categorie, image_url: editingItem.image_url, status: editingItem.status };
          res = id ? await api.updateArticle(id, payload) : await api.createArticle(payload);
      } else if (modalType === 'partner') {
          payload = { nom: editingItem.nom, description: editingItem.description, site_web: editingItem.site_web, logo_url: editingItem.logo_url, type: editingItem.type };
          res = id ? await api.updatePartner(id, payload) : await api.createPartner(payload);
      } else if (modalType === 'user') {
          payload = { username: editingItem.username, email: editingItem.email, role: editingItem.role };
          if (!id || editingItem.password) payload.password = editingItem.password;
          res = id ? await api.updateUser(id, payload) : await api.createUser(payload);
      } else if (modalType === 'donation') {
          res = await api.updateDonationStatus(id, editingItem.status);
      }

      if (res?.success) { setIsModalOpen(false); loadAllData(); }
      else alert("Erreur: " + (res?.error || "Problème serveur"));
  };

  if (!isAuthenticated || user?.role !== 'superadmin') return null;

  return (
    <div className="flex h-screen bg-comfort-light font-sans text-comfort-dark overflow-hidden">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem?.id ? "Mise à jour" : "Nouvelle entrée"} onSave={handleSaveModal}>
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
                    <FormField label="Titre de la Gazette" value={editingItem.titre} onChange={v => setEditingItem({...editingItem, titre: v})} />
                    <FormField label="Corps de l'Article" type="textarea" value={editingItem.contenu} onChange={v => setEditingItem({...editingItem, contenu: v})} />
                </>
             ) : modalType === 'partner' ? (
                <>
                    <ImageUploader label="Logotype" value={editingItem.logo_url} folder="partners" onChange={p => setEditingItem({...editingItem, logo_url: p})} />
                    <FormField label="Nom de l'Entité" value={editingItem.nom} onChange={v => setEditingItem({...editingItem, nom: v})} />
                </>
             ) : modalType === 'user' ? (
                <>
                    <FormField label="Nom d'utilisateur" value={editingItem.username} onChange={v => setEditingItem({...editingItem, username: v})} />
                    <FormField label="Habilitation" type="select" options={['user', 'editor', 'superadmin']} value={editingItem.role} onChange={v => setEditingItem({...editingItem, role: v})} />
                </>
             ) : modalType === 'donation' ? (
                <FormField label="Statut de Validation" type="select" options={['en_attente', 'confirmé', 'annulé']} value={editingItem.status} onChange={v => setEditingItem({...editingItem, status: v})} />
             ) : null
          )}
      </Modal>

      {/* SIDEBAR INSTITUTIONNELLE */}
      <aside className="w-72 bg-comfort-dark text-white flex flex-col z-20 shadow-2xl">
        <div className="p-10 border-b border-white/5">
           <h2 className="text-2xl font-serif font-bold tracking-tight">COMFORT <span className="text-comfort-gold text-[10px] block uppercase tracking-[0.4em] mt-3">Gouvernance</span></h2>
        </div>
        <nav className="flex-1 py-10 px-6 space-y-4">
           {[
               { id: 'dashboard', icon: LayoutDashboard, label: 'Vue d\'ensemble' },
               { id: 'users', icon: Users, label: 'Utilisateurs' },
               { id: 'content', icon: FileText, label: 'Programmes & Récits' },
               { id: 'finances', icon: DollarSign, label: 'Flux Financiers' },
               { id: 'partners', icon: Handshake, label: 'Alliances' },
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

      {/* PORTAIL CENTRAL */}
      <main className="flex-1 overflow-y-auto bg-white">
        <header className="bg-white/80 backdrop-blur-md py-6 px-12 flex justify-between items-center sticky top-0 z-10 border-b border-gray-50">
           <h1 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400">Section : <span className="text-comfort-blue">{activeTab}</span></h1>
           <div className="flex items-center space-x-6">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{user?.username}</span>
              <div className="h-10 w-10 rounded-full bg-comfort-blue text-white flex items-center justify-center font-bold shadow-xl border-2 border-white">
                  {user?.username.charAt(0).toUpperCase()}
              </div>
           </div>
        </header>

        <div className="p-12 max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
                <div className="space-y-12 animate-in fade-in duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Engagement Total</p>
                            <h3 className="text-3xl font-serif font-bold text-comfort-blue">${donations.reduce((acc, curr) => acc + parseFloat(curr.montant), 0).toFixed(0)}</h3>
                        </div>
                        <div className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Rayonnement Acteurs</p>
                            <h3 className="text-3xl font-serif font-bold text-comfort-blue">{users.length}</h3>
                        </div>
                        <div className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Programmes Terrain</p>
                            <h3 className="text-3xl font-serif font-bold text-comfort-blue">{projects.length}</h3>
                        </div>
                        <div className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Récits Publiés</p>
                            <h3 className="text-3xl font-serif font-bold text-comfort-blue">{blogs.length}</h3>
                        </div>
                    </div>

                    <div className="bg-comfort-dark rounded-sm overflow-hidden h-[500px] relative shadow-2xl">
                        <img src={galleryImages[currentGalleryIndex]} className="w-full h-full object-cover animate-ken-burns opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-comfort-dark via-transparent to-transparent flex items-end p-12">
                             <div className="max-w-2xl">
                                <span className="text-comfort-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Archive Visuelle</span>
                                <h4 className="text-4xl font-serif font-bold text-white mb-4 italic">Nos actions en images</h4>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* VUES TABLES ÉPURÉES */}
            {activeTab !== 'dashboard' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-serif font-bold text-comfort-blue capitalize">{activeTab}</h2>
                            <p className="text-gray-400 font-light mt-2">Gestion institutionnelle des données système.</p>
                        </div>
                        {activeTab !== 'finances' && (
                            <button onClick={() => handleCreate(activeTab === 'users' ? 'user' : activeTab === 'content' ? 'project' : activeTab === 'partners' ? 'partner' : 'project')} 
                                    className="bg-comfort-blue text-white px-8 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-comfort-gold transition-all shadow-xl">
                                <Plus size={16} className="inline mr-2" /> Créer une entrée
                            </button>
                        )}
                    </div>

                    <div className="overflow-hidden border border-gray-50 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-50">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Identifiant / Détails</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Statut / Rôle</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {activeTab === 'users' && users.map(u => (
                                    <tr key={u.id} className="hover:bg-comfort-light transition-colors">
                                        <td className="px-8 py-6 font-bold text-comfort-blue">{u.username} <span className="block text-xs font-light text-gray-400">{u.email}</span></td>
                                        <td className="px-8 py-6 uppercase text-[10px] font-bold tracking-widest">{u.role}</td>
                                        <td className="px-8 py-6 text-right flex justify-end space-x-4">
                                            <button onClick={() => handleEdit('user', u)} className="text-gray-400 hover:text-comfort-gold transition-colors"><Edit size={18}/></button>
                                            <button onClick={() => handleDelete('user', u.id)} className="text-red-300 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                                        </td>
                                    </tr>
                                ))}
                                {activeTab === 'finances' && donations.map(d => (
                                    <tr key={d.id} className="hover:bg-comfort-light transition-colors">
                                        <td className="px-8 py-6 font-serif font-bold text-comfort-blue text-lg">${d.montant} <span className="block text-[10px] font-sans font-bold text-gray-400 uppercase tracking-widest mt-1">{d.donateur_nom}</span></td>
                                        <td className="px-8 py-6"><span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${d.status === 'confirmé' ? 'bg-comfort-gold text-white' : 'bg-gray-100 text-gray-400'}`}>{d.status}</span></td>
                                        <td className="px-8 py-6 text-right"><button onClick={() => handleEdit('donation', d)} className="text-comfort-blue font-bold uppercase text-[10px] tracking-widest border border-comfort-blue/20 px-4 py-2 hover:bg-comfort-blue hover:text-white transition-all">Gérer</button></td>
                                    </tr>
                                ))}
                                {activeTab === 'content' && projects.map(p => (
                                    <tr key={p.id} className="hover:bg-comfort-light transition-colors">
                                        <td className="px-8 py-6 font-bold text-comfort-blue max-w-md truncate">{p.titre}</td>
                                        <td className="px-8 py-6 uppercase text-[10px] font-bold tracking-widest text-comfort-gold">{p.statut}</td>
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
