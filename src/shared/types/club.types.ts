export type StatutClub = 'EN_ATTENTE' | 'VALIDE' | 'SUSPENDU' | 'ARCHIVE';

export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  logoUrl?: string;
  statut: StatutClub;
  memberCount: number;
  adminId: string;
  adminName?: string;
  createdAt: string;
}

export interface ClubFormData {
  name: string;
  description: string;
  category: string;
  logoUrl?: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
