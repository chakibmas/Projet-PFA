export type StatutInscription = 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE';

export interface Event {
  id: string;
  clubId: string;
  clubName: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  maxParticipants?: number;
  registeredCount: number;
  isPublic: boolean;
  requiresRegistration: boolean;
  checkInCode?: string;
  createdAt: string;
}

export interface EventFormData {
  clubId: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  maxParticipants?: number;
  isPublic: boolean;
  requiresRegistration: boolean;
}

export interface CheckInRequest {
  code: string;
}

export interface InscriptionEvenement {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userFullName: string;
  dateInscription: string;
  statut: StatutInscription;
  checkinQR: boolean;
}
