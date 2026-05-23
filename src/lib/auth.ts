import { writable } from 'svelte/store';
import type { User } from './types/auth';
import { apiFetch } from './api';
import { goto } from '$app/navigation';

export const auth = writable<{ user: User | null }>({ user: null });

export async function login(credentials: any) {
    try {
        const data = await apiFetch<{ message: string, user: User }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        auth.set({ user: data.user });
        goto('/');
    } catch (error: any) {
        throw error;
    }
}

export async function register(userData: any) {
    try {
        const data = await apiFetch<{ message: string, user: User }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        auth.set({ user: data.user });
        goto('/');
    } catch (error: any) {
        throw error;
    }
}

export async function logout() {
    try {
        await apiFetch('/auth/logout', { method: 'POST' });
        auth.set({ user: null });
        goto('/auth/login');
    } catch (error) {
        console.error('Logout failed', error);
        // Mesmo se falhar o logout no server (ex: sem net), limpamos localmente
        auth.set({ user: null });
        goto('/auth/login');
    }
}

// O estado do usuário deve ser inicializado no +layout.svelte usando os dados do data.user
export function initAuth(user: User | null) {
    auth.set({ user });
}
