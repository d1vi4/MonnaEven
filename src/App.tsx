import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  Trash2, 
  X, 
  Utensils, 
  Camera, 
  ArrowLeft,
  Lock,
  Loader2,
  Globe,
  MessageCircle,
  Send,
  AlertCircle
} from 'lucide-react';

// Types
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
}

interface AppData {
  categories: string[];
  menuItems: MenuItem[];
}

type Language = 'az' | 'en' | 'ru';

const translations = {
  az: {
    loading: 'MonnaEven yüklənir...',
    slogan: 'Hər detaldakı incəlik',
    searchPlaceholder: 'Yeməklərin axtarışı...',
    allCategories: 'Hamısı',
    emptyMenu: 'Burada hələ heç nə yoxdur. Sonra yenə gəlin!',
    close: 'Bağla',
    adminLogin: 'Admin Girişi',
    enterPassword: 'Zəhmət olmasa şifrəni daxil edin',
    passwordPlaceholder: 'Şifrə',
    loginButton: 'Daxil ol',
    wrongPassword: 'Yanlış şifrə',
    adminPanel: 'İdarəetmə Paneli',
    backToSite: 'Sayta qayıt',
    categories: 'Kateqoriyalar',
    addCategory: 'Əlavə et',
    catPlaceholder: 'Kateqoriya adı',
    menu: 'Menyu',
    addDish: 'Yemək əlavə et',
    deleteDishPrompt: 'Bu yeməyi silmək istəyirsiniz?',
    deleteCatPrompt: (cat: string) => `"${cat}" kateqoriyasını və içindəki bütün yeməkləri silmək istəyirsiniz?`,
    newDish: 'Yeni yemək',
    dishName: 'Adı',
    dishPrice: 'Qiymət (₼)',
    dishDesc: 'Təsviri',
    uploadPhoto: 'Şəkil yüklə',
    publish: 'Dərc et',
    wantSameSite: 'Siz də belə bir sayt istəyirsiniz?',
    contactUs: 'Bizimlə əlaqə saxlayın',
    selectCat: 'Kateqoriya seçin'
  },
  en: {
    loading: 'Loading MonnaEven...',
    slogan: 'Sophistication in every detail',
    searchPlaceholder: 'Search dishes...',
    allCategories: 'All',
    emptyMenu: 'Nothing here yet. Check back later!',
    close: 'Close',
    adminLogin: 'Admin Access',
    enterPassword: 'Please enter the password',
    passwordPlaceholder: 'Password',
    loginButton: 'Login',
    wrongPassword: 'Wrong password',
    adminPanel: 'Admin Panel',
    backToSite: 'Back to site',
    categories: 'Categories',
    addCategory: 'Add',
    catPlaceholder: 'Category name',
    menu: 'Menu',
    addDish: 'Add Dish',
    deleteDishPrompt: 'Delete this dish?',
    deleteCatPrompt: (cat: string) => `Delete category "${cat}" and all its dishes?`,
    newDish: 'New Dish',
    dishName: 'Name',
    dishPrice: 'Price (₼)',
    dishDesc: 'Description',
    uploadPhoto: 'Upload Photo',
    publish: 'Publish',
    wantSameSite: 'Want a site like this?',
    contactUs: 'Contact us',
    selectCat: 'Select Category'
  },
  ru: {
    loading: 'Загрузка MonnaEven...',
    slogan: 'Изысканность в каждой детали',
    searchPlaceholder: 'Поиск блюд...',
    allCategories: 'Все',
    emptyMenu: 'Здесь пока ничего нет. Загляните позже!',
    close: 'Закрыть',
    adminLogin: 'Админ Доступ',
    enterPassword: 'Пожалуйста, введите пароль',
    passwordPlaceholder: 'Пароль',
    loginButton: 'Войти',
    wrongPassword: 'Неверный пароль',
    adminPanel: 'Панель управления',
    backToSite: 'На сайт',
    categories: 'Категории',
    addCategory: 'Добавить',
    catPlaceholder: 'Название категории',
    menu: 'Меню',
    addDish: 'Добавить блюдо',
    deleteDishPrompt: 'Удалить это блюдо?',
    deleteCatPrompt: (cat: string) => `Удалить категорию "${cat}" и все блюда в ней?`,
    newDish: 'Новое блюдо',
    dishName: 'Название',
    dishPrice: 'Цена (₼)',
    dishDesc: 'Описание',
    uploadPhoto: 'Загрузить фото',
    publish: 'Опубликовать',
    wantSameSite: 'Хотите такой же сайт?',
    contactUs: 'Свяжитесь с нами',
    selectCat: 'Выберите категорию'
  }
};

