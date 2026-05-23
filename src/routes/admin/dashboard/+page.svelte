<script lang="ts">
    import AdminLayout from '$lib/layouts/AdminLayout.svelte';
    import { 
        Hotel, 
        Truck, 
        MapPinned, 
        Tag, 
        Users,
        TrendingUp,
        ArrowUpRight
    } from 'lucide-svelte';

    let { data } = $props();

    const cards = $derived([
        { label: 'Pacotes Ativos', value: data.stats.pacotes, icon: MapPinned, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Hotéis Parceiros', value: data.stats.hoteis, icon: Hotel, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { label: 'Transporte', value: data.stats.transportes, icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Ofertas Ativas', value: data.stats.ofertas, icon: Tag, color: 'text-amber-600', bg: 'bg-amber-100' },
        { label: 'Usuários', value: data.stats.usuarios, icon: Users, color: 'text-rose-600', bg: 'bg-rose-100' },
    ]);
</script>

<AdminLayout title="Dashboard">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-500 mt-1">Bem-vindo ao painel de gerenciamento do Destino.</p>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {#each cards as card}
            <div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                <div class="inline-flex rounded-xl {card.bg} p-3 {card.color} mb-4">
                    <card.icon size={24} />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500">{card.label}</p>
                    <h3 class="mt-1 text-2xl font-bold text-gray-900">{card.value}</h3>
                </div>
                <div class="absolute top-4 right-4 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowUpRight size={20} />
                </div>
            </div>
        {/each}
    </div>

    <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div class="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-bold text-gray-900">Atividade Recente</h3>
                <TrendingUp class="text-gray-400" size={20} />
            </div>
            <div class="space-y-4">
                {#each [1, 2, 3] as i}
                    <div class="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                        <div class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                            {i}
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-900">Nova oferta cadastrada para Cancun</p>
                            <p class="text-xs text-gray-500">Há {i * 2} horas atrás</p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <div class="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <div class="mb-4 rounded-full bg-blue-50 p-4 text-blue-600">
                <TrendingUp size={32} />
            </div>
            <h3 class="text-xl font-bold text-gray-900">Relatórios Detalhados</h3>
            <p class="mt-2 text-gray-500">Visualize métricas avançadas e tendências de vendas em breve.</p>
            <a
                href="/admin/dashboard/estatisticas"
                class="mt-6 rounded-xl bg-gray-900 px-6 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-gray-800"
            >
                Ver Mais
            </a>
        </div>
    </div>
</AdminLayout>
