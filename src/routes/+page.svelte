<script lang="ts">
    import Card from '$lib/components/Card.svelte';
    import GuestLayout from '$lib/layouts/GuestLayout.svelte';
    import { MapPinned, ArrowLeft, ChevronRight } from 'lucide-svelte';
    import Image from '$lib/components/Image.svelte';
    import { goto } from '$app/navigation';

    let { data } = $props();

    let termoBusca = $state('');

    function handleSearchSubmit(e: Event) {
        e.preventDefault();
        goto(`/buscar?termo=${termoBusca}`);
    }

    function handleProximaPagina() {
        if (data.paginaAtual < data.totalPaginas - 1) {
            goto(`/?page=${data.paginaAtual + 1}`);
        }
    }

    function handlePaginaAnterior() {
        if (data.paginaAtual > 0) {
            goto(`/?page=${data.paginaAtual - 1}`);
        }
    }
</script>

<GuestLayout title="PAULA VIAGENS E TURISMO">
    <main class="grow p-4 md:p-8">
        <section class="flex flex-wrap items-center gap-8 pt-4">
            <div class="mb-4 flex w-full flex-col xl:w-[48%]">
                <h1 class="mb-4 px-4 pt-3 text-center text-4xl font-extrabold md:text-left lg:text-5xl">
                    O Mundo Todo em Suas Mãos
                </h1>
                <div class="p-4 text-lg md:px-8">
                    <p>
                        Planeje a jornada dos seus sonhos sem
                        complicações. Descubra roteiros exclusivos,
                        personalize cada detalhe e acesse pacotes de
                        viagem inesquecíveis.
                    </p>
                </div>
                <div class="mt-6 flex justify-center px-4 md:justify-start md:px-8">
                    <button
                        onclick={() => goto('/buscar')}
                        class="rounded-lg bg-[#2071b3] px-8 py-3 text-white shadow-lg transition duration-300 hover:bg-blue-800"
                    >
                        Comece a Planejar
                    </button>
                </div>
            </div>
            <div class="mt-8 flex w-full justify-center xl:mt-0 xl:w-[48%]">
                <Image
                    name="destaque"
                    alt="Imagem de destaque"
                    style="max-w-xgg w-full rounded-3xl shadow-xl"
                />
            </div>
        </section>

        <hr class="my-9 border-t-2 border-sky-300/50" />

        <section class="mt-7">
            <h2 class="mb-9 text-center text-4xl font-bold">
                Confira Nossos Pacotes
            </h2>

            <div class="mx-auto mb-8 max-w-2xl px-4">
                <div class="mb-2 flex items-center justify-center space-x-2 text-lg font-semibold text-gray-700">
                    <MapPinned size={24} />
                    <span>Procurar Viagens</span>
                </div>

                <form
                    onsubmit={handleSearchSubmit}
                    class="flex gap-4"
                >
                    <div class="relative flex-1">
                        <input
                            type="text"
                            bind:value={termoBusca}
                            placeholder="Ex.: Pacote Fernando de Noronha"
                            class="w-full rounded-xl border border-gray-300 py-3 pr-6 pl-12 text-lg text-gray-800 shadow-md outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        class="rounded-xl bg-[#2071b3] px-6 py-3 font-semibold text-white shadow-lg transition duration-300 hover:bg-blue-800"
                    >
                        Buscar
                    </button>
                </form>
            </div>

            <div class="flex flex-wrap justify-center gap-6 px-4 pb-8">
                {#if data.pacotes.length > 0}
                    {#each data.pacotes as pacote (pacote.id)}
                        <Card
                            title={pacote.name}
                            description={pacote.description}
                            imageUrl={pacote.package_photos?.cover_photo || 'placeholder'}
                            detalharHref="/pacote/{pacote.name}"
                        />
                    {/each}
                {:else}
                    <p class="w-full text-center text-lg text-gray-500">
                        Nenhum pacote disponível no momento.
                    </p>
                {/if}
            </div>

            {#if data.totalPaginas > 1}
                <div class="mt-4 mb-8 flex items-center justify-center gap-4">
                    <button
                        onclick={handlePaginaAnterior}
                        disabled={data.paginaAtual === 0}
                        class="rounded-full p-3 shadow-md transition {data.paginaAtual === 0 ? 'cursor-not-allowed bg-gray-200 text-gray-400' : 'bg-white text-[#2071b3] hover:bg-[#2071b3] hover:text-white'}"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <span class="text-lg font-medium text-gray-700">
                        Página {data.paginaAtual + 1} de {data.totalPaginas}
                    </span>

                    <button
                        onclick={handleProximaPagina}
                        disabled={data.paginaAtual === data.totalPaginas - 1}
                        class="rounded-full p-3 shadow-md transition {data.paginaAtual === data.totalPaginas - 1 ? 'cursor-not-allowed bg-gray-200 text-gray-400' : 'bg-white text-[#2071b3] hover:bg-[#2071b3] hover:text-white'}"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            {/if}
        </section>
    </main>
</GuestLayout>
