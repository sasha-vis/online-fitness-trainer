// export const usePlansStore = create<PlansStore>((set) => ({
//     plans: workoutPlans,
//     // fetchPlans: () => {
//     //     onSnapshot(collection(db, 'plans'), (snap) => {
//     //     set({ plans: snap.docs.map(d => ({ id: d.id, ...d.data() })) });
//     //     });
//     // },
//     // addPlan: async (data) => {
//     //     try {
//     //       await addDoc(collection(db, 'plans'), { ...data, createdAt: new Date() });
//     //       message.success('План создан');
//     //     } catch (error) {
//     //       message.error('Ошибка создания плана: ' + error.message);
//     //     }
//     // },
//     // updatePlan: async (id, data) => {
//     //     try {
//     //       await updateDoc(doc(db, 'plans', id), { ...data, updatedAt: new Date() });
//     //       message.success('План обновлён');
//     //     } catch (error) {
//     //       message.error('Ошибка обновления плана: ' + error.message);
//     //     }
//     // },
//     // deletePlan: async (id) => {
//     //     try {
//     //       await deleteDoc(doc(db, 'plans', id));
//     //       message.success('План удалён');
//     //     } catch (error) {
//     //       message.error('Ошибка удаления плана: ' + error.message);
//     //     }
//     // },
//     addPlan: async (data) => {
//         try {
//             const newPlan = { id: Date.now().toString(), ...data, createdAt: new Date() };
//             set((state) => ({ plans: [...state.plans, newPlan] }));
//             message.success('План создан');
//         } catch (error) {
//             if (error instanceof Error) {
//                 message.error('Ошибка создания плана: ' + error.message);
//             } else {
//                 message.error('Ошибка создания плана: неизвестная ошибка');
//             }
//         }
//     },
//     updatePlan: async (id, data) => {
//         try {
//             set((state) => {
//                 const updatedPlans = state.plans.map((item) =>
//                     item.id === id ? { ...item, ...data, updatedAt: new Date() } : item
//                 );
//                 return { plans: updatedPlans };
//             });
//             message.success('План обновлён');
//         } catch (error) {
//             if (error instanceof Error) {
//                 message.error('Ошибка обновления плана: ' + error.message);
//             } else {
//                 message.error('Ошибка обновления плана: неизвестная ошибка');
//             }
//         }
//     },
//     deletePlan: async (id) => {
//         try {
//             set((state) => ({ plans: state.plans.filter((item) => item.id !== id) }));
//             message.success('План удалён');
//         } catch (error) {
//             if (error instanceof Error) {
//                 message.error('Ошибка удаления плана: ' + error.message);
//             } else {
//                 message.error('Ошибка удаления плана: неизвестная ошибка');
//             }
//         }
//     },
// }));
import { create } from 'zustand';

export const useWorkoutStore = create((set) => ({
    selectedPlan: null, // выбранный шаблон (до редактирования)
    editingPlan: null, // редактируемый план (копия для изменений)
    setSelectedPlan: (plan) => set({ selectedPlan: plan, editingPlan: plan }),
    setEditingPlan: (plan) => set({ editingPlan: plan }),
    resetEditingPlan: () => set((state) => ({ editingPlan: state.selectedPlan })),
}));
