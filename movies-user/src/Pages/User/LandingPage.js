import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const isAuth = Boolean(useSelector((state) => state.user?.currentUser));

  if (isAuth) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="lp">
      <nav className="lp-nav">
        <div className="lp-container">
          <div className="lp-logo">🎬 MovieHub</div>
          <div className="lp-nav-actions">
            <Link to="/login" className="lp-link">
              Login
            </Link>
            <Link to="/register" className="lp-btn">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <header className="lp-hero">
        <div className="lp-container hero-content">
          <h1>
            Stream Movies & Shows <br />
            <span>Without Limits</span>
          </h1>

          <p>
            Discover thousands of movies and TV shows. No ads. HD quality.
            Cancel anytime.
          </p>

          <div className="lp-hero-actions">
            <Link to="/register" className="lp-btn primary">
              Start Free Trial
            </Link>
            <Link to="/login" className="lp-btn ghost">
              I Already Have an Account
            </Link>
          </div>
        </div>
      </header>

      <section className="lp-features lp-container">
        <div className="feature">
          <h3>🎥 HD Streaming</h3>
          <p>Crystal-clear streaming on all devices.</p>
        </div>
        <div className="feature">
          <h3>📱 Watch Anywhere</h3>
          <p>Mobile, tablet, TV, and desktop support.</p>
        </div>
        <div className="feature">
          <h3>❤️ Personalized</h3>
          <p>Smart recommendations just for you.</p>
        </div>
      </section>

      <section className="lp-stats">
        <div className="lp-container stats-grid">
          <div>
            <h2>10K+</h2>
            <span>Movies</span>
          </div>
          <div>
            <h2>1M+</h2>
            <span>Users</span>
          </div>
          <div>
            <h2>99.9%</h2>
            <span>Uptime</span>
          </div>
        </div>
      </section>

      <footer className="lp-footer">
        <h2>Ready to Start Watching?</h2>
        <Link to="/register" className="lp-btn primary large">
          Create Free Account
        </Link>
        <p>No credit card required</p>
      </footer>
    </div>
  );
}

export default LandingPage;
