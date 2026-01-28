import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Stack, Card, Theme } from '../types';

interface StoreState {
  theme: Theme;
  itemsOpen: boolean; // Dock open/closed
  stacks: Stack[];
  allCards: Card[]; 
  
  // UI State
  activeStackId: string | null;
  error: string | null;
  isLoading: boolean;

  // Actions
  toggleDock: () => void;
  setTheme: (theme: Theme) => void;
  setActiveStack: (id: string | null) => void;
  
  addStack: (title: string, cover?: string) => void;
  removeStack: (id: string) => void;
  
  addCard: (stackId: string, title: string, description?: string, cover?: string) => void;
  removeCard: (id: string) => void;
  moveCardToStack: (cardId: string, targetStackId: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      theme: 'system',
      itemsOpen: false,
      stacks: [],
      allCards: [],
      activeStackId: null,
      error: null,
      isLoading: false,

      toggleDock: () => set((state) => ({ itemsOpen: !state.itemsOpen })),
      setTheme: (theme) => set({ theme }),
      setActiveStack: (id) => set({ activeStackId: id }),

      addStack: (title, cover) => {
        const newStack: Stack = {
          id: uuidv4(),
          title,
          cover,
          cardIds: [],
          createdAt: Date.now(),
        };

        set((state) => ({ stacks: [...state.stacks, newStack] }));
      },

      removeStack: (id) => {
        set((state) => ({ 
          stacks: state.stacks.filter((s) => s.id !== id),
          allCards: state.allCards.filter((c) => c.stackId !== id)
        }));
      },

      addCard: (stackId, title, description, cover) => {
        const newCard: Card = {
          id: uuidv4(),
          stackId,
          title,
          description,
          cover,
          createdAt: Date.now(),
        };

        set((state) => {
          const updatedStacks = state.stacks.map(s => 
            s.id === stackId ? { ...s, cardIds: [...s.cardIds, newCard.id] } : s
          );
          return {
            allCards: [...state.allCards, newCard],
            stacks: updatedStacks
          };
        });
      },

      removeCard: (id) => {
        set((state) => {
          const card = state.allCards.find(c => c.id === id);
          if (!card) return state;

          const updatedStacks = state.stacks.map(s => 
             s.id === card.stackId ? { ...s, cardIds: s.cardIds.filter(cid => cid !== id) } : s
          );

          return {
             allCards: state.allCards.filter(c => c.id !== id),
             stacks: updatedStacks
          };
        });
      },
      
      moveCardToStack: (cardId, targetStackId) => {
        set((state) => {
           const card = state.allCards.find(c => c.id === cardId);
           if (!card) return state;
           const oldStackId = card.stackId;
           
           if (oldStackId === targetStackId) return state; // No op

           // Update Card
           const updatedCards = state.allCards.map(c => 
             c.id === cardId ? { ...c, stackId: targetStackId } : c
           );

           // Update Stacks
           const updatedStacks = state.stacks.map(s => {
             if (s.id === oldStackId) {
               return { ...s, cardIds: s.cardIds.filter(cid => cid !== cardId) };
             }
             if (s.id === targetStackId) {
               return { ...s, cardIds: [...s.cardIds, cardId] };
             }
             return s;
           });
           
           return {
             allCards: updatedCards,
             stacks: updatedStacks
           };
        });
      }
    }),
    {
      name: 'wishlist-storage', // unique name
      storage: createJSONStorage(() => localStorage),
      // Optional: partialize to only save stacks and allCards, not UI state like error or isLoading
      partialize: (state) => ({ 
        theme: state.theme,
        stacks: state.stacks,
        allCards: state.allCards
      }),
    }
  )
);
