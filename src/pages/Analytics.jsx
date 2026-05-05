import { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts';
import { TrendingUp, Leaf, Layers, MapPin, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PROJECTS } from '../data/projects';
import { CATEGORIES } from '../data/categories';
import { formatINR } from '../utils/formatters';

export default function Analytics() {
  const { filterByRole, isStateBoard, user } = useAuth();
  const projects = filterByRole(PROJECTS);
  const [activeTab, setActiveTab] = useState('overview');

  // -------- Derived datasets --------
  // Year-wise project count + total fund
  const yearTrend = useMemo(() => {
    const map = {};
    projects.forEach((p) => {
      map[p.year] = map[p.year] || { year: p.year, count: 0, fund: 0 };
      map[p.year].count += 1;
      map[p.year].fund += p.fund;
    });
    return Object.values(map).sort((a, b) => a.year - b.year);
  }, [projects]);

  // State-wise distribution (top 10)
  const stateDistribution = useMemo(() => {
    const map = {};
    projects.forEach((p) => {
      map[p.state] = map[p.state] || { state: p.state, count: 0, fund: 0 };
      map[p.state].count += 1;
      map[p.state].fund += p.fund;
    });
    return Object.values(map)
      .sort((a, b) => b.fund - a.fund)
      .slice(0, 10);
  }, [projects]);

  // Top medicinal plants by project count
  const topPlants = useMemo(() => {
    const map = {};
    projects.forEach((p) => {
      // Skip "Multiple" — not a single plant
      if (p.plant === 'Multiple') return;
      map[p.plant] = map[p.plant] || { plant: p.plant, count: 0, fund: 0 };
      map[p.plant].count += 1;
      map[p.plant].fund += p.fund;
    });
    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [projects]);

  // Category-wise breakdown
  const categoryBreakdown = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const items = projects.filter((p) => p.category === cat.id);
      return {
        id: cat.id,
        label: cat.label,
        color: cat.color,
        count: items.length,
        fund: items.reduce((s, p) => s + p.fund, 0),
      };
    }).filter((c) => c.count > 0);
  }, [projects]);

  // Status breakdown
  const statusData = useMemo(() => {
    const map = {};
    projects.forEach((p) => {
      map[p.status] = (map[p.status] || 0) + 1;
    });
    return Object.entries(map).map(([status, count]) => ({ status, count }));
  }, [projects]);

  // Average fund per project (year-wise)
  const avgFundByYear = useMemo(() => {
    return yearTrend.map((y) => ({
      year: y.year,
      avgFund: Math.round(y.fund / y.count),
    }));
  }, [yearTrend]);

  // Cumulative fund
  const cumulativeFund = useMemo(() => {
    let total = 0;
    return yearTrend.map((y) => {
      total += y.fund;
      return { year: y.year, cumulative: total };
    });
  }, [yearTrend]);

  // -------- Headline numbers --------
  const totalFund = projects.reduce((s, p) => s + p.fund, 0);
  const avgFund = projects.length ? totalFund / projects.length : 0;
  const completionRate = projects.length
    ? Math.round((projects.filter((p) => p.status === 'Completed').length / projects.length) * 100)
    : 0;
  const yearsActive = new Set(projects.map((p) => p.year)).size;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'geo', label: 'Geographic', icon: MapPin },
    { id: 'plants', label: 'Plants', icon: Leaf },
    { id: 'categories', label: 'Categories', icon: Layers },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-forest-600 text-sm mb-1">
          <TrendingUp className="w-4 h-4" /> Insights
        </div>
        <h1 className="text-3xl md:text-4xl font-display text-forest-900">Analytics</h1>
        <p className="text-forest-600 mt-1">
          {isStateBoard
            ? <>Funding patterns and trends in <strong>{user.state}</strong></>
            : 'Funding patterns, geographic spread, and plant-wise insights'}
        </p>
      </div>

      {/* Headline KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPI label="Total Fund Disbursed" value={formatINR(totalFund)} accent="forest" />
        <KPI label="Avg. Fund / Project" value={formatINR(avgFund)} accent="earth" />
        <KPI label="Completion Rate" value={`${completionRate}%`} accent="gold" />
        <KPI label="Years of Activity" value={yearsActive} accent="forest" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-forest-100 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === id
                ? 'border-forest-700 text-forest-800'
                : 'border-transparent text-forest-500 hover:text-forest-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <ChartCard
            title="Funding Trend Over Years"
            subtitle="Total sanctioned amount per year"
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={yearTrend}>
                <defs>
                  <linearGradient id="fundGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3f7d4f" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#3f7d4f" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#523a25' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#523a25' }}
                  tickFormatter={(v) => formatINR(v)}
                />
                <Tooltip
                  formatter={(v) => formatINR(v)}
                  contentStyle={tooltipStyle}
                />
                <Area
                  type="monotone"
                  dataKey="fund"
                  stroke="#234e30"
                  strokeWidth={2}
                  fill="url(#fundGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Projects Sanctioned Per Year"
            subtitle="Yearly volume of approvals"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={yearTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#523a25' }} />
                <YAxis tick={{ fontSize: 12, fill: '#523a25' }} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#dcebde' }} />
                <Bar dataKey="count" fill="#a07640" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Cumulative Fund Disbursed"
            subtitle="Running total over the years"
          >
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={cumulativeFund}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#523a25' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#523a25' }}
                  tickFormatter={(v) => formatINR(v)}
                />
                <Tooltip formatter={(v) => formatINR(v)} contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#c89b1f"
                  strokeWidth={3}
                  dot={{ fill: '#c89b1f', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Average Fund Per Project"
            subtitle="Typical grant size each year"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={avgFundByYear}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#523a25' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#523a25' }}
                  tickFormatter={(v) => formatINR(v)}
                />
                <Tooltip formatter={(v) => formatINR(v)} contentStyle={tooltipStyle} cursor={{ fill: '#f0e9dc' }} />
                <Bar dataKey="avgFund" fill="#3f7d4f" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Project Status Distribution"
            subtitle="How projects are progressing"
            className="lg:col-span-2"
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#523a25' }} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="status"
                  tick={{ fontSize: 12, fill: '#523a25' }}
                  width={130}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#dcebde' }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {statusData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.status === 'Completed' ? '#3f7d4f' :
                        entry.status === 'Ongoing' ? '#629b6f' :
                        entry.status === 'Pending Approval' ? '#d4af37' :
                        '#a8a29e'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {activeTab === 'geo' && (
        <div className="space-y-6">
          {isStateBoard ? (
            <div className="card text-center py-12 text-forest-500">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-forest-300" />
              <p className="font-display text-xl">Geographic comparison is for All-India view</p>
              <p className="text-sm mt-1">
                As a state board user, you only see projects from {user.state}. Switch to NMPB Admin to compare states.
              </p>
            </div>
          ) : (
            <>
              <ChartCard
                title="Top 10 States by Funding"
                subtitle="Cumulative fund sanctioned"
              >
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stateDistribution} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: '#523a25' }}
                      tickFormatter={(v) => formatINR(v)}
                    />
                    <YAxis
                      type="category"
                      dataKey="state"
                      tick={{ fontSize: 12, fill: '#523a25' }}
                      width={130}
                    />
                    <Tooltip formatter={(v) => formatINR(v)} contentStyle={tooltipStyle} cursor={{ fill: '#dcebde' }} />
                    <Bar dataKey="fund" fill="#234e30" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Top 10 States by Project Count"
                subtitle="Number of projects sanctioned"
              >
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stateDistribution} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#523a25' }} allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="state"
                      tick={{ fontSize: 12, fill: '#523a25' }}
                      width={130}
                    />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f0e9dc' }} />
                    <Bar dataKey="count" fill="#a07640" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </>
          )}
        </div>
      )}

      {activeTab === 'plants' && (
        <div className="space-y-6">
          <ChartCard
            title="Top 10 Most-Researched Medicinal Plants"
            subtitle="By number of projects"
          >
            {topPlants.length === 0 ? (
              <p className="text-center text-forest-500 py-12">No single-plant projects in this view.</p>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topPlants} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#523a25' }} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="plant"
                    tick={{ fontSize: 12, fill: '#523a25' }}
                    width={130}
                  />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#dcebde' }} />
                  <Bar dataKey="count" fill="#3f7d4f" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard
            title="Funding by Plant"
            subtitle="Total fund disbursed per medicinal plant"
          >
            {topPlants.length === 0 ? (
              <p className="text-center text-forest-500 py-12">No data.</p>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topPlants} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: '#523a25' }}
                    tickFormatter={(v) => formatINR(v)}
                  />
                  <YAxis
                    type="category"
                    dataKey="plant"
                    tick={{ fontSize: 12, fill: '#523a25' }}
                    width={130}
                  />
                  <Tooltip formatter={(v) => formatINR(v)} contentStyle={tooltipStyle} cursor={{ fill: '#f0e9dc' }} />
                  <Bar dataKey="fund" fill="#c89b1f" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-6">
          <ChartCard
            title="Projects by Category"
            subtitle="Distribution across NMPB scheme components"
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={categoryBreakdown} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#523a25' }} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#523a25' }}
                  width={200}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#dcebde' }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {categoryBreakdown.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Funding Allocation by Category"
            subtitle="Total fund disbursed per category"
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={categoryBreakdown} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#523a25' }}
                  tickFormatter={(v) => formatINR(v)}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#523a25' }}
                  width={200}
                />
                <Tooltip formatter={(v) => formatINR(v)} contentStyle={tooltipStyle} cursor={{ fill: '#f0e9dc' }} />
                <Bar dataKey="fund" radius={[0, 6, 6, 0]}>
                  {categoryBreakdown.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  );
}

const tooltipStyle = {
  background: '#163220',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontSize: 12,
};

function KPI({ label, value, accent }) {
  const accents = {
    forest: 'from-forest-50 to-forest-100 text-forest-800',
    earth:  'from-earth-50 to-earth-100 text-earth-800',
    gold:   'from-yellow-50 to-yellow-100 text-yellow-900',
  };
  return (
    <div className={`card bg-gradient-to-br ${accents[accent] || accents.forest} border-0`}>
      <div className="text-xs uppercase tracking-wider opacity-70">{label}</div>
      <div className="font-display text-2xl md:text-3xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <div className={`card ${className}`}>
      <h3 className="font-display text-lg text-forest-900">{title}</h3>
      {subtitle && <p className="text-xs text-forest-500 mb-4">{subtitle}</p>}
      {children}
    </div>
  );
}
