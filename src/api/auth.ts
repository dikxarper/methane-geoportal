import { apiRequest } from "./client";

export interface User {
    id?: number;
    name: string;
    email: string;

    organization?: string | null;
    referral_source?: string | null;
    usage_reason?: string | null;
}

interface LoginResponse {
    access_token: string;
    token_type?: string;
    user?: User;
}

export interface RegisterRequest {
    name: string;
    email: string;

    password: string;
    password_confirmation: string;

    organization: string | null;
    referral_source: string | null;
    usage_reason: string | null;
}

export function login(email: string, password: string) {
    return apiRequest<LoginResponse>("/login", {
        method: "POST",

        body: JSON.stringify({
            email,
            password,
        }),
    });
}

export function register(data: RegisterRequest) {
    return apiRequest<unknown>("/register", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function getMe(token: string) {
    return apiRequest<User>("/me", {
        token,
    });
}

export function logout(token: string) {
    return apiRequest<unknown>("/logout", {
        method: "POST",
        token,
    });
}
