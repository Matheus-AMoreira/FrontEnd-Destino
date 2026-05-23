<script lang="ts">
    import AdminLayout from '$lib/layouts/AdminLayout.svelte';
    import { Camera, Plus, Image as ImageIcon, Pencil, Trash2 } from 'lucide-svelte';
    import { apiFetch } from '$lib/api';

    let { data } = $props();
    let success = $state('');

    async function handleDelete(id: number) {
        if (confirm('Deseja realmente excluir este álbum?')) {
            try {
                await apiFetch(`/admin/pacotedefotos/${id}`, { method: 'DELETE' });
                success = 'Álbum excluído com sucesso!';
                data.fotos = data.fotos.filter((f: any) => f.id !== id);
            } catch (error: any) {
                alert(error.message || 'Erro ao excluir álbum.');
            }
        }
    }
</script>

<AdminLayout title="Gerenciar Pacotes de Fotos">
    <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <div class="bg-purple-600 p-2 rounded-lg text-white">
                <Camera size={24} />
            </div>
            <h1 class="text-2xl font-bold text-gray-900">Pacotes de Fotos</h1>
        </div>
        
        <a
            href="/admin/pacotedefoto/registrar"
            class="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-purple-700"
        >
            <Plus size={20} />
            <span>Novo Álbum</span>
        </a>
    </div>

    {#if success}
        <div class="mb-6 rounded-lg bg-green-100 p-4 text-green-700">
            {success}
        </div>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each data.fotos as album}
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                <div class="aspect-video bg-gray-100 relative overflow-hidden">
                    {#if album.items?.[0]}
                        <img src={album.items[0].url} alt={album.nome} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {:else}
                        <div class="w-full h-full flex items-center justify-center text-gray-300">
                            <ImageIcon size={48} strokeWidth={1} />
                        </div>
                    {/if}
                    <div class="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                        {album.items?.length || 0} Fotos
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-lg font-black text-gray-900 mb-1 truncate">{album.nome}</h3>
                    <p class="text-xs text-gray-500 font-medium line-clamp-2 mb-4">{album.descricao || 'Sem descrição.'}</p>
                    
                    <div class="flex items-center justify-between border-t border-gray-100 pt-3">
                        <a
                            href="/admin/pacotedefoto/editar/{album.id}"
                            class="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            <Pencil size={14} />
                            <span>Editar</span>
                        </a>
                        <button
                            onclick={() => handleDelete(album.id)}
                            class="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                        >
                            <Trash2 size={14} />
                            <span>Excluir</span>
                        </button>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</AdminLayout>
