import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function PostRide() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    from: '', destination: '', date: '', time: '',
    fare: '', seatsAvailable: '3', genderCategory: 'both',
  });

  const token = localStorage.getItem('viconnect_token');

  useEffect(() => {
    const userStr = localStorage.getItem('viconnect_user');
    if (!token || !userStr) { navigate('/login', { replace: true }); return; }
    setCurrentUser(JSON.parse(userStr));
    const today = new Date().toISOString().split('T')[0];
    setForm(f => ({ ...f, date: today }));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('viconnect_token');
    localStorage.removeItem('viconnect_user');
    navigate('/login', { replace: true });
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to post ride.'); setLoading(false); return; }
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch {
      setError('Cannot connect to server.');
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 px-4 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400";
  const labelClass = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2";

  if (!currentUser) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 flex min-h-screen">
      <Sidebar currentUser={currentUser} onLogout={handleLogout} />

      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-8 sticky top-0 z-10">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mr-4">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Post a Ride</h2>
        </header>

        <main className="flex-1 p-8 flex items-start justify-center">
          <div className="w-full max-w-2xl">
            {/* Hero Card */}
            <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden shadow-xl shadow-primary/20">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
              <div className="relative z-10">
                <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl">directions_car</span>
                </div>
                <h1 className="text-3xl font-black mb-2">Share Your Ride</h1>
                <p className="text-blue-100 text-lg">Help fellow VITians get home safely. Post your travel plans and split the cost.</p>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">
              {success ? (
                <div className="text-center py-8">
                  <div className="size-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Ride Posted!</h3>
                  <p className="text-slate-500">Redirecting to dashboard...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-400">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      <span>{error}</span>
                    </div>
                  )}

                  {/* From / To */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>
                        <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">trip_origin</span> From</span>
                      </label>
                      <input className={inputClass} name="from" placeholder="e.g. VIT Campus" value={form.from} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className={labelClass}>
                        <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">place</span> Destination</span>
                      </label>
                      <input className={inputClass} name="destination" placeholder="e.g. Chennai" value={form.destination} onChange={handleChange} required />
                    </div>
                  </div>

                  {/* Date / Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>
                        <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span> Date</span>
                      </label>
                      <input className={inputClass} type="date" name="date" value={form.date} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className={labelClass}>
                        <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">schedule</span> Time</span>
                      </label>
                      <input className={inputClass} type="time" name="time" value={form.time} onChange={handleChange} required />
                    </div>
                  </div>

                  {/* Fare / Seats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>
                        <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">currency_rupee</span> Fare per person (₹)</span>
                      </label>
                      <input className={inputClass} type="number" name="fare" placeholder="e.g. 350" min="0" value={form.fare} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className={labelClass}>
                        <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">event_seat</span> Seats Available</span>
                      </label>
                      <select className={inputClass} name="seatsAvailable" value={form.seatsAvailable} onChange={handleChange} required>
                        {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} seat{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Gender Category */}
                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">wc</span> Passenger Gender Preference</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'both', label: 'Everyone', icon: 'people' },
                        { value: 'male', label: 'Male Only', icon: 'man' },
                        { value: 'female', label: 'Female Only', icon: 'woman' },
                      ].map(opt => (
                        <label key={opt.value} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.genderCategory === opt.value ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary/40'}`}>
                          <input type="radio" name="genderCategory" value={opt.value} checked={form.genderCategory === opt.value} onChange={handleChange} className="hidden" />
                          <span className="material-symbols-outlined text-3xl">{opt.icon}</span>
                          <span className="text-xs font-bold">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <><svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg><span>Posting...</span></>
                    ) : (
                      <><span className="material-symbols-outlined">directions_car</span><span>Post Ride</span></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
