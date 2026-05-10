import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Compass, Share2, Check } from 'lucide-react';
import { api } from '../api';

export default function SharedItinerary() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [tripRes, stopsRes] = await Promise.all([api.get(`/trips/${tripId}`), api.get(`/stops/trip/${tripId}`)]);
        setTrip(tripRes.data);
        setStops(stopsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [tripId]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="min-h-screen bg-dark-950 flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!trip) return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col items-center justify-center gap-4">
      <p className="text-dark-400 text-lg">Trip not found or is private.</p>
      <button onClick={() => navigate('/')} className="text-brand-400 font-bold hover:text-brand-300">← Go Home</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-950 text-white pb-20">
      {/* Hero section */}
      <div className="h-64 md:h-96 w-full relative">
        <img src={trip.coverPhotoUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"}
          className="w-full h-full object-cover" alt="cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-dark-900/20"></div>
        <div className="absolute bottom-10 left-6 md:left-20">
          <div className="glass text-white px-3 py-1 rounded-full inline-flex items-center text-sm font-bold mb-4">
            <Compass size={12} className="mr-2 text-brand-400"/> Public Trip
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-2">{trip.name}</h1>
          {(trip.startDate || trip.endDate) && (
            <p className="text-dark-300 text-lg flex items-center gap-2">
              <Calendar size={16} className="text-brand-400"/>
              {trip.startDate || '?'} → {trip.endDate || '?'}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-10">
        <div className="card-dark rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h2 className="text-xl font-black mb-3">Destinations</h2>
            {stops.length === 0 ? (
              <p className="text-dark-400">No stops added.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {stops.map(stop => (
                  <span key={stop.id} className="flex items-center gap-2 bg-brand-500/10 text-brand-400 border border-brand-500/20 px-3 py-1.5 rounded-full font-semibold text-sm">
                    <MapPin size={12}/> {stop.cityName}
                  </span>
                ))}
              </div>
            )}
            {trip.description && <p className="text-dark-400 mt-4">{trip.description}</p>}
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
            <button onClick={copyLink}
              className="px-6 py-3 bg-brand-500 hover:bg-brand-400 text-dark-950 font-black rounded-xl transition flex items-center justify-center gap-2">
              {copied ? <><Check size={16}/> Copied!</> : <><Share2 size={16}/> Copy Link</>}
            </button>
            <button onClick={() => navigate(`/trip/${tripId}/view`)}
              className="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white font-bold rounded-xl transition text-center text-sm">
              View Full Itinerary
            </button>
          </div>
        </div>

        {stops.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stops.map((stop, i) => (
              <div key={stop.id} className="card-dark rounded-2xl p-5 hover:border-white/10 transition">
                <div className="w-8 h-8 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 font-black flex items-center justify-center text-xs mb-3">
                  {i + 1}
                </div>
                <h3 className="font-black text-xl">{stop.cityName}</h3>
                <p className="text-dark-400 text-sm">{stop.country}</p>
                {stop.arrivalDate && <p className="text-dark-500 text-xs mt-2">{stop.arrivalDate} → {stop.departureDate}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
