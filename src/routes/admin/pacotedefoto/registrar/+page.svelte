<script lang="ts">
    import AdminLayout from '$lib/layouts/AdminLayout.svelte';
    import { Image as ImageIcon, Save, X, Type, FileText, Database } from 'lucide-svelte';
    import { apiFetch } from '$lib/api';
    import { goto } from '$app/navigation';

    let nome = $state('');
    let descricao = $state('');
    let storage_type = $state('LOCAL');
    let processing = $state(false);
    let errors = $state<Record<string, string>>({});

    async function handleSubmit(e: Event) {
        e.preventDefault();
        processing = true;
        errors = {};

        try {
            await apiFetch('/admin/pacotedefotos', {
                method: 'POST',
                body: JSON.stringify({
                    nome,
                    descricao,
                    storage_type
                })
            });
            goto('/admin/pacotedefoto');
        } catch (err: any) {
            if (err.errors) {
                errors = err.errors;
            } else {
                alert(err.message || 'Erro ao salvar álbum.');
            }
        } finally {
            processing = false;
        }
    }

    const inputClasses = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none";
    const labelClasses = "flex items-center gap-2 text-sm font-semibold text-gray-700";
</script>

<AdminLayout title="Novo Álbum de Fotos">
    <div class="mx-auto max-w-2xl">
        <div class="mb-8 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <a
                    href="/admin/pacotedefoto"
                    class="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                    <X size={20} />
                </a>
                <h1 class="text-2xl font-bold text-gray-900">Novo Álbum</h1>
            </div>
        </div>

        <form onsubmit={handleSubmit} class="space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
            <div>
                <label class={labelClasses}>
                    <Type size={16} class="text-purple-500" />
                    Nome do Álbum
                </label>
                <input
                    type="text"
                    bind:value={nome}
                    class={inputClasses}
                    placeholder="Ex: Fotos de Paris 2024"
                    required
                />
                {#if errors.nome}<p class="mt-1 text-xs text-red-500">{errors.nome}</p>{/if}
            </div>

            <div>
                <label class={labelClasses}>
                    <FileText size={16} class="text-purple-500" />
                    Descrição
                </label>
                <textarea
                    bind:value={descricao}
                    class="{inputClasses} resize-none"
                    rows={3}
                    placeholder="Breve descrição do álbum..."
                ></textarea>
            </div>

            <div>
                <label class={labelClasses}>
                    <Database size={16} class="text-purple-500" />
                    Tipo de Armazenamento
                </label>
                <select
                    bind:value={storage_type}
                    class={inputClasses}
                    required
                >
                    <option value="LOCAL">Local (Servidor)</option>
                    <option value="S3">Amazon S3</option>
                    <option value="CLOUDINARY">Cloudinary</option>
                </select>
            </div>

            <div class="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <a
                    href="/admin/pacotedefoto"
                    class="rounded-lg px-6 py-2 font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    Cancelar
                </a>
                <button
                    type="submit"
                    disabled={processing}
                    class="flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-2 font-bold text-white shadow-lg transition-all hover:bg-purple-700 disabled:opacity-50"
                >
                    <Save size={20} />
                    <span>{processing ? 'Salvando...' : 'Salvar Álbum'}</span>
                </button>
            </div>
        </form>
    </div>
</AdminLayout>
