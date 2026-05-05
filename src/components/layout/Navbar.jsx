import { Link, NavLink } from 'react-router-dom';
import { Leaf, LogOut, MapPin, FolderOpen, BarChart3, FileText, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: FolderOpen },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/reports', label: 'Reports', icon: FileText },
  ];

  return (
    <header className="bg-white border-b border-forest-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-forest-700 flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform">
            <Leaf className="w-5 h-5 text-gold-400" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold text-forest-900">NMPB Portal</div>
            <div className="text-[10px] uppercase tracking-widest text-forest-500">National Medicinal Plants Board</div>
          </div>
        </Link>

        {/* Nav items */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-forest-50 text-forest-800'
                  : 'text-forest-600 hover:bg-forest-50/60 hover:text-forest-800'}`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-sm font-medium text-forest-900">{user.name}</span>
              <span className="text-xs text-forest-500 flex items-center gap-1">
                {user.state ? <><MapPin className="w-3 h-3" /> {user.state}</> : 'All India Access'}
              </span>
            </div>
          )}
          <button
            onClick={logout}
            className="p-2 rounded-lg text-forest-600 hover:bg-forest-50 hover:text-forest-800 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}