import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10 pr-10"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-400 hover:text-forest-700"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}