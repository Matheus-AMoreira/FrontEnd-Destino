import { apiFetch } from '$lib/api';
import type { Pacote } from '$lib/types/pacote';

export async function load({ url, fetch }) {
    const termo = url.searchParams.get('termo') || '';
    const precoMax = url.searchParams.get('precoMax') || '0';
    const page = url.searchParams.get('page') || '0';
    const size = url.searchParams.get('size') || '12';

    try {
        const data = await apiFetch<any>(`/buscar?termo=${termo}&precoMax=${precoMax}&page=${page}&size=${size}`, {}, fetch);

        return {
            pacotes: data.packages || [],
            filters: {
                termo: data.filters.term,
                precoMax: data.filters.max_price,
                page: data.filters.page,
                size: data.filters.size
            },
            paginacao: {
                page: data.pagination.page,
                totalPages: data.pagination.total_pages,
                totalElements: data.pagination.total_elements
            }
        };
    } catch (error) {
        console.error('Erro ao buscar pacotes:', error);
        return {
            pacotes: [],
            filters: { termo, precoMax: Number(precoMax), page: Number(page), size: Number(size) },
            paginacao: { page: 0, totalPages: 0, totalElements: 0 }
        };
    }
}
