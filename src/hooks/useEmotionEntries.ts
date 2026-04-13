import { useState, useCallback } from 'react';
import { entriesApi } from '../api/emotionEntries';
import { EmotionEntry } from '../types';

function toArray(val: unknown): EmotionEntry[] {
  if (Array.isArray(val)) return val;
  return [];
}

export function useEmotionEntries() {
  const [entries, setEntries] = useState<EmotionEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const load = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const res = await entriesApi.list(reset ? undefined : cursor);
      const raw = res.data?.data;

      // Handle both { entries: [...] } and direct array responses
      const newEntries: EmotionEntry[] = toArray(
        Array.isArray(raw) ? raw : raw?.entries
      );
      const nextCursor: string | undefined =
        Array.isArray(raw) ? undefined : raw?.next_cursor;

      setEntries((prev) => (reset ? newEntries : [...prev, ...newEntries]));
      setCursor(nextCursor);
      setHasMore(!!nextCursor);
    } catch (e) {
      // Leave existing entries on error, just stop loading
    } finally {
      setLoading(false);
    }
  }, [cursor]);

  const refresh = useCallback(() => load(true), [load]);

  return { entries, loading, hasMore, load, refresh };
}
