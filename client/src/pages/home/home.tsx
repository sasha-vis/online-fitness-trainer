import { useAuthStore } from '@/shared/stores';

export const Home = () => {
    const { user } = useAuthStore();

    if (user) {
        return <div>Добро пожаловать, {user.email}!</div>;
    }

    return (
        <div>
            Добро пожаловать в MyFit! Что бы начать пользоваться приложением, пожалуйста
            войдите в ваш аккаунт.
        </div>
    );
};
