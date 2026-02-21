import Lottie from "react-lottie";
import Footer from "../../Components/Footer";
import NavBar from "../../Components/NavBar";
import {
  AboutUsOptions,
  AccessOptions,
  adBlockOption,
  affordOptions,
  offlineOptions,
  parentalOption,
  personalizedOptions,
  streamOptions,
  vastOptions,
} from "../../Utils/AnimationData";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-page">
      <NavBar />
      <main className="about-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to CN.io</h1>
            <p className="hero-desc">
              Your ultimate streaming destination. Movies, TV shows, and
              exclusive originals in 4K quality.
            </p>
          </div>
          <div className="hero-animation">
            <Lottie options={AboutUsOptions} />
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">Why Choose CN.io?</h2>
          <div className="features-grid">
            <FeatureCard
              icon={vastOptions}
              title="Vast Library"
              desc="Thousands of movies & shows across all genres"
            />
            <FeatureCard
              icon={streamOptions}
              title="4K Streaming"
              desc="Adaptive quality for perfect playback"
            />
            <FeatureCard
              icon={personalizedOptions}
              title="Smart Recommendations"
              desc="AI-powered content discovery"
            />
            <FeatureCard
              icon={AccessOptions}
              title="All Devices"
              desc="TV, Phone, Tablet, Laptop - everywhere"
            />
            <FeatureCard
              icon={affordOptions}
              title="Affordable Plans"
              desc="Monthly, yearly - fits your budget"
            />
            <FeatureCard
              icon={adBlockOption}
              title="Ad-Free"
              desc="Pure entertainment, no interruptions"
            />
            <FeatureCard
              icon={offlineOptions}
              title="Offline Downloads"
              desc="Watch anywhere, anytime"
            />
            <FeatureCard
              icon={parentalOption}
              title="Family Safe"
              desc="Parental controls & kid profiles"
            />
          </div>
        </section>

        <section className="commitment-section">
          <h2 className="section-title">Our Promise</h2>
          <p className="commitment-text">
            Built in Chennai for the world. Fast, reliable streaming with
            content you'll love. Join 1M+ happy users today.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="feature-card">
    <div className="feature-icon">
      <Lottie options={icon} />
    </div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

export default AboutUs;
