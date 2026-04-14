export type TypeDocument = 'STATUT' | 'REGLEMENT' | 'PV' | 'AFFICHE' | 'JUSTIFICATIF' | 'AUTRE';

export interface Document {
  id: string;
  clubId?: string;
  clubName?: string;
  name: string;
  description?: string;
  type: TypeDocument;
  fileUrl: string;
  mimeType: string;
  sizeBytes: number;
  version: number;
  uploadedBy: string;
  uploadedAt: string;
  visibleToRoles: string[];
}
