import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { api } from '../api';

const CATEGORIES = ['All', 'Clothing', 'Documents', 'Electronics', 'Toiletries', 'Other'];

export default function Checklist() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('Other');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/checklists/trip/${id}`);
        setItems(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const addItem = async () => {
    if (!newItem.trim()) return;
    try {
      const res = await api.post(`/checklists/trip/${id}`, { itemName: newItem, category });
      setItems([...items, res.data]);
      setNewItem('');
    } catch (err) {
      console.error(err);
    }
  };

  const togglePacked = async (itemId) => {
    try {
      const res = await api.put(`/checklists/${itemId}/toggle`);
      setItems(items.map(i => i.id === itemId ? res.data : i));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (e, itemId) => {
    e.stopPropagation();
    try {
      await api.delete(`/checklists/${itemId}`);
      setItems(items.filter(i => i.id !== itemId));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);
  const packed = items.filter(i => i.isPacked).length;
  const progress = items.length > 0 ? (packed / items.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-dark-950/90 backdrop-blur-md border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <button onClick={() => navigate(`/trip/${id}/build`)} className="flex items-center gap-2 text-dark-400 hover:text-white transition">
          <ArrowLeft size={16}/> Itinerary
        </button>
        <span className="font-black">Packing Checklist</span>
        <span className="text-dark-400 text-sm">{packed}/{items.length} packed</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">
        <h1 className="text-4xl font-black mb-2">Packing Checklist</h1>
        <p className="text-dark-400 mb-6">Make sure you have everything.</p>

        {/* Progress bar */}
        <div className="w-full bg-dark-800 rounded-full h-2 mb-8">
          <div className="bg-brand-500 h-2 rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap mb-5">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${filter === c ? 'bg-brand-500 text-dark-950' : 'bg-dark-800 text-dark-300 hover:bg-dark-700'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Add form */}
        <div className="flex gap-2 mb-8">
          <input type="text" value={newItem} onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            placeholder="Add an item..."
            className="flex-1 p-4 bg-dark-800 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none placeholder-dark-500"/>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="p-4 bg-dark-800 border border-white/10 text-white rounded-xl outline-none text-sm [color-scheme:dark]">
            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={addItem} className="px-4 bg-brand-500 hover:bg-brand-400 text-dark-950 rounded-xl font-black transition">
            <Plus size={20}/>
          </button>
        </div>

        {loading ? <p className="text-center text-dark-400 py-10">Loading...</p> : (
          <div className="space-y-3">
            {filtered.length === 0 && <p className="text-center text-dark-500 py-10">No items yet. Add something!</p>}
            {filtered.map(item => (
              <div key={item.id} onClick={() => togglePacked(item.id)}
                className={`flex justify-between items-center p-4 rounded-2xl border cursor-pointer transition group ${item.isPacked ? 'bg-dark-900 border-dark-700' : 'card-dark hover:border-brand-500/20'}`}>
                <div className="flex items-center gap-4">
                  {item.isPacked
                    ? <CheckCircle2 className="text-brand-500 shrink-0" size={22}/>
                    : <Circle className="text-dark-600 group-hover:text-brand-400 shrink-0 transition" size={22}/>}
                  <div>
                    <span className={`font-semibold ${item.isPacked ? 'text-dark-500 line-through' : 'text-white'}`}>{item.itemName}</span>
                    {item.category && <span className="ml-2 text-xs bg-dark-800 text-dark-400 px-2 py-0.5 rounded-full">{item.category}</span>}
                  </div>
                </div>
                <button onClick={e => deleteItem(e, item.id)}
                  className="text-dark-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1">
                  <Trash2 size={16}/>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
