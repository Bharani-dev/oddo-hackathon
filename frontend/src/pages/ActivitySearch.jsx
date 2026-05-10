import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Clock, DollarSign, Trash2 } from 'lucide-react';
import { api } from '../api';

const PRESET_ACTIVITIES = [
  { title: 'City Walking Tour', type: 'SIGHTSEEING', cost: 20, durationMinutes: 120, description: 'Explore the city on foot with a local guide.' },
  { title: 'Museum Visit', type: 'CULTURE', cost: 15, durationMinutes: 180, description: 'Explore local art and history.' },
  { title: 'Local Food Tour', type: 'FOOD', cost: 50, durationMinutes: 180, description: 'Sample local cuisine at top spots.' },
  { title: 'Cooking Class', type: 'FOOD', cost: 80, durationMinutes: 240, description: 'Learn to cook traditional dishes.' },
  { title: 'Adventure Sports', type: 'ADVENTURE', cost: 100, durationMinutes: 240, description: 'Thrilling outdoor activity.' },
  { title: 'Day Trip', type: 'SIGHTSEEING', cost: 60, durationMinutes: 480, description: 'Explore nearby attractions.' },
  { title: 'Spa & Wellness', type: 'WELLNESS', cost: 90, durationMinutes: 120, description: 'Relax and rejuvenate.' },
  { title: 'Nightlife Experience', type: 'ENTERTAINMENT', cost: 40, durationMinutes: 240, description: 'Explore the local nightlife scene.' },
];

const TYPE_COLORS = {
  SIGHTSEEING: 'bg-blue-400/10 text-blue-400',
  CULTURE: 'bg-purple-400/10 text-purple-400',
  FOOD: 'bg-orange-400/10 text-orange-400',
  ADVENTURE: 'bg-red-400/10 text-red-400',
  WELLNESS: 'bg-emerald-400/10 text-emerald-400',
  ENTERTAINMENT: 'bg-pink-400/10 text-pink-400',
};

export default function ActivitySearch() {
  const navigate = useNavigate();
  const { id, stopId } = useParams();
  const [stop, setStop] = useState(null);
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({ title: '', type: 'SIGHTSEEING', cost: '', durationMinutes: 60, startTime: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [stopRes, actRes] = await Promise.all([api.get(`/stops/${stopId}`), api.get(`/activities/stop/${stopId}`)]);
        setStop(stopRes.data);
        setActivities(actRes.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [stopId]);

  const addPreset = async (preset) => {
    setAdding(preset.title);
    try {
      const res = await api.post(`/activities/stop/${stopId}`, preset);
      setActivities([...activities, res.data]);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(null);
    }
  };

  const addCustom = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/activities/stop/${stopId}`, { ...form, cost: parseFloat(form.cost) || 0 });
      setActivities([...activities, res.data]);
      setForm({ title: '', type: 'SIGHTSEEING', cost: '', durationMinutes: 60, startTime: '', description: '' });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteActivity = async (actId) => {
    try {
      await api.delete(`/activities/${actId}`);
      setActivities(activities.filter(a => a.id !== actId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-dark-950/90 backdrop-blur-md border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <button onClick={() => navigate(`/trip/${id}/build`)} className="flex items-center gap-2 text-dark-400 hover:text-white transition">
          <ArrowLeft size={16}/> Itinerary
        </button>
        <span className="font-black">{stop ? `${stop.cityName} Activities` : 'Activities'}</span>
        <div className="w-20"></div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <h1 className="text-4xl font-black mb-2">Activities {stop ? `in ${stop.cityName}` : ''}</h1>
        <p className="text-dark-400 mb-8">What do you want to experience?</p>

        {activities.length > 0 && (
          <div className="card-dark rounded-2xl p-6 mb-8">
            <h2 className="font-black text-lg mb-4">Added Activities</h2>
            <div className="space-y-3">
              {activities.map(act => (
                <div key={act.id} className="flex items-center justify-between p-3 bg-dark-900 border border-white/5 rounded-xl">
                  <div>
                    <span className="font-bold text-white">{act.title}</span>
                    <div className="flex gap-2 mt-1 items-center">
                      {act.type && <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[act.type] || 'bg-dark-700 text-dark-300'}`}>{act.type}</span>}
                      {act.cost != null && <span className="text-xs text-brand-400 font-bold">${act.cost}</span>}
                      {act.durationMinutes && <span className="text-xs text-dark-400">{act.durationMinutes} min</span>}
                    </div>
                  </div>
                  <button onClick={() => deleteActivity(act.id)} className="text-dark-500 hover:text-red-400 p-1 transition"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => setShowForm(!showForm)}
          className="w-full mb-6 p-4 border-2 border-dashed border-dark-700 rounded-2xl text-dark-400 font-bold flex items-center justify-center gap-2 hover:border-brand-500/40 hover:text-brand-400 hover:bg-brand-500/5 transition">
          <Plus size={18}/> {showForm ? 'Cancel Custom' : 'Add Custom Activity'}
        </button>

        {showForm && (
          <form onSubmit={addCustom} className="card-dark rounded-2xl p-6 mb-8 space-y-4">
            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              placeholder="Activity title"
              className="w-full p-4 bg-dark-900 border border-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-brand-500 placeholder-dark-500"/>
            <div className="grid grid-cols-2 gap-3">
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                className="p-4 bg-dark-900 border border-white/10 text-white rounded-xl outline-none [color-scheme:dark]">
                {Object.keys(TYPE_COLORS).map(t => <option key={t}>{t}</option>)}
              </select>
              <input type="number" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})}
                placeholder="Cost ($)" className="p-4 bg-dark-900 border border-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-brand-500 placeholder-dark-500"/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})}
                className="p-4 bg-dark-900 border border-white/10 text-white rounded-xl outline-none [color-scheme:dark]"/>
              <input type="number" value={form.durationMinutes} onChange={e => setForm({...form, durationMinutes: parseInt(e.target.value)})}
                placeholder="Duration (min)" className="p-4 bg-dark-900 border border-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-brand-500 placeholder-dark-500"/>
            </div>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Description" rows={2}
              className="w-full p-4 bg-dark-900 border border-white/10 text-white rounded-xl outline-none resize-none placeholder-dark-500"/>
            <button type="submit" className="w-full py-4 bg-brand-500 hover:bg-brand-400 text-dark-950 font-black rounded-xl transition">Add Activity</button>
          </form>
        )}

        <h2 className="text-xl font-black mb-5">Popular Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESET_ACTIVITIES.map((act, i) => (
            <div key={i} className="card-dark rounded-2xl p-5 hover:border-white/10 transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-lg">{act.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${TYPE_COLORS[act.type]}`}>{act.type}</span>
                </div>
                <p className="text-dark-400 text-sm mb-3">{act.description}</p>
                <div className="flex gap-4 text-sm text-dark-400">
                  <span className="flex items-center gap-1"><Clock size={12}/> {act.durationMinutes} min</span>
                  <span className="flex items-center gap-1 text-brand-400 font-bold"><DollarSign size={12}/>~{act.cost}</span>
                </div>
              </div>
              <button onClick={() => addPreset(act)} disabled={adding === act.title}
                className="w-full py-2.5 mt-4 bg-dark-800 hover:bg-brand-500 hover:text-dark-950 text-white rounded-xl font-bold transition disabled:opacity-50">
                {adding === act.title ? 'Adding...' : 'Add to Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
