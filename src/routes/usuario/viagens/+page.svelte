<script lang="ts">
    import GuestLayout from '$lib/layouts/GuestLayout.svelte';
    import {
        ArrowRightFromLine,
        CalendarDays,
        Globe,
        History,
        MapPin,
        PackageSearch,
        Ticket,
        TicketsPlane,
        User,
        ChevronRight
    } from 'lucide-svelte';
    import { auth } from '$lib/auth';
    import { formatarData, formatarPreco } from '$lib/utils';

    let { data } = $props();
    const isHistorico = data.view === 'concluidas';

    const getStatusColor = (status: string) => {
        if (isHistorico) return 'bg-gray-100 text-gray-500 border-gray-200';
        switch (status) {
            case 'Accepted':
            case 'ACEITO':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'Pending':
            case 'PENDENTE':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Rejected':
            case 'RECUSADO':
            case 'CANCELADO':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    // Grouping logic
    const groupedCompras = $derived.by(() => {
        const groups: Record<number, { pacote: any; tickets: any[] }> = {};

        data.compras.forEach((compra: any) => {
            const pacoteId = compra.offer?.package?.id;
            if (!pacoteId) return;
            
            if (!groups[pacoteId]) {
                groups[pacoteId] = {
                    pacote: compra.offer.package,
                    tickets: [],
                };
            }
            groups[pacoteId].tickets.push(compra);
        });

        return Object.values(groups).sort((a, b) => {
            const dateA = new Date(a.tickets[0].purchaseDate).getTime();
            const dateB = new Date(b.tickets[0].purchaseDate).getTime();
            return dateB - dateA;
        });
    });
</script>

<GuestLayout title={isHistorico ? 'Histórico de Viagens' : 'Minhas Viagens'}>
    <div class="flex min-h-screen bg-gray-50">
        <!-- Sidebar -->
        <aside class="sticky top-0 hidden h-screen w-72 overflow-y-auto border-r border-gray-200 bg-white lg:block">
            <div class="border-b border-gray-100 p-8">
                <div class="mb-2 flex items-center gap-4">
                    <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                        <User />
                    </div>
                    <div>
                        <h1 class="text-xl leading-tight font-bold text-gray-900">
                            Minha Conta
                        </h1>
                        <p class="max-w-[140px] truncate text-sm font-medium text-gray-500">
                            {$auth.user?.email}
                        </p>
                    </div>
                </div>
            </div>

            <nav class="mt-4 space-y-2 p-4">
                <a
                    href="/usuario/viagens"
                    class="flex w-full items-center gap-3 rounded-2xl px-6 py-4 font-bold transition-all duration-200 {data.view === 'andamento' ? 'translate-x-1 bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'}"
                >
                    <ArrowRightFromLine />
                    <span>Próximas Viagens</span>
                </a>

                <a
                    href="/usuario/historico"
                    class="flex w-full items-center gap-3 rounded-2xl px-6 py-4 font-bold transition-all duration-200 {data.view === 'concluidas' ? 'translate-x-1 bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'}"
                >
                    <History />
                    <span>Histórico</span>
                </a>
            </nav>
        </aside>

        <main class="flex-1 p-6 lg:p-12">
            <div class="mx-auto max-w-6xl">
                <div class="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <div>
                        <h1 class="flex items-center gap-4 text-4xl font-black text-gray-900">
                            <Globe class="text-blue-600" />
                            <span>
                                {isHistorico ? 'Histórico de Viagens' : 'Minhas Viagens'}
                            </span>
                        </h1>
                        <p class="mt-2 text-lg font-medium text-gray-500">
                            {isHistorico ? 'Relembre suas aventuras passadas' : 'Gerencie suas próximas aventuras inesquecíveis'}
                        </p>
                    </div>

                    <div class="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-6 py-3 shadow-sm">
                        <span class="text-sm font-bold tracking-widest text-gray-400 uppercase">
                            Total:
                        </span>
                        <strong class="text-lg font-black text-blue-600">
                            {data.compras.length}
                        </strong>
                    </div>
                </div>

                {#if data.compras.length === 0}
                    <div class="rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
                        <div class="mb-6 flex justify-center text-8xl text-gray-200">
                            <TicketsPlane size={80} />
                        </div>
                        <h3 class="mb-2 text-2xl font-extrabold text-gray-900">
                            {isHistorico ? 'Seu histórico está vazio' : 'Nenhuma viagem agendada'}
                        </h3>
                        <p class="mx-auto mb-8 max-w-sm font-medium text-gray-500">
                            {isHistorico ? 'Você ainda não completou nenhuma viagem conosco.' : 'Parece que você ainda não tem planos.'}
                        </p>
                        {#if !isHistorico}
                            <a
                                href="/buscar"
                                class="inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg shadow-blue-100 transition-all hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
                            >
                                <PackageSearch />
                                <span>Explorar Destinos</span>
                            </a>
                        {/if}
                    </div>
                {:else}
                    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {#each groupedCompras as grupo (grupo.pacote.id)}
                            <div class="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all duration-300 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-50/50 {isHistorico ? 'opacity-90 saturate-50' : ''}">
                                <div class="relative h-60 overflow-hidden">
                                    <img
                                        src={grupo.pacote.packagePhotos?.items?.[0]?.url || '/images/placeholder.jpg'}
                                        alt={grupo.pacote.name}
                                        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80"></div>

                                    <div class="absolute top-4 left-4 flex gap-2">
                                        {#if grupo.tickets.length > 1}
                                            <span class="flex items-center gap-2 rounded-xl bg-blue-600/90 px-3 py-1.5 text-xs font-black text-white shadow-lg backdrop-blur-md">
                                                <Ticket size={14} />
                                                {grupo.tickets.length} PASSAGENS
                                            </span>
                                        {/if}
                                    </div>

                                    <div class="absolute bottom-4 left-6">
                                        <div class="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-1 text-sm font-bold text-white/90 backdrop-blur-md">
                                            <MapPin class="text-red-400" size={16} />
                                            <span>
                                                {grupo.tickets[0].offer.hotel.city.name}, {grupo.tickets[0].offer.hotel.city.state.code}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex flex-1 flex-col p-8">
                                    <h3 class="mb-3 truncate text-2xl font-black text-gray-900 transition-colors group-hover:text-blue-600">
                                        {grupo.pacote.name}
                                    </h3>

                                    <p class="mb-6 line-clamp-2 text-sm leading-relaxed font-medium text-gray-500">
                                        {grupo.pacote.description}
                                    </p>

                                    <div class="mt-auto space-y-4 border-t border-gray-100 pt-6">
                                        {#each grupo.tickets as compra, idx}
                                            <a 
                                                href="/usuario/viagens/{compra.id}"
                                                class="block group/ticket {idx > 0 ? 'mt-4 border-t border-gray-50 pt-4' : ''}"
                                            >
                                                <div class="mb-4 flex items-center justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <span class="rounded-full border px-3 py-1 text-[10px] font-black tracking-wider uppercase {getStatusColor(compra.status)}">
                                                            {isHistorico ? 'CONCLUÍDA' : compra.status}
                                                        </span>
                                                        <span class="text-[10px] font-bold text-gray-400 uppercase">
                                                            Ticket #{compra.id.split('-')[0]}
                                                        </span>
                                                    </div>
                                                    <div class="text-right">
                                                        <span class="block text-xs font-black text-gray-900">
                                                            {formatarPreco(compra.finalValue)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div class="mb-2 flex items-center justify-between rounded-2xl border border-transparent bg-gray-50 p-4 transition-colors group-hover/ticket:border-blue-100 group-hover/ticket:bg-blue-50/50">
                                                    <div class="flex items-center gap-3">
                                                        <CalendarDays class="text-blue-500" size={18} />
                                                        <span class="text-sm font-bold text-gray-700">
                                                            {formatarData(compra.offer.startDate)} - {formatarData(compra.offer.endDate)}
                                                        </span>
                                                    </div>
                                                    <ChevronRight size={18} class="text-gray-300 group-hover/ticket:text-blue-500 transition-colors" />
                                                </div>
                                            </a>
                                        {/each}
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </main>
    </div>
</GuestLayout>
