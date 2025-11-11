export type AdminUser = {
    id: string;
    name?: string;
    email: string;
    role: 'user' | 'moderator' | 'admin' | string;
    banned?: boolean;
    createdAt?: string;
};