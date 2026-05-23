import { apiFetch } from '$lib/api';

export async function load({ url }) {
    const ofertaId = url.searchParams.get('ofertaId');

    if (!ofertaId) {
        return { oferta: null };
    }

    try {
        const oferta = await apiFetch<any>(`/ofertas/${ofertaId}`);
        return { oferta };
    } catch (error) {
        console.error('Erro ao carregar oferta:', error);
        return { oferta: null };
    }
}
