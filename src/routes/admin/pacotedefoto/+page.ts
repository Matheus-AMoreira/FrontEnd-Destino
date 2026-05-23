import { apiFetch } from '$lib/api';

export async function load() {
    try {
        const fotos = await apiFetch<any[]>('/admin/pacote-fotos');
        return { fotos };
    } catch (error) {
        console.error('Erro ao carregar pacotes de fotos:', error);
        return { fotos: [] };
    }
}
