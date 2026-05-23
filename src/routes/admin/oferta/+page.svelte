<script lang="ts">
    import AdminLayout from '$lib/layouts/AdminLayout.svelte';
    import { Tag, Plus, Calendar, Hotel, Truck, Package, Pencil, Trash2 } from 'lucide-svelte';
    import { formatarPreco, formatarData } from '$lib/utils';
    import { apiFetch } from '$lib/api';

    let { data } = $props();
    let success = $state('');

    async function handleDelete(id: number) {
        if (confirm('Deseja realmente excluir esta oferta?')) {
            try {
                await apiFetch(`/admin/ofertas/${id}`, { method: 'DELETE' });
                success = 'Oferta excluída com sucesso!';
                data.ofertas = data.ofertas.filter((o: any) => o.id !== id);
            } catch (error: any) {
                alert(error.message || 'Erro ao excluir oferta.');
            }
        }
    }
</script>

<AdminLayout title="Gerenciar Ofertas">
    <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <div class="bg-emerald-600 p-2 rounded-lg text-white">
                <Tag size={24} />
            </div>
            <h1 class="text-2xl font-bold text-gray-900">Gerenciar Ofertas</h1>
        </div>
        
        <a
            href="/admin/oferta/registrar"
            class="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
            <Plus size={20} />
            <span>Nova Oferta</span>
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
                    <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Pacote / Período</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Preço / Vagas</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Detalhes</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                    <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Ações</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
                {#if data.ofertas.length > 0}
                    {#each data.ofertas as oferta}
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2 font-semibold text-gray-900">
                                    <Package size={16} class="text-orange-500" />
                                    {oferta.package?.name}
                                </div>
                                <div class="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                    <Calendar size={14} />
                                    {formatarData(oferta.start_date)} - {formatarData(oferta.end_date)}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-lg font-bold text-gray-900">
                                    {formatarPreco(oferta.price)}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {oferta.availability} vagas restantes
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2 text-sm text-gray-600">
                                    <Hotel size={14} class="text-blue-500" />
                                    <span class="truncate max-w-[150px]">{oferta.hotel?.name || '-'}</span>
                                </div>
                                <div class="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                    <Truck size={14} class="text-blue-500" />
                                    <span class="truncate max-w-[150px]">{oferta.transporte?.company || '-'}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                {#if oferta.status === 'EMANDAMENTO'}
                                    <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold uppercase">Ativa</span>
                                {:else}
                                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold uppercase">{oferta.status}</span>
                                {/if}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 text-right text-sm">
                                <div class="flex justify-end gap-2">
                                    <a
                                        href="/admin/oferta/editar/{oferta.id}"
                                        class="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        <Pencil size={18} />
                                    </a>
                                    <button
                                        onclick={() => handleDelete(oferta.id)}
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
                            Nenhuma oferta cadastrada.
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</AdminLayout>
