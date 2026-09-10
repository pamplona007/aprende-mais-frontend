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

export type SubjectStatus = 'LOCKED' | 'AVAILABLE' | 'COMPLETED';

export interface Subject {
  id: string;
  slug: string;
  title: string;
  color: string;
  iconKey: IconKey;
  status: SubjectStatus;
  stars: 0 | 1 | 2 | 3;
  totalLessons: number;
  orderIndex: number;
}

export type IconKey =
  | 'chef-hat'
  | 'road'
  | 'school'
  | 'home'
  | 'coin'
  | 'food'
  | 'body'
  | 'bus'
  | 'weather'
  | 'paw';

export interface Choice {
  id: string;
  text: string;
  consequence: string;
  correct: boolean;
}

export interface MultipleChoicePayload {
  type: 'MULTIPLE_CHOICE';
  scenario?: string;
  question: string;
  choices: Choice[];
}

export interface Exercise {
  id: string;
  subjectId: string;
  prompt: string;
  payload: MultipleChoicePayload;
}

export type LessonExerciseStatus = 'PENDING' | 'CORRECT' | 'FAILED_THEN_CORRECT';

export interface LessonExercise {
  id: string;
  exerciseId: string;
  orderIndex: number;
  status: LessonExerciseStatus;
}

export type LessonStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface Lesson {
  id: string;
  studentId: string;
  subjectId: string;
  subjectTitle: string;
  subjectColor: string;
  status: LessonStatus;
  score: number;
  totalCount: number;
  startedAt: string;
  completedAt: string | null;
  exercises: LessonExercise[];
}
