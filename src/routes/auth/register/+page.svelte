<script lang="ts">
    import { z } from 'zod';
    import AuthLogo from '$lib/components/auth/AuthLogo.svelte';
    import CampoInput from '$lib/components/auth/CampoInput.svelte';
    import RequisitosSenha from '$lib/components/auth/RequisitosSenha.svelte';
    import Modal, { type ModalData } from '$lib/components/Modal.svelte';
    import { register } from '$lib/auth';

    let nome = $state('');
    let sobre_nome = $state('');
    let cpf = $state('');
    let telefone = $state('');
    let email = $state('');
    let password = $state('');
    let password_confirmation = $state('');
    let processing = $state(false);

    let modal = $state<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    let zodErrors = $state<Record<string, string>>({});

    const formatarCPF = (val: string) =>
        val
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
            .substring(0, 14);

    const formatarTelefone = (val: string) =>
        val
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
            .substring(0, 15);

    const schemaCadastro = z
        .object({
            nome: z
                .string()
                .min(3, 'Mínimo 3 caracteres')
                .regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]*$/, 'Apenas letras'),
            sobre_nome: z
                .string()
                .min(3, 'Mínimo 3 caracteres')
                .regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]*$/, 'Apenas letras'),
            cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
            telefone: z
                .string()
                .min(10, 'Telefone inválido')
                .max(11, 'Telefone inválido'),
            email: z.string().email('E-mail inválido'),
            password: z
                .string()
                .min(8, 'Mínimo 8 caracteres')
                .regex(/[A-Z]/, 'Uma letra maiúscula é obrigatória')
                .regex(/[a-z]/, 'Uma letra minúscula é obrigatória')
                .regex(/\d/, 'Um número é obrigatório')
                .regex(
                    /[@$!%*?&#\-_]/,
                    'Um caractere especial (@$!%*?&#-_) é obrigatório',
                ),
            password_confirmation: z.string(),
        })
        .refine((data) => data.password === data.password_confirmation, {
            message: 'As senhas não coincidem',
            path: ['password_confirmation'],
        });

    function handleCPFInput(e: Event) {
        const val = (e.target as HTMLInputElement).value;
        cpf = val.replace(/\D/g, '').substring(0, 11);
    }

    function handleTelefoneInput(e: Event) {
        const val = (e.target as HTMLInputElement).value;
        telefone = val.replace(/\D/g, '').substring(0, 11);
    }

    async function handleSubmit(e: Event) {
        e.preventDefault();
        
        const formData = {
            nome,
            sobre_nome,
            cpf,
            telefone,
            email,
            password,
            password_confirmation
        };

        const result = schemaCadastro.safeParse(formData);

        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                if (issue.path[0]) {
                    errs[issue.path[0].toString()] = issue.message;
                }
            });
            zodErrors = errs;
            return;
        }

        zodErrors = {};
        processing = true;
        try {
            await register(formData);
            modal = {
                show: true,
                mensagem: 'Cadastro realizado com sucesso!',
                url: '/auth/login',
            };
        } catch (err: any) {
            modal = {
                show: true,
                mensagem: err.message || 'Erro ao realizar cadastro.',
                url: null,
            };
        } finally {
            processing = false;
        }
    }
</script>

<svelte:head>
    <title>Cadastre-se - PAULA VIAGENS</title>
</svelte:head>

