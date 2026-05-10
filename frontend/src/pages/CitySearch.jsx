import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Plus, Globe } from 'lucide-react';
import { api } from '../api';

const POPULAR_CITIES = [
  { name: 'Paris', country: 'France', flag: '🇫🇷', costIndex: '$$$', tag: 'City' },
  { name: 'Tokyo', country: 'Japan', flag: '🇯🇵', costIndex: '$$$$', tag: 'City' },
  { name: 'Rome', country: 'Italy', flag: '🇮🇹', costIndex: '$$$', tag: 'City' },
  { name: 'Barcelona', country: 'Spain', flag: '🇪🇸', costIndex: '$$', tag: 'Beach' },
  { name: 'New York', country: 'USA', flag: '🇺🇸', costIndex: '$$$$', tag: 'City' },
  { name: 'Bangkok', country: 'Thailand', flag: '🇹🇭', costIndex: '$', tag: 'City' },
  { name: 'London', country: 'United Kingdom', flag: '🇬🇧', costIndex: '$$$$', tag: 'City' },
  { name: 'Bali', country: 'Indonesia', flag: '🇮🇩', costIndex: '$', tag: 'Beach' },
  { name: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', costIndex: '$$$', tag: 'City' },
  { name: 'Sydney', country: 'Australia', flag: '🇦🇺', costIndex: '$$$$', tag: 'City' },
  { name: 'Maldives', country: 'South Asia', flag: '🏝️', costIndex: '$$$$', tag: 'Islands' },
  { name: 'Dubai', country: 'UAE', flag: '🇦🇪', costIndex: '$$$$', tag: 'Luxury' },
  { name: 'Santorini', country: 'Greece', flag: '🇬🇷', costIndex: '$$$', tag: 'Islands' },
  { name: 'Las Vegas', country: 'USA', flag: '🎰', costIndex: '$$$', tag: 'City' },
];

export default function CitySearch() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(null);

  const cities = POPULAR_CITIES.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.country.toLowerCase().includes(query.toLowerCase())
  );

  const addStop = async (city) => {
    setAdding(city.name);
    try {
      await api.post(`/stops/trip/${id}`, { cityName: city.name, country: city.country });
      navigate(`/trip/${id}/build`);
    } catch (err) {
      console.error(err);
      setAdding(null);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-dark-950/90 backdrop-blur-md border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-dark-400 hover:text-white transition">
          <ArrowLeft size={16}/> Cancel
        </button>
        <span className="font-black">Add Destination</span>
        <div className="w-20"></div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">
        <h1 className="text-4xl font-black mb-2">Where next?</h1>
        <p className="text-dark-400 mb-8">Choose a city to add to your trip.</p>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-4 text-dark-500" size={18}/>
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search cities or countries..."
            className="w-full pl-12 pr-4 py-4 bg-dark-800 border border-white/10 text-white rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none placeholder-dark-500 transition"/>
        </div>

        <p className="text-xs font-bold text-dark-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Globe size={12}/> Popular Destinations</p>

        <div className="space-y-3">
          {cities.map((city, i) => (
            <div key={i} className="flex justify-between items-center p-4 card-dark rounded-2xl hover:border-brand-500/20 transition group cursor-pointer">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{city.flag}</span>
                <div>
                  <h3 className="font-black text-lg">{city.name}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-dark-400 text-sm">{city.country}</p>
                    <span className="text-xs bg-dark-800 text-dark-400 px-2 py-0.5 rounded-full">{city.tag}</span>
                    <span className="text-xs text-brand-400 font-bold">{city.costIndex}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => addStop(city)}
                disabled={adding === city.name}
                className="flex items-center gap-2 px-4 py-2 bg-dark-800 text-white hover:bg-brand-500 hover:text-dark-950 rounded-xl font-bold text-sm transition disabled:opacity-50">
                {adding === city.name ? '...' : <><Plus size={14}/> Add</>}
              </button>
            </div>
          ))}
          {cities.length === 0 && (
            <div className="text-center py-10">
              <p className="text-dark-400 mb-4">No results for "{query}"</p>
              <button onClick={() => addStop({ name: query, country: '' })}
                className="px-6 py-3 bg-brand-500 hover:bg-brand-400 text-dark-950 font-black rounded-xl transition">
                Add "{query}" anyway
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
