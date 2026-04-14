export interface Announcement {
  id: string;
  clubId?: string;
  clubName?: string;
  title: string;
  content: string;
  targetRole?: string;
  cible?: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  isRead?: boolean;
}

export interface AnnouncementFormData {
  clubId?: string;
  title: string;
  content: string;
  targetRole?: string;
}
