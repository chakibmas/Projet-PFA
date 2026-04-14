import { apiGet } from '@/shared/api/apiClient';
import { DashboardKPIs } from '@/shared/types/dashboard.types';

export const dashboardApi = {
  getKPIs: () => apiGet<DashboardKPIs>('/api/dashboard/kpis'),
};
