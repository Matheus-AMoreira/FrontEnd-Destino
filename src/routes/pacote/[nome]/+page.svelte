<script lang="ts">
    import GuestLayout from '$lib/layouts/GuestLayout.svelte';
    import { formatarData, formatarPreco } from '$lib/utils';
    import {
        Building2,
        Calendar,
        CreditCard,
        Plane,
        TicketsPlane,
    } from 'lucide-svelte';
    import { goto } from '$app/navigation';

    let { data } = $props();

    let imagemSelecionada = $state('');
    let ofertaSelecionadaId = $state<number | null>(null);
    let modalAberto = $state(false);
    const numeroPessoas = 1;

    $effect(() => {
        if (data.pacote?.package_photos?.cover_photo && !imagemSelecionada) {
            imagemSelecionada = data.pacote.package_photos.cover_photo;
        }
        if (
            data.pacote?.offers &&
            data.pacote.offers.length > 0 &&
            !ofertaSelecionadaId
        ) {
            ofertaSelecionadaId = data.pacote.offers[0].id;
        }
    });

    const ofertaAtual = $derived(
        data.pacote?.offers?.find((o) => o.id === ofertaSelecionadaId) ||
        data.pacote?.offers?.[0]
    );

    const todasFotos = $derived(
        [
            { id: -1, url: data.pacote?.package_photos?.cover_photo, nome: 'Principal' },
            ...(data.pacote?.package_photos?.photos?.map((f) => ({
                ...f,
                url: f.path,
            })) || []),
        ].filter((f) => f.url)
    );

    function handleComprar() {
        if (!ofertaAtual) return;
        goto(`/checkout?ofertaId=${ofertaAtual.id}`);
    }
</script>

