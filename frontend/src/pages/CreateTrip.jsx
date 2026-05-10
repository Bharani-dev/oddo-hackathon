import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { api } from '../api';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '', description: '', coverPhotoUrl: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userId = localStorage.getItem('userId') || 1;
    try {
      const res = await api.post(`/trips/user/${userId}`, form);
      navigate(`/trip/${res.data.id}/build`);
    } catch (err) {
      setError('Failed to create trip. Is the backend running?');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white flex">
      {/* Left visual */}
      <div className="hidden lg:block lg:w-2/5 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=800&q=80"
          className="w-full h-full object-cover" alt="Travel"/>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dark-950"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 to-transparent"></div>
        <div className="absolute bottom-12 left-10 text-white">
          <p className="text-brand-400 font-bold text-sm tracking-widest uppercase mb-2">Your next story</p>
          <h2 className="text-4xl font-black leading-tight">Every great trip<br/>starts with a<br/><span className="text-gradient">single plan.</span></h2>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-3/5 flex flex-col pt-20 px-8 md:px-16 pb-20">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-dark-400 hover:text-white mb-10 transition self-start">
          <ArrowLeft size={16}/> Back
        </button>

        <h1 className="text-4xl font-black mb-2">Plan a New Trip</h1>
        <p className="text-dark-400 mb-10">Fill in the basics. You can add cities and activities later.</p>

        {error && <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">{error}</div>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-dark-300 mb-2">Trip Name *</label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              placeholder="e.g. Euro Summer 2026"
              className="w-full p-4 bg-dark-800 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none placeholder-dark-500 transition"/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-dark-300 mb-2">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})}
                className="w-full p-4 bg-dark-800 border border-white/10 text-dark-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition [color-scheme:dark]"/>
            </div>
            <div>
              <label className="block text-sm font-bold text-dark-300 mb-2">End Date</label>
              <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})}
                className="w-full p-4 bg-dark-800 border border-white/10 text-dark-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition [color-scheme:dark]"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-dark-300 mb-2">Description (Optional)</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              placeholder="What's the goal of this trip?"
              className="w-full p-4 bg-dark-800 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none placeholder-dark-500 transition"/>
          </div>

          <div>
            <label className="block text-sm font-bold text-dark-300 mb-2">Cover Photo URL (Optional)</label>
            <input type="url" value={form.coverPhotoUrl} onChange={e => setForm({...form, coverPhotoUrl: e.target.value})}
              placeholder="https://..."
              className="w-full p-4 bg-dark-800 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none placeholder-dark-500 transition"/>
            {form.coverPhotoUrl && (
              <div className="mt-3 h-32 rounded-xl overflow-hidden">
                <img src={form.coverPhotoUrl} className="w-full h-full object-cover" alt="preview" onError={e => e.target.style.display='none'}/>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 py-4 border border-white/10 text-dark-300 font-bold rounded-xl hover:bg-dark-800 transition">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 py-4 bg-brand-500 hover:bg-brand-400 text-dark-950 font-black rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Trip'} {!loading && <ArrowRight size={18}/>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
