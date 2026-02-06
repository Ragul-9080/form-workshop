import { CheckCircle, Home } from 'lucide-react';

interface ThankYouProps {
    onBackToHome: () => void;
}

export function ThankYou({ onBackToHome }: ThankYouProps) {
    return (
        <div className="min-h-screen bg-sand-dune flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="relative">
                    <div className="absolute inset-0 bg-cyprus/5 rounded-2xl blur-xl transform rotate-1"></div>

                    <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-cyprus/10 p-12 text-center animate-fade-in">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>

                        <h1 className="text-3xl font-bold text-cyprus mb-4">
                            Thank You!
                        </h1>
                        <p className="text-cyprus/70 mb-8 leading-relaxed">
                            Your feedback has been submitted successfully. We appreciate your thoughts and will use them to improve our future workshops.
                        </p>

                        <button
                            onClick={onBackToHome}
                            className="w-full bg-cyprus text-sand-dune font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            <Home size={18} />
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
