import { apiFetch } from '$lib/api';

export async function load() {
    try {
        const [pacotes, hoteis, transportes] = await Promise.all([
            apiFetch<any[]>('/admin/pacotes'),
            apiFetch<any[]>('/admin/hoteis'),
            apiFetch<any[]>('/admin/transportes')
        ]);
        return { pacotes, hoteis, transportes };
    } catch (error) {
        console.error('Erro ao carregar dependências da oferta:', error);
        return { pacotes: [], hoteis: [], transportes: [] };
    }
}
