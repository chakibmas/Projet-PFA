import { ReactNode } from 'react';
import { Box, Alert } from '@mui/material';
import { UserRole } from '@/shared/types/auth.types';
import { useAuthStore } from '../store/authStore';

interface Props {
  roles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGate({ roles, children, fallback }: Props) {
  const hasRole = useAuthStore((s) => s.hasRole);

  if (!hasRole(roles)) {
    return (
      <>
        {fallback ?? (
          <Box p={4}>
            <Alert severity="warning">
              Accès refusé. Vous n'avez pas les permissions nécessaires pour cette page.
            </Alert>
          </Box>
        )}
      </>
    );
  }

  return <>{children}</>;
}
