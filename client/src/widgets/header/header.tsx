import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores';
import { BasicNav } from './components/basic-nav';
import { ClientNav } from './components/client-nav';
import { TrainerNav } from './components/trainer-nav';
import styles from './header.module.scss';

export const Header = () => {
    const { user, isAuthenticated } = useAuthStore();

    const getLinkClass = (isActive: boolean) =>
        isActive ? `${styles.link} ${styles.active}` : styles.link;

    const renderLeftNav = () => {
        if (!isAuthenticated) {
            return <BasicNav getLinkClass={getLinkClass} />;
        }

        if (user?.role === 'client') {
            return <ClientNav getLinkClass={getLinkClass} />;
        }

        if (user?.role === 'trainer') {
            return <TrainerNav getLinkClass={getLinkClass} />;
        }

        return null;
    };

    const renderRightNav = () => {
        if (!isAuthenticated) return null;

        return (
            <>
                {user?.role === 'client' && (
                    <NavLink
                        to="/client/trainer"
                        className={({ isActive }) => getLinkClass(isActive)}
                    >
                        Тренер
                    </NavLink>
                )}

                {user?.role === 'trainer' && (
                    <NavLink
                        to="/trainer/clients"
                        className={({ isActive }) => getLinkClass(isActive)}
                    >
                        Клиенты
                    </NavLink>
                )}

                <NavLink
                    to={`/${user?.role}/profile`}
                    className={({ isActive }) => getLinkClass(isActive)}
                >
                    Профиль
                </NavLink>
            </>
        );
    };

    return (
        <div className={styles.header_container}>
            <nav className={styles.left}>{renderLeftNav()}</nav>

            <div className={styles.right}>{renderRightNav()}</div>
        </div>
    );
};
