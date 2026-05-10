import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { api } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [isSign, setIsSign] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSign) {
        const res = await api.post('/auth/login', { email, passwordHash: password });
        localStorage.setItem('userId', res.data.id);
        localStorage.setItem('userName', res.data.name);
        navigate('/dashboard');
      } else {
        const res = await api.post('/auth/register', { email, passwordHash: password, name });
        localStorage.setItem('userId', res.data.id);
        localStorage.setItem('userName', res.data.name);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data || 'An error occurred. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Left: Hero */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Travel"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent"></div>

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">✈</span>
              <span className="text-white font-black text-2xl tracking-tight">Traveloop</span>
            </div>
          </div>

          <div>
            <p className="text-brand-400 font-bold tracking-widest text-sm uppercase mb-4">Plan. Experience. Share.</p>
            <h1 className="text-6xl font-black text-white leading-none mb-4">
              ESCAPE<br/>ORDINARY.<br/><span className="text-gradient">LIVE UNFORGETTABLE.</span>
            </h1>
            <p className="text-dark-300 text-lg max-w-sm mb-8">Handpicked destinations. Epic experiences.<br/>Stories you'll tell forever.</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                <Play size={14} className="text-brand-400 fill-brand-400"/>
                <span className="text-white text-sm font-semibold">Watch the Vibe</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center px-8 py-12 bg-dark-950">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-12 lg:hidden">
            <span className="text-2xl">✈</span>
            <span className="text-white font-black text-2xl tracking-tight">Traveloop</span>
          </div>

          <h2 className="text-3xl font-black text-white mb-2">{isSign ? 'Welcome back' : 'Join the journey'}</h2>
          <p className="text-dark-400 mb-8">{isSign ? 'Sign in to your account to continue.' : 'Create your account and start exploring.'}</p>

          {error && <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSign && (
              <div>
                <label className="block text-sm font-semibold text-dark-300 mb-2">Full Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full p-4 bg-dark-800 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition placeholder-dark-500"/>
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-dark-300 mb-2">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-4 bg-dark-800 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition placeholder-dark-500"/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-300 mb-2">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-4 bg-dark-800 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition placeholder-dark-500"/>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-brand-500 hover:bg-brand-400 text-dark-950 font-black rounded-xl transition-all shadow-lg hover:shadow-brand-500/30 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? 'Loading...' : isSign ? 'Sign In' : 'Create Account'}
              {!loading && <ArrowRight size={18}/>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-dark-400">
            {isSign ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => setIsSign(!isSign)} className="text-brand-400 font-bold hover:text-brand-300 transition">
              {isSign ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
