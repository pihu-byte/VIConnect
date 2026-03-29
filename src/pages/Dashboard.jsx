import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function VitConnectDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('viconnect_token');
        const userStr = localStorage.getItem('viconnect_user');
        if (!token || !userStr) {
            navigate('/login', { replace: true });
            return;
        }
        try {
            setCurrentUser(JSON.parse(userStr));
        } catch {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('viconnect_token');
        localStorage.removeItem('viconnect_user');
        navigate('/login', { replace: true });
    };

    if (!currentUser) return null;

    const navItems = [
        { name: 'Dashboard', icon: 'dashboard', href: '#' },
        { name: 'Browse Rides', icon: 'directions_car', href: '#' },
        { name: 'Post a Ride', icon: 'add_circle', href: '#' },
        { name: 'Browse Teams', icon: 'groups', href: '#' },
        { name: 'Create Team', icon: 'group_add', href: '#' },
        { name: 'Messages', icon: 'chat_bubble', href: '#' },
    ];

    const bottomNavItems = [
        { name: 'Profile', icon: 'person', href: '#' },
        { name: 'Settings', icon: 'settings', href: '#' },
    ];

    const recentRides = [
        {
            id: 1,
            from: 'Vellore',
            to: 'Chennai',
            time: 'Today, 5:30 PM',
            seats: '3 seats left',
            price: '₹350',
            avatar: 'https://i.pravatar.cc/150?u=rider1',
        },
        {
            id: 2,
            from: 'VIT Campus',
            to: 'Katpadi',
            time: 'Tomorrow, 09:00 AM',
            seats: '1 seat left',
            price: '₹50',
            avatar: 'https://i.pravatar.cc/150?u=rider2',
        },
    ];

    const recentChats = [
        {
            id: 1,
            name: 'Sarah Miller',
            time: '10m ago',
            message: 'Is the ride still available for 5 PM?',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
            online: true,
            highlight: false,
        },
        {
            id: 2,
            name: 'Alex Chen',
            time: '2h ago',
            message: "Let's discuss the Figma designs...",
            avatar: 'https://i.pravatar.cc/150?u=alex',
            online: false,
            highlight: true,
        },
        {
            id: 3,
            name: 'Marcus Lee',
            time: '5h ago',
            message: 'See you at the Tech Park entrance.',
            avatar: 'https://i.pravatar.cc/150?u=marcus',
            online: true,
            highlight: false,
        },
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 flex min-h-screen">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-border-light bg-white dark:bg-slate-900 flex flex-col fixed h-full z-20">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-primary size-10 rounded-xl flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">hub</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-none">VIT Connect</h1>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Campus Hub</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveTab(item.name);
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === item.name
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                                }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span>{item.name}</span>
                        </a>
                    ))}

                    <div className="pt-4 mt-4 border-t border-border-light">
                        {bottomNavItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveTab(item.name);
                                }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === item.name
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span>{item.name}</span>
                            </a>
                        ))}
                    </div>
                </nav>

                <div className="p-4 border-t border-border-light">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 transition-all">
                        <img alt="User Profile" className="size-10 rounded-full" src={`https://i.pravatar.cc/150?u=${currentUser.email}`} />
                        <div className="overflow-hidden flex-1">
                            <p className="text-sm font-bold truncate dark:text-white">{currentUser.fullName}</p>
                            <p className="text-xs text-slate-500 truncate uppercase">{currentUser.department}</p>
                        </div>
                        <button onClick={handleLogout} title="Logout" className="text-slate-400 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 ml-64 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-border-light dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <button className="size-10 rounded-full flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                        <button className="size-10 rounded-full flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
                            <span className="material-symbols-outlined">chat</span>
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <img alt="Avatar" className="size-8 rounded-full border-2 border-transparent group-hover:border-primary transition-all" src="https://i.pravatar.cc/150?u=johndoe" />
                            <span className="material-symbols-outlined text-slate-400">expand_more</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="p-8 space-y-8 bg-background-light dark:bg-background-dark min-h-[calc(100vh-4rem)]">
                    {/* Welcome Card */}
                    <section className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-3xl font-bold mb-2">Welcome back, {currentUser.fullName} 👋</h3>
                                <p className="text-white/80 text-lg max-w-lg">Your campus network is buzzing today. Find a ride home or join a hackathon team in seconds.</p>
                            </div>
                            <div className="flex gap-4">
                                <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined">directions_car</span>
                                    Post a Ride
                                </button>
                                <button className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined">group_add</span>
                                    Create Team
                                </button>
                            </div>
                        </div>
                        {/* Decorative patterns */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                    </section>

                    {/* Quick Actions Grid */}
                    <section>
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border-light dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                <div className="size-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined">local_taxi</span>
                                </div>
                                <h5 className="font-bold text-slate-800 dark:text-white">Post a Ride</h5>
                                <p className="text-sm text-slate-500 mt-1">Share your travel plans</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border-light dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                <div className="size-12 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <h5 className="font-bold text-slate-800 dark:text-white">Find a Ride</h5>
                                <p className="text-sm text-slate-500 mt-1">Book an available seat</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border-light dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                <div className="size-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined">diversity_3</span>
                                </div>
                                <h5 className="font-bold text-slate-800 dark:text-white">Create Team</h5>
                                <p className="text-sm text-slate-500 mt-1">Start a new project</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border-light dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                <div className="size-12 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined">person_add</span>
                                </div>
                                <h5 className="font-bold text-slate-800 dark:text-white">Join Team</h5>
                                <p className="text-sm text-slate-500 mt-1">Browse active vacancies</p>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Columns (Main Content) */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Recent Rides */}
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-lg font-bold text-slate-800 dark:text-white">Recent Ride Posts</h4>
                                    <a className="text-primary text-sm font-semibold hover:underline" href="#">View All</a>
                                </div>
                                <div className="space-y-4">
                                    {recentRides.map((ride) => (
                                        <div key={ride.id} className="bg-white dark:bg-slate-900 border border-border-light dark:border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-full overflow-hidden shrink-0">
                                                    <img alt="Rider" src={ride.avatar} />
                                                </div>
                                                <div>
                                                    <h6 className="font-bold text-slate-800 dark:text-white">{ride.from} <span className="text-slate-400 mx-1">→</span> {ride.to}</h6>
                                                    <p className="text-sm text-slate-500">{ride.time} • {ride.seats}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                                <span className="text-lg font-bold text-primary">{ride.price}</span>
                                                <button className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors w-full sm:w-auto">Join Ride</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Teams Seeking Members */}
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-lg font-bold text-slate-800 dark:text-white">Teams Looking for Members</h4>
                                    <a className="text-primary text-sm font-semibold hover:underline" href="#">Browse All</a>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Team Card 1 */}
                                    <div className="bg-white dark:bg-slate-900 border border-border-light dark:border-slate-800 rounded-2xl p-6 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Dev Jams '24</div>
                                            <div className="flex -space-x-2">
                                                <img alt="Team" className="size-8 rounded-full border-2 border-white dark:border-slate-900" src="https://i.pravatar.cc/150?u=team1" />
                                                <img alt="Team" className="size-8 rounded-full border-2 border-white dark:border-slate-900" src="https://i.pravatar.cc/150?u=team2" />
                                                <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-400">+1</div>
                                            </div>
                                        </div>
                                        <h5 className="font-bold text-slate-800 dark:text-white text-lg mb-2">Algorithm Wizards</h5>
                                        <p className="text-sm text-slate-500 mb-4 flex-1">Building an AI-driven notes organizer. Need a UI/UX Designer &amp; React expert.</p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded text-[10px] font-semibold">React</span>
                                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded text-[10px] font-semibold">Tailwind</span>
                                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded text-[10px] font-semibold">UI/UX</span>
                                        </div>
                                        <button className="w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white py-3 rounded-xl font-bold transition-all">Request to Join</button>
                                    </div>

                                    {/* Team Card 2 */}
                                    <div className="bg-white dark:bg-slate-900 border border-border-light dark:border-slate-800 rounded-2xl p-6 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Smart India Hackathon</div>
                                            <div className="flex -space-x-2">
                                                <img alt="Team" className="size-8 rounded-full border-2 border-white dark:border-slate-900" src="https://i.pravatar.cc/150?u=team3" />
                                                <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-400">+2</div>
                                            </div>
                                        </div>
                                        <h5 className="font-bold text-slate-800 dark:text-white text-lg mb-2">EcoTrack Innovators</h5>
                                        <p className="text-sm text-slate-500 mb-4 flex-1">Smart waste management solution. Looking for Backend developers (Node.js/Django).</p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded text-[10px] font-semibold">Node.js</span>
                                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded text-[10px] font-semibold">IoT</span>
                                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded text-[10px] font-semibold">Python</span>
                                        </div>
                                        <button className="w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white py-3 rounded-xl font-bold transition-all">Request to Join</button>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column (Conversations & Stats) */}
                        <div className="space-y-8">
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-lg font-bold text-slate-800 dark:text-white">Recent Chats</h4>
                                    <span className="material-symbols-outlined text-slate-400 cursor-pointer">more_horiz</span>
                                </div>
                                <div className="bg-white dark:bg-slate-900 border border-border-light dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="divide-y divide-border-light dark:divide-slate-800">
                                        {recentChats.map((chat) => (
                                            <div key={chat.id} className="p-4 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                                <div className="relative shrink-0">
                                                    <img alt="User" className="size-12 rounded-full" src={chat.avatar} />
                                                    {chat.online && (
                                                        <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex justify-between items-baseline">
                                                        <h6 className="font-bold text-slate-800 dark:text-white truncate">{chat.name}</h6>
                                                        <span className="text-[10px] text-slate-400 font-medium">{chat.time}</span>
                                                    </div>
                                                    <p className={`text-sm truncate mt-0.5 ${chat.highlight ? 'font-semibold text-primary' : 'text-slate-500'}`}>
                                                        {chat.message}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-4 text-center text-sm font-bold text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-border-light dark:border-slate-800">
                                        Open All Messages
                                    </button>
                                </div>
                            </section>

                            {/* Campus Updates / Stats */}
                            <section className="bg-secondary p-6 rounded-2xl text-white shadow-lg">
                                <h4 className="font-bold mb-4">Quick Stats</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                        <span className="text-sm font-medium">Active Rides Today</span>
                                        <span className="text-xl font-bold">42</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                        <span className="text-sm font-medium">New Team Requests</span>
                                        <span className="text-xl font-bold">12</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
