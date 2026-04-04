import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function BrowseTeams() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestedIds, setRequestedIds] = useState(new Set());
  const [requestingId, setRequestingId] = useState(null);
  const [toast, setToast] = useState('');
  const token = localStorage.getItem('viconnect_token');

  useEffect(() => {
    const userStr = localStorage.getItem('viconnect_user');
    if (!token || !userStr) { navigate('/login', { replace: true }); return; }
    setCurrentUser(JSON.parse(userStr));
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const [teamsRes, inboxRes] = await Promise.all([
        fetch('/api/teams', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/team-requests/inbox', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const teamsData = await teamsRes.json();
      const inboxData = await inboxRes.json();
      if (teamsRes.ok) setTeams(teamsData.teams || []);
      if (inboxRes.ok) setRequestedIds(new Set((inboxData.outgoing || []).map(r => r.team?._id || r.team)));
    } catch { console.error('Error fetching teams.'); }
    setLoading(false);
  };

  const handleJoin = async (teamId) => {
    setRequestingId(teamId);
    try {
      const res = await fetch('/api/team-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ teamId }),
      });
      const data = await res.json();
      if (res.ok) {
        setRequestedIds(prev => new Set([...prev, teamId]));
        setToast('✓ Request sent! Check your Inbox.');
      } else {
        setToast(data.message || 'Error occurred.');
      }
    } catch { setToast('Connection error.'); }
    setRequestingId(null);
    setTimeout(() => setToast(''), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('viconnect_token');
    localStorage.removeItem('viconnect_user');
    navigate('/login', { replace: true });
  };

  if (!currentUser) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 flex min-h-screen">
      <Sidebar currentUser={currentUser} onLogout={handleLogout} />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">info</span> {toast}
        </div>
      )}

      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-8 sticky top-0 z-10 justify-between">
          <h2 className="text-xl font-bold">Browse Active Teams</h2>
          <button onClick={() => navigate('/create-team')} className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[20px]">add</span> Create Team
          </button>
        </header>

        <main className="p-8">
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />)}
             </div>
          ) : teams.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-20 text-center shadow-xl">
               <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">groups</span>
               <h3 className="text-2xl font-black mb-1">No Teams Available</h3>
               <p className="text-slate-500 mb-6">Be the first to start a project on VIT Connect!</p>
               <button onClick={() => navigate('/create-team')} className="bg-primary text-white px-8 py-3 rounded-xl font-bold">Launch a Team Now</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map(team => {
                const isOwner = team.createdBy?._id === currentUser.id || team.createdBy?._id === currentUser._id;
                const isRequested = requestedIds.has(team._id);
                return (
                  <div key={team._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all p-6 flex flex-col group relative overflow-hidden">
                    <div className="flex items-start justify-between mb-4">
                      <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">rocket</span>
                      </div>
                      {isOwner ? (
                         <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase px-2 py-1 rounded-md border border-indigo-100 dark:border-indigo-800">Your Team</span>
                      ) : team.status === 'completed' ? (
                         <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase px-2 py-1 rounded-md">Closed</span>
                      ) : (
                         <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800">Recruiting</span>
                      )}
                    </div>
                    <h3 className="text-xl font-black mb-1 group-hover:text-primary transition-colors">{team.name}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase mb-4 tracking-wider">{team.projectTitle}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 flex-1">{team.description}</p>
                    
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {team.skillsRequired.map(skill => (
                          <span key={skill} className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-100 dark:border-slate-800">{skill}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                           <img src={team.createdBy?.avatar || `https://i.pravatar.cc/32?u=${team.createdBy?.email}`} className="size-6 rounded-full ring-2 ring-white dark:ring-slate-800 shadow-sm" alt="" />
                           <span className="text-[10px] font-bold text-slate-500">{team.createdBy?.fullName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                           <span className="material-symbols-outlined text-[16px]">group</span>
                           <span className="text-xs font-bold">{team.memberCount} member{team.memberCount>1?'s':''} req</span>
                        </div>
                      </div>
                    </div>

                    {!isOwner && team.status === 'active' && (
                      <button
                        onClick={() => handleJoin(team._id)}
                        disabled={isRequested || requestingId === team._id}
                        className={`mt-6 w-full py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${isRequested ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-primary dark:hover:bg-primary shadow-lg shadow-black/10'}`}
                      >
                        {isRequested ? (
                           <><span className="material-symbols-outlined text-[18px]">check</span> Joined</>
                        ) : requestingId === team._id ? (
                           'Sending...'
                        ) : (
                           <><span className="material-symbols-outlined text-[18px]">add_circle</span> Request to Join</>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
