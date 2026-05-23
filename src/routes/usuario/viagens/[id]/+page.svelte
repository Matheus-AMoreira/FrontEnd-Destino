<script lang="ts">
    import GuestLayout from '$lib/layouts/GuestLayout.svelte';
    import {
        ArrowLeft,
        BaggageClaim,
        BookSearch,
        CalendarDays,
        Hotel,
        Mail,
        Map,
        Phone,
        Plane,
        Receipt,
        Printer
    } from 'lucide-svelte';
    import { formatarData, formatarPreco } from '$lib/utils';
    import { auth } from '$lib/auth';

    let { data } = $props();
    let compra = $derived(data.compra);

    let imagemSelecionada = $state('');

    $effect(() => {
        if (compra) {
            imagemSelecionada = compra.offer.package.packagePhotos?.items?.[0]?.url || '/images/placeholder.jpg';
        }
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Accepted':
            case 'ACEITO':
                return 'bg-green-100 text-green-700 font-bold';
            case 'Pending':
            case 'PENDENTE':
                return 'bg-yellow-100 text-yellow-700 font-bold';
            case 'Rejected':
            case 'RECUSADO':
                return 'bg-red-100 text-red-700 font-bold';
            default:
                return 'bg-gray-100 text-gray-700 font-bold';
        }
    };
</script>

