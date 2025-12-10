import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores';
import styles from './header.module.scss';

export const Header = () => {
    const { user, isAuthenticated } = useAuthStore();
    const rolePrefix = user?.role === 'trainer' ? '/trainer' : '/client';

    return (
        <div className={styles.header_container}>
            <nav className={styles.left}>
                {!isAuthenticated && (
                    <>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Главная
                        </NavLink>
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Войти
                        </NavLink>
                    </>
                )}

                {isAuthenticated && (
                    <>
                        <NavLink
                            to={'/'}
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Главная
                        </NavLink>
                        <NavLink
                            to={`${rolePrefix}/nutrition`}
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Питание
                        </NavLink>
                        <NavLink
                            to={`${rolePrefix}/workouts`}
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Тренировки
                        </NavLink>
                        <NavLink
                            to={`${rolePrefix}/progress`}
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Прогресс
                        </NavLink>
                    </>
                )}
            </nav>

            <div className={styles.right}>
                {isAuthenticated && (
                    <>
                        {user?.role === 'client' && (
                            <NavLink
                                to={`${rolePrefix}/trainer`}
                                className={({ isActive }) =>
                                    isActive
                                        ? `${styles.link} ${styles.active}`
                                        : styles.link
                                }
                            >
                                Тренер
                            </NavLink>
                        )}
                        {user?.role === 'trainer' && (
                            <NavLink
                                to={`${rolePrefix}/clients`}
                                className={({ isActive }) =>
                                    isActive
                                        ? `${styles.link} ${styles.active}`
                                        : styles.link
                                }
                            >
                                Клиенты
                            </NavLink>
                        )}

                        <NavLink
                            to={`${rolePrefix}/profile`}
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Профиль
                        </NavLink>
                    </>
                )}
            </div>
        </div>
    );
};
