const ServerConnection = () => (
  <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6 relative">
    <div className="absolute top-[20%] left-[15%] w-[350px] h-[350px] bg-brand-500/5 blur-[140px] pointer-events-none" />

    <div className="text-center max-w-md relative z-10">
      <div className="relative w-20 h-20 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-accent-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-brand-500 animate-pulse" />
        </div>
      </div>

      <h1 className="text-xl font-bold text-white m-0 mb-2">Connecting to Server</h1>
      <p className="text-[#5a6380] text-sm m-0 mb-6">Setting up a secure connection...</p>

      <div className="flex items-center justify-center gap-2 text-[#3b4560] text-xs">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500/40 animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500/40 animate-pulse" style={{ animationDelay: '0.2s' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500/40 animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  </div>
);

export default ServerConnection;
