import { Chip } from '@mui/material';
import { StatutAdhesion } from '@/shared/types/membership.types';

const config: Record<StatutAdhesion, { label: string; color: 'warning' | 'success' | 'error' }> = {
  EN_ATTENTE: { label: 'En attente', color: 'warning' },
  APPROUVEE: { label: 'Approuvée', color: 'success' },
  REFUSEE: { label: 'Refusée', color: 'error' },
};

interface Props {
  status: StatutAdhesion;
}

export function MembershipStatusChip({ status }: Props) {
  const { label, color } = config[status] ?? { label: status, color: 'default' };
  return <Chip label={label} color={color} size="small" />;
}
