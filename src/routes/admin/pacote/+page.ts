import { apiFetch } from '$lib/api';

export async function load() {
    try {
        const pacotes = await apiFetch<any[]>('/admin/pacotes');
        return { pacotes };
    } catch (error) {
        console.error('Erro ao carregar pacotes:', error);
        return { pacotes: [] };
    }
}
