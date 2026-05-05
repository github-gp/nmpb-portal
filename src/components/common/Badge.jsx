// Small status/category pill
export default function Badge({ children, color = 'forest', className = '' }) {
  const styles = {
    forest: 'bg-forest-50 text-forest-700 border-forest-200',
    earth:  'bg-earth-50 text-earth-700 border-earth-200',
    blue:   'bg-blue-50 text-blue-700 border-blue-200',
    amber:  'bg-amber-50 text-amber-700 border-amber-200',
    stone:  'bg-stone-100 text-stone-700 border-stone-300',
    gold:   'bg-yellow-50 text-yellow-800 border-yellow-200',
  };
  return (
    <span className={`badge border ${styles[color] || styles.forest} ${className}`}>
      {children}
    </span>
  );
}