export default function App() {
  const [data, setData] = useState<AppData>({ categories: [], menuItems: [] });
  const [language, setLanguage] = useState<Language>('az');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const t = translations[language];

  // Load Data
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.categories.length > 0 && !activeCategory) {
      setActiveCategory(data.categories[0]);
    }
  }, [data.categories]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/data');
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (newData: AppData) => {
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      if (res.ok) {
        setData(newData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setShowAdminPanel(true);
      setPassword('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const filteredItems = data.menuItems.filter(item => {
    const isAll = activeCategory === data.categories[0];
    const matchesCategory = isAll || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF9F6] text-[#3E2723]">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="font-serif italic">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#3E2723] font-sans selection:bg-[#795548] selection:text-white">
      {!showAdminPanel ? (
        <>
          {/* Header / Hero */}
          <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ 
                backgroundImage: `linear-gradient(rgba(62, 39, 35, 0.6), rgba(62, 39, 35, 0.4)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2070')` 
              }}
            />
            
            {/* Language Switcher */}
            <div className="absolute top-4 right-4 z-30 flex gap-2">
              {(['az', 'en', 'ru'] as Language[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border ${
                    language === lang 
                      ? 'bg-white text-[#3E2723] border-white' 
                      : 'bg-white/10 text-white border-white/20'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="relative z-10 text-center px-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-[#795548]">
                <Utensils className="text-[#3E2723]" size={32} />
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-2 tracking-tight">MonnaEven</h1>
              <p className="text-white/80 font-serif italic text-lg">{t.slogan}</p>
            </div>
          </section>

          {/* Search & Categories */}
          <div className="sticky top-0 z-40 bg-[#FAF9F6] border-b border-[#3E2723]/10 px-4 py-4">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3E2723]/40" size={18} />
                <input 
                  type="text" 
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#3E2723]/10 rounded-full py-3.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-[#795548] transition-all text-sm"
                />
              </div>
              <div className="flex overflow-x-auto pb-1 gap-2 no-scrollbar scroll-smooth">
                {data.categories.map((cat, i) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                      activeCategory === cat 
                        ? 'bg-[#3E2723] text-white shadow-lg' 
                        : 'bg-white text-[#3E2723]/60 border border-[#3E2723]/10'
                    }`}
                  >
                    {i === 0 ? t.allCategories : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Grid */}
          <main className="max-w-5xl mx-auto px-4 py-8">
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 opacity-40 italic font-serif">
                {t.emptyMenu}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-[#3E2723]/5"
                  >
                    <div className="h-44 overflow-hidden">
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-serif font-bold">{item.name}</h3>
                        <span className="text-sm font-bold text-[#795548] whitespace-nowrap">{item.price} ₼</span>
                      </div>
                      <p className="text-[#3E2723]/60 text-xs line-clamp-2 italic font-serif">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* Footer Card */}
          <section className="bg-white border-y border-[#3E2723]/5 py-12 px-6">
             <div className="max-w-xl mx-auto text-center space-y-6">
                <h2 className="text-2xl font-serif font-bold">{t.wantSameSite}</h2>
                <div className="flex justify-center gap-3">
                   <a 
                    href="https://wa.me/994556482060" 
                    target="_blank"
                    className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md"
                   >
                     <MessageCircle size={18} /> WhatsApp
                   </a>
                   <a 
                    href="https://t.me/d1vi_4" 
                    target="_blank"
                    className="flex items-center gap-2 bg-[#0088cc] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md"
                   >
                     <Send size={18} /> Telegram
                   </a>
                </div>
             </div>
          </section>

          {/* Footer Trigger */}
          <footer className="py-12 flex flex-col items-center opacity-40">
            <button 
              onClick={() => setShowAdminLogin(true)}
              className="flex flex-col items-center"
            >
              <Utensils size={18} className="mb-2" />
              <span className="text-[10px] tracking-widest uppercase font-bold">© MonnaEven 2026</span>
            </button>
          </footer>
        </>
      ) : (
        <AdminPanel 
          data={data} 
          onSave={saveData} 
          onClose={() => setShowAdminPanel(false)} 
          language={language}
        />
      )}

      {/* Item Details Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex flex-col items-center py-6 px-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl my-auto"
            >
              <div className="relative h-72 sm:h-96">
                <img 
                  src={selectedItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'} 
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 bg-white/20 backdrop-blur-lg text-white p-2.5 rounded-full hover:bg-white/40 transition-all border border-white/20"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div className="min-w-0">
                    <span className="text-xs uppercase font-black text-[#795548] mb-2 block tracking-[0.2em]">{selectedItem.category}</span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight text-[#3E2723]">{selectedItem.name}</h2>
                  </div>
                  <div className="text-3xl font-serif font-black text-[#795548] whitespace-nowrap pt-1">{selectedItem.price} ₼</div>
                </div>
                <div className="w-16 h-1.5 bg-[#795548]/20 mb-8 rounded-full" />
                <div className="text-[#3E2723]/80 font-serif italic leading-relaxed text-lg sm:text-xl whitespace-pre-wrap">
                  {selectedItem.description}
                </div>
                <div className="mt-12">
                   <button 
                    onClick={() => setSelectedItem(null)}
                    className="w-full bg-[#3E2723] text-white py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-[#3E2723]/20 active:scale-95 transition-transform"
                   >
                    {t.close}
                   </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-6"
            onClick={() => {
              setShowAdminLogin(false);
              setPasswordError(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl text-center"
            >
              <Lock className="mx-auto mb-4 text-[#3E2723]" size={28} />
              <h2 className="text-xl font-serif font-bold mb-1">{t.adminLogin}</h2>
              <p className="text-xs text-[#3E2723]/50 mb-6">{t.enterPassword}</p>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input 
                  type="password" 
                  autoFocus
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  className={`w-full bg-[#FAF9F6] border rounded-xl px-4 py-3 focus:outline-none text-center ${passwordError ? 'border-red-500 bg-red-50' : 'border-[#3E2723]/10'}`}
                />
                {passwordError && <p className="text-[10px] text-red-500 font-bold">{t.wrongPassword}</p>}
                <button 
                  type="submit"
                  className="w-full bg-[#3E2723] text-white py-3 rounded-xl font-bold"
                >
                  {t.loginButton}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AdminPanel({ data, onSave, onClose, language }: { data: AppData, onSave: (d: AppData) => void, onClose: () => void, language: Language }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: '', image: '' });
  const [newCategory, setNewCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    
    const id = Date.now().toString();
    const updatedItems = [...data.menuItems, { ...newItem, id }];
    onSave({ ...data, menuItems: updatedItems });
    setNewItem({ name: '', description: '', price: '', category: data.categories[1] || '', image: '' });
    setShowAddForm(false);
  };

  const deleteItem = (id: string) => {
    if (!confirm(t.deleteDishPrompt)) return;
    const updatedItems = data.menuItems.filter(i => i.id !== id);
    onSave({ ...data, menuItems: updatedItems });
  };

  const addCategory = () => {
    if (!newCategory || data.categories.includes(newCategory)) return;
    const updatedCats = [...data.categories, newCategory];
    onSave({ ...data, categories: updatedCats });
    setNewCategory('');
  };

  const deleteCategory = (cat: string) => {
    if (!confirm(t.deleteCatPrompt(cat))) return;
    const updatedCats = data.categories.filter(c => c !== cat);
    const updatedItems = data.menuItems.filter(i => i.category !== cat);
    onSave({ categories: updatedCats, menuItems: updatedItems });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size too large (max 2MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <header className="bg-white border-b border-[#3E2723]/10 px-4 py-4 flex items-center justify-between sticky top-0 z-30">
        <button onClick={onClose} className="text-xs font-bold flex items-center gap-1">
          <ArrowLeft size={14} /> {t.backToSite}
        </button>
        <h2 className="text-xs font-bold uppercase tracking-widest">{t.adminPanel}</h2>
        <div className="w-10" />
      </header>

      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <section className="bg-white p-6 rounded-2xl border border-[#3E2723]/5">
          <h3 className="text-[10px] font-bold uppercase mb-4 opacity-40">{t.categories}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {data.categories.map((cat, i) => (
              <div key={cat} className="flex items-center gap-1.5 bg-[#FAF9F6] border border-[#3E2723]/10 rounded-full pl-3 pr-1 py-1.5">
                <span className="text-xs font-medium">{i === 0 ? t.allCategories : cat}</span>
                {i !== 0 && (
                  <button onClick={() => deleteCategory(cat)} className="p-1 hover:bg-red-50 text-red-500 rounded-full">
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder={t.catPlaceholder}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 bg-[#FAF9F6] border border-[#3E2723]/10 rounded-xl px-4 py-2 text-sm"
            />
            <button onClick={addCategory} className="bg-[#3E2723] text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap">
              {t.addCategory}
            </button>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-[#3E2723]/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-bold uppercase opacity-40">{t.menu}</h3>
            <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1.5 bg-[#795548] text-white px-4 py-2 rounded-xl text-xs font-bold">
              <Plus size={16} /> {t.addDish}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {data.menuItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-[#FAF9F6] border border-[#3E2723]/5 rounded-xl">
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                  <img src={item.image || ''} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{item.name}</h4>
                  <p className="text-[10px] font-bold text-[#795548]">{item.price} ₼</p>
                </div>
                <button onClick={() => deleteItem(item.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-lg shrink-0">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">{t.newDish}</h3>
                <button onClick={() => setShowAddForm(false)}><X size={20} /></button>
              </div>
              <form onSubmit={addItem} className="space-y-4 overflow-y-auto pr-1">
                <div onClick={() => fileInputRef.current?.click()} className="h-40 bg-[#FAF9F6] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-[#3E2723]/10 overflow-hidden cursor-pointer">
                  {newItem.image ? (
                    <img src={newItem.image} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera className="text-[#3E2723]/20 mb-2" size={24} />
                      <span className="text-[10px] font-bold opacity-30 uppercase">{t.uploadPhoto}</span>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
                <input 
                  type="text" 
                  placeholder={t.dishName}
                  required
                  value={newItem.name}
                  onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[#FAF9F6] border border-[#3E2723]/10 rounded-xl px-4 py-2.5 text-sm"
                />
                <input 
                  type="number" 
                  placeholder={t.dishPrice}
                  required
                  step="0.01"
                  value={newItem.price}
                  onChange={e => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full bg-[#FAF9F6] border border-[#3E2723]/10 rounded-xl px-4 py-2.5 text-sm"
                />
                <select 
                  required
                  value={newItem.category}
                  onChange={e => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-[#FAF9F6] border border-[#3E2723]/10 rounded-xl px-4 py-2.5 text-sm"
                >
                  <option value="">{t.selectCat}</option>
                  {data.categories.filter((_, i) => i !== 0).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <textarea 
                  rows={3}
                  placeholder={t.dishDesc}
                  value={newItem.description}
                  onChange={e => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-[#FAF9F6] border border-[#3E2723]/10 rounded-xl px-4 py-2.5 text-sm resize-none"
                />
                <button type="submit" className="w-full bg-[#3E2723] text-white py-3 rounded-xl font-bold">
                  {t.publish}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
