import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { membershipsApi } from '../api/membershipsApi';
import { MembershipStatusChip } from '../components/MembershipStatusChip';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { getErrorMessage } from '@/shared/api/apiClient';

export function MyMembershipsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['memberships', 'me'],
    queryFn: () => membershipsApi.getMine(),
  });

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3} component="h1">
        Mes adhésions
      </Typography>

      {isLoading && <LoadingSkeleton rows={3} height={80} />}
      {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />}
      {!isLoading && !isError && data?.length === 0 && (
        <EmptyState title="Aucune adhésion" description="Vous n'avez rejoint aucun club pour le moment." />
      )}
      {!isLoading && !isError && data && (
        <Stack gap={2}>
          {data.map((m) => (
            <Card key={m.id}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {m.clubName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Demande du {new Date(m.appliedAt).toLocaleDateString('fr-FR')}
                    </Typography>
                  </Box>
                  <MembershipStatusChip status={m.status} />
                </Stack>
                {m.motivation && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {m.motivation}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
