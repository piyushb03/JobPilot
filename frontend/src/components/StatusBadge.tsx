import type { ApplicationStatus } from '../types';

const CONFIG: Record<ApplicationStatus, { label: string; className: string }> = {
  Applied: { label: 'Applied', className: 'badge-applied' },
  Interview: { label: 'Interview', className: 'badge-interview' },
  Offer: { label: 'Offer', className: 'badge-offer' },
  Reject: { label: 'Rejected', className: 'badge-reject' },
  Withdrawn: { label: 'Withdrawn', className: 'badge-withdrawn' },
};

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = CONFIG[status] ?? { label: status, className: 'badge-withdrawn' };
  const sizeClass = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${sizeClass} ${config.className}`}>
      {config.label}
    </span>
  );
}
