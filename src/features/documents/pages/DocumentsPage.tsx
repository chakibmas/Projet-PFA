import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import { useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '../api/documentsApi';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { useSnackbar } from '@/app/providers/SnackbarContext';
import { getErrorMessage } from '@/shared/api/apiClient';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

export function DocumentsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notify = useSnackbar();
  const qc = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentsApi.list(),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => documentsApi.upload(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] });
      notify('Document uploadé !', 'success');
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
    e.target.value = '';
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h5" fontWeight={700} component="h1">
          Documents
        </Typography>
        <Button
          variant="contained"
          startIcon={uploadMutation.isPending ? <CircularProgress size={18} color="inherit" /> : <UploadFileIcon />}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
          aria-label="Uploader un document"
        >
          Uploader
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileChange}
          aria-label="Sélectionner un fichier"
        />
      </Stack>

      {isLoading && <LoadingSkeleton rows={4} height={52} />}
      {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />}
      {!isLoading && !isError && data?.length === 0 && (
        <EmptyState title="Aucun document" description="Uploadez votre premier document." />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <TableContainer component={Paper}>
          <Table aria-label="Liste des documents">
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Club</TableCell>
                <TableCell>Taille</TableCell>
                <TableCell>Uploadé par</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Télécharger</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((doc) => (
                <TableRow key={doc.id} hover>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.clubName ?? '—'}</TableCell>
                  <TableCell>{formatBytes(doc.sizeBytes)}</TableCell>
                  <TableCell>{doc.uploadedBy}</TableCell>
                  <TableCell>{new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Télécharger">
                      <IconButton
                        component="a"
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Télécharger ${doc.name}`}
                        size="small"
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
