import { apiFetch } from '$lib/api';
import type { User } from '$lib/types/auth';

export async function load() {
    try {
        const user = await apiFetch<User>('/usuario/perfil');
        return { user };
    } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        return { user: null };
    }
}
