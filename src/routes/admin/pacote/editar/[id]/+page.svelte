<script lang="ts">
    import AdminLayout from '$lib/layouts/AdminLayout.svelte';
    import { Package, Save, X, Type, FileText, User, Image as ImageIcon } from 'lucide-svelte';
    import { apiFetch } from '$lib/api';
    import { goto } from '$app/navigation';

    let { data } = $props();

    let nome = $state(data.pacote?.nome || '');
    let descricao = $state(data.pacote?.descricao || '');
    let tags = $state(data.pacote?.tag_ids ? (Array.isArray(data.pacote.tag_ids) ? data.pacote.tag_ids.join(', ') : data.pacote.tag_ids) : '');
    let funcionario_id = $state(data.pacote?.funcionario_id || '');
    let pacote_foto_id = $state(data.pacote?.pacote_foto_id || '');
    let processing = $state(false);
    let errors = $state<Record<string, string>>({});

    async function handleSubmit(e: Event) {
        e.preventDefault();
        processing = true;
        errors = {};

        try {
            await apiFetch(`/admin/pacotes/${data.pacote.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    nome,
                    descricao,
                    tag_ids: tags.split(',').map(t => t.trim()).filter(t => t),
                    funcionario_id: Number(funcionario_id),
                    pacote_foto_id: pacote_foto_id ? Number(pacote_foto_id) : null
                })
            });
            goto('/admin/pacote');
        } catch (err: any) {
            if (err.errors) {
                errors = err.errors;
            } else {
                alert(err.message || 'Erro ao atualizar pacote.');
            }
        } finally {
            processing = false;
        }
    }

    const inputClasses = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none";
    const labelClasses = "flex items-center gap-2 text-sm font-semibold text-gray-700";
</script>

<AdminLayout title="Editar Pacote">
    <div class="mx-auto max-w-2xl">
        <div class="mb-8 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <a
                    href="/admin/pacote"
                    class="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                    <X size={20} />
                </a>
                <h1 class="text-2xl font-bold text-gray-900">Editar Pacote</h1>
            </div>
        </div>

        {#if data.pacote}
            <form onsubmit={handleSubmit} class="space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                <div>
                    <label class={labelClasses}>
                        <Type size={16} class="text-orange-500" />
                        Nome do Pacote
                    </label>
                    <input
                        type="text"
                        bind:value={nome}
                        class={inputClasses}
                        placeholder="Ex: Primavera em Paris"
                        required
                    />
                    {#if errors.nome}<p class="mt-1 text-xs text-red-500">{errors.nome}</p>{/if}
                </div>

                <div>
                    <label class={labelClasses}>
                        <FileText size={16} class="text-orange-500" />
                        Descrição
                    </label>
                    <textarea
                        bind:value={descricao}
                        class="{inputClasses} resize-none"
                        rows={4}
                        placeholder="Descreva o que este pacote oferece..."
                        required
                    ></textarea>
                    {#if errors.descricao}<p class="mt-1 text-xs text-red-500">{errors.descricao}</p>{/if}
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label class={labelClasses}>
                            <User size={16} class="text-orange-500" />
                            Responsável
                        </label>
                        <select
                            bind:value={funcionario_id}
                            class={inputClasses}
                            required
                        >
                            <option value="">Selecione...</option>
                            {#each data.funcionarios as f}
                                <option value={f.id}>{f.nome}</option>
                            {/each}
                        </select>
                    </div>

                    <div>
                        <label class={labelClasses}>
                            <ImageIcon size={16} class="text-orange-500" />
                            Álbum de Fotos
                        </label>
                        <select
                            bind:value={pacote_foto_id}
                            class={inputClasses}
                        >
                            <option value="">Nenhum</option>
                            {#each data.pacoteFotos as pf}
                                <option value={pf.id}>{pf.nome}</option>
                            {/each}
                        </select>
                    </div>
                </div>

                <div class="pt-6 border-t border-gray-100">
                    <div>
                        <label class={labelClasses}>
                            <Package size={16} class="text-orange-500" />
                            Tags do Pacote (separadas por vírgula)
                        </label>
                        <input
                            type="text"
                            bind:value={tags}
                            class={inputClasses}
                            placeholder="Ex: aventura, praia, luxo"
                        />
                        <p class="mt-1 text-[10px] text-gray-400 italic">Cada vírgula cria uma nova tag automagicamente.</p>
                    </div>
                </div>

                <div class="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                    <a
                        href="/admin/pacote"
                        class="rounded-lg px-6 py-2 font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </a>
                    <button
                        type="submit"
                        disabled={processing}
                        class="flex items-center gap-2 rounded-lg bg-orange-600 px-8 py-2 font-bold text-white shadow-lg transition-all hover:bg-orange-700 disabled:opacity-50"
                    >
                        <Save size={20} />
                        <span>{processing ? 'Salvando...' : 'Salvar Alterações'}</span>
                    </button>
                </div>
            </form>
        {:else}
            <div class="p-12 text-center text-gray-500">
                Pacote não encontrado.
            </div>
        {/if}
    </div>
</AdminLayout>
