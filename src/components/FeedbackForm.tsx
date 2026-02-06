import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { WorkshopFeedback } from '../types/feedback';

export function FeedbackForm() {
  const [formData, setFormData] = useState<WorkshopFeedback>({
    name: '',
    department: '',
    feedback: '',
    rating: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: submitError } = await supabase
        .from('workshop_feedback')
        .insert([formData]);

      if (submitError) throw submitError;

      setIsSuccess(true);
      setFormData({
        name: '',
        department: '',
        feedback: '',
        rating: undefined,
      });

      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (value: number) => {
    setFormData({ ...formData, rating: value });
  };

  const isFormValid = formData.name && formData.department && formData.feedback;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-20 animate-pulse"></div>

          <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 transform transition-all hover:scale-[1.01]">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                Workshop Feedback
              </h1>
              <p className="text-blue-200">Help us improve by sharing your thoughts</p>
            </div>

            {isSuccess && (
              <div className="mb-6 bg-green-500/20 border border-green-400/50 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
                <CheckCircle className="text-green-400" size={24} />
                <p className="text-green-100 font-medium">Thank you! Your feedback has been submitted successfully.</p>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-500/20 border border-red-400/50 rounded-lg p-4">
                <p className="text-red-100">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-white font-medium">
                  1. Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all backdrop-blur"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-white font-medium">
                  2. Department <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all backdrop-blur"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-white font-medium">
                  3. Feedback About the Workshop <span className="text-red-400">*</span>
                </label>
                <textarea
                  placeholder="Share your feedback about the workshop (what you liked, what can be improved, suggestions)"
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all backdrop-blur resize-none"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block text-white font-medium">
                  4. Overall Rating <span className="text-blue-300 text-sm">(Optional but Recommended)</span>
                </label>
                <div className="flex gap-3 justify-center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRatingClick(value)}
                      className={`w-16 h-16 rounded-xl font-bold text-lg transition-all transform hover:scale-110 ${
                        formData.rating === value
                          ? 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-lg shadow-blue-500/50 scale-110'
                          : 'bg-white/10 text-blue-200 border border-white/30 hover:bg-white/20'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-blue-200 px-2">
                  <span>Very Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-4 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Submit Feedback
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
