<script lang="ts">
    import AdminLayout from '$lib/layouts/AdminLayout.svelte';
    import { 
        TrendingUp, 
        MapPin, 
        Users, 
        Calendar, 
        ChevronLeft, 
        BarChart3, 
        Building2 
    } from 'lucide-svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import { onMount, tick } from 'svelte';
    import { Chart, registerables } from 'chart.js';

    Chart.register(...registerables);

    let { data } = $props();
    let activeTab = $state('vendas');
    
    let chartCanvas: HTMLCanvasElement | undefined = $state();
    let chartInstance: Chart | null = null;

    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    function updateUrl(params: Record<string, string>) {
        const url = new URL(page.url);
        Object.entries(params).forEach(([key, value]) => {
            if (value) url.searchParams.set(key, value);
            else url.searchParams.delete(key);
        });
        goto(url.toString(), { keepFocus: true, noScroll: true });
    }

    function createChart() {
        if (!chartCanvas) return;
        if (chartInstance) chartInstance.destroy();

        const ctx = chartCanvas.getContext('2d');
        if (!ctx) return;

        let config: any = {
            type: 'bar',
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        padding: 12,
                        cornerRadius: 8,
                    },
                },
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f3f4f6' },
                        ticks: { stepSize: 1 },
                    },
                },
            }
        };

        if (activeTab === 'vendas') {
            const datasets = {
                ACEITO: new Array(12).fill(0),
                PENDENTE: new Array(12).fill(0),
                RECUSADO: new Array(12).fill(0),
            };

            data.stats.dados.forEach((d: any) => {
                const status = d.status as keyof typeof datasets;
                if (datasets[status] !== undefined) {
                    datasets[status][d.mes - 1] = d.total;
                }
            });

            config.data = {
                labels,
                datasets: [
                    { label: 'Concluídas', data: datasets.ACEITO, backgroundColor: '#10b981', borderRadius: 4 },
                    { label: 'Em Andamento', data: datasets.PENDENTE, backgroundColor: '#f59e0b', borderRadius: 4 },
                    { label: 'Canceladas', data: datasets.RECUSADO, backgroundColor: '#ef4444', borderRadius: 4 },
                ]
            };
            config.options.scales.x.stacked = true;
            config.options.scales.y.stacked = true;
        } else if (activeTab === 'destinos') {
            config.data = {
                labels: data.stats.destinosPopulares.map((d: any) => `${d.cidade} (${d.estado})`),
                datasets: [{
                    label: 'Viagens',
                    data: data.stats.destinosPopulares.map((d: any) => d.total),
                    backgroundColor: '#3b82f6',
                    borderRadius: 8,
                    barThickness: 32,
                }]
            };
        } else if (activeTab === 'usuarios') {
            config.data = {
                labels: data.stats.crescimentoUsuarios.map((u: any) => u.ano.toString()),
                datasets: [{
                    label: 'Usuários Cadastrados',
                    data: data.stats.crescimentoUsuarios.map((u: any) => u.total),
                    backgroundColor: '#8b5cf6',
                    borderRadius: 8,
                    barThickness: 48,
                }]
            };
        }

        chartInstance = new Chart(ctx, config);
    }

    $effect(() => {
        // Re-create chart when tab or data changes
        if (activeTab || data.stats) {
            tick().then(createChart);
        }
    });

    onMount(() => {
        createChart();
        return () => chartInstance?.destroy();
    });

    const totalVendas = $derived(data.stats.dados.reduce((acc: number, curr: any) => acc + curr.total, 0));
</script>

