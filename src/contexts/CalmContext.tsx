import React, { createContext, useContext, useState, useCallback } from 'react';
import { CalmDraft } from '../types';

interface CalmContextType {
  draft: CalmDraft;
  updateDraft: (fields: Partial<CalmDraft>) => void;
  resetDraft: () => void;
}

const CalmContext = createContext<CalmContextType | null>(null);

export function CalmProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<CalmDraft>({});

  const updateDraft = useCallback((fields: Partial<CalmDraft>) => {
    setDraft((prev) => ({ ...prev, ...fields }));
  }, []);

  const resetDraft = useCallback(() => setDraft({}), []);

  return (
    <CalmContext.Provider value={{ draft, updateDraft, resetDraft }}>
      {children}
    </CalmContext.Provider>
  );
}

export function useCalm() {
  const ctx = useContext(CalmContext);
  if (!ctx) throw new Error('useCalm must be used inside CalmProvider');
  return ctx;
}
