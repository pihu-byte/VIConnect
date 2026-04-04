import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useMissingFields from '../hooks/useMissingFields';

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    approved: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    denied: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function InboxPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeType, setActiveType] = useState('rides'); // 'rides' or 'teams'
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  
  const [ridesInbox, setRidesInbox] = useState({ incoming: [], outgoing: [] });
  const [teamsInbox, setTeamsInbox] = useState({ incoming: [], outgoing: [] });
  
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);
  const selectedRef = useRef(null);
  const activeTypeRef = useRef(activeType);
  const token = localStorage.getItem('viconnect_token');
  const { missingFields } = useMissingFields();

  useEffect(() => {
    const userStr = localStorage.getItem('viconnect_user');
    if (!token || !userStr) { navigate('/login', { replace: true }); return; }
    setCurrentUser(JSON.parse(userStr));
    refreshAll();
    const interval = setInterval(refreshAll, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    activeTypeRef.current = activeType;
  }, [activeType]);

  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (selected?.status === 'approved') {
      fetchMessagesNow(selected._id, activeType);
      pollRef.current = setInterval(() => {
        const sel = selectedRef.current;
        const type = activeTypeRef.current;
        if (sel?.status === 'approved') fetchMessagesNow(sel._id, type);
      }, 2000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [selected?._id, selected?.status, activeType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const refreshAll = async () => {
    try {
      const [ridesRes, teamsRes] = await Promise.all([
        fetch('/api/requests/inbox', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/team-requests/inbox', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const ridesData = await ridesRes.json();
      const teamsData = await teamsRes.json();
      
      const inRides = ridesData.incoming || [];
      const outRides = ridesData.outgoing || [];
      const inTeams = teamsData.incoming || [];
      const outTeams = teamsData.outgoing || [];
      
      if (ridesRes.ok) setRidesInbox({ incoming: inRides, outgoing: outRides });
      if (teamsRes.ok) setTeamsInbox({ incoming: inTeams, outgoing: outTeams });
      
      setSelected(prev => {
        if (!prev) return prev;
        const allRides = [...inRides, ...outRides];
        const allTeams = [...inTeams, ...outTeams];
        return allRides.find(r => r._id === prev._id) || allTeams.find(t => t._id === prev._id) || prev;
      });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchMessagesNow = async (requestId, type) => {
    if (!requestId) return;
    const endpoint = type === 'rides' ? `/api/messages/${requestId}` : `/api/team-messages/${requestId}`;
    try {
      const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setMessages(data.messages || []);
    } catch (e) { console.error(e); }
  };

  const fetchMessages = async () => {
    const sel = selectedRef.current;
    const type = activeTypeRef.current;
    if (!sel) return;
    await fetchMessagesNow(sel._id, type);
  };

  const handleAction = async (requestId, status) => {
    setActionLoading(true);
    const endpoint = activeType === 'rides' ? `/api/requests/${requestId}` : `/api/team-requests/${requestId}`;
    try {
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await refreshAll();
        setSelected(prev => prev ? { ...prev, status } : prev);
      }
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selected) return;
    setSending(true);
    const endpoint = activeType === 'rides' ? `/api/messages/${selected._id}` : `/api/team-messages/${selected._id}`;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: newMessage.trim() }),
      });
      const data = await res.json();
      if (res.ok) { 
        setMessages(prev => [...prev, data.data]); 
        setNewMessage(''); 
      }
    } catch (e) { console.error(e); }
    setSending(false);
  };

  const handlePay = async (requestId) => {
    if (!window.confirm('Mark this ride as paid?')) return;
    try {
      const res = await fetch(`/api/requests/${requestId}/pay`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await refreshAll();
        setSelected(prev => ({ ...prev, paymentStatus: 'paid' }));
      }
    } catch { alert('Payment error.'); }
  };

  const selectConversation = (req) => {
    setSelected(req);
    selectedRef.current = req;
    setMessages([]);
    if (req.status === 'approved') fetchMessagesNow(req._id, activeType);
  };

  const handleLogout = () => {
    localStorage.removeItem('viconnect_token');
    localStorage.removeItem('viconnect_user');
    navigate('/login', { replace: true });
  };

  if (!currentUser) return null;
  const currentInbox = activeType === 'rides' ? ridesInbox : teamsInbox;
  const displayList = activeTab === 'received' ? currentInbox.incoming : currentInbox.outgoing;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 flex min-h-screen">
      <Sidebar currentUser={currentUser} onLogout={handleLogout} missingFields={missingFields} />

      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0 relative z-10">
          <div className="flex items-center gap-6">
             <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button onClick={() => { setActiveType('rides'); setSelected(null); }} className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${activeType === 'rides' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'}`}>Rides</button>
                <button onClick={() => { setActiveType('teams'); setSelected(null); }} className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${activeType === 'teams' ? 'bg-white dark:bg-slate-700 text-indigo-500 shadow-sm' : 'text-slate-500'}`}>Teams</button>
             </div>
             <h2 className="text-xl font-bold">{activeType === 'rides' ? 'Ride Requests' : 'Team Requests'}</h2>
          </div>
          <div className="flex bg-slate-50 dark:bg-slate-800 rounded-lg p-1">
             <button onClick={() => { setActiveTab('received'); setSelected(null); }} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'received' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500'}`}>Received</button>
             <button onClick={() => { setActiveTab('sent'); setSelected(null); }} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'sent' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500'}`}>Sent</button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* List Panel */}
          <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[1,2,3,4].map(i => <div key={i} className="h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl animate-pulse" />)}
                </div>
              ) : displayList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center opacity-50">
                  <span className="material-symbols-outlined text-5xl mb-3">{activeType === 'rides' ? 'directions_car' : 'groups'}</span>
                  <p className="font-bold text-sm uppercase">Empty Inbox</p>
                </div>
              ) : (
                displayList.map(req => {
                  const otherUser = activeTab === 'received' ? req.requestedBy : (activeType === 'rides' ? req.ride?.createdBy : req.team?.createdBy);
                  const isSelected = selected?._id === req._id;
                  const title = activeType === 'rides' ? `${req.ride?.from} → ${req.ride?.destination}` : (req.team?.name || 'Deleted Team');
                  return (
                    <div
                      key={req._id}
                      onClick={() => selectConversation(req)}
                      className={`p-5 border-b border-slate-50 dark:border-slate-800 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${isSelected ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-l-primary shadow-inner' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <img src={otherUser?.avatar || `https://i.pravatar.cc/40?u=${otherUser?.email}`} alt="" className="size-10 rounded-full shrink-0 border border-slate-100" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-bold text-sm truncate">{otherUser?.fullName}</span>
                            <StatusBadge status={req.status} />
                          </div>
                          <p className={`text-[10px] font-black uppercase truncate ${isSelected ? 'text-primary' : 'text-slate-500'}`}>{title}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-bold">{new Date(req.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat/Detail Panel */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center opacity-30 select-none">
                <div className="text-center">
                  <div className="size-24 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <span className="material-symbols-outlined text-6xl">chat_bubble</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-widest">Select to start</h3>
                </div>
              </div>
            ) : (
              <>
                {/* Panel Header */}
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between shadow-sm shrink-0">
                  <div className="flex items-center gap-4">
                    <img src={(activeTab === 'received' ? selected.requestedBy?.avatar : (activeType === 'rides' ? selected.ride?.createdBy?.avatar : selected.team?.createdBy?.avatar)) || `https://i.pravatar.cc/40?u=${activeTab === 'received' ? selected.requestedBy?.email : (activeType === 'rides' ? selected.ride?.createdBy?.email : selected.team?.createdBy?.email)}`} alt="" className="size-10 rounded-full" />
                    <div>
                      <h3 className="font-black text-slate-800 dark:text-white leading-none">
                        {activeTab === 'received' ? selected.requestedBy?.fullName : (activeType === 'rides' ? selected.ride?.createdBy?.fullName : selected.team?.createdBy?.fullName)}
                      </h3>
                      <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">
                        {activeType === 'rides' ? `${selected.ride?.from} → ${selected.ride?.destination} @ ₹${selected.ride?.fare}` : `${selected.team?.name} — ${selected.team?.projectTitle}`}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto flex flex-col">
                  {/* Status Center Banner */}
                  {selected.status === 'pending' && (
                    <div className="flex-1 flex items-center justify-center p-10">
                       <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-2xl border border-slate-100 dark:border-slate-800 text-center max-w-sm w-full">
                          <div className="size-20 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                             <span className="material-symbols-outlined text-4xl text-amber-500">hourglass_top</span>
                          </div>
                          {activeTab === 'received' ? (
                             <>
                                <h4 className="text-xl font-black mb-2">Incoming Request</h4>
                                <p className="text-sm text-slate-500 mb-8 font-medium">Review this request based on their profile and message.</p>
                                <div className="flex gap-4">
                                   <button onClick={() => handleAction(selected._id, 'denied')} disabled={actionLoading} className="flex-1 py-3 text-red-600 font-black uppercase text-xs hover:bg-red-50 rounded-xl transition-all">Deny</button>
                                   <button onClick={() => handleAction(selected._id, 'approved')} disabled={actionLoading} className="flex-1 py-3 bg-primary text-white font-black uppercase text-xs rounded-xl shadow-lg shadow-primary/30 hover:scale-105 transition-all">Approve</button>
                                </div>
                             </>
                          ) : (
                             <>
                                <h4 className="text-xl font-black mb-2">Request Shared</h4>
                                <p className="text-sm text-slate-500 font-medium">Wait for the owner's approval. You'll be notified here.</p>
                             </>
                          )}
                       </div>
                    </div>
                  )}

                  {selected.status === 'denied' && (
                    <div className="flex-1 flex items-center justify-center opacity-50 p-10">
                       <div className="text-center">
                          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">cancel</span>
                          <h4 className="text-xl font-black uppercase">Request Closed</h4>
                       </div>
                    </div>
                  )}

                  {selected.status === 'approved' && (
                    <>
                      {/* Approved Info Strip */}
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 px-8 py-3 border-b border-emerald-100 dark:border-emerald-800/20 flex items-center justify-between shrink-0">
                         <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                            <span className="material-symbols-outlined text-[18px]">check_circle</span> Approved · Collaboration active
                         </div>
                         {activeType === 'rides' && activeTab === 'sent' && selected.paymentStatus === 'pending' && (
                           <button onClick={() => handlePay(selected._id)} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-emerald-700 shadow-md">
                             <span className="material-symbols-outlined text-[14px] align-middle mr-1">payments</span> Pay ₹{selected.ride?.fare}
                           </button>
                         )}
                         {activeType === 'rides' && selected.paymentStatus === 'paid' && (
                           <span className="text-[10px] font-black uppercase text-emerald-600 bg-white px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm">
                             <span className="material-symbols-outlined text-[14px] align-middle mr-1 text-emerald-500">done_all</span> Paid
                           </span>
                         )}
                      </div>

                      {/* Messages Area */}
                      <div className="flex-1 p-8 space-y-4">
                        {messages.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center opacity-20 italic font-bold">No messages yet. Say hi!</div>
                        ) : (
                          messages.map(msg => {
                            const isMe = msg.sender?._id === currentUser.id || msg.sender?._id === currentUser._id;
                            return (
                              <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] group relative ${isMe ? 'bg-primary text-white rounded-2xl rounded-tr-none shadow-xl shadow-primary/10' : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-none shadow-lg shadow-slate-200/50 dark:shadow-none'}`}>
                                   <div className="px-5 py-3 py-4">
                                      <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                                      <p className={`text-[9px] font-black uppercase mt-2 text-right opacity-60`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                   </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Chat Input */}
                      <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-6 shrink-0">
                        <div className="flex gap-4 items-center max-w-4xl mx-auto">
                           <input
                              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-medium focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                              placeholder="Type your message..."
                              value={newMessage}
                              onChange={e => setNewMessage(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                           />
                           <button
                              onClick={handleSend}
                              disabled={sending || !newMessage.trim()}
                              className="size-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center shadow-xl hover:bg-primary dark:hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:scale-100 hover:scale-110 active:scale-95"
                           >
                              <span className="material-symbols-outlined font-black">send</span>
                           </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
