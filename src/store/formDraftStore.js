// 임시 저장값 스토어

import { create } from 'zustand';

const useFormDraftStore = create((set) => ({
  formDraft: {},

  setFormDraft: (partialDraft) =>
    set((state) => ({
      formDraft: {
        ...state.formDraft,
        ...partialDraft,
      },
    })),

  resetFormDraft: () => set({ formDraft: {} }),
}));

export default useFormDraftStore;
