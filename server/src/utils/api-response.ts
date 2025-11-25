export const createApiResponse = <T>(data: T | null, error: string | null = null) => ({
    data,
    error,
    success: !error,
});
