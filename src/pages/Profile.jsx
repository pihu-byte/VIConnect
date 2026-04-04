import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useMissingFields from '../hooks/useMissingFields';

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
  const fileInputRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', department: '', avatar: '', phoneNumber: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem('viconnect_token');

  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [pwData, setPwData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState({ text: '', type: '' });

  // Missing fields
  const { missingFields, refreshMissingFields } = useMissingFields();

  useEffect(() => {
    const userStr = localStorage.getItem('viconnect_user');
    if (!token || !userStr) { navigate('/login', { replace: true }); return; }
    const user = JSON.parse(userStr);
    setCurrentUser(user);
    setFormData({
      fullName: user.fullName || '',
      department: user.department || '',
      avatar: user.avatar || '',
      phoneNumber: user.phoneNumber || '',
      bio: user.bio || '',
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
        refreshMissingFields();
      } else {
        setMessage({ text: data.message || 'Update failed.', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Connection error.', type: 'error' });
    }
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage({ text: '', type: '' });
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      const res = await fetch('/api/auth/upload-avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('viconnect_user', JSON.stringify(data.user));
        setCurrentUser(data.user);
        setFormData(prev => ({ ...prev, avatar: data.user.avatar }));
        setMessage({ text: 'Avatar uploaded!', type: 'success' });
      } else {
        setMessage({ text: data.message || 'Upload failed.', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Connection error.', type: 'error' });
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMessage({ text: '', type: '' });
    if (pwData.newPassword !== pwData.confirmNewPassword) {
      setPwMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwData.currentPassword, newPassword: pwData.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwMessage({ text: 'Password changed successfully!', type: 'success' });
        setPwData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        setPwMessage({ text: data.message || 'Failed to change password.', type: 'error' });
      }
    } catch {
      setPwMessage({ text: 'Connection error.', type: 'error' });
    }
    setPwLoading(false);
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
      <Sidebar currentUser={currentUser} onLogout={handleLogout} missingFields={missingFields} />

      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold">Profile Settings</h2>
        </header>

        <main className="p-8 flex justify-center">
          <div className="w-full max-w-2xl space-y-8">

            {/* Missing Fields Alert Banner */}
            {missingFields.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-2xl p-5 flex items-start gap-4 shadow-lg shadow-amber-100/50 dark:shadow-none animate-fade-in">
                <div className="bg-amber-100 dark:bg-amber-800/50 size-12 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-2xl">notification_important</span>
                </div>
                <div>
                  <h4 className="font-black text-amber-800 dark:text-amber-300 text-sm uppercase tracking-wide">New fields added — please complete your profile</h4>
                  <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
                    The following fields are missing:{' '}
                    {missingFields.map((f, i) => (
                      <span key={f.key}>
                        <strong>{f.label}</strong>{i < missingFields.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                    . Please fill them in below and save.
                  </p>
                </div>
              </div>
            )}

            {/* Profile Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img
                    src={formData.avatar || `https://i.pravatar.cc/150?u=${currentUser.email}`}
                    alt="Profile"
                    className="size-32 rounded-full ring-4 ring-primary/20 object-cover shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                      <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">upload</span>
                  Upload Photo
                </button>
                <h3 className="text-2xl font-bold mt-2">{currentUser.fullName}</h3>
                <p className="text-slate-500 uppercase font-semibold text-sm tracking-widest">{currentUser.registrationNumber}</p>
              </div>

              {/* Messages */}
              {message.text && (
                <div className={`mb-6 p-4 rounded-xl border text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                  {message.text}
                </div>
              )}

              {/* Profile Form */}
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">Full Name</label>
                    <input
                      className={inputClass}
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Department</label>
                    <select
                      className={inputClass}
                      value={formData.department}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                      Phone Number
                      {missingFields.some(f => f.key === 'phoneNumber') && (
                        <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300 px-2 py-0.5 rounded-full">New</span>
                      )}
                    </label>
                    <input
                      className={inputClass}
                      placeholder="Enter phone number"
                      value={formData.phoneNumber}
                      onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                      Bio
                      {missingFields.some(f => f.key === 'bio') && (
                        <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300 px-2 py-0.5 rounded-full">New</span>
                      )}
                    </label>
                    <input
                      className={inputClass}
                      placeholder="A short bio about yourself"
                      maxLength={200}
                      value={formData.bio}
                      onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>
                </div>

                {/* Preset Avatars */}
                <div>
                  <label className="block text-sm font-bold mb-4">Or Choose a Preset Avatar</label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
                    {PRESET_AVATARS.map(url => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar: url })}
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

            {/* Change Password Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowPasswordSection(s => !s)}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 dark:bg-slate-800 size-10 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">lock</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-sm">Change Password</h4>
                    <p className="text-xs text-slate-500">Update your account password</p>
                  </div>
                </div>
                <span className={`material-symbols-outlined text-slate-400 transition-transform ${showPasswordSection ? 'rotate-180' : ''}`}>expand_more</span>
              </button>

              {showPasswordSection && (
                <div className="px-6 pb-6 border-t border-slate-100 dark:border-slate-800">
                  {pwMessage.text && (
                    <div className={`mt-4 p-4 rounded-xl border text-sm flex items-center gap-2 ${pwMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                      <span className="material-symbols-outlined">{pwMessage.type === 'success' ? 'check_circle' : 'error'}</span>
                      {pwMessage.text}
                    </div>
                  )}
                  <form onSubmit={handlePasswordChange} className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Current Password</label>
                      <input
                        type="password"
                        className={inputClass}
                        placeholder="Enter current password"
                        value={pwData.currentPassword}
                        onChange={e => setPwData({ ...pwData, currentPassword: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">New Password</label>
                        <input
                          type="password"
                          className={inputClass}
                          placeholder="Min. 6 characters"
                          value={pwData.newPassword}
                          onChange={e => setPwData({ ...pwData, newPassword: e.target.value })}
                          required
                          minLength={6}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          className={inputClass}
                          placeholder="Re-enter new password"
                          value={pwData.confirmNewPassword}
                          onChange={e => setPwData({ ...pwData, confirmNewPassword: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={pwLoading}
                      className="w-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                      {pwLoading ? 'Changing...' : 'Change Password'}
                    </button>
                  </form>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
