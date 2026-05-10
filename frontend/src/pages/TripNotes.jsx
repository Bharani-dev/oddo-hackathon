import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3, Plus, Trash2, X, Check } from 'lucide-react';
import { api } from '../api';

export default function TripNotes() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ content: '' });

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/notes/trip/${id}`);
        setNotes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const saveNote = async () => {
    if (!form.content.trim()) return;
    try {
      if (editing) {
        const res = await api.put(`/notes/${editing}`, form);
        setNotes(notes.map(n => n.id === editing ? res.data : n));
        setEditing(null);
      } else {
        const res = await api.post(`/notes/trip/${id}`, form);
        setNotes([res.data, ...notes]);
      }
      setForm({ content: '' });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}`);
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (note) => {
    setEditing(note.id);
    setForm({ content: note.content });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-dark-950/90 backdrop-blur-md border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <button onClick={() => navigate(`/trip/${id}/build`)} className="flex items-center gap-2 text-dark-400 hover:text-white transition">
          <ArrowLeft size={16}/> Itinerary
        </button>
        <span className="font-black">Journal & Notes</span>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ content: '' }); }}
          className="w-9 h-9 bg-brand-500 hover:bg-brand-400 text-dark-950 rounded-full flex items-center justify-center font-black transition">
          <Plus size={18}/>
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <h1 className="text-4xl font-black mb-2">Journal & Notes</h1>
        <p className="text-dark-400 mb-10">Capture your thoughts and reminders.</p>

        {showForm && (
          <div className="card-dark rounded-2xl p-6 mb-8 border border-brand-500/20">
            <h3 className="font-black text-lg mb-3">{editing ? 'Edit Note' : 'New Note'}</h3>
            <textarea value={form.content} onChange={e => setForm({ content: e.target.value })}
              placeholder="Type your note here..."
              rows={4}
              className="w-full p-4 bg-dark-900 border border-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-brand-500 resize-none placeholder-dark-500 font-mono text-sm"/>
            <div className="flex gap-2 mt-3 justify-end">
              <button onClick={() => { setShowForm(false); setEditing(null); }}
                className="px-4 py-2 text-dark-400 hover:bg-dark-800 rounded-xl font-bold transition flex items-center gap-1"><X size={14}/> Cancel</button>
              <button onClick={saveNote}
                className="px-5 py-2 bg-brand-500 hover:bg-brand-400 text-dark-950 rounded-xl font-black transition flex items-center gap-1"><Check size={14}/> Save</button>
            </div>
          </div>
        )}

        {loading ? <p className="text-center py-10 text-dark-400">Loading...</p> :
          notes.length === 0 ? (
            <div className="text-center py-20 text-dark-500">
              <div className="text-5xl mb-4">📝</div>
              <p className="font-medium">No notes yet. Click + to write something.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {notes.map(note => (
                <div key={note.id}
                  className="card-dark p-6 rounded-2xl hover:border-white/10 transition cursor-pointer relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition flex gap-2">
                    <button onClick={() => startEdit(note)} className="p-1.5 hover:text-brand-400 text-dark-400 transition"><Edit3 size={14}/></button>
                    <button onClick={() => deleteNote(note.id)} className="p-1.5 hover:text-red-400 text-dark-400 transition"><Trash2 size={14}/></button>
                  </div>
                  {note.createdAt && (
                    <p className="text-xs font-bold text-brand-400 tracking-wider mb-2">{new Date(note.createdAt).toLocaleDateString()}</p>
                  )}
                  <p className="text-dark-200 leading-relaxed whitespace-pre-wrap font-mono text-sm">{note.content}</p>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}
