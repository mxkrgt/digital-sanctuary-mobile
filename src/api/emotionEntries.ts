import client from './client';
import { ApiResponse, EmotionEntry, CalmDraft } from '../types';

interface ListData {
  entries: EmotionEntry[];
  next_cursor?: string;
}

export const entriesApi = {
  list: (cursor?: string) =>
    client.get<ApiResponse<ListData>>('/emotion_entries', {
      params: cursor ? { cursor } : undefined,
    }),

  get: (id: string) =>
    client.get<ApiResponse<EmotionEntry>>(`/emotion_entries/${id}`),

  create: (data: CalmDraft) =>
    client.post<ApiResponse<EmotionEntry>>('/emotion_entries', data),

  update: (id: string, data: CalmDraft) =>
    client.patch<ApiResponse<EmotionEntry>>(`/emotion_entries/${id}`, data),

  delete: (id: string) => client.delete(`/emotion_entries/${id}`),
};
