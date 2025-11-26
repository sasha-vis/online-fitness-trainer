import { useAuthStore } from '@/shared/stores';

export const Home = () => {
    const { login } = useAuthStore();
    const setFakeUser = () => {
        login(
            {
                id: '1',
                email: 'test@test.com',
                role: 'trainer',
            },
            '12345'
        );
    };
    return (
        <div>
            home
            <button onClick={setFakeUser}>setFakeUser</button>
        </div>
    );
};
