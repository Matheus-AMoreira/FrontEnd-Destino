<script lang="ts">
    import {
        ChevronLeft,
        ChevronRight,
        CreditCard,
        MapPinned,
        Package,
    } from 'lucide-svelte';
    import PacoteCard from '$lib/components/PacoteCard.svelte';
    import Image from '$lib/components/Image.svelte';
    import GuestLayout from '$lib/layouts/GuestLayout.svelte';
    import { goto } from '$app/navigation';

    let { data } = $props();

    let inputTermo = $state(data.filters.termo || '');
    let inputPreco = $state(data.filters.precoMax || 0);

    function handleBuscar(e: Event) {
        e.preventDefault();
        goto(`/buscar?termo=${inputTermo}&precoMax=${inputPreco}&page=0&size=${data.filters.size}`);
    }

    function handleMudarPagina(novaPagina: number) {
        goto(`/buscar?termo=${data.filters.termo}&precoMax=${data.filters.precoMax}&page=${novaPagina}&size=${data.filters.size}`);
    }

    function handleMudarTamanhoPagina(e: Event) {
        const size = (e.target as HTMLSelectElement).value;
        goto(`/buscar?termo=${data.filters.termo}&precoMax=${data.filters.precoMax}&page=0&size=${size}`);
    }
</script>

<GuestLayout title="Encontre seu destino">
    <div class="flex min-h-screen flex-col bg-gray-50 lg:flex-row">
        <!-- Sidebar de Filtros -->
        <aside class="z-10 w-full shrink-0 bg-white p-6 shadow-lg lg:w-80">
            <div class="mb-8 flex justify-center">
                <Image
                    name="logo_cor"
                    alt="Paula viagens logo"
                    style="w-32 object-contain"
                />
            </div>

            <form onsubmit={handleBuscar} class="space-y-6">
                <div>
                    <label class="mb-2 flex items-center gap-2 text-sm font-bold tracking-wider text-gray-500 uppercase">
                        <CreditCard size={18} /> Preço Máximo
                    </label>
                    <input
                        type="number"
                        bind:value={inputPreco}
                        placeholder="Ex: 2000"
                        class="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label class="mb-2 flex items-center gap-2 text-sm font-bold tracking-wider text-gray-500 uppercase">
                        <Package size={18} /> Pacotes por página
                    </label>
                    <select
                        value={data.filters.size}
                        onchange={handleMudarTamanhoPagina}
                        class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="6">6 itens</option>
                        <option value="12">12 itens</option>
                        <option value="24">24 itens</option>
                        <option value="48">48 itens</option>
                    </select>
                </div>

                <button
                    type="submit"
                    class="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700"
                >
                    Aplicar Filtros
                </button>
            </form>
        </aside>

        <!-- Conteúdo Principal -->
        <main class="flex-1 overflow-y-auto p-4 md:p-8">
            <!-- Barra de Busca Topo -->
            <div class="mx-auto mb-8 max-w-4xl">
                <div class="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-700">
                    <MapPinned size={24} />
                    <span>Encontre seu destino</span>
                </div>
                <form onsubmit={handleBuscar} class="flex gap-4">
                    <input
                        type="text"
                        bind:value={inputTermo}
                        placeholder="Buscar por nome do pacote..."
                        class="flex-1 rounded-xl border border-gray-300 px-6 py-3 text-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        class="rounded-xl bg-[#2071b3] px-8 py-3 font-bold text-white shadow-md transition hover:bg-blue-800"
                    >
                        Buscar
                    </button>
                </form>
            </div>

            <!-- Listagem -->
            <div class="mb-6 flex items-center justify-between">
                <h2 class="text-2xl font-bold text-gray-800">
                    {data.paginacao.totalElements} Pacotes encontrados
                </h2>
                <span class="text-sm text-gray-500">
                    Página {data.paginacao.page + 1} de {data.paginacao.totalPages}
                </span>
            </div>

            {#if data.pacotes.length > 0}
                <div class="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {#each data.pacotes as pacote (pacote.id)}
                        <PacoteCard {pacote} />
                    {/each}
                </div>
            {:else}
                <div class="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
                    <p class="text-lg text-gray-500">
                        Nenhum pacote encontrado com estes filtros.
                    </p>
                </div>
            {/if}

            <!-- Controles de Paginação -->
            {#if data.paginacao.totalPages > 1}
                <div class="mt-8 flex items-center justify-center gap-6">
                    <button
                        onclick={() => handleMudarPagina(data.paginacao.page - 1)}
                        disabled={data.paginacao.page === 0}
                        class="rounded-full bg-white p-3 text-blue-600 shadow transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div class="flex gap-2">
                        {#each Array.from({ length: Math.min(5, data.paginacao.totalPages) }) as _, i}
                            {@const p = data.paginacao.totalPages > 5 && data.paginacao.page > 2 
                                ? Math.min(data.paginacao.page - 2 + i, data.paginacao.totalPages - 1)
                                : i}
                            {#if p < data.paginacao.totalPages && p >= 0}
                                <button
                                    onclick={() => handleMudarPagina(p)}
                                    class="h-10 w-10 rounded-lg font-medium transition {data.paginacao.page === p ? 'bg-[#2071b3] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}"
                                >
                                    {p + 1}
                                </button>
                            {/if}
                        {/each}
                    </div>

                    <button
                        onclick={() => handleMudarPagina(data.paginacao.page + 1)}
                        disabled={data.paginacao.page === data.paginacao.totalPages - 1}
                        class="rounded-full bg-white p-3 text-blue-600 shadow transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            {/if}
        </main>
    </div>
</GuestLayout>
