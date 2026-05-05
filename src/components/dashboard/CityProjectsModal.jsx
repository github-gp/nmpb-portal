import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, MapPin, IndianRupee, Calendar, ArrowUpRight } from 'lucide-react';
import { formatINR, formatDate, getStatusStyle } from '../../utils/formatters';
import { CATEGORIES } from '../../data/categories';

export default function CityProjectsModal({ city, projects, onClose }) {
  // Close on ESC key
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const getCategoryLabel = (id) =>
    CATEGORIES.find(c => c.id === id)?.label || id;

  const totalFund = projects.reduce((s, p) => s + p.fund, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/40 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-forest-100 flex items-start justify-between bg-gradient-to-br from-forest-50 to-white">
          <div>
            <div className="flex items-center gap-2 text-forest-600 text-sm">
              <MapPin className="w-4 h-4" />
              {city.state}
            </div>
            <h2 className="font-display text-3xl text-forest-900 mt-0.5">{city.city}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-forest-700">
              <span>
                <strong className="font-semibold">{projects.length}</strong> project
                {projects.length > 1 ? 's' : ''}
              </span>
              <span className="text-forest-300">·</span>
              <span className="flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5" />
                {formatINR(totalFund)} sanctioned
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-forest-100 text-forest-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Projects list */}
        <div className="overflow-y-auto p-4 space-y-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="group block p-4 rounded-xl border border-forest-100 hover:border-forest-300 hover:shadow-card transition-all bg-white"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono text-forest-500 uppercase tracking-wider">
                      {p.id}
                    </span>
                    <span className={`badge border ${getStatusStyle(p.status)}`}>
                      {p.status}
                    </span>
                  </div>
                  <h3 className="font-display text-base text-forest-900 leading-snug group-hover:text-forest-700 transition">
                    {p.title}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-forest-600 mt-2">
                    <span><strong className="font-medium">PI:</strong> {p.pi}</span>
                    <span><strong className="font-medium">Plant:</strong> {p.plant}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {formatDate(p.sanctionDate)}
                    </span>
                  </div>
                  <div className="text-xs text-forest-500 mt-1.5 italic">
                    {getCategoryLabel(p.category)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-display text-lg font-semibold text-forest-800">
                    {formatINR(p.fund)}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-forest-400 group-hover:text-forest-700 ml-auto mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-forest-100 bg-stone-50 text-xs text-forest-500 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-white rounded border border-forest-200 font-mono">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
}