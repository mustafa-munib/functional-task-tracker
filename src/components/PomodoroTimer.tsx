import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: number | undefined;

    if (isActive) {
      interval = window.setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            if (mode === 'work') {
              setMode('break');
              setMinutes(5);
            } else {
              setMode('work');
              setMinutes(25);
            }
            return;
          }
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setMinutes(25);
    setSeconds(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
      <h2 className="text-2xl font-bold mb-6">Pomodoro Timer</h2>
      
      <div className="mb-8">
        <div className="text-6xl font-bold mb-4">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        
        <div className="text-lg font-medium text-indigo-600 mb-6">
          {mode === 'work' ? 'Work Time' : 'Break Time'}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={toggleTimer}
            className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors"
          >
            {isActive ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button
            onClick={resetTimer}
            className="bg-gray-200 text-gray-700 p-3 rounded-full hover:bg-gray-300 transition-colors"
          >
            <RefreshCw size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}