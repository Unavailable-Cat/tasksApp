import { useState, useEffect } from 'react';
import { Check, Trash2, Pencil, X, Loader2 } from 'lucide-react';
import type { Task } from '@/types';
import {
  updateTaskTitle,
  updateTaskDescription,
  updateTaskStatus,
  deleteTask,
} from '@/api';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (task: Task) => void;
}

type EditingField = 'title' | 'description' | null;

export function TaskCard({ task, onDelete, onUpdate }: TaskCardProps) {
  const [editing, setEditing] = useState<EditingField>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (editing === 'title') setEditValue(task.title);
    if (editing === 'description') setEditValue(task.description);
  }, [editing, task.title, task.description]);

  const startEdit = (field: EditingField) => {
    setEditing(field);
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditValue('');
  };

  const saveEdit = async () => {
    if (!editing || !editValue.trim()) {
      cancelEdit();
      return;
    }
    setSaving(true);
    try {
      if (editing === 'title') {
        await updateTaskTitle(task.id, editValue.trim());
        onUpdate({ ...task, title: editValue.trim() });
      } else {
        await updateTaskDescription(task.id, editValue.trim());
        onUpdate({ ...task, description: editValue.trim() });
      }
      setEditing(null);
    } catch {
      // keep editing state on error
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      await updateTaskStatus(task.id, !task.status);
      onUpdate({ ...task, status: !task.status });
    } catch {
      // ignore
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(task.id);
      await onDelete(task.id);
    } catch {
      setDeleting(false);
    }
  };

  const handleEditKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div
      className={`group rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
        task.status
          ? 'border-slate-200 opacity-75'
          : 'border-slate-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
            task.status
              ? 'border-teal-600 bg-teal-600 text-white'
              : 'border-slate-300 hover:border-teal-500'
          } disabled:opacity-50`}
          aria-label={task.status ? 'Mark as not done' : 'Mark as done'}
        >
          {toggling ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            task.status && <Check className="h-3 w-3" strokeWidth={3} />
          )}
        </button>

        <div className="min-w-0 flex-1">
          {editing === 'title' ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKey}
              onBlur={saveEdit}
              autoFocus
              disabled={saving}
              className="w-full rounded-lg border border-teal-400 bg-slate-50 px-2 py-1 text-sm font-semibold text-slate-800 outline-none"
            />
          ) : (
            <h3
              onClick={() => !task.status && startEdit('title')}
              className={`text-sm font-semibold ${
                task.status
                  ? 'text-slate-400 line-through'
                  : 'text-slate-800 cursor-pointer hover:text-teal-600'
              }`}
            >
              {task.title}
            </h3>
          )}

          {editing === 'description' ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKey}
              onBlur={saveEdit}
              autoFocus
              rows={2}
              disabled={saving}
              className="mt-1 w-full resize-none rounded-lg border border-teal-400 bg-slate-50 px-2 py-1 text-sm text-slate-600 outline-none"
            />
          ) : (
            task.description && (
              <p
                onClick={() => startEdit('description')}
                className={`mt-1 text-sm ${
                  task.status
                    ? 'text-slate-400 line-through'
                    : 'text-slate-500 cursor-pointer hover:text-slate-700'
                }`}
              >
                {task.description}
              </p>
            )
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {editing ? (
            <>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="rounded-lg p-1.5 text-teal-600 hover:bg-teal-50 disabled:opacity-50"
                aria-label="Save"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                aria-label="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => startEdit('title')}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Edit title"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                aria-label="Delete task"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
