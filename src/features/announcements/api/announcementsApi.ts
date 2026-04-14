import { apiGet, apiPost } from '@/shared/api/apiClient';
import { Announcement, AnnouncementFormData } from '@/shared/types/announcement.types';

export const announcementsApi = {
  list: (clubId?: string) =>
    apiGet<Announcement[]>('/api/announcements', clubId ? { clubId } : undefined),

  create: (data: AnnouncementFormData) => apiPost<Announcement>('/api/announcements', data),
};
