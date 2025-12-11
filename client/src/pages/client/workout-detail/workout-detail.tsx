import { Link, useParams } from 'react-router-dom';
import styles from './workout-detail.module.scss';
import { workoutPlan } from './workout-plan-mock';
import { Breadcrumb } from 'antd';

export const WorkoutDetail = () => {
    const { workoutId } = useParams();

    const workout = workoutPlan.workouts.find((w) => w.id === workoutId);

    if (!workout) return <div className={styles.notFound}>Такой тренировки нет</div>;

    return (
        <div className={styles.workout}>
            <Breadcrumb
                style={{ marginBottom: '16px' }}
                items={[
                    {
                        title: (
                            <Link to="/client/workouts">
                                {'< Вернуться к списку тренировок'}
                            </Link>
                        ),
                    },
                ]}
            />
            <h1 className={styles.workoutTitle}>Тренировка {workoutId}</h1>

            <div className={styles.workoutDetails}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>1. Разминка</h2>
                </section>

                {workout.sections.map((section, sectionIndex) => (
                    <section key={sectionIndex} className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            {sectionIndex + 2}. {section.title}:
                        </h2>

                        <div className={styles.exercisesList}>
                            {section.exercises.map((exercise, exerciseIndex) => (
                                <div key={exerciseIndex} className={styles.exercise}>
                                    <div className={styles.exerciseName}>
                                        {exercise.video ? (
                                            <a
                                                href={exercise.video}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.exerciseLink}
                                            >
                                                {exercise.name}
                                            </a>
                                        ) : (
                                            exercise.name
                                        )}
                                    </div>
                                    <div className={styles.exerciseDetails}>
                                        <span className={styles.setsReps}>
                                            {exercise.sets} × {exercise.reps}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};
