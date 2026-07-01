export type UserRole = 'PLATFORM_ADMIN' | 'CLUB_ADMIN' | 'MEMBER' | 'VISITOR';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  roles?: UserRole[];          // multi-role: ex. ['MEMBER', 'CLUB_ADMIN']
  avatarUrl?: string;
  clubId?: string;             // for CLUB_ADMIN: the club they manage
  managedClubIds?: string[];   // all clubs this user manages
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface Session {
  id: string;
  ipAddress: string;
  userAgent: string;
  lastActive: string;
  createdAt: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
