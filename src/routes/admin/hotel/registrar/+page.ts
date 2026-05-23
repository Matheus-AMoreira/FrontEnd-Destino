import { apiFetch } from '$lib/api';

export async function load() {
    try {
        const cidades = await apiFetch<any[]>('/admin/cidades');
        return { cidades };
    } catch (error) {
        console.error('Erro ao carregar cidades:', error);
        return { cidades: [] };
    }
}
