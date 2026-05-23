import { apiFetch } from '$lib/api';
import type { Pacote } from '$lib/types/pacote';

export async function load({ params }) {
    const { nome } = params;

    try {
        const pacote = await apiFetch<Pacote>(`/pacotes/${nome}`);
        return {
            nome,
            pacote
        };
    } catch (error) {
        console.error('Erro ao carregar pacote:', error);
        return {
            nome,
            pacote: null
        };
    }
}
