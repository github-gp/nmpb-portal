import { useState } from 'react';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, STATUS_TYPES, FUND_RANGES } from '../../data/categories';
import { STATES } from '../../data/states';
import { getYears, getPlants } from '../../data/projects';
import { useAuth } from '../../context/AuthContext';

export default function FilterPanel({ filters, setFilters, totalCount, filteredCount }) {
  const { isStateBoard, user } = useAuth();
  const years = getYears();
  const plants = getPlants();

  // Build state list — for state-board users, lock it to their state
  const stateOptions = isStateBoard ? [user.state] : STATES;

  // Toggle a value within an array filter
  const toggleArrayFilter = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key] || [];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const setSingleFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? null : value }));

  const clearAll = () =>
    setFilters({
      years: [],
      states: [],
      categories: [],
      statuses: [],
      plants: [],
      fundRange: null,
      search: filters.search, // preserve text search
    });

  const activeCount =
    (filters.years?.length || 0) +
    (filters.states?.length || 0) +
    (filters.categories?.length || 0) +
    (filters.statuses?.length || 0) +
    (filters.plants?.length || 0) +
    (filters.fundRange ? 1 : 0);

  return (
    <aside className="card sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-forest-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-forest-700" />
          <h3 className="font-display text-lg text-forest-900">Filters</h3>
          {activeCount > 0 && (
            <span className="text-xs bg-forest-700 text-white px-2 py-0.5 rounded-full font-medium">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-forest-600 hover:text-forest-800 flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      <div className="text-xs text-forest-500 mb-4">
        Showing <strong className="text-forest-800">{filteredCount}</strong> of {totalCount}
      </div>

      {/* Year filter */}
      <FilterSection title="Year">
        <div className="flex flex-wrap gap-1.5">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => toggleArrayFilter('years', y)}
              className={`px-2.5 py-1 text-xs rounded-md border transition ${
                filters.years?.includes(y)
                  ? 'bg-forest-700 border-forest-700 text-white'
                  : 'bg-white border-forest-200 text-forest-700 hover:border-forest-400'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Status filter */}
      <FilterSection title="Status">
        <div className="space-y-1.5">
          {STATUS_TYPES.map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer text-sm text-forest-700 hover:text-forest-900">
              <input
                type="checkbox"
                checked={filters.statuses?.includes(s) || false}
                onChange={() => toggleArrayFilter('statuses', s)}
                className="rounded border-forest-300 text-forest-700 focus:ring-forest-500"
              />
              {s}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Category filter */}
      <FilterSection title="Project Category">
        <div className="space-y-1.5">
          {CATEGORIES.map((c) => (
            <label key={c.id} className="flex items-center gap-2 cursor-pointer text-sm text-forest-700 hover:text-forest-900">
              <input
                type="checkbox"
                checked={filters.categories?.includes(c.id) || false}
                onChange={() => toggleArrayFilter('categories', c.id)}
                className="rounded border-forest-300 text-forest-700 focus:ring-forest-500"
              />
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
              <span className="truncate">{c.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* State filter — disabled for state-board users */}
      {!isStateBoard && (
        <FilterSection title="State">
          <select
            multiple
            value={filters.states || []}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, (o) => o.value);
              setFilters((prev) => ({ ...prev, states: values }));
            }}
            className="input-field h-32 text-sm"
          >
            {stateOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <p className="text-[10px] text-forest-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
        </FilterSection>
      )}

      {/* Fund range filter */}
      <FilterSection title="Fund Range">
        <div className="space-y-1.5">
          {FUND_RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setSingleFilter('fundRange', r.id)}
              className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md border transition ${
                filters.fundRange === r.id
                  ? 'bg-earth-100 border-earth-400 text-earth-800 font-medium'
                  : 'bg-white border-forest-200 text-forest-700 hover:border-forest-400'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Plant filter */}
      <FilterSection title="Medicinal Plant" defaultOpen={false}>
        <div className="max-h-40 overflow-y-auto space-y-1">
          {plants.map((p) => (
            <label key={p} className="flex items-center gap-2 cursor-pointer text-xs text-forest-700 hover:text-forest-900">
              <input
                type="checkbox"
                checked={filters.plants?.includes(p) || false}
                onChange={() => toggleArrayFilter('plants', p)}
                className="rounded border-forest-300 text-forest-700 focus:ring-forest-500"
              />
              {p}
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}

// Collapsible section
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4 pb-4 border-b border-forest-100 last:border-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left mb-2"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-forest-700">
          {title}
        </span>
        <ChevronDown className={`w-4 h-4 text-forest-500 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && children}
    </div>
  );
}