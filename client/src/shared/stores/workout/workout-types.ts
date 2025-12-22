export interface Exercise {
    name: string;
    reps: string;
    description?: string;
    rest?: number;
    count?: number;
}

export interface WorkoutTemplate {
    id?: string;
    name: string;
    description: string;
    exercises: Exercise[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface WorkoutPlan {
    id?: string;
    name: string;
    description: string;
    exercises: Exercise[];
    createdAt?: Date;
    updatedAt?: Date;
}
export interface WorkoutListItem {
    id?: string;
    name: string;
    description: string;
    exercises: Exercise[];
    rest?: number;
    comments?: string;
}

export interface WorkoutListProps {
    list: WorkoutListItem[];
    title: string;
    onEdit: (item: WorkoutListItem) => void;
    onDelete: (id: string) => void;
}

export interface WorkoutFormData {
    name: string;
    description: string;
    exercises: Exercise[];
}

export interface WorkoutModalProps {
    visible: boolean;
    onClose: () => void;
    initialData?: WorkoutFormData;
    onSubmit: (values: WorkoutFormData) => void;
    predefinedOptions: Pick<WorkoutTemplate, 'name' | 'description' | 'exercises'>[];
}

export interface TemplatesStore {
    templates: WorkoutTemplate[];
    addTemplate: (data: Omit<WorkoutTemplate, 'id' | 'createdAt'>) => Promise<void>;
    updateTemplate: (
        id: string,
        data: Partial<Omit<WorkoutTemplate, 'id' | 'createdAt'>>
    ) => Promise<void>;
    deleteTemplate: (id: string) => Promise<void>;
}

export interface PlansStore {
    plans: WorkoutPlan[];
    addPlan: (data: Omit<WorkoutPlan, 'id' | 'createdAt'>) => Promise<void>;
    updatePlan: (
        id: string,
        data: Partial<Omit<WorkoutPlan, 'id' | 'createdAt'>>
    ) => Promise<void>;
    deletePlan: (id: string) => Promise<void>;
}
