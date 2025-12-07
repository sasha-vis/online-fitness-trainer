import { create } from 'zustand';
import dayjs from 'dayjs';
import { ProgressState } from './progress-types';

export const useProgressStore = create<ProgressState>((set) => ({
    reports: [
        {
            id: '1',
            date: dayjs('2024-05-01').format('DD/MM/YYYY'),
            weight: 70,
            waist: 50,
            hips: 45,
            chest: 90,
            arms: 60,
            legs: 105,
            comments: [
                { id: 3, text: 'Хорошо идёт прогресс, продолжай!' },
                { id: 4, text: 'Так держать!' },
            ],
        },
        {
            id: '2',
            date: dayjs('2024-06-01').format('DD/MM/YYYY'),
            weight: 69,
            waist: 58,
            hips: 75,
            chest: 80,
            arms: 60,
            legs: 115,
            comments: [
                { id: 5, text: 'Не сбавляй темпов, еще чуть-чуть.' },
                { id: 6, text: 'Стабильность' },
            ],
        },
    ],
    filters: {
        fromDate: null,
        toDate: null,
        showParams: {
            weight: false,
            waist: false,
            hips: false,
            chest: false,
            arms: false,
            legs: false,
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
                    arms: false,
                    legs: false,
                },
                page: 1,
                pageSize: 10,
            },
        })),
    addReport: (report) =>
        set((state) => ({
            reports: [...state.reports, report],
        })),
    setPage: (page) => set((state) => ({ filters: { ...state.filters, page } })),
}));
