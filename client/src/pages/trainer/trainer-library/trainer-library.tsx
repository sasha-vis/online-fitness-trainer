import { NavLink } from 'react-router-dom';
import styles from './trainer-library.module.scss';

export const TrainerLibrary = () => {
    return (
        <>
            <NavLink to="/trainer/library/excercise-templates" className={styles.card}>
                <div className={styles.cardIcon}>📚</div>
                <h3>excercise-templates ==== ссылка</h3>
                <p>шаблон упражнений</p>
            </NavLink>
            <NavLink to="/trainer/library/nutrition-templates" className={styles.card}>
                <div className={styles.cardIcon}>📚</div>
                <h3>nutrition-templates</h3>
                <p>шаблон питания</p>
            </NavLink>
            <NavLink to="/trainer/library/workout-templates" className={styles.card}>
                <div className={styles.cardIcon}>📚</div>
                <h3>workout-templates</h3>
                <p>шаблон тренировок</p>
            </NavLink>
        </>
    );
};
