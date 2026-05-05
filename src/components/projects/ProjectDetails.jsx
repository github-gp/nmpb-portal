import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Building2, User, IndianRupee, Clock, Leaf, Tag, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PROJECTS } from '../data/projects';
import { CATEGORIES } from '../data/categories';
import { formatINR, formatINRFull, formatDate, getStatusStyle } from '../utils/formatters';

export default function ProjectDetail() {
  const { id } = useParams();
  const { filterByRole, isStateBoard, user } = useAuth();

  const project = PROJECTS.find((p) => p.id === id);

  // Project doesn't exist
  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto text-amber-500 mb-3" />
        <h1 className="font-display text-2xl text-forest-900">Project not found</h1>
        <p className="text-forest-600 mt-2">No project exists with ID: <code>{id}</code></p>
        <Link to="/projects" className="btn-primary inline-flex mt-6">Back to projects</Link>
      </div>
    );
  }

  // Project exists but user can't access it (state board trying to view another state)
  const accessible = filterByRole([project]);
  if (accessible.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto text-amber-500 mb-3" />
        <h1 className="font-display text-2xl text-forest-900">Access restricted</h1>
        <p className="text-forest-600 mt-2">
          This project is in <strong>{project.state}</strong>. Your account can only view projects in <strong>{user.state}</strong>.
        </p>
        <Link to="/projects" className="btn-primary inline-flex mt-6">Back to your projects</Link>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === project.category);

  // Find related projects (same plant or same state)
  const related = PROJECTS.filter(
    (p) => p.id !== project.id && (p.plant === project.plant || p.state === project.state)
  ).slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1 text-sm text-forest-600 hover:text-forest-800 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to projects
      </Link>

      {/* Hero card */}
      <div className="card mb-6 bg-gradient-to-br from-white to-forest-50/40 border-forest-200">
        <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-forest-500 uppercase tracking-wider bg-white px-2 py-1 rounded border border-forest-100">
              {project.id}
            </span>
            <span className={`badge border ${getStatusStyle(project.status)}`}>{project.status}</span>
            {category && (
              <span className="badge border bg-white text-forest-700 border-forest-200">
                <span className="w-2 h-2 rounded-full mr-1.5" style={{ background: category.color }} />
                {category.label}
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-forest-500">Sanctioned</div>
            <div className="font-display text-2xl text-forest-800 font-semibold">
              {formatINRFull(project.fund)}
            </div>
          </div>
        </div>

        <h1 className="font-display text-3xl md:text-4xl text-forest-900 leading-tight">
          {project.title}
        </h1>
        <p className="text-forest-700 mt-3 leading-relaxed">{project.description}</p>
      </div>

      {/* Detail grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <DetailCard icon={MapPin} label="Location">
          <div className="font-medium text-forest-900">{project.city}</div>
          <div className="text-sm text-forest-600">{project.state}</div>
        </DetailCard>

        <DetailCard icon={Leaf} label="Medicinal Plant">
          <div className="font-medium text-forest-900">{project.plant}</div>
        </DetailCard>

        <DetailCard icon={Building2} label="Implementing Institution">
          <div className="font-medium text-forest-900">{project.institution}</div>
        </DetailCard>

        <DetailCard icon={User} label="Principal Investigator">
          <div className="font-medium text-forest-900">{project.pi}</div>
        </DetailCard>

        <DetailCard icon={Calendar} label="Sanction Date">
          <div className="font-medium text-forest-900">{formatDate(project.sanctionDate)}</div>
        </DetailCard>

        <DetailCard icon={Clock} label="Duration">
          <div className="font-medium text-forest-900">
            {project.duration} months
            <span className="text-sm text-forest-500 ml-1">
              (~{Math.round(project.duration / 12 * 10) / 10} years)
            </span>
          </div>
        </DetailCard>
      </div>

      {/* Related projects */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-2xl text-forest-900 mb-3">Related projects</h2>
          <p className="text-sm text-forest-600 mb-4">Projects on the same plant or in the same state</p>
          <div className="grid md:grid-cols-2 gap-3">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className="card hover:border-forest-300 hover:shadow-soft transition-all"
              >
                <div className="text-xs font-mono text-forest-500 mb-1">{p.id}</div>
                <h3 className="font-display text-base text-forest-900 line-clamp-2">{p.title}</h3>
                <div className="flex justify-between items-center mt-3 text-xs text-forest-600">
                  <span>{p.city}, {p.state}</span>
                  <span className="font-display font-semibold text-forest-800">{formatINR(p.fund)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailCard({ icon: Icon, label, children }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-forest-500 mb-2">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      {children}
    </div>
  );
}