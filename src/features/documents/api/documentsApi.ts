import { apiGet, apiUpload } from '@/shared/api/apiClient';
import { Document } from '@/shared/types/document.types';

export const documentsApi = {
  list: (clubId?: string) =>
    apiGet<Document[]>('/api/documents', clubId ? { clubId } : undefined),

  upload: (file: File, clubId?: string, description?: string) => {
    const form = new FormData();
    form.append('file', file);
    if (clubId) form.append('clubId', clubId);
    if (description) form.append('description', description);
    return apiUpload<Document>('/api/documents', form);
  },
};
