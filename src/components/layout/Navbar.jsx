import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Leaf, LogOut, MapPin, FolderOpen, BarChart3, FileText,
  LayoutDashboard, Menu, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: FolderOpen },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/reports', label: 'Reports', icon: FileText },
  ];

  // Auto-close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className="bg-white border-b border-forest-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group min-w-0">
          <div className="w-9 h-9 rounded-xl bg-forest-700 flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform shrink-0">
            <Leaf className="w-5 h-5 text-gold-400" />
          </div>
          <div className="leading-tight min-w-0">
            <div className="font-display text-base md:text-lg font-semibold text-forest-900 truncate">
              NMPB Portal
            </div>
            <div className="text-[10px] uppercase tracking-widest text-forest-500 truncate hidden sm:block">
              National Medicinal Plants Board
            </div>
          </div>
        </Link>

        {/* Desktop nav (md and up) */}
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

        {/* Right side: user info + logout (desktop) / hamburger (mobile) */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* User info — only on larger screens */}
          {user && (
            <div className="hidden lg:flex flex-col items-end leading-tight">
              <span className="text-sm font-medium text-forest-900">{user.name}</span>
              <span className="text-xs text-forest-500 flex items-center gap-1">
                {user.state ? <><MapPin className="w-3 h-3" /> {user.state}</> : 'All India Access'}
              </span>
            </div>
          )}

          {/* Logout (desktop) */}
          <button
            onClick={logout}
            className="hidden md:flex p-2 rounded-lg text-forest-600 hover:bg-forest-50 hover:text-forest-800 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>

          {/* Hamburger toggle (mobile only) */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-forest-700 hover:bg-forest-50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 top-16 bg-forest-900/30 backdrop-blur-sm z-30"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-down panel */}
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-forest-100 shadow-lg z-40 animate-in slide-in-from-top">
            {/* User info in mobile */}
            {user && (
              <div className="px-4 py-4 bg-forest-50/50 border-b border-forest-100">
                <div className="text-sm font-semibold text-forest-900">{user.name}</div>
                <div className="text-xs text-forest-600 flex items-center gap-1 mt-0.5">
                  {user.state
                    ? <><MapPin className="w-3 h-3" /> {user.state}</>
                    : 'All India Access'}
                </div>
              </div>
            )}

            {/* Nav links */}
            <nav className="flex flex-col py-2">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-5 py-3 text-base font-medium transition-colors
                    ${isActive
                      ? 'bg-forest-50 text-forest-800 border-l-4 border-forest-700'
                      : 'text-forest-700 hover:bg-forest-50/60 border-l-4 border-transparent'}`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </NavLink>
              ))}

              {/* Logout in mobile drawer */}
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="flex items-center gap-3 px-5 py-3 text-base font-medium text-red-700 hover:bg-red-50 transition-colors border-t border-forest-100 mt-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}