<script lang="ts">
    import GuestLayout from '$lib/layouts/GuestLayout.svelte';
    import { Calendar, CreditCard, Package, User } from 'lucide-svelte';
    import Modal, { type ModalData } from '$lib/components/Modal.svelte';
    import { formatarData, formatarPreco } from '$lib/utils';
    import { apiFetch } from '$lib/api';
    import { auth } from '$lib/auth';
    import { goto } from '$app/navigation';

    let { data } = $props();

    let metodoPagamento = $state('cartao-credito');
    let processing = $state(false);
    let modal = $state<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    let checkoutData = $state({
        oferta_id: data.oferta?.id,
        metodo: 'VISTA',
        processador: 'VISA',
        parcelas: 1,
    });

    const valorTotal = $derived(parseFloat(data.oferta?.price) || 0);
    const descontoPix = $derived(valorTotal * 0.05);
    const valorComDescontoPix = $derived(valorTotal - descontoPix);

    function handleMetodoChange(e: Event) {
        const val = (e.target as HTMLSelectElement).value;
        metodoPagamento = val;
        if (val === 'pix') {
            checkoutData.metodo = 'VISTA';
            checkoutData.processador = 'PIX';
            checkoutData.parcelas = 1;
        } else if (val === 'cartao-credito') {
            checkoutData.metodo = checkoutData.parcelas > 1 ? 'PARCELADO' : 'VISTA';
            checkoutData.processador = 'MASTERCARD';
        } else {
            checkoutData.metodo = 'VISTA';
            checkoutData.processador = 'VISA';
            checkoutData.parcelas = 1;
        }
    }

    function handleParcelasChange(e: Event) {
        const p = Number((e.target as HTMLSelectElement).value);
        checkoutData.parcelas = p;
        checkoutData.metodo = p > 1 ? 'PARCELADO' : 'VISTA';
    }

    async function handleSubmit(e: Event) {
        e.preventDefault();
        processing = true;
        try {
            const response = await apiFetch<any>('/checkout/processar', {
                method: 'POST',
                body: JSON.stringify(checkoutData)
            });
            goto(`/checkout/confirmacao?vendaId=${response.id}`);
        } catch (err: any) {
            modal = {
                show: true,
                mensagem: err.message || 'Erro ao processar compra.',
                url: null,
            };
        } finally {
            processing = false;
        }
    }
</script>

<svelte:head>
    <title>Checkout - PAULA VIAGENS</title>
</svelte:head>

