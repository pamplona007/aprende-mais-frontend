// Mock data — used by the teacher dashboard pages until the API wiring lands.
// Shape matches what the backend will eventually return (see src/types).

import type {
  StudentProfileSummary,
  TeachingRelationship,
  TeachingRelationshipStatus,
  UserSummary,
} from '../types';

const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000).toISOString();

export const mockUsers: UserSummary[] = [
  {
    id: 't_paula',
    email: 'paula@aprende.mais',
    displayName: 'Paula Carvalho',
    role: 'TEACHER',
    birthDate: null,
    createdAt: daysAgo(180),
  },
  {
    id: 't_rui',
    email: 'rui@aprende.mais',
    displayName: 'Rui Tavares',
    role: 'TEACHER',
    birthDate: null,
    createdAt: daysAgo(120),
  },
  {
    id: 's_ana',
    email: 'ana@aprende.mais',
    displayName: 'Ana Lima',
    role: 'STUDENT',
    birthDate: '2014-04-12T00:00:00.000Z',
    createdAt: daysAgo(90),
  },
  {
    id: 's_marco',
    email: 'marco@aprende.mais',
    displayName: 'Marco Sousa',
    role: 'STUDENT',
    birthDate: '2013-09-03T00:00:00.000Z',
    createdAt: daysAgo(60),
  },
  {
    id: 's_clara',
    email: 'clara@aprende.mais',
    displayName: 'Clara Mendes',
    role: 'STUDENT',
    birthDate: '2015-01-22T00:00:00.000Z',
    createdAt: daysAgo(45),
  },
  {
    id: 's_joao',
    email: 'joao@aprende.mais',
    displayName: 'João Pereira',
    role: 'STUDENT',
    birthDate: '2014-07-30T00:00:00.000Z',
    createdAt: daysAgo(20),
  },
  {
    id: 's_lia',
    email: 'lia@aprende.mais',
    displayName: 'Lia Rocha',
    role: 'STUDENT',
    birthDate: '2016-11-08T00:00:00.000Z',
    createdAt: daysAgo(5),
  },
];

export const mockProfiles: Record<string, StudentProfileSummary> = {
  s_ana: {
    id: 'p_ana',
    userId: 's_ana',
    learningLevel: 2,
    accessibility: { fontSize: 'large', dyslexiaFriendlyFont: true },
    preferences: { prefersAudio: true, sessionLengthMin: 20 },
    notes: 'Responde bem a exercícios com imagens. Evitar textos longos sem pausa.',
  },
  s_marco: {
    id: 'p_marco',
    userId: 's_marco',
    learningLevel: 3,
    accessibility: { highContrast: true },
    preferences: { prefersAudio: false, sessionLengthMin: 30 },
    notes: null,
  },
  s_clara: {
    id: 'p_clara',
    userId: 's_clara',
    learningLevel: 1,
    accessibility: {},
    preferences: { prefersAudio: true, sessionLengthMin: 15 },
    notes: 'Iniciando a alfabetização. Avançar com paciência.',
  },
  s_joao: {
    id: 'p_joao',
    userId: 's_joao',
    learningLevel: 2,
    accessibility: { fontSize: 'medium' },
    preferences: {},
    notes: null,
  },
  s_lia: {
    id: 'p_lia',
    userId: 's_lia',
    learningLevel: 1,
    accessibility: {},
    preferences: {},
    notes: null,
  },
};

// Each relationship keyed by id, with the teacherId/studentId pair.
const rel = (
  id: string,
  teacherId: string,
  studentId: string,
  status: TeachingRelationshipStatus,
  daysInvited: number,
  extras: Partial<TeachingRelationship> = {},
): TeachingRelationship => ({
  id,
  teacherId,
  studentId,
  status,
  message: null,
  invitedAt: daysAgo(daysInvited),
  respondedAt: null,
  revokedAt: null,
  createdAt: daysAgo(daysInvited),
  updatedAt: daysAgo(daysInvited),
  ...extras,
});

export const mockRelationships: TeachingRelationship[] = [
  // Paula's relationships
  rel('r1', 't_paula', 's_ana', 'ACCEPTED', 60, {
    message: 'Vamos trabalhar leitura juntos!',
    respondedAt: daysAgo(59),
  }),
  rel('r2', 't_paula', 's_marco', 'ACCEPTED', 30, {
    message: 'Vamos começar com textos curtos.',
    respondedAt: daysAgo(29),
  }),
  rel('r3', 't_paula', 's_clara', 'PENDING', 2, {
    message: 'Oi Clara, podemos tentar aulas de leitura?',
  }),
  rel('r4', 't_paula', 's_joao', 'REVOKED_BY_TEACHER', 15, {
    revokedAt: daysAgo(10),
  }),
  // Ruir's relationships
  rel('r5', 't_rui', 's_marco', 'DECLINED', 20, {
    respondedAt: daysAgo(19),
  }),
];

export function getUserById(id: string): UserSummary | undefined {
  return mockUsers.find((u) => u.id === id);
}

export function getProfileByStudentId(studentId: string): StudentProfileSummary | undefined {
  return mockProfiles[studentId];
}

export function getRelationshipsForTeacher(teacherId: string): TeachingRelationship[] {
  return mockRelationships.filter((r) => r.teacherId === teacherId);
}

export function searchStudents(query: string): UserSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return mockUsers.filter((u) => u.role === 'STUDENT');
  return mockUsers.filter(
    (u) =>
      u.role === 'STUDENT' &&
      (u.displayName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
  );
}
