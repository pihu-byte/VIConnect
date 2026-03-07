import { CheckCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="bg-slate-50 pt-12 pb-16 lg:pt-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Connect, Share Rides, and Build{' '}
              <span className="text-blue-600">Hackathon Teams</span>
              <br />at VIT
            </h1>

            <p className="text-base text-slate-500 leading-relaxed max-w-md">
              A smart campus platform where VIT students can share cab rides, find teammates for hackathons, and connect safely with verified peers.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                Get Started
              </button>
              <button className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors">
                Explore Rides
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Illustration Card */}
            <div className="relative w-full max-w-sm lg:max-w-md aspect-square rounded-2xl bg-gradient-to-br from-blue-100 via-blue-200/80 to-indigo-200 overflow-hidden shadow-lg">
              {/* Subtle glow effects */}
              <div className="absolute inset-0">
                <div className="absolute top-6 right-6 w-32 h-32 rounded-full bg-blue-300/30 blur-2xl" />
                <div className="absolute bottom-16 left-6 w-24 h-24 rounded-full bg-indigo-300/30 blur-xl" />
              </div>

              {/* Student Illustration */}
              <div className="absolute inset-0 flex items-center justify-center pt-4">
                <div className="relative">
                  {/* Desk/workspace lines */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-px bg-white/40" />

                  {/* Student figures */}
                  <div className="flex items-end gap-5">
                    {/* Student 1 */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-white/50 mb-1" />
                      <div className="w-14 h-20 rounded-t-lg bg-white/30" />
                      {/* Laptop */}
                      <div className="w-16 h-2 rounded bg-white/40 -mt-1" />
                    </div>
                    {/* Student 2 */}
                    <div className="flex flex-col items-center -mb-2">
                      <div className="w-10 h-10 rounded-full bg-white/50 mb-1" />
                      <div className="w-14 h-24 rounded-t-lg bg-white/30" />
                      {/* Laptop */}
                      <div className="w-16 h-2 rounded bg-white/40 -mt-1" />
                    </div>
                    {/* Student 3 */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-white/50 mb-1" />
                      <div className="w-14 h-20 rounded-t-lg bg-white/30" />
                      {/* Laptop */}
                      <div className="w-16 h-2 rounded bg-white/40 -mt-1" />
                    </div>
                  </div>

                  {/* Floating UI elements */}
                  <div className="absolute -top-4 -right-4 w-12 h-8 rounded bg-white/40 shadow-sm" />
                  <div className="absolute -top-8 left-4 w-10 h-6 rounded bg-white/30" />
                </div>
              </div>

              {/* Badge Card */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-tight">Verified Students Only</p>
                  <p className="text-xs text-slate-500">Join 5000+ active VITians today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
