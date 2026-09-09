import { api } from '../lib/api';
import type { TeachingRelationship, TeachingRelationshipStatus } from '../types';

export interface InvitePayload {
  teacherId: string;
  studentId: string;
  message?: string;
}

export interface RespondPayload {
  action: 'accept' | 'decline';
}

export interface RevokePayload {
  by: 'teacher' | 'student';
}

export interface ListRelationshipsFilters {
  teacherId?: string;
  studentId?: string;
  status?: TeachingRelationshipStatus;
}

export async function sendInvite(payload: InvitePayload): Promise<TeachingRelationship> {
  const { data } = await api.post<TeachingRelationship>('/api/teaching/invites', payload);
  return data;
}

export async function respondToInvite(
  inviteId: string,
  payload: RespondPayload,
): Promise<TeachingRelationship> {
  const { data } = await api.post<TeachingRelationship>(
    `/api/teaching/invites/${inviteId}/respond`,
    payload,
  );
  return data;
}

export async function revokeRelationship(
  relationshipId: string,
  payload: RevokePayload,
): Promise<TeachingRelationship> {
  const { data } = await api.post<TeachingRelationship>(
    `/api/teaching/relationships/${relationshipId}/revoke`,
    payload,
  );
  return data;
}

export async function listRelationships(
  filters: ListRelationshipsFilters = {},
): Promise<TeachingRelationship[]> {
  const { data } = await api.get<TeachingRelationship[]>('/api/teaching/relationships', {
    params: filters,
  });
  return data;
}
