import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Finn',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
];

export default function Profile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', department: '', avatar: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const token = localStorage.getItem('viconnect_token');

  useEffect(() => {
    const userStr = localStorage.getItem('viconnect_user');
    if (!token || !userStr) { navigate('/login', { replace: true }); return; }
    const user = JSON.parse(userStr);
    setCurrentUser(user);
    setFormData({ 
      fullName: user.fullName || '', 
      department: user.department || '', 
      avatar: user.avatar || '' 
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('viconnect_user', JSON.stringify(data.user));
        setCurrentUser(data.user);
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
      } else {
        setMessage({ text: data.message || 'Update failed.', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Connect error.', type: 'error' });
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('viconnect_token');
    localStorage.removeItem('viconnect_user');
    navigate('/login', { replace: true });
  };

  if (!currentUser) return null;

  const inputClass = "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 flex min-h-screen">
      <Sidebar currentUser={currentUser} onLogout={handleLogout} />

      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold">Profile Settings</h2>
        </header>

        <main className="p-8 flex justify-center">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <img 
                  src={formData.avatar || `https://i.pravatar.cc/150?u=${currentUser.email}`} 
                  alt="Profile" 
                  className="size-32 rounded-full ring-4 ring-primary/20 object-cover shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mt-4">{currentUser.fullName}</h3>
              <p className="text-slate-500 uppercase font-semibold text-sm tracking-widest">{currentUser.registrationNumber}</p>
            </div>

            {message.text && (
              <div className={`mb-6 p-4 rounded-xl border text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Full Name</label>
                  <input 
                    className={inputClass} 
                    value={formData.fullName} 
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Department</label>
                  <select 
                    className={inputClass} 
                    value={formData.department} 
                    onChange={e => setFormData({...formData, department: e.target.value})}
                    required
                  >
                    <option value="cse">CSE</option>
                    <option value="it">IT</option>
                    <option value="ece">ECE</option>
                    <option value="eee">EEE</option>
                    <option value="mech">Mech</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-4">Choose an Avatar</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
                  {PRESET_AVATARS.map(url => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setFormData({...formData, avatar: url})}
                      className={`size-12 rounded-full overflow-hidden border-2 transition-all ${formData.avatar === url ? 'border-primary ring-2 ring-primary/20 scale-110 shadow-md' : 'border-transparent hover:border-slate-300'}`}
                    >
                      <img src={url} alt="preset" className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
