import { apiFetch } from '$lib/api';

export async function load({ params }) {
    try {
        const [usuario, roles] = await Promise.all([
            apiFetch<any>(`/admin/usuario/${params.id}`),
            apiFetch<any[]>('/admin/roles')
        ]);
        return { usuario, roles };
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        return { usuario: null, roles: [] };
    }
}
