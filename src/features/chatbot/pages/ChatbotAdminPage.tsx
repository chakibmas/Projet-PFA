import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { chatbotApi } from '../api/chatbotApi';
import { FAQFormData } from '@/shared/types/chatbot.types';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { useSnackbar } from '@/app/providers/SnackbarContext';
import { getErrorMessage } from '@/shared/api/apiClient';

const faqSchema = z.object({
  question: z.string().min(5, 'Question requise'),
  answer: z.string().min(10, 'Réponse requise'),
  category: z.string().optional(),
});
type FAQForm = z.infer<typeof faqSchema>;

export function ChatbotAdminPage() {
  const [tab, setTab] = useState(0);
  const [openFAQ, setOpenFAQ] = useState(false);
  const notify = useSnackbar();
  const qc = useQueryClient();

  const { data: faqs, isLoading: faqsLoading, isError: faqsError, error: faqsErr, refetch: refetchFAQs } = useQuery({
    queryKey: ['chatbot', 'faqs'],
    queryFn: () => chatbotApi.getFAQs(),
  });

  const { data: logs, isLoading: logsLoading, isError: logsError, error: logsErr, refetch: refetchLogs } = useQuery({
    queryKey: ['chatbot', 'logs'],
    queryFn: () => chatbotApi.getLogs(),
    enabled: tab === 1,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FAQForm>({
    resolver: zodResolver(faqSchema),
  });

  const createFAQMutation = useMutation({
    mutationFn: (d: FAQFormData) => chatbotApi.createFAQ(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['chatbot', 'faqs'] });
      notify('FAQ ajoutée !', 'success');
      setOpenFAQ(false);
      reset();
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3} component="h1">
        Back-office Chatbot
      </Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }} aria-label="Onglets chatbot">
        <Tab label="FAQs / Intents" id="tab-faqs" aria-controls="panel-faqs" />
        <Tab label="Logs & Feedback" id="tab-logs" aria-controls="panel-logs" />
      </Tabs>

      {/* ── FAQs tab ──────────────────────────────────────────── */}
      <Box role="tabpanel" id="panel-faqs" hidden={tab !== 0}>
        {tab === 0 && (
          <>
            <Stack direction="row" justifyContent="flex-end" mb={2}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenFAQ(true)}>
                Nouvelle FAQ
              </Button>
            </Stack>

            {faqsLoading && <LoadingSkeleton rows={4} height={80} />}
            {faqsError && <ErrorState message={getErrorMessage(faqsErr)} onRetry={() => refetchFAQs()} />}
            {!faqsLoading && !faqsError && faqs?.length === 0 && (
              <EmptyState title="Aucune FAQ" description="Créez votre première entrée FAQ." />
            )}
            {!faqsLoading && !faqsError && faqs && (
              <Stack gap={2}>
                {faqs.map((faq) => (
                  <Card key={faq.id}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" mb={1} flexWrap="wrap" gap={1}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Q: {faq.question}
                        </Typography>
                        {faq.category && <Chip label={faq.category} size="small" variant="outlined" />}
                      </Stack>
                      <Divider sx={{ mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        R: {faq.answer}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </>
        )}
      </Box>

      {/* ── Logs tab ──────────────────────────────────────────── */}
      <Box role="tabpanel" id="panel-logs" hidden={tab !== 1}>
        {tab === 1 && (
          <>
            {logsLoading && <LoadingSkeleton rows={5} height={52} />}
            {logsError && <ErrorState message={getErrorMessage(logsErr)} onRetry={() => refetchLogs()} />}
            {!logsLoading && !logsError && logs?.length === 0 && (
              <EmptyState title="Aucun log" description="Les conversations apparaîtront ici." />
            )}
            {!logsLoading && !logsError && logs && logs.length > 0 && (
              <TableContainer component={Paper}>
                <Table aria-label="Logs chatbot" size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Message utilisateur</TableCell>
                      <TableCell>Réponse bot</TableCell>
                      <TableCell>Escaladé</TableCell>
                      <TableCell>Feedback</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography variant="body2" noWrap title={log.userMessage}>
                            {log.userMessage}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 240 }}>
                          <Typography variant="body2" noWrap title={log.botAnswer}>
                            {log.botAnswer}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={log.escalated ? 'Oui' : 'Non'}
                            size="small"
                            color={log.escalated ? 'warning' : 'success'}
                          />
                        </TableCell>
                        <TableCell>
                          {log.feedback ? (
                            <Chip
                              label={log.feedback === 'POSITIVE' ? '👍' : '👎'}
                              size="small"
                              variant="outlined"
                            />
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell>{new Date(log.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Box>

      {/* Create FAQ dialog */}
      <Dialog open={openFAQ} onClose={() => setOpenFAQ(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nouvelle entrée FAQ</DialogTitle>
        <form onSubmit={handleSubmit((d) => createFAQMutation.mutate(d))} noValidate>
          <DialogContent>
            <Stack gap={2} pt={1}>
              <TextField
                label="Question *"
                {...register('question')}
                error={!!errors.question}
                helperText={errors.question?.message}
                fullWidth
              />
              <TextField
                label="Réponse *"
                multiline
                rows={4}
                {...register('answer')}
                error={!!errors.answer}
                helperText={errors.answer?.message}
                fullWidth
              />
              <TextField label="Catégorie (optionnel)" {...register('category')} fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenFAQ(false)}>Annuler</Button>
            <Button type="submit" variant="contained" disabled={createFAQMutation.isPending}>
              {createFAQMutation.isPending ? <CircularProgress size={20} color="inherit" /> : 'Ajouter'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
