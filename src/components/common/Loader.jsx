import { Leaf } from 'lucide-react';

export default function Loader({ message = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-forest-500">
      <Leaf className="w-8 h-8 animate-pulse text-forest-400 mb-2" />
      <span className="text-sm">{message}</span>
    </div>
  );
}