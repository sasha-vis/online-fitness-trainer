import { NavLink } from 'react-router-dom';

interface BasicNavProps {
    getLinkClass: (isActive: boolean) => string;
}

export const BasicNav = ({ getLinkClass }: BasicNavProps) => {
    return (
        <>
            <NavLink to="/" className={({ isActive }) => getLinkClass(isActive)}>
                Главная
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => getLinkClass(isActive)}>
                Войти
            </NavLink>
        </>
    );
};
