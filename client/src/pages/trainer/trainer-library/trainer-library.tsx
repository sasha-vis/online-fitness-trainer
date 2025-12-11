import { NavLink, Outlet } from 'react-router-dom'; // Используем NavLink вместо Link
import styles from './trainer-library.module.scss';

export const TrainerLibrary = () => {
    return (
        <div className={styles.libraryContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Библиотека</h1>
                <NavLink to="/trainer" className={styles.backLink}>
                    ← Назад
                </NavLink>
            </div>

            <div className={styles.navSection}>
                <NavLink
                    to="/trainer/library/workout-templates"
                    className={({ isActive }) =>
                        isActive ? `${styles.navCard} ${styles.active}` : styles.navCard
                    }
                >
                    <div className={styles.navIcon}>💪</div>
                    <div className={styles.navContent}>
                        <h3>Шаблоны тренировок</h3>
                        <p>Готовые планы тренировок</p>
                    </div>
                </NavLink>

                <NavLink
                    to="/trainer/library/nutrition-templates"
                    className={({ isActive }) =>
                        isActive ? `${styles.navCard} ${styles.active}` : styles.navCard
                    }
                >
                    <div className={styles.navIcon}>🥗</div>
                    <div className={styles.navContent}>
                        <h3>Шаблоны питания</h3>
                        <p>Планы рационов</p>
                    </div>
                </NavLink>

                <NavLink
                    to="/trainer/library/exercises"
                    className={({ isActive }) =>
                        isActive ? `${styles.navCard} ${styles.active}` : styles.navCard
                    }
                >
                    <div className={styles.navIcon}>🏋️</div>
                    <div className={styles.navContent}>
                        <h3>Упражнения</h3>
                        <p>Библиотека упражнений</p>
                    </div>
                </NavLink>

                <NavLink
                    to="/trainer/library/meals"
                    className={({ isActive }) =>
                        isActive ? `${styles.navCard} ${styles.active}` : styles.navCard
                    }
                >
                    <div className={styles.navIcon}>🍽️</div>
                    <div className={styles.navContent}>
                        <h3>Блюда</h3>
                        <p>База блюд с КБЖУ</p>
                    </div>
                </NavLink>
            </div>

            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
};
