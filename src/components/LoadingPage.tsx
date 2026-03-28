import { Loader2 } from 'lucide-react';

export function LoadingPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sand-dune/80 backdrop-blur-md transition-all duration-500">
      <div className="relative group">
        {/* Animated background glow */}
        <div className="absolute -inset-10 bg-cyprus/20 rounded-full blur-3xl animate-pulse group-hover:bg-cyprus/30 transition-all duration-700"></div>
        
        <div className="relative flex flex-col items-center gap-6 p-12 bg-white/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500">
          <div className="relative">
            {/* Spinning Loader */}
            <Loader2 className="w-16 h-16 text-cyprus animate-spin" strokeWidth={1.5} />
            
            {/* Outer ring animation */}
            <div className="absolute inset-0 border-4 border-cyprus/10 border-t-cyprus rounded-full animate-[spin_3s_linear_infinite]" />
          </div>
          
          <div className="space-y-2 text-center">
            <h1 className="text-xl font-bold tracking-widest uppercase text-cyprus/40 animate-pulse mb-1">
              Welcome to ReachOut
            </h1>
            <h2 className="text-4xl font-extrabold tracking-tight text-cyprus">
              Processing...
            </h2>
            <p className="text-cyprus/60 font-medium animate-fade-in mt-2">
              Please wait while we prepare your experience
            </p>
          </div>

          {/* Simple progress bar animation */}
          <div className="w-48 h-1 bg-cyprus/10 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-cyprus animate-[progress_5s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
