<script lang="ts">
    import GuestLayout from '$lib/layouts/GuestLayout.svelte';
    import { 
        User as UserIcon, 
        Mail, 
        CreditCard, 
        Lock, 
        Save, 
        ShieldCheck, 
        AlertCircle 
    } from 'lucide-svelte';
    import { z } from 'zod';
    import RequisitosSenha from '$lib/components/auth/RequisitosSenha.svelte';
    import Modal, { type ModalData } from '$lib/components/Modal.svelte';
    import { apiFetch } from '$lib/api';

    let { data } = $props();

    let activeTab = $state<'info' | 'password'>('info');
    let zodErrors = $state<Record<string, string>>({});
    let processingProfile = $state(false);
    let processingPassword = $state(false);

    let modal = $state<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    let profileData = $state({
        nome: data.user?.nome || '',
        sobre_nome: data.user?.sobre_nome || '',
        email: data.user?.email || '',
        cpf: data.user?.cpf || '',
    });

    let passwordData = $state({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const schemaPerfil = z.object({
        nome: z.string().min(3, 'Mínimo 3 caracteres').regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]*$/, 'Apenas letras'),
        sobre_nome: z.string().min(3, 'Mínimo 3 caracteres').regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]*$/, 'Apenas letras'),
        email: z.string().email('E-mail inválido'),
    });

    const schemaSenha = z.object({
        current_password: z.string().min(1, 'Senha atual é obrigatória'),
        password: z.string()
            .min(8, 'Mínimo 8 caracteres')
            .regex(/[A-Z]/, 'Uma letra maiúscula é obrigatória')
            .regex(/[a-z]/, 'Uma letra minúscula é obrigatória')
            .regex(/\d/, 'Um número é obrigatório')
            .regex(/[@$!%*?&#\-_]/, 'Um caractere especial (@$!%*?&#-_) é obrigatório'),
        password_confirmation: z.string(),
    }).refine(data => data.password === data.password_confirmation, {
        message: 'As senhas não coincidem',
        path: ['password_confirmation']
    });

    async function submitProfile(e: Event) {
        e.preventDefault();
        
        const result = schemaPerfil.safeParse(profileData);
        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach(issue => {
                if (issue.path[0]) errs[issue.path[0].toString()] = issue.message;
            });
            zodErrors = errs;
            return;
        }

        zodErrors = {};
        processingProfile = true;
        try {
            await apiFetch('/usuario/perfil', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });
            modal = {
                show: true,
                mensagem: 'Perfil atualizado com sucesso!',
                url: null,
            };
        } catch (err: any) {
            modal = {
                show: true,
                mensagem: err.message || 'Erro ao atualizar perfil.',
                url: null,
            };
        } finally {
            processingProfile = false;
        }
    }

    async function submitPassword(e: Event) {
        e.preventDefault();

        const result = schemaSenha.safeParse(passwordData);
        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach(issue => {
                if (issue.path[0]) errs[issue.path[0].toString()] = issue.message;
            });
            zodErrors = errs;
            return;
        }

        zodErrors = {};
        processingPassword = true;
        try {
            await apiFetch('/usuario/password', {
                method: 'PUT',
                body: JSON.stringify(passwordData)
            });
            passwordData = {
                current_password: '',
                password: '',
                password_confirmation: '',
            };
            modal = {
                show: true,
                mensagem: 'Senha alterada com sucesso!',
                url: null,
            };
        } catch (err: any) {
            modal = {
                show: true,
                mensagem: err.message || 'Erro ao alterar senha.',
                url: null,
            };
        } finally {
            processingPassword = false;
        }
    }
</script>

