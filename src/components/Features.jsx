import { Car, Users, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: Car,
    title: 'Ride Sharing',
    text: 'Share cab rides to and from campus. Split costs with fellow students heading to the airport or railway station.',
  },
  {
    icon: Users,
    title: 'Hackathon Team Builder',
    text: 'Find the perfect teammates for your next big project. Filter by skills, department, and experience levels.',
  },
  {
    icon: MessageSquare,
    title: 'Secure Chat',
    text: 'Communicate safely with verified students. Plan your rides or projects without sharing personal contact info.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - LEFT ALIGNED per reference */}
        <div className="max-w-xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Everything You Need to Connect on Campus
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            Designed specifically for the VIT community to streamline campus life and foster innovation.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <f.icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
