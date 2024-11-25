import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TaskTracker from './components/TaskTracker';
import TaskArchive from './components/TaskArchive';
import PomodoroTimer from './components/PomodoroTimer';
import Notes from './components/Notes';
import Calendar from './components/Calendar';
import Quote from './components/Quote';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';

export default function App() {
  const [activeSection, setActiveSection] = useState('tasks');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [playClick] = useSound('/sounds/click.mp3', { volume: 0.5 });

  const handleSectionChange = (section: string) => {
    playClick();
    setActiveSection(section);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'tasks':
        return <TaskTracker />;
      case 'archive':
        return <TaskArchive />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'notes':
        return <Notes />;
      case 'calendar':
        return <Calendar />;
      default:
        return <TaskTracker />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu size={24} />
      </motion.button>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-64 bg-indigo-900 h-full overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar
                activeSection={activeSection}
                setActiveSection={(section) => {
                  handleSectionChange(section);
                  setIsMobileMenuOpen(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden md:block">
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={handleSectionChange}
        />
      </div>

      <div className="pt-16 md:pt-0 md:ml-64 p-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Quote />
          </motion.div>
          
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg min-h-[calc(100vh-12rem)]"
          >
            {renderActiveSection()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}