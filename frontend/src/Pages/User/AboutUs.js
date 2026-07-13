import { Link } from "react-router-dom";
import Footer from "../../Components/Footer";

const features = [
  {
    title: "Vast Library",
    desc: "Thousands of movies and shows across every genre — from blockbusters to indie gems.",
    img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop",
  },
  {
    title: "4K Streaming",
    desc: "Cinematic quality with adaptive bitrate. Looks stunning on any screen.",
    img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=400&fit=crop",
  },
  {
    title: "Smart Picks",
    desc: "Our algorithm learns what you love and surfaces hidden gems just for you.",
    img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=400&fit=crop",
  },
  {
    title: "Watch Anywhere",
    desc: "Seamless experience across TV, phone, tablet, and laptop. Pick up where you left off.",
    img: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&h=400&fit=crop",
  },
];

const stats = [
  { value: "10K+", label: "Movies & Shows" },
  { value: "1M+", label: "Happy Users" },
  { value: "4K", label: "Ultra HD" },
  { value: "99.9%", label: "Uptime" },
];

const AboutUs = () => (
  <div className="min-h-screen bg-surface-950 text-white">
    {/* Hero */}
    <section className="relative h-[70vh] min-h-[min(500px,80vh)] flex items-end overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=1080&fit=crop"
        alt="Cinema"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/60 to-transparent" />
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pb-16 w-full">
        <p className="text-gradient text-sm font-semibold uppercase tracking-widest mb-3 m-0">About Us</p>
        <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-tight m-0 mb-4">
          Stream Without<br />Limits
        </h1>
        <p className="text-lg text-[#8892b0] max-w-[500px] leading-relaxed m-0 mb-6">
          Your ultimate destination for movies, TV shows, and exclusive originals — all in stunning quality.
        </p>
        <Link to="/register" className="btn-primary inline-flex rounded-xl">
          Start Watching
        </Link>
      </div>
    </section>

    {/* Stats */}
    <section className="section-divider">
      <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="text-3xl font-black text-gradient mb-1">{value}</div>
            <div className="text-sm text-[#5a6380]">{label}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Features — alternating image/text rows */}
    <section className="max-w-[1200px] mx-auto px-6 py-20">
      <p className="text-gradient text-sm font-semibold uppercase tracking-widest mb-3 text-center m-0">Why CN.io</p>
      <h2 className="text-3xl font-bold text-center mb-4 m-0">Built for Movie Lovers</h2>
      <div className="accent-bar mx-auto mt-3 mb-16" />

      <div className="flex flex-col gap-20">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`grid grid-cols-[1fr_1fr] gap-12 items-center max-md:grid-cols-1 ${i % 2 !== 0 ? 'md:[direction:rtl]' : ''}`}
          >
            {/* Image */}
            <div className="overflow-hidden rounded-2xl max-md:[direction:ltr]">
              <img
                src={f.img}
                alt={f.title}
                className="w-full aspect-[3/2] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Text */}
            <div className="max-md:[direction:ltr]">
              <div className="accent-bar mb-4" />
              <h3 className="text-2xl font-bold text-white m-0 mb-3">{f.title}</h3>
              <p className="text-[#8892b0] text-base leading-relaxed m-0">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* CTA banner */}
    <section className="relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1574375927938-d5a98e8d7e28?w=1920&h=600&fit=crop"
        alt="Theater"
        className="w-full h-[400px] max-md:h-[280px] object-cover"
      />
      <div className="absolute inset-0 bg-surface-950/80 flex items-center justify-center text-center px-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-4 m-0">Ready to Start Watching?</h2>
          <p className="text-[#8892b0] text-lg max-w-[500px] mx-auto mb-6 m-0">
            Join over a million users streaming their favorite content on CN.io.
          </p>
          <Link to="/register" className="btn-primary inline-flex rounded-xl">
            Create Free Account
          </Link>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default AboutUs;
