// Shared types — mirrored from the backend's API responses.
// Kept hand-written here (no codegen) so the frontend can iterate independently
// while the backend is still in flux.

export type UserRole = 'STUDENT' | 'GUARDIAN' | 'TEACHER' | 'ADMIN';

export interface UserSummary {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  birthDate: string | null;
  createdAt: string;
}

export type TeachingRelationshipStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'REVOKED_BY_TEACHER'
  | 'REVOKED_BY_STUDENT';

export interface TeachingRelationship {
  id: string;
  teacherId: string;
  studentId: string;
  status: TeachingRelationshipStatus;
  message: string | null;
  invitedAt: string;
  respondedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
  teacher?: { id: string; displayName: string; email: string };
  student?: { id: string; displayName: string; email: string };
}

export interface StudentProfileSummary {
  id: string;
  userId: string;
  learningLevel: number;
  accessibility: Record<string, unknown>;
  preferences: Record<string, unknown>;
  notes: string | null;
}
