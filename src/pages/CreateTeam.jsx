import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function CreateTeam() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    skillsRequired: '',
    memberCount: '3',
    projectTitle: '',
    projectDescription: '',
  });

  const token = localStorage.getItem('viconnect_token');

  useEffect(() => {
    const userStr = localStorage.getItem('viconnect_user');
    if (!token || !userStr) { navigate('/login', { replace: true }); return; }
    setCurrentUser(JSON.parse(userStr));
  }, []);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const skillsArray = form.skillsRequired.split(',').map(s => s.trim()).filter(s => s);
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, skillsRequired: skillsArray }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError(data.message || 'Failed to create team.');
      }
    } catch {
      setError('Cannot connect to server.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('viconnect_token');
    localStorage.removeItem('viconnect_user');
    navigate('/login', { replace: true });
  };

  if (!currentUser) return null;

  const inputClass = "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400";
  const labelClass = "block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2";

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 flex min-h-screen">
      <Sidebar currentUser={currentUser} onLogout={handleLogout} />

      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold">Launch a Team</h2>
        </header>

        <main className="p-8 flex justify-center">
          <div className="w-full max-w-3xl">
            {success ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-20 text-center">
                <div className="size-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-4xl text-emerald-600">rocket_launch</span>
                </div>
                <h3 className="text-3xl font-black mb-2">Team Created!</h3>
                <p className="text-slate-500">Redirecting to dashboard...</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center gap-2">
                       <span className="material-symbols-outlined">error</span> {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <h4 className="text-sm font-black text-primary uppercase tracking-widest">Team Details</h4>
                      <div>
                        <label className={labelClass}>Team Name</label>
                        <input name="name" className={inputClass} placeholder="e.g. Pixel Pioneers" value={form.name} onChange={handleChange} required />
                      </div>
                      <div>
                        <label className={labelClass}>Team Description</label>
                        <textarea name="description" className={inputClass} rows="4" placeholder="Brief about your team culture..." value={form.description} onChange={handleChange} required />
                      </div>
                      <div>
                        <label className={labelClass}>Skills Required (comma separated)</label>
                        <input name="skillsRequired" className={inputClass} placeholder="React, Node.js, UI/UX" value={form.skillsRequired} onChange={handleChange} required />
                      </div>
                      <div>
                        <label className={labelClass}>Members Required</label>
                        <select name="memberCount" className={inputClass} value={form.memberCount} onChange={handleChange} required>
                          {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} Member{n>1?'s':''}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-sm font-black text-primary uppercase tracking-widest">Project Details</h4>
                      <div>
                        <label className={labelClass}>Project Title</label>
                        <input name="projectTitle" className={inputClass} placeholder="e.g. AI Study Companion" value={form.projectTitle} onChange={handleChange} required />
                      </div>
                      <div>
                        <label className={labelClass}>Project Description</label>
                        <textarea name="projectDescription" className={inputClass} rows="11" placeholder="What are you building? Explain the goal, tech stack, and roadmap..." value={form.projectDescription} onChange={handleChange} required />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? 'Launching...' : 'Create Team & Find Members'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