<div class="flex min-h-screen w-full items-center justify-center overflow-y-auto bg-linear-to-br from-[#fff6ea] via-[#ffffff] to-[#fff6ea] py-8">
    <div class="flex w-full max-w-4xl flex-col items-center justify-center gap-6 px-4 md:flex-row">
        <div class="z-10 w-full max-w-md rounded-xl border border-gray-100 bg-white/95 p-6 text-center shadow-2xl backdrop-blur-sm">
            <h1 class="mb-6 text-2xl font-bold text-[#333]">
                Cadastre-se
            </h1>

            <form onsubmit={handleSubmit}>
                <div class="grid grid-cols-2 gap-x-3 gap-y-1 text-left">
                    <div class="mb-4">
                        <label
                            for="nome"
                            class="mb-1 block text-sm font-bold text-[#555]"
                        >
                            Nome
                        </label>
                        <input
                            id="nome"
                            type="text"
                            autoComplete="given-name"
                            class="w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none {zodErrors.nome
                                ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)] bg-red-50'
                                : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'}"
                            bind:value={nome}
                            required
                        />
                        {#if zodErrors.nome}
                            <p class="mt-1 text-[10px] text-red-500">
                                {zodErrors.nome}
                            </p>
                        {/if}
                    </div>

                    <div class="mb-4">
                        <label
                            for="sobre_nome"
                            class="mb-1 block text-sm font-bold text-[#555]"
                        >
                            Sobrenome
                        </label>
                        <input
                            id="sobre_nome"
                            type="text"
                            autoComplete="family-name"
                            class="w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none {zodErrors.sobre_nome
                                ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)] bg-red-50'
                                : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'}"
                            bind:value={sobre_nome}
                            required
                        />
                        {#if zodErrors.sobre_nome}
                            <p class="mt-1 text-[10px] text-red-500">
                                {zodErrors.sobre_nome}
                            </p>
                        {/if}
                    </div>

                    <div class="mb-4">
                        <label
                            for="cpf"
                            class="mb-1 block text-sm font-bold text-[#555]"
                        >
                            CPF
                        </label>
                        <input
                            id="cpf"
                            type="text"
                            class="w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none {zodErrors.cpf
                                ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)] bg-red-50'
                                : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'}"
                            value={formatarCPF(cpf)}
                            oninput={handleCPFInput}
                            maxLength={14}
                            required
                        />
                        {#if zodErrors.cpf}
                            <p class="mt-1 text-[10px] text-red-500">
                                {zodErrors.cpf}
                            </p>
                        {/if}
                    </div>

                    <div class="mb-4">
                        <label
                            for="telefone"
                            class="mb-1 block text-sm font-bold text-[#555]"
                        >
                            Telefone
                        </label>
                        <input
                            id="telefone"
                            type="tel"
                            autoComplete="tel"
                            class="w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none {zodErrors.telefone
                                ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)] bg-red-50'
                                : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'}"
                            value={formatarTelefone(telefone)}
                            oninput={handleTelefoneInput}
                            maxLength={15}
                            required
                        />
                        {#if zodErrors.telefone}
                            <p class="mt-1 text-[10px] text-red-500">
                                {zodErrors.telefone}
                            </p>
                        {/if}
                    </div>

                    <div class="col-span-2 mb-4">
                        <label
                            for="email"
                            class="mb-1 block text-sm font-bold text-[#555]"
                        >
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            class="w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none {zodErrors.email
                                ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)] bg-red-50'
                                : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'}"
                            bind:value={email}
                            required
                        />
                        {#if zodErrors.email}
                            <p class="mt-1 text-[10px] text-red-500">
                                {zodErrors.email}
                            </p>
                        {/if}
                    </div>

                    <div class="col-span-2 mb-4">
                        <label
                            for="password"
                            class="mb-1 block text-sm font-bold text-[#555]"
                        >
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            class="w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none {zodErrors.password
                                ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)] bg-red-50'
                                : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'}"
                            bind:value={password}
                            required
                        />
                        {#if zodErrors.password}
                            <p class="mt-1 text-[10px] text-red-500">
                                {zodErrors.password}
                            </p>
                        {/if}
                    </div>

                    <div class="col-span-2 mb-4">
                        <label
                            for="password_confirmation"
                            class="mb-1 block text-sm font-bold text-[#555]"
                        >
                            Confirmar Senha
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            autoComplete="new-password"
                            class="w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none {zodErrors.password_confirmation
                                ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)] bg-red-50'
                                : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'}"
                            bind:value={password_confirmation}
                            required
                        />
                        {#if zodErrors.password_confirmation}
                            <p class="mt-1 text-[10px] text-red-500">
                                {zodErrors.password_confirmation}
                            </p>
                        {/if}
                    </div>
                </div>

                <RequisitosSenha senha={password} />

                <button
                    type="submit"
                    disabled={processing}
                    class="mt-4 w-full rounded-md py-3 text-sm font-bold shadow-md transition-all duration-300 {processing ? 'cursor-not-allowed bg-gray-300' : 'cursor-pointer bg-[#ff7300] text-white hover:bg-[#cc5c00]'}"
                >
                    {processing ? 'Processando...' : 'CADASTRAR'}
                </button>
            </form>

            <p class="mt-6 text-sm text-[#666]">
                Já possui uma conta?
                <a
                    href="/auth/login"
                    class="ml-1 font-semibold text-[#007bff] hover:underline"
                >
                    Faça o Login
                </a>
            </p>
            <p class="mt-6 text-sm text-[#666]">
                Voltar para a
                <a
                    href="/"
                    class="ml-1 font-bold text-[#007bff] hover:underline"
                >
                    Tela Inicial
                </a>
            </p>
        </div>
        <AuthLogo />
    </div>
    <Modal modalData={modal} onClose={() => (modal.show = false)} />
</div>
