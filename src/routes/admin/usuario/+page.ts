import { apiFetch } from '$lib/api';

export async function load({ url }) {
    const termo = url.searchParams.get('termo') || '';
    const page = url.searchParams.get('page') || '1';

    try {
        const usuarios = await apiFetch<any>(`/admin/usuarios?termo=${termo}&page=${page}`);
        return {
            usuarios,
            filters: { termo }
        };
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        return {
            usuarios: { data: [], links: [], last_page: 0, current_page: 1 },
            filters: { termo }
        };
    }
}
