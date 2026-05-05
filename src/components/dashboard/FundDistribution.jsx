import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CATEGORIES } from '../../data/categories';
import { formatINR } from '../../utils/formatters';

export default function FundDistribution({ projects }) {
  // Group fund by category
  const data = CATEGORIES.map((cat) => {
    const total = projects
      .filter((p) => p.category === cat.id)
      .reduce((s, p) => s + p.fund, 0);
    return { name: cat.label, value: total, color: cat.color, id: cat.id };
  }).filter((d) => d.value > 0);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="card">
      <h3 className="font-display text-lg text-forest-900 mb-1">Fund Distribution</h3>
      <p className="text-xs text-forest-500 mb-4">By project category · {formatINR(total)} total</p>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.id} fill={entry.color} stroke="#fff" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatINR(value)}
            contentStyle={{
              background: '#163220',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            iconType="circle"
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}