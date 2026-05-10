import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Plus, MapPin, Trash2 } from 'lucide-react';
import { api } from '../api';

export default function MyTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const userId = localStorage.getItem('userId') || 1;
        const res = await api.get(`/trips/user/${userId}`);
        setTrips(res.data);
      } catch (err) {
        console.error("No database connection:", err);
      }
    };
    fetchTrips();
  }, []);

  const deleteTrip = async (e, tripId) => {
    e.stopPropagation();
    if (!window.confirm('Delete this trip?')) return;
    try {
      await api.delete(`/trips/${tripId}`);
      setTrips(trips.filter(t => t.id !== tripId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white pt-24 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Nav */}
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-5 bg-dark-950/90 backdrop-blur-md border-b border-white/5">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-dark-400 hover:text-white transition">
            <ArrowLeft size={16}/> Dashboard
          </button>
          <span className="font-black text-lg">Traveloop</span>
          <button onClick={() => navigate('/create-trip')}
            className="bg-brand-500 hover:bg-brand-400 text-dark-950 font-black text-sm px-5 py-2 rounded-full transition">
            + New Trip
          </button>
        </div>

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-black mb-2">My Trips</h1>
            <p className="text-dark-400">{trips.length} {trips.length === 1 ? 'adventure' : 'adventures'} planned</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map(trip => (
            <div key={trip.id} className="group cursor-pointer card-dark rounded-2xl overflow-hidden hover:border-brand-500/20 transition">
              <div className="h-44 overflow-hidden relative" onClick={() => navigate(`/trip/${trip.id}/view`)}>
                <img src={trip.coverPhotoUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={trip.name}/>
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent"></div>
                <button onClick={e => deleteTrip(e, trip.id)}
                  className="absolute top-3 right-3 p-2 bg-dark-950/70 rounded-full text-dark-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition">
                  <Trash2 size={14}/>
                </button>
              </div>
              <div className="p-5">
                <h3 className="font-black text-xl mb-1">{trip.name}</h3>
                <p className="text-dark-400 text-sm flex items-center gap-1 mb-4">
                  <Calendar size={12}/> {trip.startDate || 'Unscheduled'} → {trip.endDate || 'TBD'}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/trip/${trip.id}/view`)}
                    className="flex-1 py-2.5 bg-dark-700 hover:bg-dark-600 text-white text-sm font-bold rounded-xl transition">View</button>
                  <button onClick={() => navigate(`/trip/${trip.id}/build`)}
                    className="flex-1 py-2.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 text-sm font-bold rounded-xl transition">Edit</button>
                </div>
              </div>
            </div>
          ))}

          {/* Add new */}
          <div onClick={() => navigate('/create-trip')}
            className="border-2 border-dashed border-dark-700 rounded-2xl flex flex-col items-center justify-center hover:border-brand-500/40 hover:bg-brand-500/5 transition cursor-pointer group"
            style={{minHeight:'280px'}}>
            <div className="w-14 h-14 rounded-full bg-dark-800 group-hover:bg-brand-500/10 flex items-center justify-center text-dark-400 group-hover:text-brand-400 transition mb-3">
              <Plus size={24}/>
            </div>
            <p className="font-bold text-dark-400 group-hover:text-white transition">Plan a New Journey</p>
          </div>
        </div>
      </div>
    </div>
  );
}
