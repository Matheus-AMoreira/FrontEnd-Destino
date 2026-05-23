import { apiFetch } from '$lib/api';

export async function load({ params }) {
    try {
        const [oferta, pacotes, hoteis, transportes] = await Promise.all([
            apiFetch<any>(`/admin/ofertas/${params.id}`),
            apiFetch<any[]>('/admin/pacotes'),
            apiFetch<any[]>('/admin/hoteis'),
            apiFetch<any[]>('/admin/transportes')
        ]);
        return { oferta, pacotes, hoteis, transportes };
    } catch (error) {
        console.error('Erro ao carregar dados da oferta:', error);
        return { oferta: null, pacotes: [], hoteis: [], transportes: [] };
    }
}
