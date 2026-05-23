import { apiFetch } from '$lib/api';

export async function load() {
    try {
        const roles = await apiFetch<any[]>('/admin/roles');
        return { roles };
    } catch (error) {
        console.error('Erro ao carregar roles:', error);
        return { roles: [] };
    }
}
