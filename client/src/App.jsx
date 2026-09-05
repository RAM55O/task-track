import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import TaskFormModal from './components/TaskFormModal';
import DeleteModal from './components/DeleteModal';
import Toast from './components/Toast';
import {
  getTasks,
  getTaskStats,
  createTask,
  updateTask,
  deleteTask,
} from './api/taskApi';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt_desc');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  // Fetch statistics
  const loadStats = useCallback(async () => {
    try {
      const res = await getTaskStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Fetch tasks based on filters and sorting
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const [sortField, sortOrder] = sortBy.split('_');

      const params = {
        status: statusFilter,
        priority: priorityFilter,
        search: searchQuery,
        sortBy: sortField,
        order: sortOrder,
      };

      const res = await getTasks(params);
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      showToast('Failed to load tasks from server', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, searchQuery, sortBy]);

  // Load initial tasks & stats
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Handlers for Task CRUD operations
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsFormModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      // Edit existing task
      const res = await updateTask(editingTask._id, taskData);
      if (res.success) {
        showToast('Task updated successfully! ✨', 'success');
        loadTasks();
        loadStats();
      }
    } else {
      // Create new task
      const res = await createTask(taskData);
      if (res.success) {
        showToast('New task created successfully! 🚀', 'success');
        loadTasks();
        loadStats();
      }
    }
  };

  const handleStatusChange = async (taskId, nextStatus) => {
    try {
      // Optimistic UI update
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: nextStatus } : t))
      );

      const res = await updateTask(taskId, { status: nextStatus });
      if (res.success) {
        showToast('Task status updated', 'success');
        loadStats();
      }
    } catch (err) {
      console.error('Failed to change status:', err);
      showToast('Could not update task status', 'error');
      loadTasks(); // Rollback on error
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    try {
      setIsDeleting(true);
      const res = await deleteTask(deletingTask._id);
      if (res.success) {
        showToast('Task deleted successfully', 'success');
        setDeletingTask(null);
        loadTasks();
        loadStats();
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      showToast('Failed to delete task', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Header */}
      <Navbar stats={stats} onOpenCreateModal={handleOpenCreateModal} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome / Dashboard header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Workspace Tasks</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Organize, track, and complete your tasks with full MERN CRUD control.
            </p>
          </div>
        </div>

        {/* Filter, Search and Sorting Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          stats={stats}
        />

        {/* Task Cards Grid */}
        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={handleOpenEditModal}
          onDelete={setDeletingTask}
          onStatusChange={handleStatusChange}
          onOpenCreateModal={handleOpenCreateModal}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
        />
      </main>

      {/* Modal: Create / Edit Task */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSaveTask}
        initialData={editingTask}
      />

      {/* Modal: Confirm Delete */}
      <DeleteModal
        isOpen={Boolean(deletingTask)}
        taskTitle={deletingTask?.title || ''}
        deleting={isDeleting}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast notifications */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
}
