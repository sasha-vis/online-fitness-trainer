import { Timestamp } from 'firebase/firestore';

export interface Dish {
    calories: number;
    carbs: number;
    category: string;
    dishId: string;
    dishTitle: string;
    fat: number;
    order: number;
    portion: string;
    protein: number;
    id: string;
    name: string;
    timeOfDay: string;
}

export interface Meal {
    description: string;
    id: string;
    name: string;
    timeOfDay: string;
    dishes: Dish[];
}

export interface DayPlan {
    day: number;
    name: string;
    meals: Meal[];
}

export interface NutritionPlanTemplate {
    id: string;
    days: DayPlan[];
    name?: string;
}

export interface ClientNutritionAssignment {
    id: string;
    clientId: string;
    templateId: string;
    startDate?: Timestamp;
    assignedAt?: Timestamp;
}

export type FilterType = 'today' | 'week' | 'month';
