"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    
    setTasks([...tasks, {
      id: Date.now(),
      text: newTask,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: 'medium'
    }]);
    setNewTask('');
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEditing = (task) => {
    setIsEditing(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: editText } : task
    ));
    setIsEditing(null);
  };

  const cancelEdit = () => {
    setIsEditing(null);
  };

  const changePriority = (id, priority) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, priority } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    if (filter === 'high-priority') return task.priority === 'high';
    if (filter === 'medium-priority') return task.priority === 'medium';
    if (filter === 'low-priority') return task.priority === 'low';
    return true;
  });

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const pendingTasksCount = tasks.filter(task => !task.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="text-indigo-600 hover:text-indigo-800 transition-colors">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
              </div>
            </Link>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                ToDoList
              </h1>
            </div>
            <div className="w-24"></div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Add New Task</h2>
              <form onSubmit={addTask} className="flex">
                <input
                  type="text"
                  className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none"
                  placeholder="What needs to be done?"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-r-lg transition-colors"
                >
                  Add Task
                </button>
              </form>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-gray-600 font-medium">{pendingTasksCount} {pendingTasksCount === 1 ? 'task' : 'tasks'} remaining</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setFilter('all')} 
                    className={`px-3 py-1 rounded-md text-sm ${filter === 'all' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setFilter('active')} 
                    className={`px-3 py-1 rounded-md text-sm ${filter === 'active' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Active
                  </button>
                  <button 
                    onClick={() => setFilter('completed')} 
                    className={`px-3 py-1 rounded-md text-sm ${filter === 'completed' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Completed
                  </button>
                  <button 
                    onClick={() => setFilter('high-priority')} 
                    className={`px-3 py-1 rounded-md text-sm ${filter === 'high-priority' ? 'bg-red-100 text-red-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    High Priority</button>
                  <button 
                    onClick={() => setFilter('medium-priority')} 
                    className={`px-3 py-1 rounded-md text-sm ${filter === 'medium-priority' ? 'bg-yellow-100 text-yellow-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Medium Priority
                  </button>
                  <button 
                    onClick={() => setFilter('low-priority')} 
                    className={`px-3 py-1 rounded-md text-sm ${filter === 'low-priority' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Low Priority
                  </button>
                </div>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">No tasks to display</p>
                  <p className="text-gray-400 mt-2">
                    {searchQuery ? 'Try adjusting your search' : 'Add a task to get started'}
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {filteredTasks.map(task => (
                    <li key={task.id} className={`bg-white border rounded-lg shadow-sm p-4 transition-all ${
                      task.completed ? 'opacity-70' : ''
                    }`}>
                      {isEditing === task.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-grow px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            autoFocus
                          />
                          <button 
                            onClick={() => saveEdit(task.id)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                          >
                            Save
                          </button>
                          <button 
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-1">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => toggleComplete(task.id)}
                              className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <div className="ml-3 flex-1">
                              <div className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                {task.text}
                              </div>
                              <div className="flex mt-1 text-xs items-center">
                                <span className={`mr-2 ${getPriorityColor(task.priority)}`}>
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                                </span>
                                <span className="text-gray-400">
                                  {new Date(task.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="relative group">
                              <button className="text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                              </button>
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                                <button 
                                  onClick={() => changePriority(task.id, 'high')}
                                  className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-100 text-red-600"
                                >
                                  High Priority
                                </button>
                                <button 
                                  onClick={() => changePriority(task.id, 'medium')}
                                  className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-100 text-yellow-600"
                                >
                                  Medium Priority
                                </button>
                                <button 
                                  onClick={() => changePriority(task.id, 'low')}
                                  className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-100 text-green-600"
                                >
                                  Low Priority
                                </button>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button 
                                  onClick={() => startEditing(task)}
                                  className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-100 text-gray-700"
                                >
                                  Edit Task
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {tasks.some(task => task.completed) && (
                <div className="mt-6 text-center">
                  <button 
                    onClick={clearCompleted}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear completed tasks
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Productivity Tips</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Break large tasks into smaller, manageable chunks.</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Use the priority system to focus on what matters most.</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Review your tasks at the beginning and end of each day.</span>
              </li>
            </ul>
          </div>

          <div className="text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} ToDoList. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}