<AdminLayout title="Estatísticas">
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <div class="mb-2 flex items-center gap-2 text-blue-600">
                <a
                    href="/admin/dashboard"
                    class="flex items-center gap-1 text-sm font-bold hover:underline"
                >
                    <ChevronLeft size={16} />
                    Voltar ao Dashboard
                </a>
            </div>
            <h1 class="text-3xl font-black tracking-tight text-gray-900">
                Estatísticas do Sistema
            </h1>
            <p class="mt-1 font-medium text-gray-500">
                Análise detalhada de vendas, destinos e usuários.
            </p>
        </div>

        <div class="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
            <Calendar size={18} class="ml-2 text-gray-400" />
            <select
                value={data.stats.ano}
                onchange={(e) => updateUrl({ ano: (e.target as HTMLSelectElement).value })}
                class="cursor-pointer border-none bg-transparent pr-8 font-bold text-gray-700 focus:ring-0 outline-none"
            >
                {#each data.stats.anosDisponiveis as a}
                    <option value={a}>{a}</option>
                {/each}
            </select>
        </div>
    </div>

    <!-- Browser-like Tabs -->
    <div class="mb-0 ml-4 flex w-fit items-center gap-1 rounded-t-3xl border-x border-t border-gray-200 bg-gray-100/50 p-1.5">
        <button
            onclick={() => activeTab = 'vendas'}
            class="flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-bold transition-all {activeTab === 'vendas' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-700'}"
        >
            <TrendingUp size={18} />
            Vendas
        </button>
        <button
            onclick={() => activeTab = 'destinos'}
            class="flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-bold transition-all {activeTab === 'destinos' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-700'}"
        >
            <MapPin size={18} />
            Destinos
        </button>
        <button
            onclick={() => activeTab = 'usuarios'}
            class="flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-bold transition-all {activeTab === 'usuarios' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-700'}"
        >
            <Users size={18} />
            Usuários
        </button>
    </div>

    <div class="relative z-10 mb-8 rounded-tr-[40px] rounded-b-[40px] border border-gray-200 bg-white p-8 shadow-2xl shadow-blue-100/50 transition-all">
        {#if activeTab === 'vendas'}
            <div>
                <div class="mb-8 flex items-center justify-between">
                    <div>
                        <h3 class="text-xl font-bold text-gray-900">Histórico Mensal de Vendas</h3>
                        <p class="mt-1 text-sm text-gray-500">Status das compras realizadas em {data.stats.ano}</p>
                    </div>
                    <div class="flex items-center gap-4 hidden sm:flex">
                        <div class="flex items-center gap-1.5">
                            <div class="h-3 w-3 rounded-full bg-emerald-500"></div>
                            <span class="text-xs font-bold tracking-tight text-gray-600 uppercase">Concluído</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <div class="h-3 w-3 rounded-full bg-amber-500"></div>
                            <span class="text-xs font-bold tracking-tight text-gray-600 uppercase">Em Andamento</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <div class="h-3 w-3 rounded-full bg-red-500"></div>
                            <span class="text-xs font-bold tracking-tight text-gray-600 uppercase">Cancelado</span>
                        </div>
                    </div>
                </div>

                <div class="h-[450px] w-full">
                    {#if totalVendas > 0}
                        <canvas bind:this={chartCanvas}></canvas>
                    {:else}
                        <div class="flex h-full w-full flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-gray-100 bg-gray-50/30 text-gray-400">
                            <BarChart3 size={48} class="mb-4 opacity-20" />
                            <p class="text-[10px] font-bold tracking-widest uppercase">Sem vendas registradas neste ano</p>
                        </div>
                    {/if}
                </div>
            </div>
        {:else if activeTab === 'destinos'}
            <div>
                <div class="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h3 class="text-xl font-bold text-gray-900">Destinos Mais Procurados</h3>
                        <p class="mt-1 text-sm text-gray-500">Top cidades com vendas aprovadas</p>
                    </div>

                    <div class="flex flex-wrap items-center gap-3">
                        <div class="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1.5">
                            <Building2 size={16} class="ml-2 text-gray-400" />
                            <select
                                value={data.stats.filtros.estado_id || ''}
                                onchange={(e) => updateUrl({ estado_id: (e.target as HTMLSelectElement).value })}
                                class="cursor-pointer border-none bg-transparent pr-8 text-xs font-bold text-gray-600 focus:ring-0 outline-none"
                            >
                                <option value="">Todos os Estados</option>
                                {#each data.stats.estados as e}
                                    <option value={e.id}>{e.nome}</option>
                                {/each}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="h-[450px] w-full">
                    {#if data.stats.destinosPopulares.length > 0}
                        <canvas bind:this={chartCanvas}></canvas>
                    {:else}
                        <div class="flex h-full w-full flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-gray-100 bg-gray-50/30 text-gray-400">
                            <MapPin size={48} class="mb-4 opacity-20" />
                            <p class="text-[10px] font-bold tracking-widest uppercase">Nenhum destino encontrado</p>
                        </div>
                    {/if}
                </div>
            </div>
        {:else if activeTab === 'usuarios'}
            <div>
                <div class="mb-8">
                    <h3 class="text-xl font-bold text-gray-900">Evolução de Usuários Cadastrados</h3>
                    <p class="mt-1 text-sm text-gray-500">Crescimento da base de usuários ao longo do tempo</p>
                </div>

                <div class="h-[450px] w-full">
                    {#if data.stats.crescimentoUsuarios.length > 0}
                        <canvas bind:this={chartCanvas}></canvas>
                    {:else}
                        <div class="flex h-full w-full flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-gray-100 bg-gray-50/30 text-gray-400">
                            <Users size={48} class="mb-4 opacity-20" />
                            <p class="text-[10px] font-bold tracking-widest uppercase">Dados de usuários indisponíveis</p>
                        </div>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</AdminLayout>
