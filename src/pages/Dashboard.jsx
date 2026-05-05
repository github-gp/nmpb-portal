import { useAuth } from '../context/AuthContext';
import { PROJECTS } from '../data/projects';
import { formatINR } from '../utils/formatters';
import { FolderOpen, IndianRupee, MapPin, CheckCircle2, TrendingUp } from 'lucide-react';
import IndiaMap from '../components/dashboard/IndiaMap';
import ProjectsByYear from '../components/dashboard/ProjectsByYear';
import FundDistribution from '../components/dashboard/FundDistribution';

export default function Dashboard() {
  const { user, filterByRole, isStateBoard } = useAuth();
  const myProjects = filterByRole(PROJECTS);

  const stats = {
    total: myProjects.length,
    fund: myProjects.reduce((s, p) => s + p.fund, 0),
    states: new Set(myProjects.map(p => p.state)).size,
    cities: new Set(myProjects.map(p => p.city)).size,
    completed: myProjects.filter(p => p.status === 'Completed').length,
    ongoing: myProjects.filter(p => p.status === 'Ongoing').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display text-forest-900">
          Welcome back, <span className="italic text-forest-700">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-forest-600 mt-1">
          {isStateBoard
            ? <>Showing projects sanctioned in <strong>{user.state}</strong></>
            : 'A bird\'s-eye view of NMPB-funded projects across India'}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={FolderOpen}
          label="Total Projects"
          value={stats.total}
          sublabel={`${stats.ongoing} ongoing`}
        />
        <StatCard
          icon={IndianRupee}
          label="Fund Sanctioned"
          value={formatINR(stats.fund)}
          sublabel="Cumulative"
        />
        <StatCard
          icon={MapPin}
          label={isStateBoard ? 'Cities' : 'States Covered'}
          value={isStateBoard ? stats.cities : stats.states}
          sublabel={isStateBoard ? 'in your state' : `${stats.cities} cities`}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={stats.completed}
          sublabel={`${stats.total ? Math.round(stats.completed / stats.total * 100) : 0}% of total`}
        />
      </div>

      {/* Map (full width) */}
      <div className="mb-8">
        <IndiaMap projects={myProjects} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <ProjectsByYear projects={myProjects} />
        <FundDistribution projects={myProjects} />
      </div>

      {/* Insight banner */}
      <div className="card bg-forest-50/50 border-forest-200 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-forest-700 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-gold-400" />
        </div>
        <div>
          <h4 className="font-display text-base text-forest-900">At a glance</h4>
          <p className="text-sm text-forest-700 mt-1 leading-relaxed">
            Across {stats.total} projects, NMPB has sanctioned {formatINR(stats.fund)} in
            funding{isStateBoard ? '' : ` reaching ${stats.states} states`}.
            {' '}{stats.completed} projects have been completed and {stats.ongoing} are currently ongoing.
            Click any dot on the map to see all projects from that city.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sublabel }) {
  return (
    <div className="card flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-forest-50 to-forest-100 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-forest-700" />
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-forest-500">{label}</div>
        <div className="text-2xl font-display font-semibold text-forest-900 truncate">{value}</div>
        {sublabel && <div className="text-xs text-forest-500 mt-0.5">{sublabel}</div>}
      </div>
    </div>
  );
}