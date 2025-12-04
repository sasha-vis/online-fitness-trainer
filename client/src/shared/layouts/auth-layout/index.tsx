import { Outlet } from 'react-router-dom';
import styles from './index.module.scss';

export const AuthLayout = () => {
    return (
        <div className={styles.layout}>
            <Outlet />
        </div>
    );
};
