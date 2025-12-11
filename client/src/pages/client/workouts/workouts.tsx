import React from 'react';
import styles from './workouts.module.scss';
import { WorkoutCard } from './components/workout-card';
import { workoutPlan } from '../workout-detail/workout-plan-mock';

interface LoaderProps {
    children: React.ReactNode;
}

const Loader = ({ children }: LoaderProps) => {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.loading}>{children}</div>
        </div>
    );
};

export const Workouts = () => {
    const isLoading = false;

    if (isLoading) {
        return <Loader>Загрузка плана тренировок...</Loader>;
    }

    return (
        <>
            {!workoutPlan ? (
                <div className={styles.noPlanMessage}>
                    <h2 className={styles.noPlanTitle}>
                        Тренер пока не отправлял вам ваш план тренировок
                    </h2>
                    <p className={styles.noPlanText}>
                        Пожалуйста, подождите или спросите тренера в чате.
                    </p>
                </div>
            ) : (
                <div className={styles.workoutPlan}>
                    <div className={styles.planHeader}>
                        <h2 className={styles.planTitle}>План тренировок на неделю</h2>
                        <div className={styles.planInfo}>
                            <div className={styles.planGoal}>
                                <span className={styles.infoLabel}>Цель:</span>
                                <span className={styles.infoValue}>
                                    {workoutPlan.goal}
                                </span>
                            </div>
                            <div className={styles.planWorkouts}>
                                <span className={styles.infoLabel}>
                                    Рекомендуемое количество тренировок:
                                </span>
                                <span className={styles.workoutCount}>
                                    {workoutPlan.workouts.length}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.trainingsList}>
                        {workoutPlan.workouts.map((workout, index) => (
                            <WorkoutCard
                                key={workout.id}
                                workout={workout}
                                workoutIndex={index + 1}
                                to={`/client/workouts/${workout.id}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};
