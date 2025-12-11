import { NavLink } from 'react-router-dom';

interface ClientNavProps {
    getLinkClass: (isActive: boolean) => string;
}

export const ClientNav = ({ getLinkClass }: ClientNavProps) => {
    return (
        <>
            <NavLink
                to="/client"
                className={({ isActive }) => getLinkClass(isActive)}
                end
            >
                Главная
            </NavLink>
            <NavLink
                to="/client/nutrition"
                className={({ isActive }) => getLinkClass(isActive)}
            >
                Питание
            </NavLink>
            <NavLink
                to="/client/workouts"
                className={({ isActive }) => getLinkClass(isActive)}
            >
                Тренировки
            </NavLink>
            <NavLink
                to="/client/progress"
                className={({ isActive }) => getLinkClass(isActive)}
            >
                Прогресс
            </NavLink>
        </>
    );
};
