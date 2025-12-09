import { create } from 'zustand';
// import { collection,
//     // addDoc,
//     // updateDoc,
//     // deleteDoc,
//     onSnapshot,
//     // doc,
// } from 'firebase/firestore';
// import { db } from '../../../firebase'
import { message } from 'antd';
import { workoutPlans } from '@shared/constants/workout-plans';
import { workoutTemplates } from '@shared/constants/workout-templates';

import { TemplatesStore, PlansStore } from '@shared/stores/workout/workout-types';

export const useTemplatesStore = create<TemplatesStore>((set) => ({
    templates: workoutTemplates,
    // fetchTemplates: () => {
    //   onSnapshot(collection(db, 'templates'), (snap) => {
    //     set({ templates: snap.docs.map(d => ({ id: d.id, ...d.data() })) });
    //   });
    // },
    addTemplate: async (data) => {
        try {
            const newTemplate = {
                id: Date.now().toString(),
                ...data,
                createdAt: new Date(),
            };
            set((state) => ({ templates: [...state.templates, newTemplate] }));
            message.success('Шаблон создан');
        } catch (error) {
            if (error instanceof Error) {
                message.error('Ошибка создания: ' + error.message);
            } else {
                message.error('Ошибка создания: неизвестная ошибка');
            }
        }
    },
    updateTemplate: async (id: string, data) => {
        try {
            set((state) => {
                const updatedTemplates = state.templates.map((item) =>
                    item.id === id ? { ...item, ...data, updatedAt: new Date() } : item
                );
                return { templates: updatedTemplates };
            });
            message.success('Шаблон обновлён');
        } catch (error) {
            if (error instanceof Error) {
                message.error('Ошибка обновления: ' + error.message);
            } else {
                message.error('Ошибка обновления: неизвестная ошибка');
            }
        }
    },
    deleteTemplate: async (id) => {
        try {
            set((state) => ({
                templates: state.templates.filter((item) => item.id !== id),
            }));
            message.success('Шаблон удалён');
        } catch (error) {
            if (error instanceof Error) {
                message.error('Ошибка удаления шаблона:' + error.message);
            } else {
                message.error('Ошибка создания шаблона: неизвестная ошибка');
            }
        }
    },
    // addTemplate: async (data) => {
    //   try {
    //     await addDoc(collection(db, 'templates'), { ...data, createdAt: new Date() });
    //     message.success('Шаблон создан');
    //   } catch (error) {
    //     message.error('Ошибка создания: ' + error.message);
    //   }
    // },
    // updateTemplate: async (id, data) => {
    //   try {
    //     await updateDoc(doc(db, 'templates', id), { ...data, updatedAt: new Date() });
    //     message.success('Шаблон обновлён');
    //   } catch (error) {
    //     message.error('Ошибка обновления: ' + error.message);
    //   }
    // },
    // deleteTemplate: async (id) => {
    //   try {
    //     await deleteDoc(doc(db, 'templates', id));
    //     message.success('Шаблон удалён');
    //   } catch (error) {
    //     message.error('Ошибка удаления: ' + error.message);
    //   }
    // },
}));

export const usePlansStore = create<PlansStore>((set) => ({
    plans: workoutPlans,
    // fetchPlans: () => {
    //     onSnapshot(collection(db, 'plans'), (snap) => {
    //     set({ plans: snap.docs.map(d => ({ id: d.id, ...d.data() })) });
    //     });
    // },
    // addPlan: async (data) => {
    //     try {
    //       await addDoc(collection(db, 'plans'), { ...data, createdAt: new Date() });
    //       message.success('План создан');
    //     } catch (error) {
    //       message.error('Ошибка создания плана: ' + error.message);
    //     }
    // },
    // updatePlan: async (id, data) => {
    //     try {
    //       await updateDoc(doc(db, 'plans', id), { ...data, updatedAt: new Date() });
    //       message.success('План обновлён');
    //     } catch (error) {
    //       message.error('Ошибка обновления плана: ' + error.message);
    //     }
    // },
    // deletePlan: async (id) => {
    //     try {
    //       await deleteDoc(doc(db, 'plans', id));
    //       message.success('План удалён');
    //     } catch (error) {
    //       message.error('Ошибка удаления плана: ' + error.message);
    //     }
    // },
    addPlan: async (data) => {
        try {
            const newPlan = { id: Date.now().toString(), ...data, createdAt: new Date() };
            set((state) => ({ plans: [...state.plans, newPlan] }));
            message.success('План создан');
        } catch (error) {
            if (error instanceof Error) {
                message.error('Ошибка создания плана: ' + error.message);
            } else {
                message.error('Ошибка создания плана: неизвестная ошибка');
            }
        }
    },
    updatePlan: async (id, data) => {
        try {
            set((state) => {
                const updatedPlans = state.plans.map((item) =>
                    item.id === id ? { ...item, ...data, updatedAt: new Date() } : item
                );
                return { plans: updatedPlans };
            });
            message.success('План обновлён');
        } catch (error) {
            if (error instanceof Error) {
                message.error('Ошибка обновления плана: ' + error.message);
            } else {
                message.error('Ошибка обновления плана: неизвестная ошибка');
            }
        }
    },
    deletePlan: async (id) => {
        try {
            set((state) => ({ plans: state.plans.filter((item) => item.id !== id) }));
            message.success('План удалён');
        } catch (error) {
            if (error instanceof Error) {
                message.error('Ошибка удаления плана: ' + error.message);
            } else {
                message.error('Ошибка удаления плана: неизвестная ошибка');
            }
        }
    },
}));