{#if compra}
<GuestLayout title={`Viagem: ${compra.offer.package.name}`}>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div>
                    <a
                        href="/usuario/viagens"
                        class="group mb-4 inline-flex items-center text-sm font-black tracking-widest text-blue-600 uppercase transition-colors hover:text-blue-700"
                    >
                        <ArrowLeft class="mr-4" size={20} />
                        Voltar para Minhas Viagens
                    </a>
                    <h1 class="mb-3 text-4xl leading-tight font-black text-gray-900 lg:text-5xl">
                        {compra.offer.package.name}
                    </h1>
                    <div class="flex items-center gap-3">
                        <span
                            class={`rounded-full border px-4 py-1.5 text-xs tracking-widest uppercase ${getStatusStyle(compra.status)}`}
                        >
                            Status: {compra.status}
                        </span>
                        <span class="text-sm font-bold text-gray-400">|</span>
                        <span class="text-sm font-bold tracking-wider text-gray-500 uppercase">
                            Reserva #{compra.id.split('-')[0].toUpperCase()}
                        </span>
                    </div>
                </div>

                <div class="flex gap-4">
                    <button
                        onclick={() => window.print()}
                        class="flex items-center gap-2 rounded-2xl border-2 border-gray-100 bg-white px-8 py-4 text-sm font-black text-gray-900 shadow-sm transition-all hover:border-blue-100 hover:shadow-xl"
                    >
                        <Printer size={20} />
                        Imprimir Voucher
                    </button>
                </div>
            </div>

            <div class="mb-12">
                <div class="group relative overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-2xl shadow-blue-50">
                    <img
                        src={imagemSelecionada}
                        alt={compra.offer.package.name}
                        class="h-[500px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                </div>

                {#if compra.offer.package.packagePhotos?.items?.length > 1}
                    <div class="mt-6 grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8">
                        {#each compra.offer.package.packagePhotos.items as foto}
                            <button
                                onclick={() => imagemSelecionada = foto.url}
                                class={`aspect-square overflow-hidden rounded-2xl border-4 transition-all duration-300 ${
                                    imagemSelecionada === foto.url
                                        ? 'scale-105 border-blue-600 shadow-lg'
                                        : 'border-white hover:border-blue-200'
                                }`}
                            >
                                <img
                                    src={foto.url}
                                    alt="Foto do pacote"
                                    class="h-full w-full object-cover"
                                />
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>

            <div class="grid grid-cols-1 gap-10 lg:grid-cols-3">
                <div class="space-y-10 lg:col-span-2">
                    <div class="rounded-4xl border border-gray-100 bg-white p-10 shadow-xl shadow-blue-50">
                        <h2 class="mb-8 flex items-center gap-4 text-2xl font-black text-gray-900">
                            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-inner">
                                <Map />
                            </div>
                            Resumo do Itinerário
                        </h2>

                        <div class="grid grid-cols-1 gap-10 md:grid-cols-2">
                            <div class="flex items-center space-x-5">
                                <div class="flex h-14 w-14 items-center justify-center rounded-[20px] bg-indigo-50 text-indigo-600">
                                    <Plane />
                                </div>
                                <div>
                                    <h3 class="mb-1 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                        Partida
                                    </h3>
                                    <p class="text-xl font-extrabold text-gray-900">
                                        {formatarData(compra.offer.startDate)}
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-5">
                                <div class="flex h-14 w-14 items-center justify-center rounded-[20px] bg-blue-50 text-blue-600">
                                    <CalendarDays />
                                </div>
                                <div>
                                    <h3 class="mb-1 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                        Retorno
                                    </h3>
                                    <p class="text-xl font-extrabold text-gray-900">
                                        {formatarData(compra.offer.endDate)}
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-5">
                                <div class="flex h-14 w-14 items-center justify-center rounded-[20px] bg-emerald-50 text-emerald-600">
                                    <Hotel />
                                </div>
                                <div>
                                    <h3 class="mb-1 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                        Hospedagem
                                    </h3>
                                    <p class="text-xl font-extrabold text-gray-900">
                                        {compra.offer.hotel.name}
                                    </p>
                                    <p class="text-sm font-bold text-gray-500">
                                        {compra.offer.hotel.city.name}, {compra.offer.hotel.city.state.code}
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-5">
                                <div class="flex h-14 w-14 items-center justify-center rounded-[20px] bg-orange-50 text-orange-600">
                                    <BaggageClaim />
                                </div>
                                <div>
                                    <h3 class="mb-1 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                        Transporte
                                    </h3>
                                    <p class="text-xl font-extrabold text-gray-900">
                                        {compra.offer.transport.company}
                                    </p>
                                    <p class="text-sm font-bold text-gray-500">
                                        Modalidade: {compra.offer.transport.type}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="mt-10 border-t border-gray-50 pt-10">
                            <h3 class="mb-4 text-sm font-black tracking-[0.1em] text-gray-400 uppercase">
                                Descrição do Pacote
                            </h3>
                            <p class="text-lg leading-relaxed font-medium text-gray-600">
                                {compra.offer.package.description}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="space-y-10">
                    <div class="group rounded-[32px] border border-gray-100 bg-white p-10 shadow-xl shadow-blue-50 transition-colors hover:border-blue-100">
                        <h2 class="mb-8 flex items-center gap-4 text-xl font-black text-gray-900">
                            <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-inner">
                                <Receipt />
                            </div>
                            Pagamento
                        </h2>
                        <div class="space-y-6">
                            <div class="flex items-center justify-between rounded-2xl bg-gray-50/50 p-4">
                                <span class="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                    Data da Compra
                                </span>
                                <span class="font-black text-gray-900">
                                    {formatarData(compra.purchaseDate)}
                                </span>
                            </div>
                            <div class="flex flex-col gap-2 border-t border-gray-100 pt-6">
                                <span class="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                    Investimento Total
                                </span>
                                <span class="text-4xl font-black tracking-tight text-blue-600">
                                    {formatarPreco(compra.finalValue)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="group relative overflow-hidden rounded-[32px] bg-gradient-to-br from-gray-900 to-blue-900 p-10 text-white shadow-2xl">
                        <div class="absolute top-0 right-0 -mt-12 -mr-12 h-32 w-32 rounded-full bg-white/5 transition-transform duration-700 group-hover:scale-150" />

                        <h3 class="relative mb-6 text-xl font-black">
                            Suporte 24h
                        </h3>
                        <div class="relative space-y-6">
                            <div class="flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition-colors hover:bg-white/10">
                                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p class="mb-1 text-[10px] font-black tracking-widest text-blue-300 uppercase">
                                        Telefone
                                    </p>
                                    <p class="text-lg font-extrabold">
                                        (11) 4002-8922
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition-colors hover:bg-white/10">
                                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p class="mb-1 text-[10px] font-black tracking-widest text-blue-300 uppercase">
                                        E-mail
                                    </p>
                                    <p class="font-extrabold">
                                        ajuda@destino.com.br
                                    </p>
                                </div>
                            </div>
                        </div>
                        <a
                            href="/contato"
                            class="mt-8 block w-full rounded-2xl bg-white py-4 text-center text-sm font-black text-gray-900 shadow-lg shadow-black/20 transition-all hover:bg-blue-50 active:scale-95"
                        >
                            Precisa de Ajuda?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</GuestLayout>
{:else}
<div class="flex items-center justify-center min-h-[60vh]">
    <p class="text-gray-500 font-bold">Carregando detalhes da viagem...</p>
</div>
{/if}

<style>
    @media print {
        :global(nav), :global(footer), .Printer, button, a {
            display: none !important;
        }
        .min-h-screen {
            padding: 0 !important;
            background: white !important;
        }
    }
</style>
