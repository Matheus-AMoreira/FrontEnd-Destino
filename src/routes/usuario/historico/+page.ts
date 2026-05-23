import { apiFetch } from '$lib/api';

export async function load() {
    try {
        const compras = await apiFetch<any[]>('/usuario/viagens');
        return {
            compras,
            view: 'concluidas'
        };
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        return {
            compras: [],
            view: 'concluidas'
        };
    }
}
