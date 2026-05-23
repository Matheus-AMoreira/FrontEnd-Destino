import { apiFetch } from '$lib/api';

export async function load({ params }) {
    try {
        const foto = await apiFetch<any>(`/admin/pacotedefotos/${params.id}`);
        return { foto };
    } catch (error) {
        console.error('Erro ao carregar álbum:', error);
        return { foto: null };
    }
}
