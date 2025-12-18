import { Badge } from '@/components/ui/badge';
import type { RiskLevel } from '@/types/api';

const variantMap: Record<RiskLevel, 'success' | 'warning' | 'danger' | 'neutral'> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
  unknown: 'neutral',
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <Badge variant={variantMap[level]} className="uppercase tracking-wide">{level} risk</Badge>;
}
