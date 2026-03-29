import { useEffect, useState } from 'react';
import { LogOut, RefreshCw, Download, Pencil, Trash2, Plus, X, Save, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { WorkshopFeedback } from '../types/feedback';
import type { AppConfig } from '../types/config';

export interface Speaker {
  id: string;
  name: string;
  is_active: boolean;
  created_at?: string;
  linkedin_url?: string;
}


interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [feedbacks, setFeedbacks] = useState<WorkshopFeedback[]>([]);
  const [config, setConfig] = useState<AppConfig>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feedback' | 'speakers'>('feedback');
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isSpeakerModalOpen, setIsSpeakerModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [speakerName, setSpeakerName] = useState('');
  const [speakerLinkedin, setSpeakerLinkedin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');
  const [showModal, setShowModal] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<WorkshopFeedback | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<WorkshopFeedback>>({});

  useEffect(() => {
    fetchFeedbacks();
    fetchConfig();
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      const { data, error } = await supabase
        .from('speakers')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      setSpeakers(data || []);
    } catch (err) {
      console.error('Error fetching speakers:', err);
    }
  };

  const handleSpeakerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSpeaker) {
        const { error } = await supabase
          .from('speakers')
          .update({ name: speakerName, linkedin_url: speakerLinkedin })
          .eq('id', editingSpeaker.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('speakers')
          .insert([{ name: speakerName, linkedin_url: speakerLinkedin }]);
        if (error) throw error;
      }
      setIsSpeakerModalOpen(false);
      setSpeakerName('');
      setSpeakerLinkedin('');
      setEditingSpeaker(null);
      fetchSpeakers();
    } catch (err) {
      console.error('Error saving speaker:', err);
      alert('Failed to save speaker');
    }
  };

  const toggleSpeakerActive = async (speaker: Speaker) => {
    try {
      const { error } = await supabase
        .from('speakers')
        .update({ is_active: !speaker.is_active })
        .eq('id', speaker.id);
      if (error) throw error;
      fetchSpeakers();
    } catch (err) {
      console.error('Error toggling speaker:', err);
    }
  };

  const deleteSpeaker = async (id: string) => {
    if (!window.confirm('Are you sure? This will delete the speaker name but ratings in older feedback will remain as JSON data.')) return;
    try {
      const { error } = await supabase
        .from('speakers')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchSpeakers();
    } catch (err) {
      console.error('Error deleting speaker:', err);
    }
  };

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

  const handleSaveConfig = async () => {
    setConfigLoading(true);
    try {
      const updates = [
        { key: 'instagram_url', value: config.instagram_url || '' },
        { key: 'linkedin_url', value: config.linkedin_url || '' },
        { key: 'whatsapp_url', value: config.whatsapp_url || '' },
      ];

      for (const update of updates) {
        const { error } = await supabase.from('app_config').upsert(update);
        if (error) throw error;
      }
      alert('Links updated successfully!');
      fetchConfig();
    } catch (err) {
      console.error('Detailed error saving config:', err);
      if (err && typeof err === 'object' && 'code' in err && err.code === '401') {
        alert('Authentication error: Your session may have expired or the API key is invalid. Please restart the dev server.');
      } else {
        alert(`Failed to save links: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
      }
    } finally {
      setConfigLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      const { error } = await supabase.from('workshop_feedback').delete().eq('id', id);
      if (error) throw error;
      setFeedbacks(feedbacks.filter(f => f.id !== id));
    } catch (err) {
      console.error('Error deleting feedback:', err);
      alert('Failed to delete feedback');
    }
  };

  const openModal = (feedback?: WorkshopFeedback) => {
    if (feedback) {
      setEditingFeedback(feedback);
      setFormData(feedback);
    } else {
      setEditingFeedback(null);
      setFormData({
        name: '',
        department: '',
        feedback: '',
        rating: 5,
        rating_ragul: undefined,
        rating_ashvini: undefined
      });
    }
    setShowModal(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFeedback?.id) {
        const { error } = await supabase
          .from('workshop_feedback')
          .update(formData)
          .eq('id', editingFeedback.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('workshop_feedback')
          .insert([formData]);
        if (error) throw error;
      }
      setShowModal(false);
      fetchFeedbacks();
    } catch (err) {
      console.error('Error saving feedback:', err);
      alert('Failed to save feedback');
    }
  };


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
    <div className="min-h-screen bg-sand-dune p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-cyprus mb-2">Admin Dashboard</h1>
            <p className="text-cyprus/70">Total Feedback Received: {feedbacks.length}</p>
          </div>

          <button
            onClick={onLogout}
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white border border-cyprus/10 rounded-lg p-4 shadow-sm">
            <p className="text-cyprus/60 text-sm mb-1">Total Responses</p>
            <p className="text-3xl font-bold text-cyprus">{feedbacks.length}</p>
          </div>
          <div className="bg-white border border-cyprus/10 rounded-lg p-4 shadow-sm">
            <p className="text-cyprus/60 text-sm mb-1">Average Overall</p>
            <p className="text-3xl font-bold text-cyprus">
              {feedbacks.filter((f) => f.rating).length > 0
                ? (
                  feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) /
                  feedbacks.filter((f) => f.rating).length
                ).toFixed(1)
                : 'N/A'}
            </p>
          </div>
          {speakers.filter(s => s.is_active).map(speaker => {
            const speakerFeedbacks = feedbacks.filter(f => f.speaker_ratings && f.speaker_ratings[speaker.name]);
            const avg = speakerFeedbacks.length > 0
              ? (speakerFeedbacks.reduce((acc, f) => acc + (f.speaker_ratings![speaker.name] || 0), 0) / speakerFeedbacks.length).toFixed(1)
              : 'N/A';
            return (
              <div key={speaker.id} className="bg-white border border-cyprus/10 rounded-lg p-4 shadow-sm">
                <p className="text-cyprus/60 text-sm mb-1">Avg. {speaker.name}</p>
                <p className="text-3xl font-bold text-cyprus">{avg}</p>
              </div>
            );
          })}
          <div className="bg-white border border-cyprus/10 rounded-lg p-4 shadow-sm">
            <p className="text-cyprus/60 text-sm mb-1">With Ratings</p>
            <p className="text-3xl font-bold text-cyprus">{feedbacks.filter((f) => f.rating).length}</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-4 mb-6 border-b border-cyprus/10">
          <button
            onClick={() => setActiveTab('feedback')}
            className={`pb-3 px-4 font-bold transition-all ${activeTab === 'feedback'
              ? 'text-cyprus border-b-2 border-cyprus'
              : 'text-cyprus/40 hover:text-cyprus/60'
              }`}
          >
            Feedback Responses
          </button>
          <button
            onClick={() => setActiveTab('speakers')}
            className={`pb-3 px-4 font-bold transition-all ${activeTab === 'speakers'
              ? 'text-cyprus border-b-2 border-cyprus'
              : 'text-cyprus/40 hover:text-cyprus/60'
              }`}
          >
            Manage Speakers
          </button>
        </div>

      </div>

      {/* Social Links Config */}
      <div className="bg-white border border-cyprus/10 rounded-lg p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-cyprus">
          <Settings size={20} />
          <h2 className="text-xl font-bold">Social Media Links Configuration</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-cyprus/70 text-sm mb-1">Instagram URL</label>
            <input
              type="text"
              value={config.instagram_url || ''}
              onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })}
              className="w-full bg-white border border-cyprus/20 rounded px-3 py-2 text-cyprus text-sm focus:outline-none focus:ring-1 focus:ring-cyprus"
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <label className="block text-cyprus/70 text-sm mb-1">LinkedIn URL</label>
            <input
              type="text"
              value={config.linkedin_url || ''}
              onChange={(e) => setConfig({ ...config, linkedin_url: e.target.value })}
              className="w-full bg-white border border-cyprus/20 rounded px-3 py-2 text-cyprus text-sm focus:outline-none focus:ring-1 focus:ring-cyprus"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <label className="block text-cyprus/70 text-sm mb-1">WhatsApp URL</label>
            <input
              type="text"
              value={config.whatsapp_url || ''}
              onChange={(e) => setConfig({ ...config, whatsapp_url: e.target.value })}
              className="w-full bg-white border border-cyprus/20 rounded px-3 py-2 text-cyprus text-sm focus:outline-none focus:ring-1 focus:ring-cyprus"
              placeholder="https://wa.me/..."
            />
          </div>

        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSaveConfig}
            disabled={configLoading}
            className="bg-cyprus hover:bg-cyprus/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {configLoading ? 'Saving...' : 'Save Links'}
          </button>

        </div>
      </div>


      {activeTab === 'speakers' ? (
        <div className="bg-white border border-cyprus/10 rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-cyprus">Speakers Management</h2>
            <button
              onClick={() => {
                setEditingSpeaker(null);
                setSpeakerName('');
                setSpeakerLinkedin('');
                setIsSpeakerModalOpen(true);
              }}
              className="bg-cyprus text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-cyprus/90 transition-all shadow-md"
            >
              <Plus size={20} />
              Add New Speaker
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {speakers.map((speaker) => (
              <div key={speaker.id} className="border border-cyprus/10 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition-all">
                <div>
                  <h3 className="font-bold text-cyprus">{speaker.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${speaker.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-cyprus/60">{speaker.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSpeakerActive(speaker)}
                    className={`p-2 rounded-lg transition-colors ${speaker.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                    title={speaker.is_active ? 'Deactivate' : 'Activate'}
                  >
                    <RefreshCw size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingSpeaker(speaker);
                      setSpeakerName(speaker.name);
                      setSpeakerLinkedin(speaker.linkedin_url || '');
                      setIsSpeakerModalOpen(true);
                    }}
                    className="p-2 bg-cyprus/5 text-cyprus hover:bg-cyprus/10 rounded-lg transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => deleteSpeaker(speaker.id)}
                    className="p-2 bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {isSpeakerModalOpen && (
            <div className="fixed inset-0 bg-cyprus/20 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
              <div className="bg-white border border-cyprus/10 rounded-xl w-full max-w-sm p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-cyprus mb-4">
                  {editingSpeaker ? 'Edit Speaker' : 'Add New Speaker'}
                </h2>
                <form onSubmit={handleSpeakerSubmit} className="space-y-4">
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Speaker Name"
                    value={speakerName}
                    onChange={(e) => setSpeakerName(e.target.value)}
                    className="w-full bg-white border border-cyprus/20 rounded lg p-2.5 text-cyprus focus:outline-none focus:ring-1 focus:ring-cyprus"
                  />
                  <input
                    type="url"
                    placeholder="LinkedIn Profile URL (optional)"
                    value={speakerLinkedin}
                    onChange={(e) => setSpeakerLinkedin(e.target.value)}
                    className="w-full bg-white border border-cyprus/20 rounded lg p-2.5 text-cyprus focus:outline-none focus:ring-1 focus:ring-cyprus"
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsSpeakerModalOpen(false)}
                      className="flex-1 py-2 bg-cyprus/10 text-cyprus rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-cyprus text-white rounded-lg"
                    >
                      {editingSpeaker ? 'Update' : 'Add'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-cyprus/10 rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex gap-4 mb-6">
          <button
            onClick={fetchFeedbacks}
            className="bg-cyprus/10 hover:bg-cyprus/20 border border-cyprus/30 text-cyprus px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            <RefreshCw size={20} />
            Refresh
          </button>
          <button
            onClick={() => openModal()}
            className="bg-cyprus text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-cyprus/90 transition-all shadow-md"
          >
            <Plus size={20} />
            Add Feedback
          </button>
          <button
            onClick={downloadCSV}
            className="bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            <Download size={20} />
            Export as CSV
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-cyprus/70">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'rating')}
              className="bg-white border border-cyprus/20 text-cyprus rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-cyprus"
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>

        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-cyprus/20 border-t-cyprus rounded-full animate-spin"></div>
          </div>

        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-600">{error}</div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-12 text-cyprus/60">
            <p className="text-lg">No feedback received yet</p>
          </div>

        ) : (
          <div className="space-y-4">
            {sortedFeedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-white border border-cyprus/10 rounded-lg p-5 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-cyprus">{feedback.name}</h3>
                    <p className="text-cyprus/60 text-sm">{feedback.department}</p>
                  </div>

                  {feedback.rating && (
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getRatingColor(feedback.rating)}`}>
                        {feedback.rating}/5
                      </div>
                      <div className="flex gap-4 mt-1">
                        {feedback.rating_ragul && (
                          <div className="text-xs">
                            <span className="text-cyprus/40">Ragul:</span>
                            <span className={`ml-1 font-semibold ${getRatingColor(feedback.rating_ragul)}`}>{feedback.rating_ragul}</span>
                          </div>
                        )}
                        {feedback.rating_ashvini && (
                          <div className="text-xs">
                            <span className="text-cyprus/40">Ashvini:</span>
                            <span className={`ml-1 font-semibold ${getRatingColor(feedback.rating_ashvini)}`}>{feedback.rating_ashvini}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-cyprus/80 mb-3 leading-relaxed">{feedback.feedback}</p>
                <p className="text-xs text-cyprus/40">
                  {new Date(feedback.created_at || '').toLocaleString()}
                </p>

                <div className="mt-4 pt-3 border-t border-cyprus/10 flex justify-end gap-2">
                  <button
                    onClick={() => openModal(feedback)}
                    className="p-1.5 hover:bg-cyprus/5 rounded text-cyprus/60 hover:text-cyprus transition-colors"
                    title="Edit"
                  >

                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => feedback.id && handleDelete(feedback.id)}
                    className="p-1.5 hover:bg-red-50 rounded text-red-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >

                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-cyprus/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-cyprus/10 rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyprus">
                {editingFeedback ? 'Edit Feedback' : 'Add Feedback'}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-cyprus/50 hover:text-cyprus"
              >
                <X size={24} />

              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-cyprus/70 text-sm mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-cyprus/20 rounded lg p-2.5 text-cyprus focus:outline-none focus:ring-1 focus:ring-cyprus"
                />

              </div>
              <div>
                <label className="block text-cyprus/70 text-sm mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={formData.department || ''}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-white border border-cyprus/20 rounded lg p-2.5 text-cyprus focus:outline-none focus:ring-1 focus:ring-cyprus"
                />

              </div>
              <div>
                <label className="block text-cyprus/70 text-sm mb-1">Feedback</label>
                <textarea
                  required
                  rows={4}
                  value={formData.feedback || ''}
                  onChange={e => setFormData({ ...formData, feedback: e.target.value })}
                  className="w-full bg-white border border-cyprus/20 rounded lg p-2.5 text-cyprus focus:outline-none focus:ring-1 focus:ring-cyprus"
                />

              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-cyprus/70 text-sm mb-1">Overall</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating || ''}
                    onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) || undefined })}
                    className="w-full bg-white border border-cyprus/20 rounded p-2 text-cyprus focus:outline-none focus:ring-1 focus:ring-cyprus"
                  />
                </div>
                <div>
                  <label className="block text-cyprus/70 text-sm mb-1">Ragul</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating_ragul || ''}
                    onChange={e => setFormData({ ...formData, rating_ragul: parseInt(e.target.value) || undefined })}
                    className="w-full bg-white border border-cyprus/20 rounded p-2 text-cyprus focus:outline-none focus:ring-1 focus:ring-cyprus"
                  />
                </div>
                <div>
                  <label className="block text-cyprus/70 text-sm mb-1">Ashvini</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating_ashvini || ''}
                    onChange={e => setFormData({ ...formData, rating_ashvini: parseInt(e.target.value) || undefined })}
                    className="w-full bg-white border border-cyprus/20 rounded p-2 text-cyprus focus:outline-none focus:ring-1 focus:ring-cyprus"
                  />
                </div>

              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-cyprus/10 text-cyprus rounded-lg hover:bg-cyprus/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-cyprus text-white rounded-lg hover:bg-cyprus/90 transition-colors"
                >

                  {editingFeedback ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
