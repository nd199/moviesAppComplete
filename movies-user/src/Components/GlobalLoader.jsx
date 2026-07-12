import { CircularProgress, Backdrop } from "@mui/material";

const GlobalLoader = ({ open = true, message = "Loading..." }) => (
  <Backdrop open={open} sx={{ color: "#fff", zIndex: (t) => t.zIndex.drawer + 1, backgroundColor: "rgba(5,8,16,0.92)", backdropFilter: "blur(12px)" }}>
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <div className="absolute inset-0 w-16 h-16 rounded-full animate-glow" />
        <CircularProgress size={52} thickness={3} sx={{ color: "#7c3aed", '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }} />
      </div>
      <p className="text-[#8892b0] text-sm font-medium tracking-wide m-0">{message}</p>
    </div>
  </Backdrop>
);

export const MovieListSkeleton = ({ count = 5 }) => (
  <div className="py-10 px-[3.5vw]">
    <div className="mb-6 px-1">
      <div className="w-48 h-7 rounded-xl bg-white/5 animate-shimmer" />
      <div className="w-14 h-[3px] rounded-full bg-white/10 mt-2.5 animate-shimmer" />
    </div>
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-none w-[185px] flex flex-col gap-2">
          <div className="w-full aspect-[2/3] rounded-2xl bg-white/5 animate-shimmer" />
          <div className="w-4/5 h-3.5 rounded-lg bg-white/5 animate-shimmer" />
          <div className="w-2/5 h-2.5 rounded bg-white/5 animate-shimmer" />
        </div>
      ))}
    </div>
  </div>
);

export const FeaturedSkeleton = () => (
  <div className="w-full h-[88vh] min-h-[560px] bg-surface-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-full border-2 border-brand-500/20 animate-pulse" />
      <div className="w-48 h-5 rounded-xl bg-white/5 animate-shimmer" />
    </div>
  </div>
);

export default GlobalLoader;
