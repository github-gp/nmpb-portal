import { useState, useMemo } from 'react';
import {
  FileText, Download, Calendar, Building2, Leaf,
  IndianRupee, Filter, FileSpreadsheet, FileBarChart,
  CheckCircle2, Clock, AlertCircle, MapPin,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PROJECTS } from '../data/projects';
import { CATEGORIES, STATUS_TYPES } from '../data/categories';
import { formatINR, formatDate } from '../utils/formatters';
import { exportToCSV } from '../utils/exportData';

export default function Reports() {
  const { filterByRole, isStateBoard, user } = useAuth();
  const projects = filterByRole(PROJECTS);
  const isViewer = user?.role === 'viewer';

  const reports = useMemo(
    () => [
      {
        id: 'annual-summary',
        title: 'Annual Summary',
        description: 'Year-wise breakdown of all projects sanctioned',
        icon: Calendar,
        accent: 'forest',
        getData: () => projects,
        getStats: () => {
          const years = new Set(projects.map((p) => p.year));
          return [
            { label: 'Years covered', value: years.size },
            { label: 'Total projects', value: projects.length },
            { label: 'Total fund', value: formatINR(projects.reduce((s, p) => s + p.fund, 0)) },
          ];
        },
      },
      {
        id: 'completed',
        title: 'Completed Projects',
        description: 'All projects with status "Completed"',
        icon: CheckCircle2,
        accent: 'forest',
        getData: () => projects.filter((p) => p.status === 'Completed'),
        getStats: () => {
          const completed = projects.filter((p) => p.status === 'Completed');
          return [
            { label: 'Completed', value: completed.length },
            { label: 'Total fund', value: formatINR(completed.reduce((s, p) => s + p.fund, 0)) },
            { label: 'Avg. duration', value: completed.length
              ? `${Math.round(completed.reduce((s, p) => s + p.duration, 0) / completed.length)} mo`
              : '—' },
          ];
        },
      },
      {
        id: 'ongoing',
        title: 'Ongoing Projects',
        description: 'Currently active projects under implementation',
        icon: Clock,
        accent: 'earth',
        getData: () => projects.filter((p) => p.status === 'Ongoing'),
        getStats: () => {
          const ongoing = projects.filter((p) => p.status === 'Ongoing');
          return [
            { label: 'Ongoing', value: ongoing.length },
            { label: 'Committed fund', value: formatINR(ongoing.reduce((s, p) => s + p.fund, 0)) },
            { label: 'Avg. duration', value: ongoing.length
              ? `${Math.round(ongoing.reduce((s, p) => s + p.duration, 0) / ongoing.length)} mo`
              : '—' },
          ];
        },
      },
      {
        id: 'high-value',
        title: 'High-Value Projects (> ₹50 Lakh)',
        description: 'Projects sanctioned for over ₹50 Lakh',
        icon: IndianRupee,
        accent: 'gold',
        getData: () => projects.filter((p) => p.fund > 5000000),
        getStats: () => {
          const hv = projects.filter((p) => p.fund > 5000000);
          return [
            { label: 'Projects', value: hv.length },
            { label: 'Total fund', value: formatINR(hv.reduce((s, p) => s + p.fund, 0)) },
            { label: '% of total', value: projects.length
              ? `${Math.round(hv.length / projects.length * 100)}%`
              : '—' },
          ];
        },
      },
      {
        id: 'cultivation',
        title: 'Cultivation Projects',
        description: 'All cultivation & agro-techniques projects',
        icon: Leaf,
        accent: 'forest',
        getData: () => projects.filter((p) => p.category === 'cultivation'),
        getStats: () => {
          const data = projects.filter((p) => p.category === 'cultivation');
          return [
            { label: 'Projects', value: data.length },
            { label: 'Total fund', value: formatINR(data.reduce((s, p) => s + p.fund, 0)) },
            { label: 'Plants covered', value: new Set(data.map((p) => p.plant)).size },
          ];
        },
      },
      {
        id: 'rd',
        title: 'R&D Projects',
        description: 'Research & development projects',
        icon: FileBarChart,
        accent: 'earth',
        getData: () => projects.filter((p) => p.category === 'rd'),
        getStats: () => {
          const data = projects.filter((p) => p.category === 'rd');
          return [
            { label: 'Projects', value: data.length },
            { label: 'Total fund', value: formatINR(data.reduce((s, p) => s + p.fund, 0)) },
            { label: 'Institutions', value: new Set(data.map((p) => p.institution)).size },
          ];
        },
      },
      {
        id: 'institution-wise',
        title: 'Institution-Wise Master Report',
        description: 'Projects grouped by implementing institution',
        icon: Building2,
        accent: 'forest',
        getData: () => projects,
        getStats: () => [
          { label: 'Institutions', value: new Set(projects.map((p) => p.institution)).size },
          { label: 'Total projects', value: projects.length },
          { label: 'Total fund', value: formatINR(projects.reduce((s, p) => s + p.fund, 0)) },
        ],
      },
      ...(!isStateBoard ? [{
        id: 'state-wise',
        title: 'State-Wise Master Report',
        description: 'Projects grouped by state',
        icon: MapPin,
        accent: 'gold',
        getData: () => projects,
        getStats: () => [
          { label: 'States', value: new Set(projects.map((p) => p.state)).size },
          { label: 'Cities', value: new Set(projects.map((p) => p.city)).size },
          { label: 'Total fund', value: formatINR(projects.reduce((s, p) => s + p.fund, 0)) },
        ],
      }] : []),
    ],
    [projects, isStateBoard]
  );

  const handleDownload = (report) => {
    const data = report.getData();
    const filename = `nmpb-${report.id}-${new Date().toISOString().slice(0, 10)}.csv`;
    exportToCSV(data, filename);
  };

  const handleDownloadAll = () => {
    const filename = `nmpb-master-${new Date().toISOString().slice(0, 10)}.csv`;
    exportToCSV(projects, filename);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-forest-600 text-sm mb-1">
            <FileText className="w-4 h-4" /> Reports
          </div>
          <h1 className="text-3xl md:text-4xl font-display text-forest-900">
            Pre-built reports
          </h1>
          <p className="text-forest-600 mt-1">
            Download structured reports as CSV. {isStateBoard && <>Limited to <strong>{user.state}</strong> data.</>}
          </p>
        </div>
        <button
          onClick={handleDownloadAll}
          disabled={isViewer || projects.length === 0}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Download All ({projects.length})
        </button>
      </div>

      {isViewer && (
        <div className="card mb-6 bg-amber-50 border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900">Public viewer access</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Report downloads are disabled for public viewer accounts. Sign in with NMPB or State Board credentials to export data.
            </p>
          </div>
        </div>
      )}

      {/* Reports grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r) => (
          <ReportCard
            key={r.id}
            report={r}
            disabled={isViewer || r.getData().length === 0}
            onDownload={() => handleDownload(r)}
          />
        ))}
      </div>

      {/* Custom report tip */}
      <div className="card mt-8 bg-forest-50/50 border-forest-200 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-forest-700 flex items-center justify-center shrink-0">
          <Filter className="w-5 h-5 text-gold-400" />
        </div>
        <div>
          <h4 className="font-display text-base text-forest-900">Need a custom report?</h4>
          <p className="text-sm text-forest-700 mt-1 leading-relaxed">
            Use the Projects page to apply any combination of filters — year, state, category,
            fund range, status, plant — and click <strong>Export CSV</strong> to download exactly
            what you need.
          </p>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ report, disabled, onDownload }) {
  const Icon = report.icon;
  const data = report.getData();
  const stats = report.getStats();

  const accents = {
    forest: { bg: 'bg-forest-100', text: 'text-forest-700', border: 'border-forest-200' },
    earth:  { bg: 'bg-earth-100',  text: 'text-earth-700',  border: 'border-earth-200' },
    gold:   { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  };
  const a = accents[report.accent] || accents.forest;

  return (
    <div className={`card flex flex-col hover:shadow-soft transition-shadow ${a.border}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${a.bg} ${a.text} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg text-forest-900 leading-tight">{report.title}</h3>
          <p className="text-xs text-forest-500 mt-0.5">{report.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 my-3 py-3 border-y border-forest-100">
        {stats.map((s, i) => (
          <div key={i} className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-forest-500">{s.label}</div>
            <div className="font-display text-sm font-semibold text-forest-900 mt-0.5 truncate">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onDownload}
        disabled={disabled}
        className="btn-secondary mt-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        Download CSV ({data.length} rows)
      </button>
    </div>
  );
}
