import { Link } from "react-router-dom";
import Footer from "../../Components/Footer";
import { useScrollReveal } from "../../Utils/useScrollReveal";

const features = [
  {
    title: "Vast Library",
    desc: "Thousands of movies and shows across every genre — from blockbusters to indie gems.",
    img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop",
    icon: "🎬",
  },
  {
    title: "4K Streaming",
    desc: "Cinematic quality with adaptive bitrate. Looks stunning on any screen.",
    img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=400&fit=crop",
    icon: "✨",
  },
  {
    title: "Smart Picks",
    desc: "Our algorithm learns what you love and surfaces hidden gems just for you.",
    img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=400&fit=crop",
    icon: "🎯",
  },
  {
    title: "Watch Anywhere",
    desc: "Seamless experience across TV, phone, tablet, and laptop. Pick up where you left off.",
    img: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&h=400&fit=crop",
    icon: "📱",
  },
];

const stats = [
  { value: "10K+", label: "Movies & Shows" },
  { value: "1M+", label: "Happy Users" },
  { value: "4K", label: "Ultra HD" },
  { value: "99.9%", label: "Uptime" },
];

const AboutUs = () => {
  const heroRef = useScrollReveal({ threshold: 0.1 });
  const statsRef = useScrollReveal({ threshold: 0.2 });
  const ctaRef = useScrollReveal({ threshold: 0.15 });

  return (
    <div className="min-h-screen bg-surface-950 text-white">
      {/* Hero - full viewport cover */}
      <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=1080&fit=crop"
          alt="Cinema"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          style={{ animation: 'heroZoom 20s ease-in-out infinite alternate' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-950/80 to-transparent" />

        {/* Floating glow accents */}
        <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] bg-brand-500/10 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-accent-500/8 blur-[120px] pointer-events-none" />

        <div ref={heroRef} className="reveal relative z-10 max-w-[1200px] mx-auto px-6 pb-20 w-full">
          <p className="text-gradient text-sm font-semibold uppercase tracking-[0.2em] mb-4 m-0">About Us</p>
          <h1 className="text-[clamp(2.8rem,6vw,5rem)] font-black leading-[0.9] m-0 mb-5 tracking-tight">
            Stream Without<br />Limits
          </h1>
          <p className="text-lg text-[#8892b0] max-w-[500px] leading-relaxed m-0 mb-8">
            Your ultimate destination for movies, TV shows, and exclusive originals — all in stunning quality.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/register" className="btn-primary inline-flex rounded-xl !px-8 !py-3.5">
              Start Watching
            </Link>
            <Link to="/movies" className="btn-secondary inline-flex rounded-xl !px-8 !py-3.5">
              Browse Library
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-[0.65rem] text-[#5a6380] uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/15 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-brand-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-divider">
        <div ref={statsRef} className="reveal max-w-[1200px] mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }, i) => (
            <div key={label} className={`text-center reveal reveal-delay-${i + 1}`}>
              <div className="text-4xl font-black text-gradient mb-2">{value}</div>
              <div className="text-sm text-[#5a6380] font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features — alternating image/text rows */}
      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <p className="text-gradient text-sm font-semibold uppercase tracking-[0.2em] mb-3 text-center m-0">Why CN.io</p>
        <h2 className="text-3xl font-bold text-center mb-4 m-0">Built for Movie Lovers</h2>
        <div className="accent-bar mx-auto mt-3 mb-16" />

        <div className="flex flex-col gap-24">
          {features.map((f, i) => {
            const FeatureRow = () => {
              const rowRef = useScrollReveal({ threshold: 0.15 });
              return (
                <div
                  ref={rowRef}
                  className={`reveal reveal-delay-${(i % 2) + 1} grid grid-cols-[1fr_1fr] gap-12 items-center max-md:grid-cols-1 ${i % 2 !== 0 ? 'md:[direction:rtl]' : ''}`}
                >
                  {/* Image */}
                  <div className="overflow-hidden rounded-2xl max-md:[direction:ltr] group/img">
                    <img
                      src={f.img}
                      alt={f.title}
                      className="w-full aspect-[3/2] object-cover transition-transform duration-700 group-hover/img:scale-105"
                    />
                  </div>
                  {/* Text */}
                  <div className="max-md:[direction:ltr]">
                    <div className="text-3xl mb-4">{f.icon}</div>
                    <div className="accent-bar mb-4" />
                    <h3 className="text-2xl font-bold text-white m-0 mb-3">{f.title}</h3>
                    <p className="text-[#8892b0] text-base leading-relaxed m-0">{f.desc}</p>
                  </div>
                </div>
              );
            };
            return <FeatureRow key={f.title} />;
          })}
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1574375927938-d5a98e8d7e28?w=1920&h=600&fit=crop"
          alt="Theater"
          className="w-full h-[400px] max-md:h-[280px] object-cover"
        />
        <div className="absolute inset-0 bg-surface-950/80 backdrop-blur-[2px] flex items-center justify-center text-center px-6">
          <div ref={ctaRef} className="reveal">
            <h2 className="text-3xl font-bold text-white mb-4 m-0">Ready to Start Watching?</h2>
            <p className="text-[#8892b0] text-lg max-w-[500px] mx-auto mb-8 m-0">
              Join over a million users streaming their favorite content on CN.io.
            </p>
            <Link to="/register" className="btn-primary inline-flex rounded-xl !px-8 !py-3.5">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes heroZoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.12); }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;
