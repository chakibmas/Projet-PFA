import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import { ReactNode } from 'react';

interface Props {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({
  title = 'Aucun résultat',
  description = 'Il n\'y a rien à afficher pour le moment.',
  icon,
  action,
}: Props) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      gap={2}
      aria-live="polite"
    >
      {icon ?? <InboxIcon sx={{ fontSize: 64, color: 'text.disabled' }} aria-hidden />}
      <Typography variant="h6" color="text.secondary" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.disabled" textAlign="center" maxWidth={360}>
        {description}
      </Typography>
      {action && (
        <Button variant="outlined" onClick={action.onClick} sx={{ mt: 1 }}>
          {action.label}
        </Button>
      )}
    </Box>
  );
}
