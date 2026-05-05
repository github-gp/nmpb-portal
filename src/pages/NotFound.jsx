import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="text-7xl font-display text-forest-300 mb-2">404</div>
      <h1 className="text-2xl font-display text-forest-900">Page not found</h1>
      <p className="text-forest-600 mt-2 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">Go to Dashboard</Link>
    </div>
  );
}