import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clubsApi } from '../api/clubsApi';
import { ClubFormData } from '@/shared/types/club.types';
import { useSnackbar } from '@/app/providers/SnackbarContext';
import { getErrorMessage } from '@/shared/api/apiClient';
import { useNavigate } from 'react-router-dom';

export function useClubs(params?: { search?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: ['clubs', params],
    queryFn: () => clubsApi.list(params),
  });
}

export function useClub(id: string) {
  return useQuery({
    queryKey: ['clubs', id],
    queryFn: () => clubsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateClub() {
  const qc = useQueryClient();
  const notify = useSnackbar();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ClubFormData) => clubsApi.create(data),
    onSuccess: (club) => {
      qc.invalidateQueries({ queryKey: ['clubs'] });
      notify('Club créé avec succès !', 'success');
      navigate(`/clubs/${club.id}`);
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });
}

export function useUpdateClub(id: string) {
  const qc = useQueryClient();
  const notify = useSnackbar();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ClubFormData) => clubsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clubs'] });
      notify('Club mis à jour !', 'success');
      navigate(`/clubs/${id}`);
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });
}
