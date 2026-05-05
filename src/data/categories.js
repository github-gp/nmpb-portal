// NMPB project categories (based on actual NMPB scheme components)
export const CATEGORIES = [
  { id: 'cultivation', label: 'Cultivation & Agro-techniques', color: '#3f7d4f' },
  { id: 'conservation', label: 'In-situ / Ex-situ Conservation', color: '#629b6f' },
  { id: 'rd', label: 'Research & Development', color: '#a07640' },
  { id: 'qpm', label: 'Quality Planting Material', color: '#825d33' },
  { id: 'awareness', label: 'IEC / Awareness', color: '#d4af37' },
  { id: 'market', label: 'Market Linkage & Value Addition', color: '#67492a' },
  { id: 'training', label: 'Training & Capacity Building', color: '#8fbb98' },
  { id: 'survey', label: 'Survey, Inventory & Documentation', color: '#b8915f' },
];

export const STATUS_TYPES = ['Ongoing', 'Completed', 'Pending Approval', 'On Hold'];

export const FUND_RANGES = [
  { id: 'small', label: '< ₹10 Lakh', min: 0, max: 1000000 },
  { id: 'medium', label: '₹10 Lakh – ₹50 Lakh', min: 1000000, max: 5000000 },
  { id: 'large', label: '₹50 Lakh – ₹1 Cr', min: 5000000, max: 10000000 },
  { id: 'major', label: '> ₹1 Cr', min: 10000000, max: Infinity },
];