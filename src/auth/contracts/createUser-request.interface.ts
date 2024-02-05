export interface CreateUserRequest {
    email: string;
    phoneNumber: string;
    password: string;
    displayName: string;
    photoURL: string;
    disabled: boolean;
}

export interface ResendUserRequest {
    email: string;
}

export interface ResetPassword {
    old: string;
    new: string;
    confirm: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}