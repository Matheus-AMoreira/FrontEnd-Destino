<script lang="ts">
    import AdminLayout from '$lib/layouts/AdminLayout.svelte';
    import { Hotel, Plus, Pencil, Trash2, MapPin } from 'lucide-svelte';
    import { formatarPreco } from '$lib/utils';
    import { apiFetch } from '$lib/api';

    let { data } = $props();
    let success = $state('');

    async function handleDelete(id: number) {
        if (confirm('Deseja realmente excluir este hotel?')) {
            try {
                await apiFetch(`/admin/hoteis/${id}`, { method: 'DELETE' });
                success = 'Hotel excluído com sucesso!';
                data.hoteis = data.hoteis.filter((h: any) => h.id !== id);
            } catch (error: any) {
                alert(error.message || 'Erro ao excluir hotel.');
            }
        }
    }
</script>

<AdminLayout title="Gerenciar Hotéis">
    <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <div class="bg-blue-600 p-2 rounded-lg text-white">
                <Hotel size={24} />
            </div>
            <h1 class="text-2xl font-bold text-gray-900">Gerenciar Hotéis</h1>
        </div>
        
        <a
            href="/admin/hotel/registrar"
            class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
            <Plus size={20} />
            <span>Novo Hotel</span>
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
                    <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nome</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Localização</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Diária</th>
                    <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Ações</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
                {#if data.hoteis.length > 0}
                    {#each data.hoteis as hotel}
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">#{hotel.id}</td>
                            <td class="whitespace-nowrap px-6 py-4">
                                <div class="text-sm font-semibold text-gray-900">{hotel.nome}</div>
                                <div class="text-xs text-gray-500">{hotel.endereco || ''}</div>
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                {#if hotel.cidade}
                                    <div class="flex items-center gap-1">
                                        <MapPin size={14} class="text-gray-400" />
                                        <span>{hotel.cidade.nome} / {hotel.cidade.estado?.sigla || ''}</span>
                                    </div>
                                {:else}
                                    -
                                {/if}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                {formatarPreco(hotel.diaria)}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 text-right text-sm">
                                <div class="flex justify-end gap-2">
                                    <a
                                        href="/admin/hotel/editar/{hotel.id}"
                                        class="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        <Pencil size={18} />
                                    </a>
                                    <button
                                        onclick={() => handleDelete(hotel.id)}
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
                            Nenhum hotel cadastrado.
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</AdminLayout>
