import { useState, useEffect } from 'react';
import { Send, CheckCircle, Instagram, Linkedin } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';


import { supabase } from '../lib/supabase';
import type { WorkshopFeedback } from '../types/feedback';
import type { AppConfig } from '../types/config';

interface FeedbackFormProps {
  onSuccess?: () => void;
}

export function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const [config, setConfig] = useState<AppConfig>({});

  const [formData, setFormData] = useState<WorkshopFeedback>({
    name: '',
    department: '',
    feedback: '',
    rating: undefined,
    rating_ragul: undefined,
    rating_ashvini: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase.from('app_config').select('*');
      if (error) throw error;
      const configMap: any = {};
      data?.forEach((item) => {
        configMap[item.key] = item.value;
      });
      setConfig(configMap);
    } catch (err) {
      console.error('Error fetching config:', err);
    }
  };

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
        rating_ragul: undefined,
        rating_ashvini: undefined,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (value: number) => {
    setFormData({ ...formData, rating: value });
  };

  const handleSpeakerRatingClick = (speaker: 'ragul' | 'ashvini', value: number) => {
    setFormData({
      ...formData,
      [speaker === 'ragul' ? 'rating_ragul' : 'rating_ashvini']: value
    });
  };

  const isFormValid = formData.name && formData.department && formData.feedback;

  return (
    <div className="min-h-screen bg-sand-dune flex items-center justify-center p-4">

      <div className="w-full max-w-2xl">
        <div className="relative">
          <div className="absolute inset-0 bg-cyprus/5 rounded-2xl blur-xl transform rotate-1"></div>


          <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-cyprus/10 p-8 transform transition-all hover:scale-[1.01]">

            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-cyprus mb-2">
                Workshop Feedback
              </h1>
              <p className="text-cyprus/70">Help us improve by sharing your thoughts</p>

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
                <label className="block text-cyprus font-medium">
                  1. Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-cyprus/20 rounded-lg text-cyprus placeholder-cyprus/40 focus:outline-none focus:ring-2 focus:ring-cyprus focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-cyprus font-medium">
                  2. Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-cyprus/20 rounded-lg text-cyprus placeholder-cyprus/40 focus:outline-none focus:ring-2 focus:ring-cyprus focus:border-transparent transition-all"
                  required
                />
              </div>


              <div className="space-y-2">
                <label className="block text-cyprus font-medium">
                  3. Feedback About the Workshop <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Share your feedback about the workshop (what you liked, what can be improved, suggestions)"
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-white border border-cyprus/20 rounded-lg text-cyprus placeholder-cyprus/40 focus:outline-none focus:ring-2 focus:ring-cyprus focus:border-transparent transition-all resize-none"
                  required
                />
              </div>


              <div className="space-y-3">
                <label className="block text-cyprus font-medium">
                  4. Overall Rating <span className="text-cyprus/60 text-sm">(Recommended)</span>
                </label>
                <div className="flex gap-3 justify-center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRatingClick(value)}
                      className={`w-16 h-16 rounded-xl font-bold text-lg transition-all transform hover:scale-110 ${formData.rating === value
                        ? 'bg-cyprus text-sand-dune shadow-lg scale-110'
                        : 'bg-white text-cyprus border border-cyprus/20 hover:bg-cyprus/5'
                        }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-cyprus/60 px-2">
                  <span>Very Poor</span>
                  <span>Excellent</span>
                </div>
              </div>


              <div className="space-y-3">
                <label className="block text-cyprus font-medium">
                  5. Speaker: Ragul <span className="text-cyprus/60 text-sm"></span>
                </label>
                <div className="flex gap-3 justify-center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={`ragul-${value}`}
                      type="button"
                      onClick={() => handleSpeakerRatingClick('ragul', value)}
                      className={`w-16 h-16 rounded-xl font-bold text-lg transition-all transform hover:scale-110 ${formData.rating_ragul === value
                        ? 'bg-cyprus text-sand-dune shadow-lg scale-110'
                        : 'bg-white text-cyprus border border-cyprus/20 hover:bg-cyprus/5'
                        }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-cyprus font-medium">
                  6. Speaker: Ashvini <span className="text-cyprus/60 text-sm"></span>
                </label>
                <div className="flex gap-3 justify-center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={`ashvini-${value}`}
                      type="button"
                      onClick={() => handleSpeakerRatingClick('ashvini', value)}
                      className={`w-16 h-16 rounded-xl font-bold text-lg transition-all transform hover:scale-110 ${formData.rating_ashvini === value
                        ? 'bg-cyprus text-sand-dune shadow-lg scale-110'
                        : 'bg-white text-cyprus border border-cyprus/20 hover:bg-cyprus/5'
                        }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>


              <div className="mt-8 pt-6 border-t border-cyprus/10 mb-6">
                <p className="text-center text-cyprus/70 mb-4">Follow us on social media for updates!</p>

                <div className="flex justify-center gap-4 flex-wrap">
                  {config.instagram_url && (
                    <a
                      href={config.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                    >
                      <Instagram size={20} />
                      Instagram
                    </a>
                  )}
                  {config.linkedin_url && (
                    <a
                      href={config.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-[#0a66c2] rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                    >
                      <Linkedin size={20} />
                      LinkedIn
                    </a>
                  )}
                  {config.whatsapp_url && (
                    <a
                      href={config.whatsapp_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-[#25D366] rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                    >
                      <WhatsAppIcon size={20} />
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full bg-cyprus text-sand-dune font-bold py-4 rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg"
              >

                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-sand-dune border-t-transparent rounded-full animate-spin" />

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
