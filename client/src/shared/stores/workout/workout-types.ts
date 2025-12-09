export interface Exercise {
    name: string;
    reps: string;
    description?: string;
    rest?: number; // Добавляем rest, если используется
    count?: number; // Добавляем count для повторений (если нужно)
}

// Тип для шаблона тренировки
export interface WorkoutTemplate {
    id?: string;
    name: string;
    description: string;
    exercises: Exercise[];
    createdAt?: Date;
    updatedAt?: Date;
}

// Тип для плана тренировки
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
    // Дополнительные поля если есть в данных
    rest?: number;
    comments?: string;
}

// Тип для пропсов компонента WorkoutList
export interface WorkoutListProps {
    list: WorkoutListItem[];
    title: string;
    onEdit: (item: WorkoutListItem) => void;
    onDelete: (id: string) => void;
}

// Тип для формы модального окна
export interface WorkoutFormData {
    name: string;
    description: string;
    exercises: Exercise[];
}

// Тип для пропсов модального окна
export interface WorkoutModalProps {
    visible: boolean;
    onClose: () => void;
    initialData?: WorkoutFormData;
    onSubmit: (values: WorkoutFormData) => void;
    predefinedOptions: Pick<WorkoutTemplate, 'name' | 'description' | 'exercises'>[];
}

// Тип для стора шаблонов
export interface TemplatesStore {
    templates: WorkoutTemplate[];
    addTemplate: (data: Omit<WorkoutTemplate, 'id' | 'createdAt'>) => Promise<void>;
    updateTemplate: (
        id: string,
        data: Partial<Omit<WorkoutTemplate, 'id' | 'createdAt'>>
    ) => Promise<void>;
    deleteTemplate: (id: string) => Promise<void>;
}

// Тип для стора планов
export interface PlansStore {
    plans: WorkoutPlan[];
    addPlan: (data: Omit<WorkoutPlan, 'id' | 'createdAt'>) => Promise<void>;
    updatePlan: (
        id: string,
        data: Partial<Omit<WorkoutPlan, 'id' | 'createdAt'>>
    ) => Promise<void>;
    deletePlan: (id: string) => Promise<void>;
}
