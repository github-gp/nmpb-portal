import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

export default function ProjectsByYear({ projects }) {
  // Group by year
  const data = Object.values(
    projects.reduce((acc, p) => {
      acc[p.year] = acc[p.year] || { year: p.year, count: 0 };
      acc[p.year].count += 1;
      return acc;
    }, {})
  ).sort((a, b) => a.year - b.year);

  return (
    <div className="card">
      <h3 className="font-display text-lg text-forest-900 mb-1">Projects by Year</h3>
      <p className="text-xs text-forest-500 mb-4">Sanctions per year of inception</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12, fill: '#523a25' }}
            axisLine={{ stroke: '#bbd7c0' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#523a25' }}
            axisLine={{ stroke: '#bbd7c0' }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: '#163220',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 12,
            }}
            cursor={{ fill: '#dcebde' }}
          />
          <Bar dataKey="count" fill="#3f7d4f" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}