import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useMissingFields from '../hooks/useMissingFields';

export default function CreateTeam() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    skillsRequired: [],
    memberCount: '3',
    projectTitle: '',
    projectDescription: '',
    hackathonDate: '',
  });
  const [skillInput, setSkillInput] = useState('');

  const token = localStorage.getItem('viconnect_token');
  const { missingFields } = useMissingFields();

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
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
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
      <Sidebar currentUser={currentUser} onLogout={handleLogout} missingFields={missingFields} />

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
                        <label className={labelClass}>Skills Required</label>
                        <div className="flex flex-col gap-2">
                          <input 
                            className={inputClass} 
                            placeholder="Type a skill and press Enter (e.g. React, UI/UX)" 
                            value={skillInput} 
                            onChange={e => setSkillInput(e.target.value)} 
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ',') {
                                e.preventDefault();
                                const val = skillInput.trim();
                                if (val && !form.skillsRequired.includes(val)) {
                                  setForm(f => ({ ...f, skillsRequired: [...f.skillsRequired, val] }));
                                }
                                setSkillInput('');
                              }
                            }}
                          />
                          {form.skillsRequired.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {form.skillsRequired.map(skill => (
                                <span key={skill} className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                                  {skill}
                                  <button type="button" onClick={() => setForm(f => ({ ...f, skillsRequired: f.skillsRequired.filter(s => s !== skill) }))} className="hover:text-red-500 material-symbols-outlined text-[14px]">close</button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
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
                        <textarea name="projectDescription" className={inputClass} rows="6" placeholder="What are you building? Explain the goal, tech stack, and roadmap..." value={form.projectDescription} onChange={handleChange} required />
                      </div>
                      <div>
                        <label className={labelClass}>Hackathon Date (Optional)</label>
                        <input type="date" name="hackathonDate" className={inputClass} value={form.hackathonDate} onChange={handleChange} />
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
