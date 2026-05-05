import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already logged in, redirect away
  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(username.trim(), password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  // Demo credentials list — clickable to autofill
  const demoCreds = [
    { label: 'NMPB Admin (all India)', user: 'admin', pw: 'nmpb@2025' },
    { label: 'MP State Board',         user: 'mp_smpb', pw: 'mp@2025' },
    { label: 'Kerala State Board',     user: 'kerala_smpb', pw: 'kl@2025' },
    { label: 'Uttarakhand State Board',user: 'uk_smpb', pw: 'uk@2025' },
    { label: 'Public Viewer',          user: 'public', pw: 'public' },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-forest-800 text-white relative overflow-hidden">
        {/* Decorative leaves */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-forest-700/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-gold-500/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-forest-700 flex items-center justify-center shadow-lg">
            <Leaf className="w-6 h-6 text-gold-400" />
          </div>
          <div>
            <div className="font-display text-xl font-semibold">NMPB Portal</div>
            <div className="text-xs uppercase tracking-widest text-gold-400/90">Ministry of AYUSH · GoI</div>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="font-display text-5xl leading-[1.05] mb-6">
            India's medicinal heritage,<br />
            <span className="italic text-gold-400">rooted in data.</span>
          </h1>
          <p className="text-forest-100/80 leading-relaxed">
            A unified repository of every project sanctioned by the National Medicinal Plants Board — searchable, filterable, and mapped across the nation.
          </p>
        </div>

        <div className="relative z-10 text-xs text-forest-200/60 font-mono">
          v1.0 · {new Date().getFullYear()}
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-8 bg-stone-50">
        <div className="w-full max-w-md">
          <h2 className="font-display text-3xl text-forest-900 mb-2">Sign in</h2>
          <p className="text-sm text-forest-600 mb-8">
            Use your NMPB or State Board credentials.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              Sign in <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-white border border-forest-100 rounded-xl">
            <div className="text-xs uppercase tracking-wider font-semibold text-forest-700 mb-2">
              Demo credentials
            </div>
            <div className="space-y-1">
              {demoCreds.map(c => (
                <button
                  key={c.user}
                  onClick={() => { setUsername(c.user); setPassword(c.pw); }}
                  className="w-full text-left text-xs text-forest-600 hover:bg-forest-50 px-2 py-1.5 rounded flex justify-between"
                >
                  <span>{c.label}</span>
                  <span className="font-mono text-forest-400">{c.user}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}