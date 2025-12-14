import { Link, NavLink, Outlet } from 'react-router-dom';
import styles from './trainer-library.module.scss';
import { Breadcrumb } from 'antd';

export const TrainerLibrary = () => {
    return (
        <div className={styles.libraryContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Библиотека</h1>

                <Breadcrumb
                    style={{ marginBottom: '16px' }}
                    items={[
                        {
                            title: <Link to="/trainer">{'< Вернуться на главную'}</Link>,
                        },
                    ]}
                />
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
                        <h3>Шаблоны планов тренировок</h3>
                        <p>Готовые планы тренировок</p>
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
                    to="/trainer/library/nutrition-templates"
                    className={({ isActive }) =>
                        isActive ? `${styles.navCard} ${styles.active}` : styles.navCard
                    }
                >
                    <div className={styles.navIcon}>🥗</div>
                    <div className={styles.navContent}>
                        <h3>Шаблоны планов питания</h3>
                        <p>Готовые планы питания</p>
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
                        <p>Библиотека блюд</p>
                    </div>
                </NavLink>
            </div>

            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
};
