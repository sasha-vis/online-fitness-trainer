import { NavLink } from 'react-router-dom';

interface TrainerNavProps {
    getLinkClass: (isActive: boolean) => string;
}

export const TrainerNav = ({ getLinkClass }: TrainerNavProps) => {
    return (
        <>
            <NavLink to="/trainer" className={({ isActive }) => getLinkClass(isActive)}>
                Главная
            </NavLink>
            <NavLink
                to="/trainer/library"
                className={({ isActive }) => getLinkClass(isActive)}
            >
                Библиотека
            </NavLink>
        </>
    );
};
