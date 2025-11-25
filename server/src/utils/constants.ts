export const USER_ROLES = {
    ADMIN: 'admin',
    TRAINER: 'trainer',
    CLIENT: 'client',
    USER: 'user',
} as const;

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
} as const;
