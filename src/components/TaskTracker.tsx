import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string;
}

export default function TaskTracker() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      const parsedTasks = JSON.parse(saved);
      // Archive tasks from previous dates
      const currentTasks = parsedTasks.filter((task: Task) => task.date === today);
      const tasksToArchive = parsedTasks.filter((task: Task) => task.date !== today);
      
      if (tasksToArchive.length > 0) {
        const archivedTasks = JSON.parse(localStorage.getItem('archivedTasks') || '[]');
        localStorage.setItem('archivedTasks', JSON.stringify([...archivedTasks, ...tasksToArchive]));
      }
      
      return currentTasks;
    }
    return [];
  });

  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  const saveToStorage = (updatedTasks: Task[]) => {
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
      date: today
    };
    
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveToStorage(updatedTasks);
    setNewTask('');
  };

  const toggleComplete = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveToStorage(updatedTasks);
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditingText(task.title);
  };

  const saveEdit = () => {
    if (!editingText.trim()) return;
    
    const updatedTasks = tasks.map(task =>
      task.id === editingId ? { ...task, title: editingText } : task
    );
    setTasks(updatedTasks);
    saveToStorage(updatedTasks);
    setEditingId(null);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveToStorage(updatedTasks);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Today's Tasks</h2>
          <p className="text-gray-600">{format(new Date(), 'MMMM d, yyyy')}</p>
        </div>
        
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="36"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="36"
              stroke="#4F46E5"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                strokeDasharray: "251.2",
                strokeDashoffset: "0",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
      
      <form onSubmit={addTask} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={24} />
          </motion.button>
        </div>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {tasks.map(task => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task.id)}
              className="h-5 w-5 text-indigo-600 rounded"
            />
            
            {editingId === task.id ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="flex-1 p-1 border rounded"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={saveEdit}
                  className="text-green-600 hover:text-green-700"
                >
                  <Check size={20} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditingId(null)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X size={20} />
                </motion.button>
              </div>
            ) : (
              <>
                <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </span>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => startEdit(task)}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    <Edit2 size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 py-8"
        >
          No tasks yet. Add your first task above!
        </motion.div>
      )}
    </div>
  );
}