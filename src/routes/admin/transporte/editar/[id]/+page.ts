import { apiFetch } from '$lib/api';

export async function load({ params }) {
    try {
        const transporte = await apiFetch<any>(`/admin/transportes/${params.id}`);
        return { transporte };
    } catch (error) {
        console.error('Erro ao carregar transporte:', error);
        return { transporte: null };
    }
}
