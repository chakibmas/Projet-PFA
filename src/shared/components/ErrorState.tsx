import { Box, Typography, Button, Alert } from '@mui/material';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Une erreur est survenue.',
  onRetry,
}: Props) {
  return (
    <Box py={4} aria-live="assertive">
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              Réessayer
            </Button>
          )
        }
      >
        <Typography variant="body2">{message}</Typography>
      </Alert>
    </Box>
  );
}
