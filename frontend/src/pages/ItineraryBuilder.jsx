import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus, List, DollarSign, ClipboardList, StickyNote, Trash2, Eye } from 'lucide-react';
import { api } from '../api';

export default function ItineraryBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripRes, stopsRes] = await Promise.all([
          api.get(`/trips/${id}`),
          api.get(`/stops/trip/${id}`)
        ]);
        setTrip(tripRes.data);
        setStops(stopsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDeleteStop = async (stopId) => {
    try {
      await api.delete(`/stops/${stopId}`);
      setStops(stops.filter(s => s.id !== stopId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Sticky nav */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-dark-950/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => navigate('/my-trips')} className="flex items-center gap-2 text-dark-400 hover:text-white transition">
            <ArrowLeft size={16}/> My Trips
          </button>
          <span className="font-black">Traveloop</span>
          <div className="flex gap-2">
            <button onClick={() => navigate(`/trip/${id}/view`)}
              className="flex items-center gap-1.5 px-4 py-2 bg-dark-800 border border-white/10 text-white text-sm font-bold rounded-full hover:bg-dark-700 transition">
              <Eye size={14}/> View
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-20">
        {/* Trip header */}
        <div className="mb-10">
          <h1 className="text-5xl font-black mb-2">{trip?.name || 'Trip'}</h1>
          <p className="text-dark-400 text-lg">{trip?.startDate && trip?.endDate ? `${trip.startDate} → ${trip.endDate}` : 'No dates set'}</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { label: 'Timeline', icon: <List size={18}/>, cb: () => navigate(`/trip/${id}/view`) },
            { label: 'Budget', icon: <DollarSign size={18}/>, cb: () => navigate(`/trip/${id}/budget`) },
            { label: 'Checklist', icon: <ClipboardList size={18}/>, cb: () => navigate(`/trip/${id}/checklist`) },
            { label: 'Notes', icon: <StickyNote size={18}/>, cb: () => navigate(`/trip/${id}/notes`) },
          ].map((action, i) => (
            <button key={i} onClick={action.cb}
              className="card-dark flex items-center justify-center gap-2 py-4 rounded-xl hover:border-brand-500/20 hover:text-brand-400 text-dark-300 font-bold text-sm transition">
              {action.icon} {action.label}
            </button>
          ))}
        </div>

        {/* Stops */}
        <div className="card-dark rounded-2xl p-6 md:p-8">
          <h2 className="font-black text-xl mb-6 flex items-center gap-2">
            <MapPin size={20} className="text-brand-400"/> Stops & Destinations
          </h2>

          {stops.length === 0 && (
            <div className="text-center py-12 text-dark-500">
              <div className="text-5xl mb-4">🗺️</div>
              <p className="font-semibold">No stops yet. Add your first destination!</p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            {stops.map((stop, index) => (
              <div key={stop.id}
                className="flex items-center justify-between p-5 bg-dark-900 border border-white/5 rounded-2xl hover:border-brand-500/20 transition group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-black text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-black text-lg">{stop.cityName}</h3>
                    <p className="text-dark-400 text-sm">{stop.country || ''}</p>
                    {stop.arrivalDate && (
                      <p className="text-dark-500 text-xs mt-1">{stop.arrivalDate} → {stop.departureDate}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate(`/trip/${id}/stop/${stop.id}/activities`)}
                    className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white text-sm font-bold rounded-xl transition">
                    Activities
                  </button>
                  <button onClick={() => handleDeleteStop(stop.id)}
                    className="p-2 text-dark-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition opacity-0 group-hover:opacity-100">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => navigate(`/trip/${id}/cities`)}
            className="w-full p-4 border-2 border-dashed border-dark-700 rounded-2xl text-dark-400 font-bold flex items-center justify-center gap-2 hover:border-brand-500/40 hover:text-brand-400 hover:bg-brand-500/5 transition">
            <Plus size={20}/> Add Next Destination
          </button>
        </div>
      </div>
    </div>
  );
}
