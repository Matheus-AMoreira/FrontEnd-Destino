<script lang="ts">
    import AdminLayout from '$lib/layouts/AdminLayout.svelte';
    import { Hotel, Save, X, Type, DollarSign, MapPin, Navigation } from 'lucide-svelte';
    import { apiFetch } from '$lib/api';
    import { goto } from '$app/navigation';

    let { data } = $props();

    let nome = $state('');
    let diaria = $state<number | string>('');
    let cidade_id = $state<number | string>('');
    let endereco = $state('');
    let processing = $state(false);
    let errors = $state<Record<string, string>>({});

    async function handleSubmit(e: Event) {
        e.preventDefault();
        processing = true;
        errors = {};

        try {
            await apiFetch('/admin/hoteis', {
                method: 'POST',
                body: JSON.stringify({
                    nome,
                    diaria: Number(diaria),
                    cidade_id: Number(cidade_id),
                    endereco
                })
            });
            goto('/admin/hotel');
        } catch (err: any) {
            if (err.errors) {
                errors = err.errors;
            } else {
                alert(err.message || 'Erro ao salvar hotel.');
            }
        } finally {
            processing = false;
        }
    }

    const inputClasses = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none";
    const labelClasses = "flex items-center gap-2 text-sm font-semibold text-gray-700";
</script>

<AdminLayout title="Novo Hotel">
    <div class="mx-auto max-w-2xl">
        <div class="mb-8 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <a
                    href="/admin/hotel"
                    class="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                    <X size={20} />
                </a>
                <h1 class="text-2xl font-bold text-gray-900">Novo Hotel</h1>
            </div>
        </div>

        <form onsubmit={handleSubmit} class="space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
            <div>
                <label class={labelClasses}>
                    <Type size={16} class="text-blue-500" />
                    Nome do Hotel
                </label>
                <input
                    type="text"
                    bind:value={nome}
                    class={inputClasses}
                    placeholder="Ex: Hotel Grand Palace"
                    required
                />
                {#if errors.nome}<p class="mt-1 text-xs text-red-500">{errors.nome}</p>{/if}
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <label class={labelClasses}>
                        <DollarSign size={16} class="text-blue-500" />
                        Valor da Diária
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        bind:value={diaria}
                        class={inputClasses}
                        placeholder="0.00"
                        required
                    />
                    {#if errors.diaria}<p class="mt-1 text-xs text-red-500">{errors.diaria}</p>{/if}
                </div>

                <div>
                    <label class={labelClasses}>
                        <MapPin size={16} class="text-blue-500" />
                        Cidade
                    </label>
                    <select
                        bind:value={cidade_id}
                        class={inputClasses}
                        required
                    >
                        <option value="">Selecione...</option>
                        {#each data.cidades as c}
                            <option value={c.id}>{c.nome} / {c.estado?.sigla}</option>
                        {/each}
                    </select>
                    {#if errors.cidade_id}<p class="mt-1 text-xs text-red-500">{errors.cidade_id}</p>{/if}
                </div>
            </div>

            <div>
                <label class={labelClasses}>
                    <Navigation size={16} class="text-blue-500" />
                    Endereço Completo
                </label>
                <input
                    type="text"
                    bind:value={endereco}
                    class={inputClasses}
                    placeholder="Rua, Número, Bairro..."
                    required
                />
                {#if errors.endereco}<p class="mt-1 text-xs text-red-500">{errors.endereco}</p>{/if}
            </div>

            <div class="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <a
                    href="/admin/hotel"
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
                    <span>{processing ? 'Salvando...' : 'Salvar Hotel'}</span>
                </button>
            </div>
        </form>
    </div>
</AdminLayout>
