export type User = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    slug: string;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
