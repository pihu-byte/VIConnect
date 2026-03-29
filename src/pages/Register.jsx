import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function VitConnectRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        registrationNumber: '',
        email: '',
        department: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(''); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Registration failed. Please try again.');
                setLoading(false);
                return;
            }

            // Save token and user info
            localStorage.setItem('viconnect_token', data.token);
            localStorage.setItem('viconnect_user', JSON.stringify(data.user));

            navigate('/dashboard');
        } catch (err) {
            setError('Cannot connect to server. Make sure the backend is running.');
            setLoading(false);
        }
    };

    return (
        <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-0 m-0">
            <div className="flex flex-col lg:flex-row w-full min-h-screen">
                {/* Left Side */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/90 to-primary items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10"><span className="material-symbols-outlined text-[120px] text-white">groups</span></div>
                        <div className="absolute bottom-20 right-10"><span className="material-symbols-outlined text-[150px] text-white">rocket_launch</span></div>
                        <div className="absolute top-1/2 left-1/4"><span className="material-symbols-outlined text-[80px] text-white">code</span></div>
                    </div>
                    <div className="relative z-10 max-w-lg text-white">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-white p-2 rounded-lg">
                                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor" fillRule="evenodd"></path>
                                </svg>
                            </div>
                            <span className="text-2xl font-bold tracking-tight">VIT Connect</span>
                        </div>
                        <h1 className="text-5xl font-black leading-tight mb-6">Join VIT Connect</h1>
                        <p className="text-xl text-blue-50 leading-relaxed mb-8 opacity-90">
                            Create your account and start connecting with VIT students. Build teams, find mentors, and collaborate on projects.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                                <span className="material-symbols-outlined text-sm">handshake</span>
                                <span className="text-sm font-medium">Team Building</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                                <span className="material-symbols-outlined text-sm">terminal</span>
                                <span className="text-sm font-medium">Hackathons</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                                <span className="material-symbols-outlined text-sm">lightbulb</span>
                                <span className="text-sm font-medium">Innovation</span>
                            </div>
                        </div>
                        <div className="mt-12 rounded-xl overflow-hidden shadow-2xl border border-white/20">
                            <img className="w-full h-64 object-cover" alt="Students collaborating together in a modern workspace" src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop" />
                        </div>
                    </div>
                </div>

                {/* Right Side — Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-20">
                    <div className="w-full max-w-xl bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800">
                        <div className="mb-8">
                            <div className="lg:hidden flex items-center gap-2 mb-6 text-primary">
                                <span className="material-symbols-outlined">hub</span>
                                <span className="font-bold">VIT Connect</span>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Create an Account</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Enter your details to get started with the community</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-400">
                                <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">error</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                                    <input
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary px-4 py-3 outline-none transition-all"
                                        placeholder="John Doe"
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Registration Number</label>
                                    <input
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary px-4 py-3 outline-none transition-all"
                                        placeholder="22BCE1234"
                                        type="text"
                                        name="registrationNumber"
                                        value={formData.registrationNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                                <input
                                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary px-4 py-3 outline-none transition-all"
                                    placeholder="yourname@vitstudent.ac.in"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Department</label>
                                <select
                                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary px-4 py-3 outline-none transition-all"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    <option value="cse">Computer Science &amp; Engineering (CSE)</option>
                                    <option value="it">Information Technology (IT)</option>
                                    <option value="ece">Electronics &amp; Communication (ECE)</option>
                                    <option value="eee">Electrical &amp; Electronics (EEE)</option>
                                    <option value="mech">Mechanical Engineering</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                    <input
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary px-4 py-3 outline-none transition-all"
                                        placeholder="Min. 6 characters"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
                                    <input
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary px-4 py-3 outline-none transition-all"
                                        placeholder="••••••••"
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                            </svg>
                                            <span>Creating Account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Create Account</span>
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-600 dark:text-slate-400">
                                Already have an account?
                                <Link to="/login" className="text-primary font-bold hover:underline ml-1">Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
