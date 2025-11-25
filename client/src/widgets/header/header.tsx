import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores';
import { Button } from 'antd';
import styles from './header.module.scss';

export const Header = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const rolePrefix = user?.role === 'trainer' ? '/trainer' : '/client';
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <header className={styles.header}>
            <nav className={styles.left}>
                {isAuthenticated && user ? (
                    <>
                        <NavLink to={rolePrefix}>Главная</NavLink>
                        <NavLink to={`${rolePrefix}/nutrition`}>Питание</NavLink>
                        <NavLink to={`${rolePrefix}/progress`}>Прогресс</NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/">Главная</NavLink>
                        <NavLink to="/login">Войти</NavLink>
                    </>
                )}
            </nav>
            <div className={styles.center}>
                {isAuthenticated && (
                    <NavLink to={`${rolePrefix}/profile`}>
                        <p>Avatar</p>
                    </NavLink>
                )}
            </div>
            <div className={styles.right}>
                {isAuthenticated && user && (
                    <>
                        <span className={styles.role}>
                            {user.role === 'trainer' ? 'Тренер' : 'Клиент'}
                        </span>
                        <NavLink to={`${rolePrefix}/profile`}>Профиль</NavLink>
                        <Button onClick={handleLogout}>Выйти</Button>
                    </>
                )}
                {!isAuthenticated && !user && <NavLink to="/login">Войти</NavLink>}
            </div>
        </header>
    );
};
