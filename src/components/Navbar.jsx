import { useState } from 'react';
import { Asterisk, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Asterisk className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">VIT Connect</span>
          </div>

          {/* Center Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Home</a>
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">How it Works</a>
          </div>

          {/* Right Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button className="px-5 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-full hover:bg-blue-50 transition-colors">
              Login
            </button>
            <button className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-slate-100 mt-2 pt-4 space-y-3">
            <a href="#home" className="block text-sm text-slate-600 hover:text-slate-900 py-1">Home</a>
            <a href="#features" className="block text-sm text-slate-600 hover:text-slate-900 py-1">Features</a>
            <a href="#how-it-works" className="block text-sm text-slate-600 hover:text-slate-900 py-1">How it Works</a>
            <div className="flex items-center gap-4 pt-2">
              <button className="px-5 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-full hover:bg-blue-50 transition-colors">
                Login
              </button>
              <button className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
