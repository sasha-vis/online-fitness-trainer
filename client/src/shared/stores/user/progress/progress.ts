import { create } from 'zustand';
import { ProgressState } from './progress-types';
import {
    subscribeMeasurements,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
} from '@pages/client/progress/progress-services/progress-services';

export const useProgressStore = create<ProgressState>((set, get) => ({
    measurements: [],
    loading: false,
    subscribeLoading: false,
    error: null,
    subscribe: (clientId) => {
        set({ subscribeLoading: true, error: null });
        const currentUnsubscribe = get()._unsubscribe;
        if (currentUnsubscribe) currentUnsubscribe();
        const unsubscribe = subscribeMeasurements(clientId, (data) =>
            set({
                measurements: data,
                subscribeLoading: false,
            })
        );
        set({ _unsubscribe: unsubscribe });
    },
    add: async (data) => {
        set({ loading: true, error: null });
        try {
            await addMeasurement(data);
        } catch (e) {
            if (e instanceof Error) {
                set({
                    error: e.message,
                });
            } else {
                set({
                    error: 'Ошибка при добавлении отчёта',
                });
            }
        } finally {
            set({ loading: false });
        }
    },
    update: async (id, data) => {
        set({ loading: true, error: null });
        try {
            await updateMeasurement(id, data);
        } catch (e) {
            if (e instanceof Error) {
                set({
                    error: e.message,
                });
            } else {
                set({
                    error: 'Ошибка при добавлении отчёта',
                });
            }
        } finally {
            set({ loading: false });
        }
    },
    remove: async (id) => {
        set({ loading: true, error: null });
        try {
            await deleteMeasurement(id);
        } catch (e) {
            if (e instanceof Error) {
                set({
                    error: e.message,
                });
            } else {
                set({
                    error: 'Ошибка при удаления отчёта',
                });
            }
        } finally {
            set({ loading: false });
        }
    },
    filters: {
        fromDate: null,
        toDate: null,
        showParams: {
            weight: false,
            waist: false,
            hips: false,
            chest: false,
            arm: false,
            leg: false,
        },
        page: 1,
        pageSize: 10,
    },
    setFilters: (filters) =>
        set((state) => ({
            filters: {
                ...state.filters,
                ...filters,
                showParams: {
                    ...state.filters.showParams,
                    ...(filters.showParams || {}),
                },
            },
        })),
    resetDateFilters: () =>
        set(() => ({
            filters: {
                fromDate: null,
                toDate: null,
                showParams: {
                    weight: false,
                    waist: false,
                    hips: false,
                    chest: false,
                    arm: false,
                    leg: false,
                },
            },
        })),
}));
