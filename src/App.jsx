import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';

export default function App() {
  const { user } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col">
      {user && !isLoginPage && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/projects" element={
            <ProtectedRoute><Projects /></ProtectedRoute>
          } />
          <Route path="/projects/:id" element={
            <ProtectedRoute><ProjectDetail /></ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute><Analytics /></ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute><Reports /></ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {user && !isLoginPage && <Footer />}
    </div>
  );
}