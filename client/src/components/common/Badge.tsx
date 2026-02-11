import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'prime' | 'core' | 'select';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  prime: 'bg-purple-100 text-purple-700',
  core: 'bg-blue-100 text-blue-700',
  select: 'bg-amber-100 text-amber-700',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function TierBadge({ tier }: { tier: 'prime' | 'core' | 'select' }) {
  const labels = { prime: 'Prime', core: 'Core', select: 'Select' };
  return <Badge variant={tier}>{labels[tier]}</Badge>;
}