<GuestLayout title={data.pacote?.name || 'Pacote'}>
    {#if !data.pacote}
        <div class="flex flex-1 items-center justify-center">
            <div class="text-center">
                <h2 class="text-2xl font-bold text-gray-800">
                    Pacote "{data.name}" não encontrado
                </h2>
                <button
                    onclick={() => window.history.back()}
                    class="mt-4 text-blue-600 hover:underline"
                >
                    Voltar
                </button>
            </div>
        </div>
    {:else}
        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <!-- Breadcrumb -->
            <nav class="mb-8 flex" aria-label="Breadcrumb">
                <ol class="flex items-center space-x-4 text-sm">
                    <li>
                        <a href="/" class="text-gray-400 hover:text-gray-500">
                            Início
                        </a>
                    </li>
                    <li>
                        <span class="text-gray-300">/</span>
                    </li>
                    <li>
                        <a href="/buscar" class="text-gray-400 hover:text-gray-500">
                            Busca
                        </a>
                    </li>
                    <li>
                        <span class="text-gray-300">/</span>
                    </li>
                    <li>
                        <span class="max-w-[200px] truncate font-medium text-gray-600">
                            {data.pacote.name}
                        </span>
                    </li>
                </ol>
            </nav>

            <div class="overflow-hidden rounded-2xl bg-white shadow-lg">
                <div class="grid grid-cols-1 gap-8 p-8 lg:grid-cols-2">
                    <!-- Galeria -->
                    <div class="space-y-4">
                        <button
                            class="group aspect-w-16 aspect-h-12 relative w-full cursor-zoom-in overflow-hidden rounded-xl bg-gray-100 text-left"
                            onclick={() => (modalAberto = true)}
                        >
                            <img
                                src={imagemSelecionada || '/assets/images/placeholder.jpg'}
                                alt={data.pacote.name}
                                class="h-96 w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div class="bg-opacity-0 group-hover:bg-opacity-10 absolute inset-0 flex items-center justify-center transition-all">
                                <span class="bg-opacity-50 rounded-full bg-black px-3 py-1 text-sm font-medium text-white opacity-0 group-hover:opacity-100">
                                    Ver em tela cheia
                                </span>
                            </div>
                        </button>
                        <div class="flex gap-2 overflow-x-auto pb-2">
                            {#each todasFotos as foto, index}
                                <button
                                    onclick={() => (imagemSelecionada = foto.url || '')}
                                    class="h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all {imagemSelecionada === foto.url ? 'border-blue-500 opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}"
                                >
                                    <img
                                        src={foto.url}
                                        alt={foto.nome}
                                        class="h-full w-full object-cover"
                                    />
                                </button>
                            {/each}
                        </div>
                    </div>

                    <!-- Detalhes -->
                    <div class="space-y-6">
                        <div>
                            <h1 class="mb-2 text-3xl font-bold text-gray-900">
                                {data.pacote.name}
                            </h1>
                            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <div class="flex items-center gap-1">
                                    <Building2 size={20} />
                                    <span>
                                        {ofertaAtual?.hotel?.cidade?.name} - {ofertaAtual?.hotel?.cidade?.estado?.code}
                                    </span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <Calendar size={20} />
                                    <span>
                                        {ofertaAtual ? formatarData(ofertaAtual.start_date) : ''} até {ofertaAtual ? formatarData(ofertaAtual.end_date) : ''}
                                    </span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <Plane size={20} />
                                    <span>
                                        {ofertaAtual?.transporte?.type} ({ofertaAtual?.transporte?.company})
                                    </span>
                                </div>
                            </div>
                            {#if data.pacote.tags}
                                <div class="mt-3 flex flex-wrap gap-2">
                                    {#each data.pacote.tags as tag}
                                        <span class="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold tracking-wide text-blue-600 uppercase">
                                            {tag.nome}
                                        </span>
                                    {/each}
                                </div>
                            {/if}
                        </div>

                        <div class="rounded-xl border border-blue-100 bg-linear-to-r from-blue-50 to-indigo-50 p-6">
                            <div class="flex items-baseline space-x-2">
                                <span class="text-4xl font-bold text-blue-900">
                                    {formatarPreco((ofertaAtual?.price || 0) * numeroPessoas)}
                                </span>
                                <span class="text-sm text-gray-600">
                                    / total para {numeroPessoas} {numeroPessoas > 1 ? 'pessoas' : 'pessoa'}
                                </span>
                            </div>
                            <div class="mt-1 flex items-center text-sm text-gray-500">
                                <CreditCard size={16} class="mr-1" /> Preço individual: {formatarPreco(ofertaAtual?.price || 0)}
                            </div>
                        </div>

                        <div class="space-y-3">
                            <span class="block text-lg font-semibold text-gray-900">
                                Escolha a data da viagem
                            </span>
                            <div class="flex flex-col gap-2">
                                {#each data.pacote.offers as oferta (oferta.id)}
                                    <label
                                        class="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all {ofertaSelecionadaId === oferta.id ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}"
                                    >
                                        <div class="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="oferta"
                                                value={oferta.id}
                                                bind:group={ofertaSelecionadaId}
                                                class="h-5 w-5 cursor-pointer text-blue-600 focus:ring-blue-500"
                                            />
                                            <div>
                                                <div class="font-medium text-gray-900">
                                                    {formatarData(oferta.start_date)} a {formatarData(oferta.end_date)}
                                                </div>
                                                <div class="text-sm text-gray-500">
                                                    Hotel: {oferta.hotel?.name} | {oferta.transporte?.type}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            <div class="font-bold text-gray-900">
                                                {formatarPreco(oferta.price)}
                                            </div>
                                            <div class="text-xs font-medium text-green-600">
                                                {oferta.availability} vagas
                                            </div>
                                        </div>
                                    </label>
                                {/each}
                            </div>
                        </div>

                        <button
                            onclick={handleComprar}
                            class="flex w-full transform items-center justify-center space-x-2 rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl active:scale-95"
                        >
                            <TicketsPlane size={24} />
                            <span>Reservar Agora</span>
                        </button>

                        <div class="rounded-lg bg-gray-50 p-4 text-gray-700">
                            <h3 class="mb-2 font-bold text-gray-900">
                                Sobre o Pacote
                            </h3>
                            <p class="text-sm leading-relaxed">
                                {data.pacote.description}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="border-t border-gray-200 bg-gray-50 px-8 py-8">
                    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div>
                            <h3 class="mb-3 text-lg font-bold text-gray-900">
                                Hospedagem
                            </h3>
                            <div class="rounded-lg border bg-white p-4">
                                <p class="font-semibold text-blue-800">
                                    {ofertaAtual?.hotel?.name}
                                </p>
                                <p class="text-sm text-gray-600">
                                    Diária média inclusa: {formatarPreco(ofertaAtual?.hotel?.daily_rate || 0)}
                                </p>
                                <p class="mt-1 text-sm text-gray-500">
                                    {ofertaAtual?.hotel?.cidade?.name}, {ofertaAtual?.hotel?.cidade?.estado?.code}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 class="mb-3 text-lg font-bold text-gray-900">
                                Transporte Incluso
                            </h3>
                            <div class="rounded-lg border bg-white p-4">
                                <p class="font-semibold text-blue-800">
                                    {ofertaAtual?.transporte?.company}
                                </p>
                                <p class="text-sm text-gray-600">
                                    Tipo: {ofertaAtual?.transporte?.type}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <!-- Modal Lightbox -->
    {#if modalAberto}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
            onclick={() => (modalAberto = false)}
        >
            <button class="absolute top-4 right-4 text-4xl text-white hover:text-gray-300">
                &times;
            </button>
            <img
                src={imagemSelecionada}
                alt="Tela cheia"
                class="max-h-full max-w-full rounded-lg shadow-2xl"
                onclick={(e) => e.stopPropagation()}
            />
        </div>
    {/if}
</GuestLayout>
