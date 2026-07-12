import { ArrowBack } from "@mui/icons-material";
import { Link, useParams, useLocation, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchTmdbMovieDetails } from "../../Network/ApiCalls";
import GlobalLoader from "../../Components/GlobalLoader";

const VideoFullScreen = () => {
  const { id } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [videoSrc, setVideoSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const [movieTitle, setMovieTitle] = useState("");

  const trailerFromState = location.state?.trailer;
  const trailerFromParams = searchParams.get('trailer');

  useEffect(() => {
    const fetchTrailer = async () => {
      setLoading(true);
      if (trailerFromParams) { setVideoSrc(trailerFromParams); setMovieTitle(id); setLoading(false); return; }
      if (trailerFromState) { setVideoSrc(trailerFromState); setMovieTitle(id); setLoading(false); return; }
      if (id) {
        const details = await fetchTmdbMovieDetails(id);
        if (details?.trailer) { setVideoSrc(details.trailer); setMovieTitle(details.title || details.name || id); }
        else { setVideoSrc("https://videos.pexels.com/video-files/4782220/4782220-hd_1280_720_30fps.mp4"); setMovieTitle(id); }
      }
      setLoading(false);
    };
    fetchTrailer();
  }, [id, trailerFromState, trailerFromParams]);

  let finalVideoSrc = videoSrc;
  if (videoSrc && videoSrc.includes('youtube.com')) {
    const videoId = videoSrc.split('v=')[1]?.split('&')[0];
    if (videoId) finalVideoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0`;
  }

  if (loading) return (
    <>
      <GlobalLoader open={true} message="Loading trailer..." />
      <div className="min-h-screen bg-black flex flex-col">
        <div className="p-4">
          <Link to="/" className="flex items-center gap-2 text-white no-underline hover:text-accent-400 transition-colors">
            <ArrowBack /> <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex items-center justify-between p-3 sm:p-4 bg-surface-900/90 backdrop-blur-md border-b border-white/10 z-10 gap-3">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 text-white no-underline hover:text-accent-400 transition-colors shrink-0">
          <ArrowBack sx={{ fontSize: 20 }} /> <span className="hidden sm:inline text-sm">Back to Home</span>
        </Link>
        <h1 className="text-sm sm:text-lg font-semibold text-white m-0 truncate flex-1 text-center min-w-0">{movieTitle}</h1>
        <div className="w-0 sm:w-[120px] shrink-0" />
      </div>

      <div className="flex-1 relative">
        {finalVideoSrc.includes('youtube.com/embed') ? (
          <iframe src={finalVideoSrc} className="absolute inset-0 w-full h-full border-none" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen title="Movie Trailer" />
        ) : (
          <video src={finalVideoSrc} autoPlay controls className="absolute inset-0 w-full h-full object-contain" title="Movie Trailer" />
        )}
      </div>
    </div>
  );
};

export default VideoFullScreen;
