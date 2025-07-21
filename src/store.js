import { create } from 'zustand';
import { persist /*, createJSONStorage */ } from 'zustand/middleware';

/*
  bookmarkData shape:
  {
    "uuid-abc123": { offset: 100, index: 4 },
    "uuid-xyz789": { offset: 400, index: 7 }
  }
*/

export const useStore = create(
  persist(
    (set, get) => ({
      // ─── UI state ────────────────────────────────────────────
      isSelected: false,
      setSelected: (value) => set({ isSelected: value }),

      // ─── Bookmark state ──────────────────────────────────────
      bookmarkData: {},            // ← persisted
      currentUuid: null,
      setCurrentUuid: (uuid) => set({ currentUuid: uuid }),
      removeBookmarkById: (uuid, id) =>
        set((state) => {
          const list = state.bookmarkData[uuid];
          if (!Array.isArray(list)) return {};

          const filtered = list.filter((item) => item.id !== id);
          const newData = { ...state.bookmarkData };

          if (filtered.length > 0) {
            newData[uuid] = filtered;
          } else {
            delete newData[uuid]; // remove key entirely
          }

          return { bookmarkData: newData };
        }),

      setBookmarkData: ({ type, key, data }) =>
        set((state) => {
          if (type === 'appendToList') {
            const entry = state.bookmarkData[key];
            return {
              bookmarkData: {
                ...state.bookmarkData,
                [key]: entry ? [...entry, data] : [data],
              },
            };
          }
        }),
    }),
    {
      name: 'bookmark-storage',           // key in localStorage
      // storage: createJSONStorage(() => localStorage), // uncomment for SSR
      partialize: (state) => ({
        bookmarkData: state.bookmarkData, // only this slice is persisted
      }),
      // version: 1,                      // optional: bump when you change shape
    }
  )
);
