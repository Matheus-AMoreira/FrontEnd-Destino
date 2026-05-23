<script lang="ts">
    import AdminLayout from '$lib/layouts/AdminLayout.svelte';
    import { Plane, Save, X, Building2, Truck, DollarSign } from 'lucide-svelte';
    import { apiFetch } from '$lib/api';
    import { goto } from '$app/navigation';

    let empresa = $state('');
    let meio = $state('');
    let preco = $state<number | string>('');
    let processing = $state(false);
    let errors = $state<Record<string, string>>({});

    async function handleSubmit(e: Event) {
        e.preventDefault();
        processing = true;
        errors = {};

        try {
            await apiFetch('/admin/transportes', {
                method: 'POST',
                body: JSON.stringify({
                    empresa,
                    meio,
                    preco: Number(preco)
                })
            });
            goto('/admin/transporte');
        } catch (err: any) {
            if (err.errors) {
                errors = err.errors;
            } else {
                alert(err.message || 'Erro ao salvar transporte.');
            }
        } finally {
            processing = false;
        }
    }

    const inputClasses = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none";
    const labelClasses = "flex items-center gap-2 text-sm font-semibold text-gray-700";
</script>

<AdminLayout title="Novo Transporte">
    <div class="mx-auto max-w-2xl">
        <div class="mb-8 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <a
                    href="/admin/transporte"
                    class="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                    <X size={20} />
                </a>
                <h1 class="text-2xl font-bold text-gray-900">Novo Transporte</h1>
            </div>
        </div>

        <form onsubmit={handleSubmit} class="space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
            <div>
                <label class={labelClasses}>
                    <Building2 size={16} class="text-blue-500" />
                    Empresa
                </label>
                <input
                    type="text"
                    bind:value={empresa}
                    class={inputClasses}
                    placeholder="Ex: Latam Airlines, Gontijo..."
                    required
                />
                {#if errors.empresa}<p class="mt-1 text-xs text-red-500">{errors.empresa}</p>{/if}
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <label class={labelClasses}>
                        <Truck size={16} class="text-blue-500" />
                        Meio de Transporte
                    </label>
                    <select
                        bind:value={meio}
                        class={inputClasses}
                        required
                    >
                        <option value="">Selecione...</option>
                        <option value="AVIAO">Avião</option>
                        <option value="ONIBUS">Ônibus</option>
                        <option value="NAVIO">Navio</option>
                    </select>
                    {#if errors.meio}<p class="mt-1 text-xs text-red-500">{errors.meio}</p>{/if}
                </div>

                <div>
                    <label class={labelClasses}>
                        <DollarSign size={16} class="text-blue-500" />
                        Preço Base
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
            </div>

            <div class="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <a
                    href="/admin/transporte"
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
                    <span>{processing ? 'Salvando...' : 'Salvar Transporte'}</span>
                </button>
            </div>
        </form>
    </div>
</AdminLayout>
