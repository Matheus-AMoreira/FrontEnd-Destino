<script lang="ts">
    import AdminLayout from '$lib/layouts/AdminLayout.svelte';
    import { 
        Search, 
        UserCheck, 
        Lock, 
        Unlock, 
        History,
        UserPlus,
        Mail,
        Trash2
    } from 'lucide-svelte';
    import { apiFetch } from '$lib/api';
    import { formatarData } from '$lib/utils';
    import { goto } from '$app/navigation';

    let { data } = $props();
    let searchTerm = $state(data.filters.termo || '');

    $effect(() => {
        searchTerm = data.filters.termo || '';
    });

    function handleSearch(e: Event) {
        e.preventDefault();
        goto(`/admin/usuario?termo=${searchTerm}`);
    }

    async function handleAprovar(id: string) {
        if (confirm('Deseja aprovar este usuário manualmente?')) {
            try {
                await apiFetch(`/admin/usuario/${id}/aprovar`, { method: 'POST' });
                location.reload();
            } catch (error: any) {
                alert(error.message || 'Erro ao aprovar usuário.');
            }
        }
    }

    async function handleResendInvitation(id: string) {
        try {
            await apiFetch(`/admin/usuario/${id}/resend-invitation`, { method: 'POST' });
            alert('Convite reenviado com sucesso!');
        } catch (error: any) {
            alert(error.message || 'Erro ao reenviar convite.');
        }
    }

    async function handleDelete(id: string) {
        if (confirm('Deseja realmente excluir este usuário? Esta ação não pode ser desfeita.')) {
            try {
                await apiFetch(`/admin/usuario/${id}`, { method: 'DELETE' });
                location.reload();
            } catch (error: any) {
                alert(error.message || 'Erro ao excluir usuário.');
            }
        }
    }

    async function handleToggleBlock(id: string) {
        try {
            await apiFetch(`/admin/usuario/${id}/toggle-block`, { method: 'POST' });
            location.reload();
        } catch (error: any) {
            alert(error.message || 'Erro ao alterar status do usuário.');
        }
    }

    function getRoleBadgeColor(role: string) {
        switch (role) {
            case 'ADMINISTRADOR': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'FUNCIONARIO': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    }
</script>

<AdminLayout title="Gerenciamento de Usuários">
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 class="text-3xl font-bold text-gray-900">Usuários</h1>
            <p class="text-gray-500 mt-1">Gerencie permissões, valide contas e monitore atividades.</p>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <form onsubmit={handleSearch} class="relative w-full sm:w-72">
                <input
                    type="text"
                    placeholder="Buscar..."
                    class="w-full pl-11 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                    bind:value={searchTerm}
                />
                <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </form>

            <a
                href="/admin/usuario/registrar"
                class="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
            >
                <UserPlus size={18} />
                <span>Novo Funcionário</span>
            </a>
        </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead class="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th class="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Usuário</th>
                        <th class="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Contato / CPF</th>
                        <th class="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Nível</th>
                        <th class="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                        <th class="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    {#if data.usuarios.data.length > 0}
                        {#each data.usuarios.data as usuario}
                            <tr class="hover:bg-gray-50/50 transition-colors group">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                                            {usuario.first_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p class="font-bold text-gray-900 leading-tight">{usuario.first_name} {usuario.last_name}</p>
                                            <p class="text-xs text-gray-500 mt-0.5">Desde {formatarData(usuario.created_at)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <p class="text-sm font-medium text-gray-900">{usuario.email}</p>
                                    <p class="text-xs text-gray-500">{usuario.cpf}</p>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border {getRoleBadgeColor(usuario.role)}">
                                        {usuario.role}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <div class="flex flex-col items-center gap-1">
                                        {#if !usuario.email_verified_at}
                                            <span class="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 rounded-lg">Aguardando Verif.</span>
                                        {:else}
                                            <span class="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 rounded-lg">Verificado</span>
                                        {/if}
                                        {#if !usuario.is_valid}
                                            <span class="text-[10px] font-bold text-red-500 bg-red-50 px-2 rounded-lg">Bloqueado</span>
                                        {/if}
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            href="/admin/usuario/{usuario.id}"
                                            class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Inspecionar e Editar"
                                        >
                                            <History size={18} />
                                        </a>
                                        
                                        {#if !usuario.email_verified_at}
                                            <button
                                                onclick={() => handleResendInvitation(usuario.id)}
                                                class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Reenviar Convite"
                                            >
                                                <Mail size={18} />
                                            </button>
                                            <button
                                                onclick={() => handleAprovar(usuario.id)}
                                                class="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                title="Validar Manualmente"
                                            >
                                                <UserCheck size={18} />
                                            </button>
                                        {/if}

                                        <button
                                            onclick={() => handleToggleBlock(usuario.id)}
                                            class={`p-2 rounded-lg transition-colors ${usuario.is_valid ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' : 'text-red-600 bg-red-50 hover:bg-red-100'}`}
                                            title={usuario.is_valid ? "Bloquear" : "Desbloquear"}
                                        >
                                            {#if usuario.is_valid}
                                                <Lock size={18} />
                                            {:else}
                                                <Unlock size={18} />
                                            {/if}
                                        </button>

                                        <button
                                            onclick={() => handleDelete(usuario.id)}
                                            class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Excluir Usuário"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    {:else}
                        <tr>
                            <td colspan="5" class="px-6 py-20 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <Search class="text-gray-200" size={48} strokeWidth={1} />
                                    <p class="text-gray-400 font-medium">Nenhum usuário encontrado.</p>
                                </div>
                            </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
</AdminLayout>
