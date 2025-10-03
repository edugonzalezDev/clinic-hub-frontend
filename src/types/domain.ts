export type User = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'doctor' | 'patient';
    document: string; // documento de  identidad
    isFirstLogin?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type RegisterData = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    document: string;
    phone: string;
    role: 'admin' | 'doctor' | 'patient';
    agreement: boolean;
}

export type LoginCredentials = {
    email: string;
    password: string;
}

export type CodeMfa = {
    code: string;
}