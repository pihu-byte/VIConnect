import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Benefits />
      <CTA />
      <Footer />
    </div>
  );
}
