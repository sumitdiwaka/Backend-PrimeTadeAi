import { useState } from 'react';

const TaskForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    status: initialData.status || 'pending',
    priority: initialData.priority || 'medium'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Get priority color for visual feedback
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 border-red-200 bg-red-50';
      case 'medium': return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      case 'low': return 'text-green-600 border-green-200 bg-green-50';
      default: return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  // Get status color for visual feedback
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-600 border-green-200 bg-green-50';
      case 'in-progress': return 'text-blue-600 border-blue-200 bg-blue-50';
      case 'pending': return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      default: return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Field */}
      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Task Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Give your task a clear, descriptive title
        </p>
      </div>

      {/* Description Field */}
      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add details about your task..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white resize-none"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Optional: Add any additional details or notes
        </p>
      </div>

      {/* Status and Priority Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Field */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Status
            </span>
          </label>
          <div className="relative">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full appearance-none px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 cursor-pointer ${getStatusColor(formData.status)}`}
            >
              <option value="pending" className="bg-white text-gray-900">⏳ Pending</option>
              <option value="in-progress" className="bg-white text-gray-900">🔄 In Progress</option>
              <option value="completed" className="bg-white text-gray-900">✅ Completed</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Priority Field */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Priority
            </span>
          </label>
          <div className="relative">
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={`w-full appearance-none px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 cursor-pointer ${getPriorityColor(formData.priority)}`}
            >
              <option value="low" className="bg-white text-gray-900">🟢 Low</option>
              <option value="medium" className="bg-white text-gray-900">🟡 Medium</option>
              <option value="high" className="bg-white text-gray-900">🔴 High</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Card (Optional visual feedback) */}
      <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Task Preview</h4>
        <div className="flex items-center space-x-3">
          <div className={`w-1 h-8 rounded-full ${
            formData.priority === 'high' ? 'bg-red-500' :
            formData.priority === 'medium' ? 'bg-yellow-500' :
            'bg-green-500'
          }`}></div>
          <div className="flex-1">
            <p className="font-medium text-gray-800">
              {formData.title || 'Untitled Task'}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                formData.status === 'completed' ? 'bg-green-100 text-green-800' :
                formData.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {formData.status === 'pending' && '⏳ Pending'}
                {formData.status === 'in-progress' && '🔄 In Progress'}
                {formData.status === 'completed' && '✅ Completed'}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                formData.priority === 'high' ? 'bg-red-100 text-red-800' :
                formData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {formData.priority === 'high' && '🔴 High'}
                {formData.priority === 'medium' && '🟡 Medium'}
                {formData.priority === 'low' && '🟢 Low'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="group relative px-6 py-2.5 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Cancel
            </span>
          </button>
        )}
        <button
          type="submit"
          className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 overflow-hidden"
        >
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200"></span>
          <span className="relative z-10 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {initialData._id ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              )}
            </svg>
            {initialData._id ? 'Update Task' : 'Create Task'}
          </span>
        </button>
      </div>

      {/* Form Footer Note */}
      <p className="text-xs text-center text-gray-400 mt-4">
        Fields marked with <span className="text-red-500">*</span> are required
      </p>
    </form>
  );
};

export default TaskForm;