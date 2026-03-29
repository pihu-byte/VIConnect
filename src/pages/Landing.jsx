import React from 'react';
import { Link } from 'react-router-dom';

export default function VitConnectLanding() {
    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col overflow-x-hidden">
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
                    <div className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-3xl font-bold">hub</span>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">VIT Connect</h2>
                    </div>
                    <nav className="hidden md:flex flex-1 justify-center gap-10">
                        <a className="text-sm font-semibold text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors" href="#">Home</a>
                        <a className="text-sm font-semibold text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors" href="#features">Features</a>
                        <a className="text-sm font-semibold text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors" href="#how-it-works">How It Works</a>
                    </nav>
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="hidden sm:flex min-w-[100px] items-center justify-center rounded-lg border-2 border-primary/20 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10 transition-all">
                            Login
                        </Link>
                        <Link to="/register" className="flex min-w-[100px] items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all">
                            Register
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <section className="relative px-6 py-16 lg:px-10 lg:py-24">
                    <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div className="flex flex-col gap-8 text-left">
                            <div className="space-y-4">
                                <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white md:text-6xl">
                                    Connect, Share Rides, and Build <span className="text-primary">Hackathon Teams</span> at VIT
                                </h1>
                                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
                                    A smart campus platform where VIT students can share cab rides, find teammates for hackathons, and connect safely with verified peers.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/register" className="flex h-12 min-w-[160px] items-center justify-center rounded-xl bg-primary px-6 text-base font-bold text-white shadow-xl shadow-primary/30 hover:scale-105 transition-transform">
                                    Get Started
                                </Link>
                                <Link to="/rides" className="flex h-12 min-w-[160px] items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 px-6 text-base font-bold text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                                    Explore Rides
                                </Link>
                            </div>
                        </div>
                        <div className="relative aspect-square md:aspect-video lg:aspect-square w-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-indigo-accent/10 flex items-center justify-center">
                            <img alt="Students collaborating" className="h-full w-full object-cover mix-blend-overlay opacity-80" data-alt="Modern illustration of students working on laptops and traveling" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-indigo-accent/20"></div>
                            <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-white/90 dark:bg-slate-900/90 p-6 backdrop-blur-sm shadow-xl">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">verified</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">Verified Students Only</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Join 5000+ active VITians today</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white dark:bg-slate-900/50 py-20 px-6 lg:px-10" id="features">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 max-w-2xl">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white md:text-4xl">Everything You Need to Connect on Campus</h2>
                            <p className="mt-4 text-slate-600 dark:text-slate-400">Designed specifically for the VIT community to streamline campus life and foster innovation.</p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="group flex flex-col gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl">directions_car</span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ride Sharing</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Share cab rides to and from campus. Split costs with fellow students heading to the airport or railway station.</p>
                                </div>
                            </div>
                            <div className="group flex flex-col gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl">groups</span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Hackathon Team Builder</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Find the perfect teammates for your next big project. Filter by skills, department, and experience levels.</p>
                                </div>
                            </div>
                            <div className="group flex flex-col gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl">chat</span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Secure Chat</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Communicate safely with verified students. Plan your rides or projects without sharing personal contact info.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 px-6 lg:px-10" id="how-it-works">
                    <div className="mx-auto max-w-7xl">
                        <h2 className="mb-12 text-3xl font-black text-slate-900 dark:text-white">How It Works</h2>
                        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">

                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    1
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-lg">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="material-symbols-outlined text-primary">person_add</span>
                                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">Create Account</h4>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400">Sign up using your VIT email address to ensure a verified and safe community environment.</p>
                                </div>
                            </div>

                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    2
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-lg">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="material-symbols-outlined text-primary">add_box</span>
                                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">Post or Join</h4>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400">Create a new ride request or project idea, or browse existing posts to join others with similar needs.</p>
                                </div>
                            </div>

                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    3
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-lg">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="material-symbols-outlined text-primary">shield</span>
                                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">Connect Safely</h4>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400">Chat within the app to finalize details and meet your new teammates or travel companions on campus.</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                <section className="py-20 px-6 lg:px-10 bg-primary/5">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-3xl">savings</span>
                                </div>
                                <h5 className="font-bold text-slate-900 dark:text-white">Reduce Travel Costs</h5>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Save up to 75% on cab fares by splitting with 3 other students.</p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-3xl">psychology</span>
                                </div>
                                <h5 className="font-bold text-slate-900 dark:text-white">Meet Similar Interests</h5>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Network with peers who share your academic or creative passions.</p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-3xl">construction</span>
                                </div>
                                <h5 className="font-bold text-slate-900 dark:text-white">Build Teams</h5>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Form diverse teams with developers, designers, and managers.</p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-3xl">lock</span>
                                </div>
                                <h5 className="font-bold text-slate-900 dark:text-white">Protect Privacy</h5>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Encrypted messaging ensures your private data stays private.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-6 py-20 lg:px-10">
                    <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-gradient-to-br from-primary to-indigo-accent p-12 text-center text-white shadow-2xl shadow-primary/40">
                        <h2 className="text-3xl font-black md:text-5xl mb-6">Start Connecting with VIT Students Today</h2>
                        <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">Join the fastest-growing student community at VIT. Whether you're heading home or building the next unicorn, we've got you covered.</p>
                        <Link to="/register" className="inline-flex h-14 min-w-[200px] items-center justify-center rounded-2xl bg-white px-8 text-lg font-black text-primary hover:bg-slate-50 transition-colors shadow-lg">
                            Join VIT Connect
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="bg-slate-900 py-16 px-6 lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between gap-12 border-b border-slate-800 pb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-white">
                                <span className="material-symbols-outlined text-3xl text-primary">hub</span>
                                <h2 className="text-xl font-bold tracking-tight">VIT Connect</h2>
                            </div>
                            <p className="text-slate-400 max-w-xs">Building a stronger, more connected community for VITians worldwide.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-16">
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-white/50">Platform</h4>
                                <ul className="space-y-2">
                                    <li><a className="text-slate-400 hover:text-white transition-colors" href="#features">Features</a></li>
                                    <li><a className="text-slate-400 hover:text-white transition-colors" href="#how-it-works">How It Works</a></li>
                                    <li><a className="text-slate-400 hover:text-white transition-colors" href="#">Safety</a></li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-white/50">Account</h4>
                                <ul className="space-y-2">
                                    <li><Link className="text-slate-400 hover:text-white transition-colors" to="/login">Login</Link></li>
                                    <li><Link className="text-slate-400 hover:text-white transition-colors" to="/register">Register</Link></li>
                                    <li><a className="text-slate-400 hover:text-white transition-colors" href="#">Profile</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">© 2026 VIT Connect. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a className="text-slate-500 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">social_leaderboard</span></a>
                            <a className="text-slate-500 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">terminal</span></a>
                            <a className="text-slate-500 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
