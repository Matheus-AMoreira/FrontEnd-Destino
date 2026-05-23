import { apiFetch } from '$lib/api';

export async function load({ url }) {
    const vendaId = url.searchParams.get('vendaId');

    if (!vendaId) {
        return { compra: null };
    }

    try {
        const compra = await apiFetch<any>(`/vendas/${vendaId}`);
        return { compra };
    } catch (error) {
        console.error('Erro ao carregar confirmação:', error);
        return { compra: null };
    }
}
