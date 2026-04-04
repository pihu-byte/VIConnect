import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { name: 'Browse Rides', icon: 'directions_car', path: '/dashboard' },
    { name: 'Post a Ride', icon: 'add_circle', path: '/post-ride' },
    { name: 'Browse Teams', icon: 'groups', path: '/browse-teams' },
    { name: 'Create Team', icon: 'group_add', path: '/create-team' },
    { name: 'Inbox', icon: 'inbox', path: '/inbox' },
  ];

  const bottomNavItems = [
    { name: 'Profile', icon: 'person', path: '/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col fixed h-full z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
          <span className="material-symbols-outlined font-black">hub</span>
        </div>
        <div>
          <h1 className="font-black text-lg leading-none text-slate-900 dark:text-white">VIT Connect</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Campus Hub</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => item.path !== '#' && navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left group ${
              isActive(item.path) && item.path !== '#'
                ? 'bg-primary/5 text-primary'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <span className={`material-symbols-outlined transition-colors ${isActive(item.path) ? 'text-primary' : 'text-slate-400 group-hover:text-primary/70'}`}>{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </button>
        ))}
        <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
          {bottomNavItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left group ${
                isActive(item.path)
                  ? 'bg-primary/5 text-primary'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`material-symbols-outlined transition-colors ${isActive(item.path) ? 'text-primary' : 'text-slate-400 group-hover:text-primary/70'}`}>{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        {currentUser && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-sm">
            <img
              alt="User"
              className="size-10 rounded-full ring-2 ring-primary/20 object-cover shadow-sm"
              src={currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.email}`}
            />
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-black truncate text-slate-900 dark:text-white uppercase">{currentUser.fullName}</p>
              <p className="text-[10px] text-slate-500 truncate font-bold uppercase tracking-widest">{currentUser.department}</p>
            </div>
            <button onClick={onLogout} title="Logout" className="text-slate-400 hover:text-red-500 transition-colors">
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
