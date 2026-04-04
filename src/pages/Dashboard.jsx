import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useMissingFields from '../hooks/useMissingFields';

const departmentLabel = { cse: 'CSE', it: 'IT', ece: 'ECE', eee: 'EEE', mech: 'Mech' };
const genderIcon = { both: 'people', male: 'man', female: 'woman' };
const genderLabel = { both: 'All', male: 'Male Only', female: 'Female Only' };

export default function VitConnectDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [rides, setRides] = useState([]);
  const [inboxPreview, setInboxPreview] = useState([]);
  const [requestedIds, setRequestedIds] = useState(new Set());
  const [requestingId, setRequestingId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('viconnect_token');
  const { missingFields } = useMissingFields();

  useEffect(() => {
    const userStr = localStorage.getItem('viconnect_user');
    if (!token || !userStr) { navigate('/login', { replace: true }); return; }
    const user = JSON.parse(userStr);
    setCurrentUser(user);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ridesRes, inboxRes] = await Promise.all([
        fetch('/api/rides', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/requests/inbox', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const ridesData = await ridesRes.json();
      const inboxData = await inboxRes.json();
      
      // Filter only active rides
      setRides((ridesData.rides || []).filter(r => r.status === 'active'));
      
      const myOutgoing = inboxData.outgoing || [];
      setRequestedIds(new Set(myOutgoing.map(r => r.ride?._id)));
      
      const preview = [
        ...(inboxData.incoming || []).map(r => ({ ...r, type: 'received' })),
        ...(myOutgoing).map(r => ({ ...r, type: 'sent' })),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
      setInboxPreview(preview);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };

  const handleRequest = async (rideId) => {
    setRequestingId(rideId);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rideId }),
      });
      const data = await res.json();
      if (res.ok) {
        setRequestedIds(prev => new Set([...prev, rideId]));
        showToast('✓ Request sent! Check your Inbox.');
      } else {
        showToast(data.message || 'Could not send request.');
      }
    } catch { showToast('Connection error.'); }
    setRequestingId(null);
  };

  const handleCompleteRide = async (rideId) => {
    if (!window.confirm('Mark this ride as done? This will initiate payments from passengers.')) return;
    try {
      const res = await fetch(`/api/rides/${rideId}/complete`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('✓ Ride completed! Payments requested.');
        fetchData();
      }
    } catch { showToast('Error completing ride.'); }
  };

  const handleDeleteRide = async (rideId) => {
    if (!window.confirm('Delete this ride? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/rides/${rideId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('✓ Ride deleted.');
        fetchData();
      }
    } catch { showToast('Error deleting ride.'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('viconnect_token');
    localStorage.removeItem('viconnect_user');
    navigate('/login', { replace: true });
  };

  const getRideButton = (ride) => {
    const isOwn = ride.createdBy?._id === currentUser?.id || ride.createdBy?._id === currentUser?._id;
    if (isOwn) {
      return (
        <div className="flex gap-2">
           <button onClick={() => handleCompleteRide(ride._id)} className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20" title="Mark as Done">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
           </button>
           <button onClick={() => handleDeleteRide(ride._id)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all shadow-md shadow-red-500/20" title="Delete">
              <span className="material-symbols-outlined text-[20px]">delete</span>
           </button>
        </div>
      );
    }
    const genderMismatch = ride.genderCategory !== 'both' && currentUser?.gender && currentUser.gender !== ride.genderCategory;
    if (genderMismatch) return <span className="px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg">Not Eligible</span>;
    if (requestedIds.has(ride._id)) return <span className="px-4 py-2 text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check</span>Requested</span>;
    return (
      <button
        onClick={() => handleRequest(ride._id)}
        disabled={requestingId === ride._id}
        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all shadow-sm disabled:opacity-60 whitespace-nowrap"
      >
        {requestingId === ride._id ? 'Sending...' : 'Request to Join'}
      </button>
    );
  };

  if (!currentUser) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 flex min-h-screen">
      <Sidebar currentUser={currentUser} onLogout={handleLogout} missingFields={missingFields} />

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-2 transition-all">
          <span className="material-symbols-outlined text-[18px]">info</span>{toastMsg}
        </div>
      )}

      <div className="flex-1 ml-64 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Dashboard</h2>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/inbox')} className="relative size-10 rounded-xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              {inboxPreview.filter(r => r.type === 'received' && r.status === 'pending').length > 0 && (
                <span className="absolute top-1 right-1 size-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
              )}
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/profile')}>
              <div className="relative">
                <img alt="Avatar" className="size-9 rounded-full ring-2 ring-primary/20 object-cover" src={currentUser.avatar || `https://i.pravatar.cc/50?u=${currentUser.email}`} />
                {missingFields.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 size-3 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                )}
              </div>
              <div className="hidden sm:block">
                 <p className="text-xs font-black uppercase leading-none">{currentUser.fullName}</p>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{currentUser.department}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 space-y-10 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-4rem)]">
          {/* Welcome Banner */}
          <section className="bg-gradient-to-br from-primary via-indigo-600 to-violet-700 rounded-3xl p-10 text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl animate-pulse" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <h3 className="text-4xl font-black mb-3">Hello, {currentUser.fullName.split(' ')[0]}! 🚀</h3>
                <p className="text-white/80 text-lg max-w-xl font-medium leading-relaxed">Ready to build something amazing or find a ride? Your campus network is at your fingertips.</p>
              </div>
              <div className="flex flex-wrap gap-4 shrink-0">
                <button onClick={() => navigate('/post-ride')} className="bg-white text-primary px-8 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center gap-2 shadow-xl shadow-black/10">
                  <span className="material-symbols-outlined">directions_car</span> Share a Ride
                </button>
                <button onClick={() => navigate('/create-team')} className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-2xl font-black hover:bg-white/30 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined">rocket_launch</span> Start a Team
                </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Rides Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                   <span className="material-symbols-outlined text-primary">explore</span>
                   Available Rides
                </h4>
                <div className="flex gap-2">
                   <button className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400"><span className="material-symbols-outlined text-[20px]">filter_list</span></button>
                   <span className="bg-primary/10 text-primary text-[10px] font-black uppercase px-2.5 py-1.5 rounded-full">{rides.length} Active</span>
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />)}
                </div>
              ) : rides.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-16 text-center">
                  <div className="size-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl text-slate-300">no_crash</span>
                  </div>
                  <h5 className="font-black text-slate-600 dark:text-slate-400 text-lg mb-2">Silence on the road...</h5>
                  <p className="text-sm text-slate-500 mb-8 max-w-xs mx-auto">Nobody has posted a ride recently. Why don't you offer one?</p>
                  <button onClick={() => navigate('/post-ride')} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-3.5 rounded-2xl font-black hover:bg-primary dark:hover:bg-primary hover:text-white transition-all shadow-xl">
                    Post a Ride
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {rides.sort((a,b) => (a.createdBy._id === currentUser.id ? -1 : 1)).map(ride => (
                    <div key={ride._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-2xl hover:border-primary/30 transition-all group overflow-hidden relative">
                      {ride.status === 'completed' && <div className="absolute top-0 right-0 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl">Completed</div>}
                      <div className="flex items-center gap-5 flex-1 min-w-0">
                        <div className="relative">
                           <img alt="Rider" src={ride.createdBy?.avatar || `https://i.pravatar.cc/48?u=${ride.createdBy?.email}`} className="size-14 rounded-full ring-2 ring-primary/10 object-cover shrink-0" />
                           {ride.createdBy?._id === currentUser.id && <span className="absolute -bottom-1 -right-1 bg-primary text-white size-5 rounded-full flex items-center justify-center text-[10px] ring-2 ring-white">ME</span>}
                        </div>
                        <div className="min-w-0">
                          <h6 className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-lg">
                            <span className="truncate">{ride.from}</span>
                            <span className="material-symbols-outlined text-primary text-[20px] font-black group-hover:translate-x-1 transition-transform">trending_flat</span>
                            <span className="truncate font-black text-primary">{ride.destination}</span>
                          </h6>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                             <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
                               <span className="material-symbols-outlined text-[14px]">calendar_today</span> {ride.date}
                             </p>
                             <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
                               <span className="material-symbols-outlined text-[14px]">schedule</span> {ride.time}
                             </p>
                             <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
                               <span className="material-symbols-outlined text-[14px]">person</span> {ride.createdBy?.fullName}
                             </p>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <span className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                              <span className="material-symbols-outlined text-[14px]">{genderIcon[ride.genderCategory]}</span>
                              {genderLabel[ride.genderCategory]}
                            </span>
                            <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">{departmentLabel[ride.createdBy?.department] || ride.createdBy?.department}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-50 dark:border-slate-800 pt-4 sm:pt-0">
                        <div className="text-right">
                           <p className="text-xs text-slate-400 font-bold uppercase leading-none mb-1">Fare</p>
                           <span className="text-2xl font-black text-primary">₹{ride.fare}</span>
                        </div>
                        {getRideButton(ride)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inbox Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-black text-slate-800 dark:text-white">Recent Activity</h4>
                <button onClick={() => navigate('/inbox')} className="text-primary text-xs font-black uppercase tracking-widest hover:underline">View All</button>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
                {inboxPreview.length === 0 ? (
                  <div className="p-10 text-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl block mb-3 opacity-30">notification_important</span>
                    <p className="text-sm font-bold">No updates yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    {inboxPreview.map(req => {
                      const name = req.type === 'received' ? req.requestedBy?.fullName : req.ride?.createdBy?.fullName;
                      const statusColors = { pending: 'text-amber-500', approved: 'text-emerald-500', denied: 'text-red-500' };
                      return (
                        <div key={req._id} onClick={() => navigate('/inbox')} className="p-5 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group">
                          <img src={ (req.type === 'received' ? req.requestedBy?.avatar : req.ride?.createdBy?.avatar) || `https://i.pravatar.cc/40?u=${req.type === 'received' ? req.requestedBy?.email : req.ride?.createdBy?.email}`} alt="" className="size-10 rounded-full shrink-0 group-hover:scale-110 transition-transform" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-sm font-black text-slate-800 dark:text-white truncate">{name}</p>
                              <span className={`text-[10px] font-black uppercase ${statusColors[req.status]}`}>{req.status}</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">{req.ride?.from} → {req.ride?.destination}</p>
                            <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider">{req.type === 'received' ? 'Request to join' : 'Your request'}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <button onClick={() => navigate('/inbox')} className="w-full py-4 text-center text-xs font-black uppercase tracking-widest text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-50 dark:border-slate-800">
                  Open Inbox
                </button>
              </div>

              {/* Browse Teams Link Card */}
              <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl shadow-indigo-500/30">
                <span className="material-symbols-outlined text-4xl mb-4 font-black">diversity_3</span>
                <h4 className="text-2xl font-black mb-2">Build a Team</h4>
                <p className="text-white/70 text-sm mb-6 font-medium leading-relaxed">Collaborate on hackathons, final year projects, or hobby experiments.</p>
                <button onClick={() => navigate('/browse-teams')} className="w-full bg-white text-indigo-700 py-3 rounded-xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Browse Teams
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
