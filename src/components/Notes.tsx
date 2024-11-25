import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      timestamp: Date.now(),
    };
    setNotes([...notes, newNote]);
    setActiveNote(newNote);
    setTitle(newNote.title);
    setContent(newNote.content);
  };

  const saveNote = () => {
    if (!activeNote) return;
    
    const updatedNotes = notes.map(note =>
      note.id === activeNote.id
        ? { ...note, title, content, timestamp: Date.now() }
        : note
    );
    setNotes(updatedNotes);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (activeNote?.id === id) {
      setActiveNote(null);
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col md:flex-row">
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Notes</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={createNewNote}
            className="text-indigo-600 hover:text-indigo-700"
          >
            <Plus size={24} />
          </motion.button>
        </div>
        
        <div className="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
          {notes.map(note => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => {
                setActiveNote(note);
                setTitle(note.title);
                setContent(note.content);
              }}
              className={`p-3 rounded-lg cursor-pointer ${
                activeNote?.id === note.id
                  ? 'bg-indigo-100'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium truncate">{note.title}</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
              <p className="text-sm text-gray-500 truncate">{note.content}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 min-h-[calc(100vh-20rem)] md:min-h-0">
        {activeNote ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold w-full focus:outline-none"
                placeholder="Note Title"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={saveNote}
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Save size={20} />
              </motion.button>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[calc(100%-4rem)] p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Start writing..."
            />
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a note or create a new one
          </div>
        )}
      </div>
    </div>
  );
}