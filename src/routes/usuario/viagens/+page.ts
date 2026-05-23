import { apiFetch } from '$lib/api';

export async function load() {
    try {
        const compras = await apiFetch<any[]>('/usuario/viagens');
        return {
            compras,
            view: 'andamento'
        };
    } catch (error) {
        console.error('Erro ao carregar viagens:', error);
        return {
            compras: [],
            view: 'andamento'
        };
    }
}
