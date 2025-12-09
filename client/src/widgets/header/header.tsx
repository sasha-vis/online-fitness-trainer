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
                        <NavLink to="/">Главная</NavLink>
                        <NavLink to="/login">Войти</NavLink>
                    </>
                )}

                {isAuthenticated && (
                    <>
                        <NavLink to={'/'}>Главная</NavLink>
                        <NavLink to={`${rolePrefix}/nutrition`}>Питание</NavLink>
                        <NavLink to={`${rolePrefix}/workouts`}>Тренировки</NavLink>
                        <NavLink to={`${rolePrefix}/progress`}>Прогресс</NavLink>
                    </>
                )}
            </nav>

            <div className={styles.right}>
                {isAuthenticated && (
                    <>
                        {user?.role === 'client' && (
                            <NavLink to={`${rolePrefix}/trainer`}>Тренер</NavLink>
                        )}
                        {user?.role === 'trainer' && (
                            <NavLink to={`${rolePrefix}/clients`}>Клиенты</NavLink>
                        )}

                        <NavLink to={`${rolePrefix}/profile`}>Профиль</NavLink>
                    </>
                )}
            </div>
        </div>
    );
};
