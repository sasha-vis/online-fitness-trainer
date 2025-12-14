export interface IUser {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone?: string;
    avatar?: string;
}

export interface IUserInfo {
    id: string;
    user_id: string;
    height: number;
    age: number;
    profile_photo_url: string;
    goal: string;
}

export interface UpdateUserPayload {
    name: string;
    surname: string;
    email: string;
    phone?: string;
    height?: number | null | undefined;
}
