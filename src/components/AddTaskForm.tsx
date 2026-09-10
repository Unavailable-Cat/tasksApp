import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import type { TaskRequest } from '@/types';

interface AddTaskFormProps {
  onAdd: (task: TaskRequest) => Promise<void>;
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await onAdd({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
      setExpanded(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setExpanded(true)}
          placeholder="Add a new task..."
          className="flex-1 bg-transparent text-base text-slate-800 placeholder-slate-400 outline-none"
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add
        </button>
      </div>

      {expanded && (
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)..."
          rows={2}
          className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-teal-400 focus:bg-white"
          disabled={submitting}
        />
      )}

      {error && (
        <p className="mt-2 text-sm text-rose-600">{error}</p>
      )}
    </form>
  );
}
