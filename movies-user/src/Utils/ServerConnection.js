import Lottie from 'react-lottie';
import { ServerConnectingOptions } from './AnimationData';

const ServerConnection = () => (
  <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6">
    <div className="text-center max-w-md">
      <div className="w-64 h-64 mx-auto mb-6"><Lottie options={ServerConnectingOptions} /></div>
      <div className="text-xl font-bold text-white mb-3">Warming Up Backend Service</div>
      <div className="text-[#8892b0] text-sm mb-4">Initializing... Estimated time: ~2 min 50 sec</div>
      <div className="glass rounded-2xl p-5">
        <p className="text-[#8892b0] mb-2 m-0">The backend service is starting up on free-tier infrastructure.</p>
        <p className="text-[#5a6380] text-sm mb-2 m-0">This may take up to 2 min 50 sec to spin up</p>
        <p className="text-[#8892b0] text-sm m-0"><strong>Note:</strong> Initial warm-up typically takes 2-3 minutes on first access.</p>
      </div>
    </div>
  </div>
);

export default ServerConnection;