<GuestLayout title="Confirmar Compra">
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
                <button
                    onclick={() => window.history.back()}
                    class="mb-4 flex cursor-pointer items-center text-gray-600 hover:text-gray-900"
                >
                    ← Voltar
                </button>
                <h1 class="text-3xl font-bold text-gray-900">
                    Confirmar Compra
                </h1>
            </div>

            {#if !data.oferta}
                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-md text-center">
                    <p class="text-gray-600">Oferta não encontrada ou expirada.</p>
                    <a href="/buscar" class="mt-4 inline-block text-blue-600 hover:underline">Voltar para busca</a>
                </div>
            {:else}
                <form
                    onsubmit={handleSubmit}
                    class="grid grid-cols-1 gap-8 lg:grid-cols-3"
                >
                    <div class="space-y-6 lg:col-span-2">
                        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                            <h2 class="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                                <User size={24} />
                                Seus Dados
                            </h2>
                            <div class="space-y-2">
                                <p>
                                    <strong>Nome:</strong> {$auth.user?.first_name} {$auth.user?.last_name}
                                </p>
                                <p>
                                    <strong>Email:</strong> {$auth.user?.email}
                                </p>
                            </div>
                        </div>

                        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                            <h2 class="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                                <CreditCard size={24} />
                                Forma de Pagamento
                            </h2>

                            <div class="mb-6">
                                <label class="mb-3 block text-sm font-medium text-gray-700">
                                    Selecione como deseja pagar:
                                </label>
                                <select
                                    value={metodoPagamento}
                                    onchange={handleMetodoChange}
                                    class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="cartao-credito">
                                        Cartão de Crédito
                                    </option>
                                    <option value="cartao-debito">
                                        Cartão de Débito
                                    </option>
                                    <option value="pix">PIX</option>
                                </select>
                            </div>

                            {#if metodoPagamento === 'cartao-credito'}
                                <div class="space-y-4">
                                    <div>
                                        <label class="mb-2 block text-sm font-medium text-gray-700">
                                            Parcelas
                                        </label>
                                        <select
                                            value={checkoutData.parcelas}
                                            onchange={handleParcelasChange}
                                            class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
                                        >
                                            {#each Array.from({ length: 12 }, (_, i) => i + 1) as num}
                                                <option value={num}>
                                                    {num}x de {formatarPreco(valorTotal / num)}
                                                    {num > 1 ? ' sem juros' : ''}
                                                </option>
                                            {/each}
                                        </select>
                                    </div>
                                </div>
                            {/if}

                            {#if metodoPagamento === 'pix'}
                                <div class="rounded-lg border border-green-200 bg-green-50 p-4">
                                    <div class="flex items-center">
                                        <span class="mr-3 text-2xl">🧾</span>
                                        <div>
                                            <p class="font-semibold text-green-800">
                                                5% de desconto no PIX!
                                            </p>
                                            <p class="text-sm text-green-600">
                                                Economize {formatarPreco(descontoPix)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            {/if}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            class="w-full rounded-xl px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all {processing ? 'cursor-not-allowed bg-gray-400' : 'cursor-pointer bg-green-600 hover:bg-green-700'}"
                        >
                            {processing
                                ? 'Processando...'
                                : metodoPagamento === 'pix'
                                    ? `Pagar com PIX - ${formatarPreco(valorComDescontoPix)}`
                                    : `Confirmar Compra - ${formatarPreco(valorTotal)}`}
                        </button>
                    </div>

                    <div class="space-y-6">
                        <div class="sticky top-4 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                            <h2 class="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                                <Package size={30} class="text-blue-600" />
                                Resumo
                            </h2>

                            <div class="mb-4 space-y-3">
                                <div>
                                    <span class="text-sm font-bold tracking-tight text-gray-500 uppercase">
                                        Pacote
                                    </span>
                                    <p class="font-medium">
                                        {data.oferta.package?.name}
                                    </p>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600">
                                        Localização:
                                    </span>
                                    <span class="font-medium text-right">
                                        {data.oferta.hotel?.cidade?.name} - {data.oferta.hotel?.cidade?.estado?.code}
                                    </span>
                                </div>
                                <div class="space-y-1">
                                    <div class="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar size={14} />
                                        <span>
                                            Embarque: {formatarData(data.oferta.start_date)}
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar size={14} />
                                        <span>
                                            Retorno: {formatarData(data.oferta.end_date)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="border-t border-gray-200 pt-4">
                                <div class="mb-2 flex justify-between text-sm">
                                    <span>Valor Original:</span>
                                    <span>{formatarPreco(valorTotal)}</span>
                                </div>

                                {#if metodoPagamento === 'pix'}
                                    <div class="mb-2 flex justify-between text-sm text-green-600">
                                        <span>Desconto PIX:</span>
                                        <span>-{formatarPreco(descontoPix)}</span>
                                    </div>
                                {/if}

                                <div class="mt-4 flex items-center justify-between border-t pt-4 text-lg font-bold">
                                    <span>Total:</span>
                                    <span class="text-blue-600">
                                        {metodoPagamento === 'pix'
                                            ? formatarPreco(valorComDescontoPix)
                                            : formatarPreco(valorTotal)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            {/if}
        </div>
    </div>
    <Modal modalData={modal} onClose={() => (modal.show = false)} />
</GuestLayout>
