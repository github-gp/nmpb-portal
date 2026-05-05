import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-forest-600 hover:text-forest-800 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to projects
      </Link>
      <h1 className="text-3xl font-display">Project: {id}</h1>
      <p className="text-forest-600 mt-2">Full project details view — coming next.</p>
    </div>
  );
}