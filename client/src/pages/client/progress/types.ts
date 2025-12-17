// export interface BodyMeasurement {
//     id?: string;
//     clientId: string;
//     arm: number;
//     chest: number;
//     hips: number;
//     leg: number;
//     waist: number;
//     weight: number;
//     photosUrl: string[];
//     createdAt: Date;
// }
  
// export type BodyMeasurementForm = Omit<BodyMeasurement, 'id' | 'clientId' | 'photosUrl' | 'createdAt'> & {
//     photos?: File[];
// };

// export const MEASUREMENT_FIELDS: { key: keyof BodyMeasurementForm; label: string }[] = [
//     { key: 'arm', label: 'Рука' },
//     { key: 'chest', label: 'Грудь' },
//     { key: 'hips', label: 'Бёдра' },
//     { key: 'leg', label: 'Нога' },
//     { key: 'waist', label: 'Талия' },
//     { key: 'weight', label: 'Вес' },
// ];