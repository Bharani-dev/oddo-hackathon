import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Share2, DollarSign, Edit } from 'lucide-react';
import { api } from '../api';

export default function ItineraryView() {
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
        const stopsWithActivities = await Promise.all(
          stopsRes.data.map(async (stop) => {
            try {
              const actRes = await api.get(`/activities/stop/${stop.id}`);
              return { ...stop, activities: actRes.data };
            } catch {
              return { ...stop, activities: [] };
            }
          })
        );
        setStops(stopsWithActivities);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-dark-950/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-dark-400 hover:text-white transition">
            <ArrowLeft size={16}/> Back
          </button>
          <h1 className="text-lg font-black">{trip?.name}</h1>
          <div className="flex gap-2">
            <button onClick={() => navigate(`/trip/${id}/build`)}
              className="flex items-center gap-1.5 px-4 py-2 bg-dark-800 text-sm font-bold text-white rounded-full hover:bg-dark-700 transition">
              <Edit size={14}/> Edit
            </button>
            <button onClick={() => navigate(`/shared/${id}`)}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-dark-950 text-sm font-black rounded-full hover:bg-brand-400 transition">
              <Share2 size={14}/> Share
            </button>
          </div>
        </div>
      </div>

      {/* Cover */}
      {trip?.coverPhotoUrl && (
        <div className="h-52 w-full overflow-hidden">
          <img src={trip.coverPhotoUrl} className="w-full h-full object-cover" alt="cover"/>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-950"></div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-10">
        {stops.length === 0 && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🗺️</div>
            <p className="text-dark-400 text-lg mb-4">No stops added yet.</p>
            <button className="btn-primary" onClick={() => navigate(`/trip/${id}/build`)}>Build your itinerary →</button>
          </div>
        )}

        {stops.map((stop, index) => (
          <div key={stop.id} className="mb-14 relative">
            <div className="absolute left-6 top-14 bottom-0 w-px bg-dark-700"></div>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 font-black flex items-center justify-center z-10">
                #{index + 1}
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-black">{stop.cityName}</h2>
                <p className="text-dark-400 flex items-center text-sm mt-1">
                  <MapPin size={12} className="mr-1"/>
                  {stop.country || ''}
                  {stop.arrivalDate && <span className="ml-3">{stop.arrivalDate} → {stop.departureDate}</span>}
                </p>
              </div>
            </div>

            <div className="ml-16 space-y-3">
              {stop.activities.length === 0 && (
                <div className="p-4 border border-dashed border-dark-700 rounded-xl text-dark-500 text-sm">
                  No activities.{' '}
                  <button className="text-brand-400 font-semibold" onClick={() => navigate(`/trip/${id}/stop/${stop.id}/activities`)}>
                    Add activities →
                  </button>
                </div>
              )}
              {stop.activities.map((act, i) => (
                <div key={i} className="card-dark p-5 rounded-2xl flex justify-between items-center hover:border-white/10 transition">
                  <div>
                    <h4 className="font-black text-lg">{act.title}</h4>
                    <div className="flex items-center gap-4 text-dark-400 text-sm mt-1">
                      {act.startTime && <span className="flex items-center gap-1"><Clock size={12}/> {act.startTime}</span>}
                      {act.type && <span className="bg-dark-800 px-2 py-0.5 rounded-full capitalize text-xs">{act.type}</span>}
                    </div>
                  </div>
                  {act.cost != null && (
                    <div className="font-black text-brand-400 bg-brand-500/10 px-3 py-1.5 rounded-xl flex items-center gap-1">
                      <DollarSign size={14}/>{act.cost}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
