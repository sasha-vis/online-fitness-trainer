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
        <div className={styles.header_container}>
            <nav className={styles.left}>
                {isAuthenticated && user?.id ? (
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
                {isAuthenticated && user?.id && (
                    <>
                        <span className={styles.role}>
                            {user.role === 'trainer' ? 'Тренер' : 'Клиент'}
                        </span>
                        <NavLink to={`${rolePrefix}/profile`}>Профиль</NavLink>
                        <Button onClick={handleLogout}>Выйти</Button>
                    </>
                )}
            </div>
        </div>
    );
};
