<script lang="ts">
    import AdminLayout from '$lib/layouts/AdminLayout.svelte';
    import { 
        User as UserIcon, 
        Mail, 
        Fingerprint, 
        Calendar, 
        Shield, 
        ShoppingBag, 
        ChevronLeft,
        CheckCircle2,
        XCircle,
        Lock,
        Unlock,
        History,
        CreditCard,
        Phone as PhoneIcon,
        Save
    } from 'lucide-svelte';
    import { apiFetch } from '$lib/api';
    import { formatarData, formatarPreco, formatarCPF, formatarTelefone, limparNaoNumericos } from '$lib/utils';
    import { goto } from '$app/navigation';
    import Modal, { type ModalData } from '$lib/components/Modal.svelte';

    let { data } = $props();
    let processing = $state(false);
    let activeTab = $state<'historico' | 'perfil' | 'acesso'>('historico');

    let modal = $state<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    let perfilData = $state({
        firstName: data.usuario?.firstName || '',
        lastName: data.usuario?.lastName || '',
        email: data.usuario?.email || '',
        cpf: data.usuario?.cpf || '',
        phone: data.usuario?.phone || ''
    });

    let acessoData = $state({
        roleId: data.usuario?.roleId || ''
    });

    async function handleAprovar() {
        if (confirm('Deseja aprovar este usuário manualmente?')) {
            processing = true;
            try {
                await apiFetch(`/admin/usuario/${data.usuario.id}/aprovar`, { method: 'POST' });
                location.reload();
            } catch (error: any) {
                alert(error.message || 'Erro ao aprovar usuário.');
            } finally {
                processing = false;
            }
        }
    }

    async function handleToggleBlock() {
        processing = true;
        try {
            await apiFetch(`/admin/usuario/${data.usuario.id}/toggle-block`, { method: 'POST' });
            location.reload();
        } catch (error: any) {
            alert(error.message || 'Erro ao alterar status do usuário.');
        } finally {
            processing = false;
        }
    }

    async function handleUpdatePerfil(e: Event) {
        e.preventDefault();
        processing = true;
        try {
            const payload = {
                ...perfilData,
                cpf: limparNaoNumericos(perfilData.cpf),
                phone: limparNaoNumericos(perfilData.phone)
            };
            await apiFetch(`/admin/usuario/${data.usuario.id}/perfil`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            modal = { show: true, mensagem: 'Perfil atualizado com sucesso!', url: null };
        } catch (error: any) {
            modal = { show: true, mensagem: 'Erro ao atualizar perfil: ' + error.message, url: null };
        } finally {
            processing = false;
        }
    }

    async function handleUpdateAccess(e: Event) {
        e.preventDefault();
        processing = true;
        try {
            await apiFetch(`/admin/usuario/${data.usuario.id}/access`, {
                method: 'PUT',
                body: JSON.stringify(acessoData)
            });
            modal = { show: true, mensagem: 'Acesso atualizado com sucesso!', url: null };
        } catch (error: any) {
            modal = { show: true, mensagem: 'Erro ao atualizar acesso: ' + error.message, url: null };
        } finally {
            processing = false;
        }
    }

    const cardClasses = "bg-white rounded-3xl border border-gray-100 p-8 shadow-sm";
</script>

<AdminLayout title={`Detalhes: ${data.usuario?.firstName}`}>
    <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-4">
            <a
                href="/admin/usuario"
                class="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
            >
                <ChevronLeft size={20} />
            </a>
            <div>
                <h1 class="text-3xl font-black text-gray-900 leading-tight">Inspecionar Usuário</h1>
                <p class="text-gray-500 font-medium">Gestão de perfil e histórico de atividades.</p>
            </div>
        </div>

        <div class="flex items-center gap-3">
            <span class={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${data.usuario?.role?.isStaff ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                {data.usuario?.role?.name || 'Cliente'}
            </span>
            {#if !data.usuario?.isValid}
                <span class="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-red-600 text-white border border-red-600 shadow-lg shadow-red-100">
                    Bloqueado
                </span>
            {/if}
        </div>
    </div>

    {#if data.usuario}
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Sidebar -->
            <div class="lg:col-span-3 space-y-6">
                <div class={cardClasses}>
                    <div class="flex flex-col items-center text-center mb-8">
                        <div class="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-100 mb-6">
                            {data.usuario.firstName.charAt(0)}
                        </div>
                        <h2 class="text-2xl font-black text-gray-900">{data.usuario.firstName} {data.usuario.lastName}</h2>
                        <p class="text-sm text-gray-400 font-bold mt-1 tracking-tight">{data.usuario.email}</p>
                    </div>

                    <div class="space-y-3">
                        <button
                            onclick={() => activeTab = 'historico'}
                            class={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'historico' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'}`}
                        >
                            <History size={20} />
                            <span class="text-sm">Histórico</span>
                        </button>
                        <button
                            onclick={() => activeTab = 'perfil'}
                            class={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'perfil' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'}`}
                        >
                            <UserIcon size={20} />
                            <span class="text-sm">Perfil</span>
                        </button>
                        <button
                            onclick={() => activeTab = 'acesso'}
                            class={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'acesso' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'}`}
                        >
                            <Shield size={20} />
                            <span class="text-sm">Acessos</span>
                        </button>
                    </div>

                    <div class="mt-10 pt-8 border-t border-gray-100 space-y-3">
                        {#if !data.usuario.emailVerifiedAt}
                            <button
                                onclick={handleAprovar}
                                disabled={processing}
                                class="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50"
                            >
                                <CheckCircle2 size={18} />
                                Validar Email Manualmente
                            </button>
                        {/if}

                        <button
                            onclick={handleToggleBlock}
                            disabled={processing}
                            class={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-2xl transition-all disabled:opacity-50 ${data.usuario.isValid ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-100'}`}
                        >
                            {#if data.usuario.isValid}
                                <Lock size={18} />
                                Bloquear Usuário
                            {:else}
                                <Unlock size={18} />
                                Desbloquear Usuário
                            {/if}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="lg:col-span-9">
                {#if activeTab === 'historico'}
                    <div class={cardClasses}>
                        <div class="flex items-center justify-between mb-8">
                            <div class="flex items-center gap-3">
                                <ShoppingBag class="text-blue-600" />
                                <h3 class="text-xl font-black text-gray-900">Histórico de Compras</h3>
                            </div>
                            <span class="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-500">
                                {data.usuario.purchases?.length || 0} viagens
                            </span>
                        </div>

                        <div class="space-y-4">
                            {#if data.usuario.purchases && data.usuario.purchases.length > 0}
                                {#each data.usuario.purchases as compra}
                                    <div class="flex items-center justify-between p-6 rounded-2xl border border-gray-50 bg-gray-50/50 hover:border-blue-100 hover:bg-white hover:shadow-md transition-all group">
                                        <div class="flex items-center gap-4">
                                            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 border border-gray-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <ShoppingBag size={20} />
                                            </div>
                                            <div>
                                                <p class="font-bold text-gray-900">{compra.offer?.package?.name}</p>
                                                <p class="text-xs text-gray-500 font-medium">{formatarData(compra.purchaseDate)}</p>
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            <p class="font-black text-gray-900">{formatarPreco(compra.finalValue)}</p>
                                            <span class={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${compra.status === 'Accepted' || compra.status === 'ACEITO' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {compra.status}
                                            </span>
                                        </div>
                                    </div>
                                {/each}
                            {:else}
                                <div class="py-20 text-center flex flex-col items-center gap-4">
                                    <ShoppingBag class="text-gray-100" size={60} strokeWidth={1} />
                                    <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Este usuário ainda não realizou compras.</p>
                                </div>
                            {/if}
                        </div>
                    </div>
                {:else if activeTab === 'perfil'}
                    <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div class="bg-gray-50/50 px-10 py-8 border-b border-gray-100">
                            <h3 class="text-2xl font-black text-gray-900 tracking-tight">Dados Pessoais</h3>
                            <p class="text-gray-500 font-medium text-sm">Atualize as informações de identificação do usuário.</p>
                        </div>
                        <form onsubmit={handleUpdatePerfil} class="p-10 space-y-8">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nome</label>
                                    <input
                                        type="text"
                                        bind:value={perfilData.firstName}
                                        class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                    />
                                </div>
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Sobrenome</label>
                                    <input
                                        type="text"
                                        bind:value={perfilData.lastName}
                                        class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                    />
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                                        <Mail size={14} />
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        bind:value={perfilData.email}
                                        class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                    />
                                </div>
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                                        <CreditCard size={14} />
                                        CPF
                                    </label>
                                    <input
                                        type="text"
                                        value={perfilData.cpf}
                                        oninput={(e) => perfilData.cpf = formatarCPF(e.currentTarget.value)}
                                        class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                    />
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                                    <PhoneIcon size={14} />
                                    Telefone
                                </label>
                                <input
                                    type="text"
                                    value={perfilData.phone}
                                    oninput={(e) => perfilData.phone = formatarTelefone(e.currentTarget.value)}
                                    class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                />
                            </div>
                            <div class="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    class="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    {processing ? 'Salvando...' : 'Salvar Alterações'}
                                </button>
                            </div>
                        </form>
                    </div>
                {:else if activeTab === 'acesso'}
                    <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div class="bg-gray-50/50 px-10 py-8 border-b border-gray-100">
                            <h3 class="text-2xl font-black text-gray-900 tracking-tight">Controle de Acesso</h3>
                            <p class="text-gray-500 font-medium text-sm">Gerencie o cargo e as permissões individuais.</p>
                        </div>
                        <form onsubmit={handleUpdateAccess} class="p-10 space-y-12">
                            <div>
                                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 block mb-6">Cargo Atribuído</label>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {#each data.roles as role}
                                        <label
                                            class={`p-6 border-2 rounded-3xl cursor-pointer transition-all ${acessoData.roleId === role.id ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-100' : 'border-gray-50 hover:border-blue-100 hover:bg-gray-50/50'}`}
                                        >
                                            <div class="flex items-center justify-between mb-2">
                                                <span class="font-black text-lg text-gray-900">{role.name}</span>
                                                <input
                                                    type="radio"
                                                    name="roleId"
                                                    value={role.id}
                                                    bind:group={acessoData.roleId}
                                                    class="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-600"
                                                />
                                            </div>
                                            <p class="text-xs text-gray-500 font-bold leading-relaxed">{role.description}</p>
                                        </label>
                                    {/each}
                                </div>
                            </div>

                            <div class="p-6 bg-amber-50/50 border border-amber-100 rounded-[2rem] flex gap-4">
                                <Shield size={24} class="text-amber-500 shrink-0" />
                                <p class="text-xs font-bold text-amber-900 leading-relaxed">
                                    Atenção: Alterações de acesso entram em vigor imediatamente. Membros do Staff não podem ser promovidos a Administrador via interface por motivos de segurança crítica.
                                </p>
                            </div>

                            <div class="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    class="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    {processing ? 'Sincronizando...' : 'Atualizar Acessos'}
                                </button>
                            </div>
                        </form>
                    </div>
                {/if}
            </div>
        </div>
    {:else}
        <div class="py-20 text-center">
            <XCircle size={48} class="mx-auto text-red-200 mb-4" />
            <p class="text-gray-500 font-bold">Usuário não encontrado ou erro ao carregar dados.</p>
        </div>
    {/if}

    <Modal modalData={modal} onClose={() => modal.show = false} />
</AdminLayout>
