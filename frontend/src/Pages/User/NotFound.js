import { Link } from "react-router-dom";
import { Home, Search } from "@mui/icons-material";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6 relative">
      <div className="absolute top-[20%] left-[15%] w-[350px] h-[350px] bg-brand-500/5 blur-[140px] pointer-events-none" />

      <div className="text-center relative z-10">
        <h1 className="text-[8rem] sm:text-[10rem] font-black leading-none m-0 bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-[#5a6380] text-lg m-0 mt-2 mb-8">Page not found</p>
        <p className="text-[#3b4560] text-sm m-0 mb-8 max-w-[360px] mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-semibold no-underline hover:shadow-lg hover:shadow-brand-500/25 transition-all">
            <Home sx={{ fontSize: 18 }} /> Go Home
          </Link>
          <Link to="/movies" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[#8892b0] text-sm font-semibold no-underline hover:bg-white/10 hover:text-white transition-all">
            <Search sx={{ fontSize: 18 }} /> Browse Movies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
