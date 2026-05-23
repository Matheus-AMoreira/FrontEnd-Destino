import { apiFetch } from '$lib/api';

export async function load() {
    try {
        const transportes = await apiFetch<any[]>('/admin/transportes');
        return { transportes };
    } catch (error) {
        console.error('Erro ao carregar transportes:', error);
        return { transportes: [] };
    }
}
