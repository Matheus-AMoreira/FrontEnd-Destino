import { apiFetch } from '$lib/api';

export async function load() {
    try {
        const ofertas = await apiFetch<any[]>('/admin/ofertas');
        return { ofertas };
    } catch (error) {
        console.error('Erro ao carregar ofertas:', error);
        return { ofertas: [] };
    }
}
