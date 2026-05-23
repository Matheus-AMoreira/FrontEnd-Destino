import { apiFetch } from '$lib/api';

export async function load() {
    try {
        const [funcionarios, pacoteFotos] = await Promise.all([
            apiFetch<any[]>('/admin/funcionarios'),
            apiFetch<any[]>('/admin/pacote-fotos')
        ]);
        return { funcionarios, pacoteFotos };
    } catch (error) {
        console.error('Erro ao carregar dados para registro de pacote:', error);
        return { funcionarios: [], pacoteFotos: [] };
    }
}
