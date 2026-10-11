import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface DataIntegrityBadgeProps {
  type?: 'verified' | 'demonstration' | 'policy';
  label?: string;
  className?: string;
}

export const DataIntegrityBadge: React.FC<DataIntegrityBadgeProps> = ({
  type = 'verified',
  label,
  className = ''
}) => {
  if (type === 'demonstration') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200/80 rounded px-2 py-0.5 ${className}`}>
        <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
        <span>{label || 'Demonstration Prototype Data'}</span>
      </span>
    );
  }

  if (type === 'policy') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200/80 rounded px-2 py-0.5 ${className}`}>
        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
        <span>{label || 'Official Library Policy Enforced'}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded px-2 py-0.5 ${className}`}>
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
      <span>{label || 'Verified University Catalogue Standard'}</span>
    </span>
  );
};
