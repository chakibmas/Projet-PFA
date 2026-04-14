export interface Notification {
  id: string;
  message: string;
  canal: string;        // 'IN_APP' | 'EMAIL'
  dateEnvoi: string;
  statut: 'LUE' | 'NON_LUE';
  link?: string;        // optional deep link
}
