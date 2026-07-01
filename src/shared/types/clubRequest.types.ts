export type ClubRequestStatus = 'EN_ATTENTE' | 'APPROUVEE' | 'REFUSEE';

export interface ClubRequest {
  id: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  clubName: string;
  clubDescription: string;
  clubCategory: string;
  logoUrl?: string;
  motivation: string;
  status: ClubRequestStatus;
  adminComment?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateClubRequestData {
  clubName: string;
  clubDescription: string;
  clubCategory: string;
  logoUrl?: string;
  motivation: string;
}
