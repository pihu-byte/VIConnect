import { UserPlus, SquarePlus, ShieldCheck } from 'lucide-react';

const steps = [
  {
    num: 1,
    icon: UserPlus,
    title: 'Create Account',
    text: 'Sign up using your VIT email address to ensure a verified and safe community environment.',
    side: 'right',
  },
  {
    num: 2,
    icon: SquarePlus,
    title: 'Post or Join',
    text: 'Create a new ride request or project idea, or browse existing posts to join others with similar needs.',
    side: 'left',
  },
  {
    num: 3,
    icon: ShieldCheck,
    title: 'Connect Safely',
    text: 'Chat within the app to finalize details and meet your new teammates or travel companions on campus.',
    side: 'right',
  },
];

function StepCard({ step }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
      {/* Mobile badge */}
      <div className="flex md:hidden items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
          {step.num}
        </div>
        <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <step.icon className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
      </div>

      <p className="text-slate-500 text-sm leading-relaxed">{step.text}</p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-16">
          How It Works
        </h2>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 hidden md:block" />

          <div className="space-y-12 md:space-y-16">
            {steps.map((step) => (
              <div key={step.num} className="relative">
                {/* Badge on center line - Desktop */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-6 w-10 h-10 rounded-full bg-slate-200 text-slate-700 items-center justify-center font-bold text-sm z-10 shadow-sm">
                  {step.num}
                </div>

                {/* Desktop row layout */}
                <div className="hidden md:grid md:grid-cols-2 md:gap-16">
                  {step.side === 'left' ? (
                    <>
                      <div className="pr-8">
                        <StepCard step={step} />
                      </div>
                      <div />
                    </>
                  ) : (
                    <>
                      <div />
                      <div className="pl-8">
                        <StepCard step={step} />
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile layout */}
                <div className="md:hidden">
                  <StepCard step={step} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
