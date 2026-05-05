import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-forest-700">Loading…</div>
      </div>
    );
  }

  if (!user) {
    // Save the location they were trying to reach
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}