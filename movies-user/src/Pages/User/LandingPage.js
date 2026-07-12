import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

const LandingPage = () => {
  const isAuth = Boolean(useSelector(s => s.user?.currentUser));
  if (isAuth) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-surface-950 text-white">
      <nav className="sticky top-0 z-50 py-4 px-6 glass-strong">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-gradient">CN.io</span>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-[#8892b0] no-underline text-sm hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="btn-primary rounded-xl px-4 py-2 text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      <header className="flex items-center justify-center min-h-[85vh] text-center px-6">
        <div className="max-w-[600px]">
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-black mb-5 m-0 leading-tight">
            Stream Without<br /><span className="text-gradient">Limits</span>
          </h1>
          <p className="text-lg text-[#5a6380] mb-8 m-0">Thousands of movies and TV shows. No ads. HD quality. Cancel anytime.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/register" className="btn-primary rounded-xl">Start Free Trial</Link>
            <Link to="/login" className="btn-secondary rounded-xl">Sign In</Link>
          </div>
        </div>
      </header>

      <section className="max-w-[1200px] mx-auto px-6 py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[{ icon: "🎥", title: "HD Streaming", desc: "Crystal-clear on all devices" }, { icon: "📱", title: "Watch Anywhere", desc: "Mobile, tablet, TV, desktop" }, { icon: "❤️", title: "Personalized", desc: "Smart recommendations" }].map(f => (
          <div key={f.title} className="glass rounded-2xl p-8 text-center hover:border-white/15 transition-all">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="text-lg font-bold m-0 mb-1">{f.title}</h3>
            <p className="text-[#5a6380] text-sm m-0">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="py-16 section-divider">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-3 max-sm:grid-cols-1 gap-8 text-center">
          {[{ v: "10K+", l: "Movies" }, { v: "1M+", l: "Users" }, { v: "99.9%", l: "Uptime" }].map(({ v, l }) => (
            <div key={l}><h2 className="text-3xl font-black text-gradient m-0">{v}</h2><span className="text-[#5a6380] text-sm">{l}</span></div>
          ))}
        </div>
      </section>

      <footer className="text-center py-20 px-6">
        <h2 className="text-2xl font-bold mb-5 m-0">Ready to Start?</h2>
        <Link to="/register" className="btn-primary rounded-xl">Create Free Account</Link>
        <p className="text-[#5a6380] text-sm mt-3 m-0">No credit card required</p>
      </footer>
    </div>
  );
};

export default LandingPage;
