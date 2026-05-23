<script lang="ts">
    import AdminLayout from '$lib/layouts/AdminLayout.svelte';
    import { Tag, Save, X, Calendar, DollarSign, Users, Hotel, Truck, Package } from 'lucide-svelte';
    import { apiFetch } from '$lib/api';
    import { goto } from '$app/navigation';

    let { data } = $props();

    let inicio = $state(data.oferta?.inicio?.split('T')[0] || '');
    let fim = $state(data.oferta?.fim?.split('T')[0] || '');
    let preco = $state<number | string>(data.oferta?.preco || '');
    let disponibilidade = $state<number | string>(data.oferta?.disponibilidade || '');
    let status = $state(data.oferta?.status || 'DISPONIVEL');
    let pacote_id = $state<number | string>(data.oferta?.pacote_id || '');
    let hotel_id = $state<number | string>(data.oferta?.hotel_id || '');
    let transporte_id = $state<number | string>(data.oferta?.transporte_id || '');
    
    let processing = $state(false);
    let errors = $state<Record<string, string>>({});

    async function handleSubmit(e: Event) {
        e.preventDefault();
        processing = true;
        errors = {};

        try {
            await apiFetch(`/admin/ofertas/${data.oferta.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    inicio,
                    fim,
                    preco: Number(preco),
                    disponibilidade: Number(disponibilidade),
                    status,
                    pacote_id: Number(pacote_id),
                    hotel_id: Number(hotel_id),
                    transporte_id: Number(transporte_id)
                })
            });
            goto('/admin/oferta');
        } catch (err: any) {
            if (err.errors) {
                errors = err.errors;
            } else {
                alert(err.message || 'Erro ao atualizar oferta.');
            }
        } finally {
            processing = false;
        }
    }

    const inputClasses = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none";
    const labelClasses = "flex items-center gap-2 text-sm font-semibold text-gray-700";
</script>

<AdminLayout title="Editar Oferta">
    <div class="mx-auto max-w-3xl">
        <div class="mb-8 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <a
                    href="/admin/oferta"
                    class="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                    <X size={20} />
                </a>
                <h1 class="text-2xl font-bold text-gray-900">Editar Oferta</h1>
            </div>
        </div>

        {#if data.oferta}
            <form onsubmit={handleSubmit} class="space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label class={labelClasses}>
                            <Calendar size={16} class="text-blue-500" />
                            Data de Início
                        </label>
                        <input
                            type="date"
                            bind:value={inicio}
                            class={inputClasses}
                            required
                        />
                        {#if errors.inicio}<p class="mt-1 text-xs text-red-500">{errors.inicio}</p>{/if}
                    </div>

                    <div>
                        <label class={labelClasses}>
                            <Calendar size={16} class="text-blue-500" />
                            Data de Fim
                        </label>
                        <input
                            type="date"
                            bind:value={fim}
                            class={inputClasses}
                            required
                        />
                        {#if errors.fim}<p class="mt-1 text-xs text-red-500">{errors.fim}</p>{/if}
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                        <label class={labelClasses}>
                            <DollarSign size={16} class="text-blue-500" />
                            Preço
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            bind:value={preco}
                            class={inputClasses}
                            placeholder="0.00"
                            required
                        />
                        {#if errors.preco}<p class="mt-1 text-xs text-red-500">{errors.preco}</p>{/if}
                    </div>

                    <div>
                        <label class={labelClasses}>
                            <Users size={16} class="text-blue-500" />
                            Vagas
                        </label>
                        <input
                            type="number"
                            bind:value={disponibilidade}
                            class={inputClasses}
                            placeholder="0"
                            required
                        />
                        {#if errors.disponibilidade}<p class="mt-1 text-xs text-red-500">{errors.disponibilidade}</p>{/if}
                    </div>

                    <div>
                        <label class={labelClasses}>
                            <Tag size={16} class="text-blue-500" />
                            Status
                        </label>
                        <select
                            bind:value={status}
                            class={inputClasses}
                            required
                        >
                            <option value="DISPONIVEL">Disponível</option>
                            <option value="ESGOTADO">Esgotado</option>
                            <option value="INDISPONIVEL">Indisponível</option>
                        </select>
                    </div>
                </div>

                <div class="space-y-6 pt-6 border-t border-gray-100">
                    <div>
                        <label class={labelClasses}>
                            <Package size={16} class="text-blue-500" />
                            Pacote Base
                        </label>
                        <select
                            bind:value={pacote_id}
                            class={inputClasses}
                            required
                        >
                            <option value="">Selecione um pacote...</option>
                            {#each data.pacotes as p}
                                <option value={p.id}>{p.nome}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label class={labelClasses}>
                                <Hotel size={16} class="text-blue-500" />
                                Hotel
                            </label>
                            <select
                                bind:value={hotel_id}
                                class={inputClasses}
                                required
                            >
                                <option value="">Selecione um hotel...</option>
                                {#each data.hoteis as h}
                                    <option value={h.id}>{h.nome} ({h.cidade?.nome})</option>
                                {/each}
                            </select>
                        </div>

                        <div>
                            <label class={labelClasses}>
                                <Truck size={16} class="text-blue-500" />
                                Transporte
                            </label>
                            <select
                                bind:value={transporte_id}
                                class={inputClasses}
                                required
                            >
                                <option value="">Selecione um transporte...</option>
                                {#each data.transportes as t}
                                    <option value={t.id}>{t.empresa} ({t.meio})</option>
                                {/each}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                    <a
                        href="/admin/oferta"
                        class="rounded-lg px-6 py-2 font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </a>
                    <button
                        type="submit"
                        disabled={processing}
                        class="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-2 font-bold text-white shadow-lg transition-all hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save size={20} />
                        <span>{processing ? 'Salvando...' : 'Salvar Alterações'}</span>
                    </button>
                </div>
            </form>
        {:else}
            <div class="p-12 text-center text-gray-500">
                Oferta não encontrada.
            </div>
        {/if}
    </div>
</AdminLayout>
