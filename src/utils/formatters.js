// Indian currency formatter (lakhs/crores)
export const formatINR = (amount) => {
  if (amount == null) return '—';
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Full numeric INR with commas
export const formatINRFull = (amount) => {
  if (amount == null) return '—';
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Friendly date
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Status badge color
export const getStatusStyle = (status) => {
  const map = {
    'Ongoing':         'bg-blue-50 text-blue-700 border-blue-200',
    'Completed':       'bg-forest-50 text-forest-700 border-forest-200',
    'Pending Approval':'bg-amber-50 text-amber-700 border-amber-200',
    'On Hold':         'bg-stone-100 text-stone-700 border-stone-300',
  };
  return map[status] || 'bg-stone-50 text-stone-700 border-stone-200';
};