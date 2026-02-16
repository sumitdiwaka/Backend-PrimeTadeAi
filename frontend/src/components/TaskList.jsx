import { useState } from 'react';

const TaskList = ({ tasks, onEdit, onDelete, currentUser }) => {
  const [deletingId, setDeletingId] = useState(null);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setDeletingId(id);
      await onDelete(id);
      setDeletingId(null);
    }
  };

  // Check if user can edit/delete task
  const canModifyTask = (task) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return task.user?._id === currentUser.id || task.user === currentUser.id;
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-gray-500">No tasks found. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => {
        const canModify = canModifyTask(task);
        
        return (
          <div
            key={task._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
              {canModify && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(task)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                    title="Edit task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    disabled={deletingId === task._id}
                    className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 disabled:opacity-50"
                    title="Delete task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3">{task.description || 'No description'}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority} priority
              </span>
            </div>

            {/* Show user info for admin view */}
            {task.user && (
              <div className="text-sm text-gray-500 border-t pt-2 mt-2">
                {typeof task.user === 'object' ? (
                  <div className="flex justify-between">
                    <span>Created by: {task.user.name || 'Unknown'}</span>
                    {task.user.email && (
                      <span className="text-xs text-gray-400">{task.user.email}</span>
                    )}
                  </div>
                ) : (
                  <span>User ID: {task.user}</span>
                )}
              </div>
            )}

            <div className="text-xs text-gray-400 mt-2">
              {new Date(task.createdAt).toLocaleDateString()}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;