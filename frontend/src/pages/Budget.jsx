import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, DollarSign, Plane, Hotel, UtensilsCrossed, Ticket } from 'lucide-react';
import { api } from '../api';

export default function Budget() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customBudget, setCustomBudget] = useState({ flights: 0, stay: 0, meals: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [tripRes, stopsRes] = await Promise.all([api.get(`/trips/${id}`), api.get(`/stops/trip/${id}`)]);
        setTrip(tripRes.data);
        setStops(stopsRes.data);
        const activities = [];
        for (const stop of stopsRes.data) {
          try {
            const actRes = await api.get(`/activities/stop/${stop.id}`);
            activities.push(...actRes.data);
          } catch {}
        }
        setAllActivities(activities);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const activityTotal = allActivities.reduce((sum, a) => sum + (a.cost || 0), 0);
  const totalCost = activityTotal + Number(customBudget.flights) + Number(customBudget.stay) + Number(customBudget.meals);

  const breakdown = [
    { label: 'Flights & Transport', icon: <Plane size={18}/>, color: 'text-blue-400 bg-blue-400/10', key: 'flights' },
    { label: 'Accommodation', icon: <Hotel size={18}/>, color: 'text-purple-400 bg-purple-400/10', key: 'stay' },
    { label: 'Meals & Dining', icon: <UtensilsCrossed size={18}/>, color: 'text-orange-400 bg-orange-400/10', key: 'meals' },
    { label: 'Activities', icon: <Ticket size={18}/>, color: 'text-brand-400 bg-brand-400/10', key: 'activities' },
  ];

  if (loading) return <div className="min-h-screen bg-dark-950 flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-dark-950/90 backdrop-blur-md border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <button onClick={() => navigate(`/trip/${id}/build`)} className="flex items-center gap-2 text-dark-400 hover:text-white transition">
          <ArrowLeft size={16}/> Itinerary
        </button>
        <span className="font-black">Budget</span>
        <div className="w-20"></div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <h1 className="text-4xl font-black mb-2">Budget Estimator</h1>
        <p className="text-dark-400 mb-10">{trip?.name} · {stops.length} stops · {allActivities.length} activities</p>

        {/* Total */}
        <div className="relative rounded-3xl overflow-hidden mb-10 p-10 text-center"
          style={{background: 'linear-gradient(135deg, #1c1c1c 0%, #2a1a0a 100%)'}}>
          <div className="absolute inset-0 opacity-10"
            style={{backgroundImage:'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=20)', backgroundSize:'cover'}}></div>
          <p className="text-dark-300 font-bold mb-2 relative z-10">Estimated Total Cost</p>
          <h2 className="relative z-10 text-7xl font-black text-brand-400">
            <span className="text-3xl">$</span>{totalCost.toFixed(0)}
          </h2>
        </div>

        {/* Breakdown */}
        <h3 className="text-xl font-black mb-5">Cost Breakdown</h3>
        <div className="space-y-4 mb-10">
          {breakdown.map((item) => (
            <div key={item.key} className="card-dark p-5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.color}`}>{item.icon}</div>
                <span className="font-bold text-white">{item.label}</span>
              </div>
              {item.key === 'activities' ? (
                <span className="font-black text-lg text-brand-400">${activityTotal.toFixed(0)}</span>
              ) : (
                <div className="flex items-center gap-2 bg-dark-900 rounded-xl px-3 py-2 border border-white/10">
                  <DollarSign size={14} className="text-dark-400"/>
                  <input type="number" min="0" value={customBudget[item.key]}
                    onChange={e => setCustomBudget({...customBudget, [item.key]: e.target.value})}
                    className="w-20 bg-transparent text-right font-black text-white outline-none"/>
                </div>
              )}
            </div>
          ))}
        </div>

        {allActivities.length > 0 && (
          <div className="card-dark rounded-2xl p-6">
            <h3 className="font-black text-lg mb-4">Activity Costs</h3>
            <div className="space-y-3">
              {allActivities.map((act, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-dark-200">{act.title}</span>
                  <span className="font-black text-brand-400">${act.cost || 0}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
