import { create } from 'zustand';

export const useWorkoutStore = create((set) => ({
    selectedPlan: null,
    editingPlan: null,
    setSelectedPlan: (plan) => set({ selectedPlan: plan, editingPlan: plan }),
    setEditingPlan: (plan) => set({ editingPlan: plan }),
    resetEditingPlan: () => set((state) => ({ editingPlan: state.selectedPlan })),
}));
