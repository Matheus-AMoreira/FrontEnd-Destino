import { apiFetch } from '$lib/api';

export async function load() {
    try {
        const stats = await apiFetch<any>('/admin/stats');
        return { stats };
    } catch (error) {
        console.error('Erro ao carregar estatísticas do admin:', error);
        return {
            stats: {
                hoteis: 0,
                transportes: 0,
                pacotes: 0,
                ofertas: 0,
                usuarios: 0
            }
        };
    }
}
