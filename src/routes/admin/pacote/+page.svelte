<script lang="ts">
    import AdminLayout from '$lib/layouts/AdminLayout.svelte';
    import { 
        Package, 
        Plus, 
        Pencil, 
        Trash2, 
        User as UserIcon, 
        Image as ImageIcon, 
        ShoppingBag, 
        X,
        Calendar,
        MapPin,
        CreditCard
    } from 'lucide-svelte';
    import { apiFetch } from '$lib/api';
    import { formatarPreco, formatarData } from '$lib/utils';

    let { data } = $props();

    let selectedPacote = $state<any>(null);
    let salesList = $state<any[]>([]);
    let loadingSales = $state(false);
    let success = $state('');

    async function handleDelete(id: number) {
        if (confirm('Deseja realmente excluir este pacote?')) {
            try {
                await apiFetch(`/admin/pacotes/${id}`, { method: 'DELETE' });
                success = 'Pacote excluído com sucesso!';
                data.pacotes = data.pacotes.filter((p: any) => p.id !== id);
            } catch (error: any) {
                alert(error.message || 'Erro ao excluir pacote.');
            }
        }
    }

    async function fetchSales(pacote: any) {
        selectedPacote = pacote;
        loadingSales = true;
        try {
            const data = await apiFetch<any[]>(`/admin/pacotes/${pacote.id}/compras`);
            salesList = data;
        } catch (error) {
            console.error('Erro ao buscar vendas:', error);
        } finally {
            loadingSales = false;
        }
    }
</script>

<AdminLayout title="Gerenciar Pacotes">
    <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <div class="bg-orange-600 p-2 rounded-lg text-white">
                <Package size={24} />
            </div>
            <h1 class="text-2xl font-bold text-gray-900">Gerenciar Pacotes</h1>
        </div>
        
        <a
            href="/admin/pacote/registrar"
            class="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-orange-700"
        >
            <Plus size={20} />
            <span>Novo Pacote</span>
        </a>
    </div>

    {#if success}
        <div class="mb-6 rounded-lg bg-green-100 p-4 text-green-700 font-medium">
            {success}
        </div>
    {/if}

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Pacote</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Responsável</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Álbum</th>
                    <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Ações</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
                {#if data.pacotes.length > 0}
                    {#each data.pacotes as pacote}
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4">
                                <div class="font-semibold text-gray-900">{pacote.name}</div>
                                <div class="text-sm text-gray-500 line-clamp-1">{pacote.description}</div>
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                <div class="flex items-center gap-2">
                                    <UserIcon size={16} class="text-gray-400" />
                                    {pacote.staff?.first_name || 'Não atribuído'}
                                </div>
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                <div class="flex items-center gap-2">
                                    <ImageIcon size={16} class="text-gray-400" />
                                    {pacote.package_photos?.name || 'Sem álbum'}
                                </div>
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 text-right text-sm">
                                <div class="flex justify-end gap-2">
                                    <button
                                        onclick={() => fetchSales(pacote)}
                                        class="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                        title="Ver Vendas"
                                    >
                                        <ShoppingBag size={18} />
                                    </button>
                                    <a
                                        href="/admin/pacote/editar/{pacote.id}"
                                        class="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
                                        title="Editar"
                                    >
                                        <Pencil size={18} />
                                    </a>
                                    <button
                                        onclick={() => handleDelete(pacote.id)}
                                        class="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                                        title="Excluir"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                {:else}
                    <tr>
                        <td colspan="4" class="px-6 py-12 text-center text-sm text-gray-500">
                            Nenhum pacote cadastrado.
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>

    <!-- Modal de Vendas -->
    {#if selectedPacote}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" onclick={() => (selectedPacote = null)}></div>
            <div class="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onclick={(e) => e.stopPropagation()}>
                <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h3 class="text-2xl font-black text-gray-900 leading-tight">Vendas: {selectedPacote.name}</h3>
                        <p class="text-gray-500 text-sm font-medium">Relatório de compras efetuadas para este pacote.</p>
                    </div>
                    <button onclick={() => (selectedPacote = null)} class="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} class="text-gray-400" />
                    </button>
                </div>

                <div class="p-6 overflow-y-auto flex-1 bg-gray-50/50">
                    {#if loadingSales}
                        <div class="py-20 text-center flex flex-col items-center gap-4">
                            <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Carregando dados de venda...</p>
                        </div>
                    {:else if salesList.length > 0}
                        <div class="space-y-4">
                            {#each salesList as compra}
                                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div class="flex flex-col md:flex-row justify-between gap-4">
                                        <div class="flex items-center gap-4">
                                            <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 uppercase">
                                                {compra.user.first_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p class="font-bold text-gray-900">{compra.user.first_name} {compra.user.last_name}</p>
                                                <p class="text-xs text-gray-500 font-medium">{compra.user.email}</p>
                                            </div>
                                        </div>

                                        <div class="flex flex-wrap items-center gap-3">
                                            <div class="bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                                <div class="flex items-center gap-2 text-[10px] uppercase font-black text-gray-400 mb-1">
                                                    <Calendar size={12} />
                                                    <span>Viagem</span>
                                                </div>
                                                <p class="text-xs font-bold text-gray-700">
                                                    {formatarData(compra.offer.start_date)} - {formatarData(compra.offer.end_date)}
                                                </p>
                                            </div>

                                            <div class="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                                                <div class="flex items-center gap-2 text-[10px] uppercase font-black text-blue-400 mb-1">
                                                    <CreditCard size={12} />
                                                    <span>Valor Pago</span>
                                                </div>
                                                <p class="text-sm font-black text-blue-600">
                                                    {formatarPreco(compra.final_value)}
                                                </p>
                                            </div>

                                            <div class="flex flex-col items-end gap-1">
                                                <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase border {compra.status === 'ACEITO' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}">
                                                    {compra.status}
                                                </span>
                                                <p class="text-[10px] text-gray-400 font-bold">Compra em {formatarData(compra.purchase_date)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mt-3 flex items-center gap-2 text-[10px] font-medium text-gray-400">
                                        <MapPin size={10} class="text-gray-300" />
                                        <span>Destino: {compra.offer.hotel.city.name}</span>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <div class="py-20 text-center flex flex-col items-center gap-4">
                            <ShoppingBag class="text-gray-200" size={60} />
                            <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Nenhuma venda registrada para este pacote ainda.</p>
                        </div>
                    {/if}
                </div>

                <div class="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs font-medium text-gray-400 uppercase tracking-widest">
                    <span>Total de Vendas: {salesList.length}</span>
                    <span>Soma Total: {formatarPreco(salesList.reduce((acc, curr) => acc + curr.final_value, 0))}</span>
                </div>
            </div>
        </div>
    {/if}
</AdminLayout>
