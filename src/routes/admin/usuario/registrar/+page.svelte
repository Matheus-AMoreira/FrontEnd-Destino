<script lang="ts">
    import AdminLayout from '$lib/layouts/AdminLayout.svelte';
    import { 
        ArrowLeft,
        ShieldCheck,
        UserPlus,
        Mail,
        CreditCard,
        User as UserIcon,
        Phone,
        Plus
    } from 'lucide-svelte';
    import { apiFetch } from '$lib/api';
    import { goto } from '$app/navigation';
    import Modal, { type ModalData } from '$lib/components/Modal.svelte';
    import { formatarCPF, formatarTelefone, limparNaoNumericos } from '$lib/utils';

    let { data } = $props();

    let modal = $state<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    let processing = $state(false);
    let zodErrors = $state<Record<string, string>>({});

    let formData = $state({
        firstName: '',
        lastName: '',
        email: '',
        cpf: '',
        phone: '',
        roleId: data.roles[0]?.id || '',
    });

    async function handleSubmit(e: Event) {
        e.preventDefault();
        processing = true;
        zodErrors = {};

        try {
            const payload = {
                ...formData,
                cpf: limparNaoNumericos(formData.cpf),
                phone: limparNaoNumericos(formData.phone)
            };

            await apiFetch('/admin/usuario/registrar', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            modal = {
                show: true,
                mensagem: 'Funcionário cadastrado com sucesso! O convite foi enviado ao e-mail informado.',
                url: '/admin/usuario'
            };
        } catch (error: any) {
            modal = {
                show: true,
                mensagem: 'Erro ao cadastrar funcionário: ' + error.message,
                url: null
            };
        } finally {
            processing = false;
        }
    }

    function handleCPFInput(e: Event) {
        const input = e.target as HTMLInputElement;
        formData.cpf = formatarCPF(input.value);
    }

    function handlePhoneInput(e: Event) {
        const input = e.target as HTMLInputElement;
        formData.phone = formatarTelefone(input.value);
    }
</script>

<AdminLayout title="Novo Funcionário">
    <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <a 
                href="/admin/usuario"
                class="p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft size={24} />
            </a>
            <div class="bg-blue-600 p-2 rounded-lg text-white">
                <UserPlus size={24} />
            </div>
            <h1 class="text-2xl font-bold text-gray-900">Novo Funcionário</h1>
        </div>
    </div>

    <div class="max-w-4xl">
        <form onsubmit={handleSubmit} class="space-y-6">
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                        <UserIcon size={18} className="text-blue-600" />
                        Informações Pessoais
                    </h3>
                </div>
                
                <div class="p-6 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1">
                            <label class="text-xs font-semibold text-gray-600 uppercase ml-1">Nome</label>
                            <input
                                type="text"
                                bind:value={formData.firstName}
                                required
                                class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                                placeholder="Nome do colaborador"
                            />
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-semibold text-gray-600 uppercase ml-1">Sobrenome</label>
                            <input
                                type="text"
                                bind:value={formData.lastName}
                                required
                                class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                                placeholder="Sobrenome"
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1">
                            <label class="text-xs font-semibold text-gray-600 uppercase ml-1">E-mail</label>
                            <div class="relative">
                                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="email"
                                    bind:value={formData.email}
                                    required
                                    class="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                                    placeholder="email@destino.com"
                                />
                            </div>
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-semibold text-gray-600 uppercase ml-1">CPF</label>
                            <div class="relative">
                                <CreditCard class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    value={formData.cpf}
                                    oninput={handleCPFInput}
                                    required
                                    class="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                                    placeholder="000.000.000-00"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label class="text-xs font-semibold text-gray-600 uppercase ml-1">Telefone (Opcional)</label>
                        <div class="relative">
                            <Phone class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                value={formData.phone}
                                oninput={handlePhoneInput}
                                class="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck size={18} className="text-blue-600" />
                        Cargo e Função
                    </h3>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {#each data.roles as role}
                            <label
                                class={`flex flex-col p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                    formData.roleId === role.id 
                                        ? 'border-blue-600 bg-blue-50' 
                                        : 'border-gray-100 hover:border-blue-200'
                                }`}
                            >
                                <div class="flex items-center justify-between mb-2">
                                    <span class={`font-bold text-sm ${formData.roleId === role.id ? 'text-blue-700' : 'text-gray-700'}`}>
                                        {role.name}
                                    </span>
                                    <input
                                        type="radio"
                                        name="roleId"
                                        value={role.id}
                                        bind:group={formData.roleId}
                                        class="text-blue-600 focus:ring-blue-500"
                                    />
                                </div>
                                <p class="text-xs text-gray-500 leading-relaxed">
                                    {role.description}
                                </p>
                            </label>
                        {/each}
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-end gap-4">
                <a
                    href="/admin/usuario"
                    class="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    Cancelar
                </a>
                <button
                    type="submit"
                    disabled={processing}
                    class="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-2.5 font-bold text-white shadow-md transition-all hover:bg-blue-700 disabled:opacity-50"
                >
                    <Plus size={20} />
                    {processing ? 'Enviando...' : 'Cadastrar e Enviar Convite'}
                </button>
            </div>
        </form>
    </div>

    <Modal modalData={modal} onClose={() => {
        if (modal.url) goto(modal.url);
        modal.show = false;
    }} />
</AdminLayout>
