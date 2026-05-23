import { apiFetch } from '$lib/api';

export async function load({ params }) {
    try {
        const compra = await apiFetch<any>(`/usuario/viagens/${params.id}`);
        return { compra };
    } catch (error) {
        console.error('Erro ao carregar detalhes da viagem:', error);
        return { compra: null };
    }
}
