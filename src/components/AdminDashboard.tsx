import { useEffect, useState } from 'react';
import { LogOut, RefreshCw, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { WorkshopFeedback } from '../types/feedback';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [feedbacks, setFeedbacks] = useState<WorkshopFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('workshop_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setFeedbacks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const getSortedFeedbacks = () => {
    if (sortBy === 'rating') {
      return [...feedbacks].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return feedbacks;
  };

  const getRatingColor = (rating: number | undefined) => {
    if (!rating) return 'text-gray-400';
    if (rating === 5) return 'text-green-400';
    if (rating === 4) return 'text-blue-400';
    if (rating === 3) return 'text-yellow-400';
    if (rating === 2) return 'text-orange-400';
    return 'text-red-400';
  };

  const downloadCSV = () => {
    const headers = ['Name', 'Department', 'Feedback', 'Rating', 'Date'];
    const rows = feedbacks.map((f) => [
      f.name,
      f.department,
      f.feedback.replace(/"/g, '""'),
      f.rating || '',
      new Date(f.created_at || '').toLocaleDateString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => (typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell)).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workshop-feedback-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const sortedFeedbacks = getSortedFeedbacks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-blue-200">Total Feedback Received: {feedbacks.length}</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 text-red-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4">
            <p className="text-blue-200 text-sm mb-1">Total Responses</p>
            <p className="text-3xl font-bold text-white">{feedbacks.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4">
            <p className="text-blue-200 text-sm mb-1">Average Rating</p>
            <p className="text-3xl font-bold text-white">
              {feedbacks.filter((f) => f.rating).length > 0
                ? (
                    feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) /
                    feedbacks.filter((f) => f.rating).length
                  ).toFixed(1)
                : 'N/A'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4">
            <p className="text-blue-200 text-sm mb-1">With Ratings</p>
            <p className="text-3xl font-bold text-white">{feedbacks.filter((f) => f.rating).length}</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6 mb-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={fetchFeedbacks}
              className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/50 text-blue-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
            >
              <RefreshCw size={20} />
              Refresh
            </button>
            <button
              onClick={downloadCSV}
              className="bg-green-500/20 hover:bg-green-500/30 border border-green-400/50 text-green-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
            >
              <Download size={20} />
              Export as CSV
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-blue-200">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'rating')}
                className="bg-white/10 border border-white/30 text-white rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-white/30 border-t-blue-400 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4 text-red-200">{error}</div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-12 text-blue-200">
              <p className="text-lg">No feedback received yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedFeedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-5 hover:bg-white/10 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{feedback.name}</h3>
                      <p className="text-blue-200 text-sm">{feedback.department}</p>
                    </div>
                    {feedback.rating && (
                      <div className={`text-3xl font-bold ${getRatingColor(feedback.rating)}`}>
                        {feedback.rating}/5
                      </div>
                    )}
                  </div>
                  <p className="text-white/80 mb-3 leading-relaxed">{feedback.feedback}</p>
                  <p className="text-xs text-blue-200/60">
                    {new Date(feedback.created_at || '').toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
