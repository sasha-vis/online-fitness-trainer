import type { User } from '@/shared/stores/user/user';

export const TEST_USERS = [
    {
        id: '1',
        email: 'client@test.com',
        password: 'client123',
        role: 'client' as const,
    },
    {
        id: '2',
        email: 'trainer@test.com',
        password: 'trainer123',
        role: 'trainer' as const,
    },
];

export const findUser = (email: string, password: string): User | null => {
    const user = TEST_USERS.find((u) => u.email === email && u.password === password);

    if (!user) return null;

    return {
        id: user.id,
        email: user.email,
        role: user.role,
    };
};
