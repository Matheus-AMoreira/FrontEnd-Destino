import { apiFetch } from '$lib/api';

export async function load() {
    try {
        const hoteis = await apiFetch<any[]>('/admin/hoteis');
        return { hoteis };
    } catch (error) {
        console.error('Erro ao carregar hotéis:', error);
        return { hoteis: [] };
    }
}
