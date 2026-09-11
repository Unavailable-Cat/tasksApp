import { useState, useEffect, useCallback } from 'react';
import { CheckSquare, Loader2, AlertCircle, Inbox } from 'lucide-react';
import type { Task, TaskRequest } from '@/types';
import {
  getAllTasks,
  addTask,
  deleteTask as apiDeleteTask,
} from '@/api';
import { AddTaskForm } from '@/components/AddTaskForm';
import { FilterBar } from '@/components/FilterBar';
import { TaskCard } from '@/components/TaskCard';

type Filter = 'all' | 'active' | 'completed';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not reach the backend server'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAdd = async (task: TaskRequest) => {
    await addTask(task);
    await loadTasks();
  };

  const handleDelete = async (id: string) => {
    await apiDeleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdate = (updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.status).length,
    completed: tasks.filter((t) => t.status).length,
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.status;
    if (filter === 'completed') return t.status;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white">
              <CheckSquare className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Task Manager</h1>
              <p className="text-sm text-slate-500">
                {counts.active} task{counts.active !== 1 ? 's' : ''} left to do
              </p>
            </div>
          </div>
        </header>

        <AddTaskForm onAdd={handleAdd} />

        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            <div>
              <p className="text-sm font-medium text-rose-800">
                Could not connect to backend
              </p>
              <p className="mt-0.5 text-sm text-rose-600">{error}</p>
              <button
                onClick={loadTasks}
                className="mt-2 text-sm font-semibold text-rose-700 underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {!error && (
          <>
            <FilterBar
              filter={filter}
              onFilterChange={setFilter}
              counts={counts}
            />

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Inbox className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600">
                  {filter === 'all'
                    ? 'No tasks yet'
                    : filter === 'active'
                    ? 'No active tasks'
                    : 'No completed tasks'}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {filter === 'all'
                    ? 'Add your first task above'
                    : filter === 'active'
                    ? 'All caught up!'
                    : 'Complete a task to see it here'}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <footer className="mt-8 text-center text-xs text-slate-400">
            Hosted on Netlify
        </footer>
      </div>
    </div>
  );
}

export default App;
