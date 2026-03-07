import { PiggyBank, Target, Wrench, Lock } from 'lucide-react';

const benefits = [
  {
    icon: PiggyBank,
    title: 'Reduce Travel Costs',
    text: 'Save up to 75% on cab fares by splitting with 3 other students.',
  },
  {
    icon: Target,
    title: 'Meet Similar Interests',
    text: 'Network with peers who share your academic or creative passions.',
  },
  {
    icon: Wrench,
    title: 'Build Teams',
    text: 'Form diverse teams with developers, designers, and managers.',
  },
  {
    icon: Lock,
    title: 'Protect Privacy',
    text: 'Encrypted messaging ensures your private data stays private.',
  },
];

export default function Benefits() {
  return (
    <section className="py-20 bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b) => (
            <div key={b.title} className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                <b.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{b.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
