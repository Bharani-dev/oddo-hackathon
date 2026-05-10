import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, Calendar, Compass, ArrowRight, Search, Plane } from 'lucide-react';
import { api } from '../api';

const DESTINATIONS = [
  { name: 'Maldives', country: 'Tropical Paradise', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80', rating: 4.9, from: '$889' },
  { name: 'Las Vegas', country: 'Nevada, USA', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80', rating: 4.8, from: '$499' },
  { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80', rating: 4.8, from: '$699' },
  { name: 'Dubai', country: 'UAE', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80', rating: 4.7, from: '$829' },
];

const FILTERS = ['All', 'Beach', 'City', 'Islands', 'Adventure', 'Luxury'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const userName = localStorage.getItem('userName') || 'Traveler';

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const userId = localStorage.getItem('userId') || 1;
        const res = await api.get(`/trips/user/${userId}`);
        setTrips(res.data);
      } catch (err) {
        console.error("API Error", err);
      }
    };
    fetchTrips();
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-5 bg-dark-950/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xl">✈</span>
            <span className="font-black text-xl tracking-tight">Traveloop</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm text-dark-300">
            <button onClick={() => navigate('/my-trips')} className="hover:text-white transition">My Trips</button>
            <button onClick={() => navigate('/profile')} className="hover:text-white transition">Profile</button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/create-trip')}
            className="hidden md:flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-dark-950 font-black text-sm px-5 py-2.5 rounded-full transition">
            Plan My Escape <ArrowRight size={14}/>
          </button>
          <button onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-dark-950 font-black text-sm">
            {userName.charAt(0).toUpperCase()}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative h-screen max-h-[700px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80"
          className="w-full h-full object-cover" alt="hero"/>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/40 via-dark-950/20 to-dark-950"></div>
        <div className="absolute inset-0 flex flex-col justify-end pb-20 px-8 md:px-20 max-w-5xl">
          <p className="text-brand-400 font-bold tracking-widest text-xs uppercase mb-4">Handpicked destinations. Epic experiences.</p>
          <h1 className="text-5xl md:text-7xl font-black leading-none mb-4 text-white">
            ESCAPE ORDINARY.<br/><span className="text-gradient">LIVE UNFORGETTABLE.</span>
          </h1>
          <p className="text-dark-300 text-lg mb-8">Stories you'll tell forever.</p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate('/create-trip')}
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-dark-950 font-black px-7 py-3.5 rounded-full transition shadow-lg hover:shadow-brand-500/30">
              Start Your Journey <ArrowRight size={18}/>
            </button>
            <button onClick={() => navigate('/my-trips')}
              className="flex items-center gap-2 glass text-white font-bold px-7 py-3.5 rounded-full hover:bg-white/10 transition">
              My Trips
            </button>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 mb-16 relative z-10">
        <div className="glass-light rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-2xl">
          <div className="flex-1 flex items-center gap-3 px-4 border-r border-gray-200">
            <Compass size={18} className="text-dark-500"/>
            <div>
              <p className="text-xs text-dark-400 font-semibold">Where to?</p>
              <p className="text-dark-800 font-bold text-sm">Anywhere</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 border-r border-gray-200">
            <Calendar size={18} className="text-dark-500"/>
            <div>
              <p className="text-xs text-dark-400 font-semibold">Check in</p>
              <p className="text-dark-800 font-bold text-sm">Add dates</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 border-r border-gray-200">
            <Calendar size={18} className="text-dark-500"/>
            <div>
              <p className="text-xs text-dark-400 font-semibold">Check out</p>
              <p className="text-dark-800 font-bold text-sm">Add dates</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3 px-4">
            <Plane size={18} className="text-dark-500"/>
            <div>
              <p className="text-xs text-dark-400 font-semibold">Travelers</p>
              <p className="text-dark-800 font-bold text-sm">2 Adults</p>
            </div>
          </div>
          <button onClick={() => navigate('/create-trip')}
            className="bg-dark-950 text-white font-black px-6 py-3 rounded-xl text-sm hover:bg-dark-800 transition whitespace-nowrap flex items-center gap-2">
            <Search size={16}/> Search Escapes
          </button>
        </div>
      </div>

      {/* Top Destinations */}
      <div className="max-w-6xl mx-auto px-6 mb-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
          <div>
            <h2 className="text-4xl font-black mb-2">Top Destinations</h2>
            <p className="text-dark-400">From tropical islands to legendary cities.<br/>Find your next escape.</p>
          </div>
          <button onClick={() => navigate('/my-trips')} className="text-brand-400 font-bold hover:text-brand-300 transition mt-4 md:mt-0 flex items-center gap-1">
            View all <ArrowRight size={16}/>
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${activeFilter === f ? 'bg-white text-dark-950' : 'bg-dark-800 text-dark-300 hover:bg-dark-700'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DESTINATIONS.map((dest, i) => (
            <div key={i} onClick={() => navigate('/create-trip')}
              className="relative group cursor-pointer rounded-2xl overflow-hidden" style={{height: '280px'}}>
              <img src={dest.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={dest.name}/>
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-black text-lg text-white">{dest.name}</h3>
                <p className="text-dark-300 text-xs mb-1">{dest.country}</p>
                <div className="flex justify-between items-center">
                  <span className="text-brand-400 text-xs font-bold">★ {dest.rating}</span>
                  <span className="text-white text-xs font-bold">From {dest.from}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VIP + User Trips */}
      <div className="max-w-6xl mx-auto px-6 mb-24 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* VIP Treatment */}
        <div className="relative rounded-3xl overflow-hidden" style={{minHeight:'280px'}}>
          <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
            className="absolute inset-0 w-full h-full object-cover" alt="Luxury"/>
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent"></div>
          <div className="relative z-10 p-8 flex flex-col justify-end h-full">
            <p className="text-brand-400 font-bold text-sm uppercase tracking-widest mb-2">VIP Treatment?</p>
            <h3 className="text-3xl font-black text-white mb-2">Private yachts, villa upgrades & experiences made just for you.</h3>
            <button className="mt-4 self-start bg-white text-dark-950 font-black px-5 py-2.5 rounded-full text-sm hover:bg-brand-400 transition">
              Explore Luxury
            </button>
          </div>
        </div>

        {/* Plan Your Escape */}
        <div className="card-dark p-8 rounded-3xl">
          <h3 className="text-2xl font-black mb-2 text-white">Plan Your Escape</h3>
          <p className="text-dark-400 mb-8 text-sm">Custom itineraries, smart recommendations and real experiences.</p>
          <div className="space-y-5">
            {['Choose Destination', 'Select Dates', 'Add Experiences', 'We Plan the Rest'].map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 text-xs font-black">{i+1}</div>
                <span className="text-white font-semibold">{step}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/create-trip')}
            className="mt-8 w-full bg-brand-500 hover:bg-brand-400 text-dark-950 font-black py-3.5 rounded-xl transition flex items-center justify-center gap-2">
            Start Planning <ArrowRight size={16}/>
          </button>
        </div>
      </div>

      {/* My Escape — real trips */}
      {trips.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 mb-24">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black">My Escape</h2>
              <p className="text-dark-400">Your upcoming adventures</p>
            </div>
            <button onClick={() => navigate('/my-trips')} className="text-brand-400 font-bold hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight size={16}/>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {trips.slice(0, 3).map(trip => (
              <div key={trip.id} onClick={() => navigate(`/trip/${trip.id}/view`)}
                className="card-dark rounded-2xl overflow-hidden cursor-pointer group hover:border-brand-500/30 transition">
                <div className="h-40 overflow-hidden">
                  <img src={trip.coverPhotoUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={trip.name}/>
                </div>
                <div className="p-5">
                  <h4 className="font-black text-lg text-white mb-1">{trip.name}</h4>
                  <p className="text-dark-400 text-sm flex items-center gap-1 mb-4">
                    <Calendar size={12}/> {trip.startDate || 'Unscheduled'} → {trip.endDate || 'TBD'}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={e => {e.stopPropagation(); navigate(`/trip/${trip.id}/build`)}}
                      className="flex-1 py-2 bg-dark-700 hover:bg-dark-600 text-white text-sm font-bold rounded-lg transition">Edit</button>
                    <button onClick={e => {e.stopPropagation(); navigate(`/trip/${trip.id}/budget`)}}
                      className="flex-1 py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 text-sm font-bold rounded-lg transition">Budget</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Strip */}
      <div className="border-t border-white/5 py-12 mb-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: '🌍', label: 'Destinations', value: '200+' },
            { icon: '⭐', label: 'Best Price', value: 'Guaranteed' },
            { icon: '🎯', label: '24/7 Concierge', value: "We're here" },
            { icon: '🔒', label: 'Secure Booking', value: 'Always safe' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-white font-bold">{stat.value}</p>
              <p className="text-dark-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
