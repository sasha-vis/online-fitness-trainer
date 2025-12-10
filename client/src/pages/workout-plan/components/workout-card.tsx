import { Link } from 'react-router-dom';
import styles from './workout-card.module.scss';

interface IExercise {
    name: string;
    sets: number;
    reps: string;
    video: string;
}

interface ISection {
    title: string;
    exercises: IExercise[];
}

interface IWorkout {
    id: string;
    sections: ISection[];
}

interface WorkoutCardProps {
    workout: IWorkout;
    workoutIndex: number;
    to: string;
}

export const WorkoutCard = ({ workout, workoutIndex, to }: WorkoutCardProps) => {
    return (
        <Link to={to} className={styles.workoutLink}>
            <div className={styles.workoutCard}>
                <div className={styles.workoutTitle}>{`Тренировка ${workoutIndex}`}</div>
                <div className={styles.workoutDescription}>
                    {workout.sections.map((section, index) => (
                        <span key={index}>{section.title}</span>
                    ))}
                </div>
            </div>
        </Link>
    );
};
