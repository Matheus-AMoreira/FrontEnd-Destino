<script lang="ts">
    import GuestLayout from '$lib/layouts/GuestLayout.svelte';
    import { formatarPreco } from '$lib/utils';
    import { auth } from '$lib/auth';

    let { data } = $props();
</script>

<svelte:head>
    <title>Reserva Confirmada - PAULA VIAGENS</title>
</svelte:head>

<GuestLayout title="Reserva Confirmada">
    <div class="flex min-h-screen items-center justify-center bg-gray-50 py-8">
        <div class="mx-auto w-full max-w-md px-4 sm:px-6 lg:px-8">
            {#if !data.compra}
                <div class="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">
                    <p class="text-gray-600">Venda não encontrada.</p>
                    <a href="/" class="mt-4 inline-block text-blue-600 hover:underline">Voltar ao início</a>
                </div>
            {:else}
                <div class="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">
                    <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <svg
                            class="h-10 w-10 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    <h1 class="mb-2 text-2xl font-bold text-gray-900">
                        Pagamento Confirmado!
                    </h1>

                    <p class="mb-6 text-gray-600">
                        Sua viagem foi reservada com sucesso. Em breve você
                        receberá um email com todos os detalhes.
                    </p>

                    <div class="mb-6 rounded-lg bg-gray-50 p-4 text-left">
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600">
                                    Número do Pedido:
                                </span>
                                <span class="font-semibold">
                                    #{data.compra.id}
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">
                                    Pacote:
                                </span>
                                <span class="text-right font-semibold">
                                    {data.compra.oferta?.pacote?.nome}
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">
                                    Valor Pago:
                                </span>
                                <span class="font-semibold text-green-600">
                                    {formatarPreco(Number(data.compra.valor_final))}
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">
                                    Status:
                                </span>
                                <span class="font-semibold">
                                    {data.compra.status}
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">
                                    Data da Compra:
                                </span>
                                <span class="font-semibold">
                                    {new Date(data.compra.data_compra).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <a
                        href="/usuario/viagens"
                        class="block w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        Ver Minhas Viagens
                    </a>

                    <div class="mt-6 flex justify-center space-x-4">
                        <button
                            onclick={() => window.print()}
                            class="flex cursor-pointer items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                            <svg
                                class="mr-1 h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                />
                            </svg>
                            Imprimir
                        </button>

                        <a
                            href="/contato"
                            class="flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                            <svg
                                class="mr-1 h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Ajuda
                        </a>
                    </div>
                </div>

                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-500">
                        Obrigado por escolher a Destino! 🌴
                    </p>
                </div>
            {/if}
        </div>
    </div>
</GuestLayout>
