import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, User, Mail, Save, Camera } from 'lucide-react';
import { api } from '../api';

export default function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!userId) { navigate('/login'); return; }
    (async () => {
      try {
        const res = await api.get(`/users/${userId}`);
        setUser(res.data);
        setForm({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error(err);
      }
    })();
  }, [userId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/users/${userId}`, form);
      setUser(res.data);
      localStorage.setItem('userName', res.data.name);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const initials = user ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Sticky nav */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-dark-950/90 backdrop-blur-md border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-dark-400 hover:text-white transition">
          <ArrowLeft size={16}/> Dashboard
        </button>
        <span className="font-black">Traveloop</span>
        <div className="w-20"></div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">
        <h1 className="text-4xl font-black mb-10">Account Settings</h1>

        {/* Profile card */}
        <div className="card-dark rounded-3xl overflow-hidden mb-6">
          {/* Banner */}
          <div className="h-28 bg-gradient-to-r from-brand-600/40 via-dark-800 to-dark-900 relative">
            <div className="absolute inset-0 opacity-20"
              style={{backgroundImage:'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=50)', backgroundSize:'cover'}}></div>
          </div>
          <div className="px-8 pb-8">
            <div className="flex items-end gap-4 -mt-10 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 border-4 border-dark-800 flex items-center justify-center text-dark-950 text-2xl font-black shadow-xl">
                {initials}
              </div>
              <div className="pb-1">
                <p className="font-black text-2xl text-white">{user?.name}</p>
                <p className="text-dark-400 text-sm">{user?.email}</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-dark-300 mb-2 flex items-center gap-2"><User size={13}/> Full Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full p-4 bg-dark-900 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition"/>
              </div>
              <div>
                <label className="block text-sm font-bold text-dark-300 mb-2 flex items-center gap-2"><Mail size={13}/> Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full p-4 bg-dark-900 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition"/>
              </div>
              <button type="submit" disabled={saving}
                className={`w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 transition ${saved ? 'bg-emerald-500 text-white' : 'bg-brand-500 hover:bg-brand-400 text-dark-950'} disabled:opacity-50`}>
                <Save size={16}/> {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>

        <button onClick={handleLogout}
          className="w-full p-4 border border-red-500/20 text-red-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-500/10 transition">
          <LogOut size={18}/> Sign Out
        </button>
      </div>
    </div>
  );
}
