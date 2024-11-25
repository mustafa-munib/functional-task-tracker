import React from 'react';
import { Layout, CheckSquare, Clock, StickyNote, Calendar, Archive } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const navItems: NavItem[] = [
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { id: 'archive', label: 'Archive', icon: <Archive size={20} /> },
    { id: 'pomodoro', label: 'Pomodoro', icon: <Clock size={20} /> },
    { id: 'notes', label: 'Notes', icon: <StickyNote size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
  ];

  return (
    <div className="bg-indigo-900 text-white h-screen w-64 fixed left-0 top-0 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-8"
      >
        <Layout className="h-8 w-8" />
        <h1 className="text-xl font-bold">Productivity Hub</h1>
      </motion.div>
      
      <nav className="space-y-2">
        {navItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeSection === item.id
                ? 'bg-indigo-700 shadow-lg'
                : 'hover:bg-indigo-800'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>
    </div>
  );
}