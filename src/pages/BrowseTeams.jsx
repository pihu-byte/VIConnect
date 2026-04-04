import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useMissingFields from '../hooks/useMissingFields';

export default function BrowseTeams() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestedIds, setRequestedIds] = useState(new Set());
  const [approvedIds, setApprovedIds] = useState(new Set());
  const [requestingId, setRequestingId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [chatTeam, setChatTeam] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const chatRef = useRef(null);
  const [toast, setToast] = useState('');
  const token = localStorage.getItem('viconnect_token');
  const { missingFields } = useMissingFields();

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
      if (inboxRes.ok) {
        setRequestedIds(new Set((inboxData.outgoing || []).map(r => r.team?._id || r.team)));
        const approved = (inboxData.outgoing || []).filter(r => r.status === 'approved').map(r => r.team?._id || r.team);
        setApprovedIds(new Set(approved));
      }
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

  const handleCompleteTeam = async (teamId) => {
    if (!window.confirm('Mark this team as completed?')) return;
    try {
      const res = await fetch(`/api/teams/${teamId}/complete`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { fetchTeams(); setToast('Team marked as completed.'); setOpenMenuId(null); }
    } catch { setToast('Error occurred.'); }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Delete this team permanently?')) return;
    try {
      const res = await fetch(`/api/teams/${teamId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { fetchTeams(); setToast('Team deleted.'); setOpenMenuId(null); }
    } catch { setToast('Error occurred.'); }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/teams/${editingTeam._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editingTeam),
      });
      if (res.ok) {
        fetchTeams();
        setEditingTeam(null);
        setToast('Team updated.');
      }
    } catch { setToast('Error occurred.'); }
  };

  const openGroupChat = async (team) => {
    setChatTeam(team);
    try {
      const res = await fetch(`/api/team-group-messages/${team._id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setChatMessages(data.messages || []);
    } catch { setToast('Error fetching messages.'); }
  };

  const handleSendGroupMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    try {
      const res = await fetch(`/api/team-group-messages/${chatTeam._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: messageInput })
      });
      const data = await res.json();
      if (res.ok) {
        setChatMessages(prev => [...prev, data.data]);
        setMessageInput('');
        setTimeout(() => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' }), 50);
      }
    } catch { setToast('Could not send message.'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('viconnect_token');
    localStorage.removeItem('viconnect_user');
    navigate('/login', { replace: true });
  };

  if (!currentUser) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 flex min-h-screen">
      <Sidebar currentUser={currentUser} onLogout={handleLogout} missingFields={missingFields} />

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
                const isApproved = approvedIds.has(team._id);
                return (
                  <div key={team._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all p-6 flex flex-col group relative overflow-hidden">
                    <div className="flex items-start justify-between mb-4">
                      <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">rocket</span>
                      </div>
                      {isOwner ? (
                         <div className="flex items-center gap-2">
                           <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase px-2 py-1 rounded-md border border-indigo-100 dark:border-indigo-800">Your Team</span>
                           <div className="relative">
                             <button onClick={() => setOpenMenuId(openMenuId === team._id ? null : team._id)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                               <span className="material-symbols-outlined text-[20px]">more_vert</span>
                             </button>
                             {openMenuId === team._id && (
                               <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 py-2">
                                 <button onClick={() => { setEditingTeam(team); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700">Edit Details</button>
                                 <button onClick={() => handleCompleteTeam(team._id)} className="w-full text-left px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">Mark Completed</button>
                                 <button onClick={() => handleDeleteTeam(team._id)} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Delete Team</button>
                               </div>
                             )}
                           </div>
                         </div>
                      ) : team.status === 'completed' ? (
                         <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase px-2 py-1 rounded-md">Closed</span>
                      ) : (
                         <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800">Recruiting</span>
                      )}
                    </div>
                    <h3 className="text-xl font-black mb-1 group-hover:text-primary transition-colors">{team.name}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase mb-4 tracking-wider">{team.projectTitle}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-1">{team.description}</p>
                    
                    {team.hackathonDate && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-lg p-2.5 mb-4 flex items-center gap-2 text-amber-700 dark:text-amber-400 opacity-90 hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-[16px]">event_star</span>
                        <span className="text-xs font-black uppercase tracking-widest">Hackathon: {new Date(team.hackathonDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    
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

                    {(isOwner || isApproved) && (
                      <button onClick={() => openGroupChat(team)} className="mt-6 w-full py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40">
                         <span className="material-symbols-outlined text-[18px]">forum</span> Team Chat
                      </button>
                    )}

                    {!isOwner && !isApproved && team.status === 'active' && (
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

      {/* Edit Modal */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-black">Edit Team</h3>
              <button onClick={() => setEditingTeam(null)} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="edit-form" onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Team Name</label>
                  <input className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 outline-none" value={editingTeam.name} onChange={e => setEditingTeam({...editingTeam, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                  <textarea className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 outline-none" rows="3" value={editingTeam.description} onChange={e => setEditingTeam({...editingTeam, description: e.target.value})} />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">Hackathon Date</label>
                   <input type="date" className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 outline-none" value={editingTeam.hackathonDate} onChange={e => setEditingTeam({...editingTeam, hackathonDate: e.target.value})} />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 shrink-0">
               <button form="edit-form" type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-black py-3 rounded-xl shadow-lg transition-all">Save Changes</button>
            </div>
          </div>
        </div>
      )}
      {/* Chat Modal */}
      {chatTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col h-[80vh]">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900">
               <div className="flex items-center gap-3">
                 <div className="size-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><span className="material-symbols-outlined">diversity_3</span></div>
                 <div>
                    <h3 className="text-sm font-black leading-tight">{chatTeam.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Group Chat</p>
                 </div>
               </div>
               <button onClick={() => setChatTeam(null)} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={chatRef}>
               {chatMessages.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400">
                   <span className="material-symbols-outlined text-4xl mb-2 opacity-50">chat_bubble</span>
                   <p className="text-sm font-bold">No messages yet. Say hello!</p>
                 </div>
               ) : (
                 chatMessages.map(msg => {
                   const isMe = msg.sender?._id === currentUser.id || msg.sender?._id === currentUser._id;
                   return (
                     <div key={msg._id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                       <img src={msg.sender?.avatar || `https://i.pravatar.cc/32?u=${msg.sender?.email}`} className="size-8 rounded-full shrink-0 mt-1 ring-2 ring-slate-100 dark:ring-slate-800" alt=""/>
                       <div className={`flex flex-col gap-1 max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                         <span className="text-[10px] font-bold text-slate-400">{msg.sender?.fullName}</span>
                         <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-primary text-white rounded-tr-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm'}`}>
                           {msg.text}
                         </div>
                       </div>
                     </div>
                   )
                 })
               )}
            </div>
            <form onSubmit={handleSendGroupMessage} className="p-4 border-t border-slate-100 dark:border-slate-800 shrink-0 flex gap-2 bg-slate-50 dark:bg-slate-900">
              <input value={messageInput} onChange={e => setMessageInput(e.target.value)} placeholder="Type your message..." className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-5 py-3 outline-none text-sm" />
              <button type="submit" disabled={!messageInput.trim()} className="size-12 rounded-full bg-primary text-white flex items-center justify-center shrink-0 disabled:opacity-50 hover:bg-primary/90 transition-colors shadow-lg">
                <span className="material-symbols-outlined text-[20px] ml-1">send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
