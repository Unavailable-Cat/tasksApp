import { ListTodo, CheckCircle2, Clock } from 'lucide-react';

type Filter = 'all' | 'active' | 'completed';

interface FilterBarProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  counts: { all: number; active: number; completed: number };
}

const FILTERS: { key: Filter; label: string; icon: typeof ListTodo }[] = [
  { key: 'all', label: 'All', icon: ListTodo },
  { key: 'active', label: 'Active', icon: Clock },
  { key: 'completed', label: 'Done', icon: CheckCircle2 },
];

export function FilterBar({ filter, onFilterChange, counts }: FilterBarProps) {
  return (
    <div className="mb-4 flex items-center gap-1 rounded-xl bg-slate-100 p-1">
      {FILTERS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            filter === key
              ? 'bg-white text-teal-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Icon className="h-4 w-4" />
          {label}
          <span
            className={`ml-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold ${
              filter === key
                ? 'bg-teal-50 text-teal-600'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {counts[key]}
          </span>
        </button>
      ))}
    </div>
  );
}
