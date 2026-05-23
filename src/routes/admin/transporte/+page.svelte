<script lang="ts">
    import AdminLayout from '$lib/layouts/AdminLayout.svelte';
    import { Truck, Plus, Plane, Bus, Ship, Pencil, Trash2 } from 'lucide-svelte';
    import { formatarPreco } from '$lib/utils';
    import { apiFetch } from '$lib/api';

    let { data } = $props();
    let success = $state('');

    function getIcon(tipo: string) {
        switch (tipo?.toUpperCase()) {
            case 'AEREO': return Plane;
            case 'RODOVIARIO': return Bus;
            case 'MARITIMO': return Ship;
            default: return Truck;
        }
    }

    async function handleDelete(id: number) {
        if (confirm('Deseja realmente excluir este transporte?')) {
            try {
                await apiFetch(`/admin/transportes/${id}`, { method: 'DELETE' });
                success = 'Transporte excluído com sucesso!';
                data.transportes = data.transportes.filter((t: any) => t.id !== id);
            } catch (error: any) {
                alert(error.message || 'Erro ao excluir transporte.');
            }
        }
    }
</script>

<AdminLayout title="Gerenciar Transportes">
    <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <div class="bg-blue-600 p-2 rounded-lg text-white">
                <Truck size={24} />
            </div>
            <h1 class="text-2xl font-bold text-gray-900">Gerenciar Transportes</h1>
        </div>
        
        <a
            href="/admin/transporte/registrar"
            class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
            <Plus size={20} />
            <span>Novo Transporte</span>
        </a>
    </div>

    {#if success}
        <div class="mb-6 rounded-lg bg-green-100 p-4 text-green-700">
            {success}
        </div>
    {/if}

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Empresa</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Meio</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Preço Base</th>
                    <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Ações</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
                {#if data.transportes.length > 0}
                    {#each data.transportes as transporte}
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">#{transporte.id}</td>
                            <td class="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                                {transporte.empresa}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                <div class="flex items-center gap-2">
                                    <div class="p-1 rounded bg-gray-100 text-gray-600">
                                        <svelte:component this={getIcon(transporte.meio)} size={16} />
                                    </div>
                                    <span class="capitalize">{transporte.meio.toLowerCase()}</span>
                                </div>
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                {formatarPreco(transporte.preco)}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 text-right text-sm">
                                <div class="flex justify-end gap-2">
                                    <a
                                        href="/admin/transporte/editar/{transporte.id}"
                                        class="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        <Pencil size={18} />
                                    </a>
                                    <button
                                        onclick={() => handleDelete(transporte.id)}
                                        class="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                {:else}
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center text-sm text-gray-500">
                            Nenhum transporte cadastrado.
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</AdminLayout>
