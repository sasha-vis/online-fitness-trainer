export interface ProgressReport {
    id: string;
    date: string;
    weight: number;
    waist: number;
    hips: number;
    chest: number;
    arms: number;
    legs: number;
    photoUrl?: string;
    comments: { id: number; date?: string; text: string }[];
}

export interface ShowParams {
    weight: boolean;
    waist: boolean;
    hips: boolean;
    chest: boolean;
    arms: boolean;
    legs: boolean;
}

export type ParamKey = keyof ShowParams;

export interface ProgressState {
    reports: ProgressReport[];
    filters: {
        fromDate?: string | null;
        toDate?: string | null;
        showParams: {
            weight: boolean;
            waist: boolean;
            hips: boolean;
            chest: boolean;
            arms: boolean;
            legs: boolean;
        };
        page: number;
        pageSize: number;
    };
    setFilters: (filters: Partial<ProgressState['filters']>) => void;
    resetDateFilters: () => void;
    addReport: (report: ProgressReport) => void;
    setPage: (page: number) => void;
}
