import { Download, FolderOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PROJECTS } from '../data/projects';
import { useFilters } from '../hooks/useFilters';
import { exportToCSV } from '../utils/exportData';
import FilterPanel from '../components/projects/FilterPanel';
import ProjectsTable from '../components/projects/ProjectsTable';
import SearchBar from '../components/common/SearchBar';

export default function Projects() {
  const { filterByRole, user } = useAuth();
  const accessible = filterByRole(PROJECTS);
  const { filters, setFilters, filtered } = useFilters(accessible);

  const handleExport = () => {
    const filename = `nmpb-projects-${new Date().toISOString().slice(0, 10)}.csv`;
    exportToCSV(filtered, filename);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-forest-600 text-sm mb-1">
            <FolderOpen className="w-4 h-4" />
            Repository
          </div>
          <h1 className="text-3xl md:text-4xl font-display text-forest-900">
            All Projects
          </h1>
          <p className="text-forest-600 mt-1">
            Browse, filter, and export the complete project repository.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={filtered.length === 0 || user?.role === 'viewer'}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title={user?.role === 'viewer' ? 'Export disabled for public viewers' : 'Download as CSV'}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search bar — full width above grid */}
      <div className="mb-6">
        <SearchBar
          value={filters.search}
          onChange={(v) => setFilters((p) => ({ ...p, search: v }))}
          placeholder="Search by title, plant, PI, institution, project ID…"
        />
      </div>

      {/* Two-column layout: filters + table */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          totalCount={accessible.length}
          filteredCount={filtered.length}
        />
        <div className="min-w-0">
          <ProjectsTable projects={filtered} />
          {filtered.length > 0 && (
            <p className="text-xs text-forest-500 mt-3 text-center">
              Showing {filtered.length} of {accessible.length} projects · Click any row to view full details
            </p>
          )}
        </div>
      </div>
    </div>
  );
}