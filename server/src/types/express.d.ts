declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: 'client' | 'trainer' | 'admin' | 'user';
            };
        }
    }
}

export {};
