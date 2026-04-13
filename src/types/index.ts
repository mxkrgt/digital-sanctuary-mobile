export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface EmotionEntry {
  id: string;
  emotion_name: string;
  intensity: number;
  trigger?: string;
  vulnerability?: string;
  interpretations?: string;
  sensations?: string;
  urges?: string;
  body_language?: string;
  words_said?: string;
  actions_taken?: string;
  repercussions?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface Stats {
  total_entries: number;
  streak: number;
  reflections: number;
}

export type CalmDraft = Partial<Omit<EmotionEntry, 'id' | 'created_at' | 'updated_at'>>;
