import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface ArchivedTask {
  id: string;
  title: string;
  completed: boolean;
  date: string;
}

interface TaskGroup {
  date: string;
  tasks: ArchivedTask[];
}

export default function TaskArchive() {
  const archivedTasks = JSON.parse(localStorage.getItem('archivedTasks') || '[]');
  
  // Group tasks by date
  const groupedTasks: TaskGroup[] = archivedTasks.reduce((groups: TaskGroup[], task: ArchivedTask) => {
    const existingGroup = groups.find(group => group.date === task.date);
    if (existingGroup) {
      existingGroup.tasks.push(task);
    } else {
      groups.push({ date: task.date, tasks: [task] });
    }
    return groups;
  }, []);

  // Sort groups by date (most recent first)
  groupedTasks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Task Archive</h2>
      
      <div className="space-y-8">
        {groupedTasks.map((group, index) => (
          <motion.div
            key={group.date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b pb-6 last:border-b-0"
          >
            <h3 className="text-lg font-semibold mb-4 text-indigo-600">
              {format(new Date(group.date), 'MMMM d, yyyy')}
            </h3>
            
            <div className="space-y-2">
              {group.tasks.map(task => (
                <motion.div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    readOnly
                    className="h-5 w-5 text-indigo-600 rounded cursor-not-allowed"
                  />
                  <span className={task.completed ? 'line-through text-gray-500' : ''}>
                    {task.title}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {groupedTasks.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No archived tasks yet. Completed tasks will appear here automatically.
          </div>
        )}
      </div>
    </div>
  );
}