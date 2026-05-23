import { apiFetch } from '$lib/api';

export async function load({ url }) {
    const ano = url.searchParams.get('ano') || new Date().getFullYear().toString();
    const estadoId = url.searchParams.get('estado_id') || '';
    
    try {
        const stats = await apiFetch<any>(`/admin/estatisticas?ano=${ano}&estadoId=${estadoId}`);
        return { stats };
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        return {
            stats: {
                dados: [],
                crescimentoUsuarios: [],
                destinosPopulares: [],
                ano: parseInt(ano),
                anosDisponiveis: [parseInt(ano)],
                estados: [],
                filtros: { estado_id: null }
            }
        };
    }
}
