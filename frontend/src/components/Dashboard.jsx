import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      let url = '/tasks';
      
      // Admin can filter tasks
      if (user?.role === 'admin' && filter === 'my') {
        
      }
      
      const response = await api.get(url);
      let fetchedTasks = response.data.data;
      
      
      if (user?.role === 'admin' && filter === 'my') {
        fetchedTasks = fetchedTasks.filter(task => task.user?._id === user.id);
      }
      
      setTasks(fetchedTasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      setTasks([response.data.data, ...tasks]);
      setShowForm(false);
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Create task error:', error);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await api.put(`/tasks/${editingTask._id}`, taskData);
      setTasks(tasks.map(t => t._id === editingTask._id ? response.data.data : t));
      setEditingTask(null);
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Update task error:', error);
     
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Delete task error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'admin' ? (
              <>
                <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium mr-2">
                  ADMIN
                </span>
                Viewing {filter === 'my' ? 'your tasks' : 'all tasks'}
              </>
            ) : (
              'Your tasks'
            )}
          </p>
        </div>
        
        <div className="flex space-x-3">
          {/* Admin filter buttons  */}
          {user?.role === 'admin' && (
            <div className="flex rounded-md shadow-sm mr-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                All Tasks
              </button>
              <button
                onClick={() => setFilter('my')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                  filter === 'my'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                My Tasks
              </button>
            </div>
          )}
          
          {!showForm && !editingTask && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Task
            </button>
          )}
        </div>
      </div>

      {(showForm || editingTask) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <TaskForm
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            initialData={editingTask || {}}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        </div>
      )}

      {/* Task stats for admin  */}
      {user?.role === 'admin' && tasks.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'completed').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {tasks.filter(t => t.status !== 'completed').length}
            </p>
          </div>
        </div>
      )}

      <TaskList
        tasks={tasks}
        onEdit={(task) => {
          setEditingTask(task);
          setShowForm(false);
        }}
        onDelete={handleDeleteTask}
        currentUser={user} 
      />
    </div>
  );
};

export default Dashboard;