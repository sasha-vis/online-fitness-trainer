import { Unsubscribe } from 'firebase/firestore';

export interface ShowParams {
    weight: boolean;
    waist: boolean;
    hips: boolean;
    chest: boolean;
    arm: boolean;
    leg: boolean;
}

export type ParamKey = keyof ShowParams;


export interface BodyMeasurement {
  id: string;
  clientId: string;
  createdAt: Date;
  updatedAt?: Date;
  arm?: number;
  chest?: number;
  hips?: number;
  leg?: number;
  waist?: number;
  weight?: number;
  photosUrl?: string[];
}

export interface Filters {
  fromDate: string | null;
  toDate: string | null;
  showParams: {
    weight: boolean;
    waist: boolean;
    hips: boolean;
    chest: boolean;
    arm: boolean;
    leg: boolean;
  };
}

export interface ProgressState {
  measurements: BodyMeasurement[];
  loading?: boolean;
  error: string | null;
  _unsubscribe?: Unsubscribe;
  subscribe: (clientId: string) => void;
  add: (data: Omit<BodyMeasurement, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  update: (id: string, data: Partial<BodyMeasurement>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  filters: Filters;
  setFilters: (filters: Partial<Filters>) => void;
  resetDateFilters: () => void;
}

export const MEASUREMENT_FIELDS: { key: keyof BodyMeasurement; label: string }[] = [
  { key: 'arm', label: 'Обхват руки' },
  { key: 'chest', label: 'Обхват груди' },
  { key: 'hips', label: 'Обхват бёдер' },
  { key: 'leg', label: 'Обхват ноги' },
  { key: 'waist', label: 'Обхват талии' },
  { key: 'weight', label: 'Вес' },
];
