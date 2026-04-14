export type StatutAdhesion = 'EN_ATTENTE' | 'APPROUVEE' | 'REFUSEE';

export interface Membership {
  id: string;
  clubId: string;
  clubName: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  status: StatutAdhesion;
  motivation?: string;
  cotisationPayee: boolean;
  commentaire?: string;
  appliedAt: string;
  updatedAt: string;
}

export interface MembershipApplyRequest {
  clubId: string;
  motivation?: string;
}
