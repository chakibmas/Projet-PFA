import { Box, Skeleton, Stack } from '@mui/material';

interface Props {
  rows?: number;
  height?: number;
}

export function LoadingSkeleton({ rows = 3, height = 80 }: Props) {
  return (
    <Stack spacing={2} aria-label="Chargement en cours...">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="rounded" height={height} animation="wave" />
      ))}
    </Stack>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
      gap={3}
      aria-label="Chargement en cours..."
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="rounded" height={200} animation="wave" />
      ))}
    </Box>
  );
}
