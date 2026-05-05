import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, ArrowUpRight } from 'lucide-react';
import { formatINR, formatDate, getStatusStyle } from '../../utils/formatters';
import { CATEGORIES } from '../../data/categories';

export default function ProjectsTable({ projects }) {
  const [sortKey, setSortKey] = useState('sanctionDate');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = [...projects].sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const getCategoryLabel = (id) =>
    CATEGORIES.find((c) => c.id === id)?.label || id;

  if (projects.length === 0) {
    return (
      <div className="card text-center py-16 text-forest-500">
        <p className="font-display text-xl mb-1">No projects match your filters</p>
        <p className="text-sm">Try clearing some filters or adjusting your search.</p>
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-forest-50/60 border-b border-forest-100">
            <tr>
              <Th name="id" label="Project ID" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <Th name="title" label="Title" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <Th name="state" label="State" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <Th name="category" label="Category" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <Th name="fund" label="Fund" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
              <Th name="sanctionDate" label="Sanctioned" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <Th name="status" label="Status" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => (
              <tr
                key={p.id}
                className={`border-b border-forest-50 hover:bg-forest-50/40 transition-colors ${
                  i % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'
                }`}
              >
                <td className="px-4 py-3 font-mono text-xs text-forest-600 whitespace-nowrap">
                  {p.id}
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <div className="font-medium text-forest-900 line-clamp-2 leading-snug">
                    {p.title}
                  </div>
                  <div className="text-xs text-forest-500 mt-0.5">
                    {p.plant} · {p.institution}
                  </div>
                </td>
                <td className="px-4 py-3 text-forest-700 whitespace-nowrap">
                  <div>{p.state}</div>
                  <div className="text-xs text-forest-500">{p.city}</div>
                </td>
                <td className="px-4 py-3 text-forest-700 text-xs">
                  {getCategoryLabel(p.category)}
                </td>
                <td className="px-4 py-3 text-right font-display font-semibold text-forest-800 whitespace-nowrap">
                  {formatINR(p.fund)}
                </td>
                <td className="px-4 py-3 text-forest-600 text-xs whitespace-nowrap">
                  {formatDate(p.sanctionDate)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`badge border ${getStatusStyle(p.status)}`}>{p.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/projects/${p.id}`}
                    className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-900 text-xs font-medium"
                  >
                    View <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ name, label, sortKey, sortDir, onSort, align = 'left' }) {
  const active = sortKey === name;
  return (
    <th
      onClick={() => onSort(name)}
      className={`px-4 py-3 text-${align} text-xs font-semibold uppercase tracking-wider text-forest-700 cursor-pointer select-none hover:bg-forest-100/40`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active && (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
      </span>
    </th>
  );
}