import { apiFetch } from '$lib/api';

export async function load({ params }) {
    try {
        const [pacote, funcionarios, pacoteFotos] = await Promise.all([
            apiFetch<any>(`/admin/pacotes/${params.id}`),
            apiFetch<any[]>('/admin/funcionarios'),
            apiFetch<any[]>('/admin/pacote-fotos')
        ]);
        return { pacote, funcionarios, pacoteFotos };
    } catch (error) {
        console.error('Erro ao carregar dados do pacote:', error);
        return { pacote: null, funcionarios: [], pacoteFotos: [] };
    }
}
