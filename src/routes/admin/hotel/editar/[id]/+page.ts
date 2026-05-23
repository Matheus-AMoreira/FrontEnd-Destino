import { apiFetch } from '$lib/api';

export async function load({ params }) {
    try {
        const [hotel, cidades] = await Promise.all([
            apiFetch<any>(`/admin/hoteis/${params.id}`),
            apiFetch<any[]>('/admin/cidades')
        ]);
        return { hotel, cidades };
    } catch (error) {
        console.error('Erro ao carregar dados do hotel:', error);
        return { hotel: null, cidades: [] };
    }
}