<GuestLayout title="Meu Perfil">
    <div class="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
        <div class="mb-10 text-center">
            <h1 class="text-4xl font-black text-gray-900 tracking-tight">Configurações de Perfil</h1>
            <p class="text-gray-500 mt-2 font-medium">Gerencie suas informações pessoais e segurança da conta.</p>
        </div>

        <div class="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
            <!-- Sidebar Tabs -->
            <div class="w-full md:w-72 bg-gray-50 p-8 border-r border-gray-100">
                <div class="space-y-3">
                    <button
                        onclick={() => { activeTab = 'info'; zodErrors = {}; }}
                        class="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all {activeTab === 'info' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-white hover:text-blue-600'}"
                    >
                        <UserIcon size={20} />
                        <span>Informações Pessoais</span>
                    </button>
                    <button
                        onclick={() => { activeTab = 'password'; zodErrors = {}; }}
                        class="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all {activeTab === 'password' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-white hover:text-blue-600'}"
                    >
                        <Lock size={20} />
                        <span>Senha e Segurança</span>
                    </button>
                </div>

                <div class="mt-auto pt-10 px-4">
                    <div class="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
                        <ShieldCheck class="text-blue-600 mb-2" size={24} />
                        <p class="text-[10px] font-black text-blue-400 uppercase tracking-widest">Status da Conta</p>
                        <p class="text-sm font-bold text-blue-900 mt-1">Conta Verificada</p>
                    </div>
                </div>
            </div>

            <!-- Content Area -->
            <div class="flex-1 p-8 lg:p-12">
                {#if activeTab === 'info'}
                    <form onsubmit={submitProfile} class="space-y-8">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nome</label>
                                <div class="relative group">
                                    <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                        <UserIcon size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        bind:value={profileData.nome}
                                        class="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                        placeholder="Seu nome"
                                    />
                                </div>
                                {zodErrors.nome ? `<p class="text-red-500 text-xs font-bold ml-4">${zodErrors.nome}</p>` : ''}
                            </div>

                            <div class="space-y-2">
                                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Sobrenome</label>
                                <div class="relative group">
                                    <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                        <UserIcon size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        bind:value={profileData.sobre_nome}
                                        class="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                        placeholder="Seu sobrenome"
                                    />
                                </div>
                                {zodErrors.sobre_nome ? `<p class="text-red-500 text-xs font-bold ml-4">${zodErrors.sobre_nome}</p>` : ''}
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">E-mail de Contato</label>
                            <div class="relative group">
                                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    bind:value={profileData.email}
                                    class="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                    placeholder="seu@email.com"
                                />
                            </div>
                            {zodErrors.email ? `<p class="text-red-500 text-xs font-bold ml-4">${zodErrors.email}</p>` : ''}
                        </div>

                        <div class="space-y-2">
                            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">CPF (Somente números)</label>
                            <div class="relative group opacity-75">
                                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <CreditCard size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={profileData.cpf}
                                    class="w-full pl-12 pr-6 py-4 bg-gray-100 border-2 border-transparent rounded-2xl font-bold text-gray-500 cursor-not-allowed"
                                    readonly
                                />
                            </div>
                            <p class="text-[10px] text-gray-400 font-bold ml-4">* Para alterar o CPF, entre em contato com o suporte.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={processingProfile}
                            class="w-full md:w-auto px-12 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-95"
                        >
                            {#if processingProfile}
                                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {:else}
                                <Save size={18} />
                                <span>Salvar Alterações</span>
                            {/if}
                        </button>
                    </form>
                {:else}
                    <form onsubmit={submitPassword} class="space-y-8">
                        <div class="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4 mb-8">
                            <AlertCircle class="text-amber-500 flex-shrink-0" size={24} />
                            <div>
                                <p class="text-amber-900 font-bold text-sm">Mudança de Senha</p>
                                <p class="text-amber-700 text-xs mt-1 font-medium leading-relaxed">
                                    Sua nova senha deve seguir os requisitos de segurança da plataforma. Você precisará confirmar sua senha atual para realizar esta alteração.
                                </p>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Senha Atual</label>
                            <div class="relative group">
                                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    bind:value={passwordData.current_password}
                                    class="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                    placeholder="••••••••"
                                />
                            </div>
                            {zodErrors.current_password ? `<p class="text-red-500 text-xs font-bold ml-4">${zodErrors.current_password}</p>` : ''}
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nova Senha</label>
                                <div class="relative group">
                                    <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        bind:value={passwordData.password}
                                        class="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {zodErrors.password ? `<p class="text-red-500 text-xs font-bold ml-4">${zodErrors.password}</p>` : ''}
                                <RequisitosSenha senha={passwordData.password} />
                            </div>

                            <div class="space-y-2">
                                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Confirmar Nova Senha</label>
                                <div class="relative group">
                                    <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        bind:value={passwordData.password_confirmation}
                                        class="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {zodErrors.password_confirmation ? `<p class="text-red-500 text-xs font-bold ml-4">${zodErrors.password_confirmation}</p>` : ''}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processingPassword}
                            class="w-full md:w-auto px-12 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-95"
                        >
                            {#if processingPassword}
                                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {:else}
                                <Lock size={18} />
                                <span>Atualizar Senha</span>
                            {/if}
                        </button>
                    </form>
                {/if}
            </div>
        </div>
    </div>
    <Modal modalData={modal} onClose={() => (modal.show = false)} />
</GuestLayout>
