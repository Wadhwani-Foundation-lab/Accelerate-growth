import { Check } from 'lucide-react';
import type { RAGStatus } from '../../types';

interface RAGBadgeProps {
  status: RAGStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const statusConfig: Record<RAGStatus, { color: string; bg: string; label: string }> = {
  red: { color: 'bg-rag-red', bg: 'bg-red-100', label: 'Blocked' },
  yellow: { color: 'bg-rag-yellow', bg: 'bg-yellow-100', label: 'At Risk' },
  green: { color: 'bg-rag-green', bg: 'bg-green-100', label: 'On Track' },
  complete: { color: 'bg-rag-complete', bg: 'bg-blue-100', label: 'Complete' },
};

const sizeStyles = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function RAGBadge({ status, size = 'md', showLabel = false }: RAGBadgeProps) {
  const config = statusConfig[status];

  return (
    <div className="inline-flex items-center gap-1.5">
      {status === 'complete' ? (
        <div className={`${sizeStyles[size]} rounded-full bg-rag-complete flex items-center justify-center`}>
          <Check className="w-3 h-3 text-white" />
        </div>
      ) : (
        <div className={`${sizeStyles[size]} rounded-full ${config.color}`} />
      )}
      {showLabel && (
        <span className="text-xs font-medium text-gray-600">{config.label}</span>
      )}
    </div>
  );
}

export function RAGDot({ status }: { status: RAGStatus }) {
  return <RAGBadge status={status} size="sm" />;
}

export function RAGSelector({
  value,
  onChange,
}: {
  value: RAGStatus;
  onChange: (status: RAGStatus) => void;
}) {
  const statuses: RAGStatus[] = ['red', 'yellow', 'green', 'complete'];

  return (
    <div className="flex items-center gap-2">
      {statuses.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`p-1 rounded-full transition-all ${
            value === s ? 'ring-2 ring-offset-1 ring-gray-400 scale-110' : 'opacity-60 hover:opacity-100'
          }`}
        >
          <RAGBadge status={s} size="md" />
        </button>
      ))}
    </div>
  );
}
