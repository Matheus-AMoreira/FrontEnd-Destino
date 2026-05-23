<script lang="ts">
    import AuthLogo from "$lib/components/auth/AuthLogo.svelte";
    import CampoInput from "$lib/components/auth/CampoInput.svelte";
    import Modal, { type ModalData } from "$lib/components/Modal.svelte";
    import { login } from "$lib/auth";
    import { apiFetch } from "$lib/api";

    let email = $state("");
    let password = $state("");
    let processing = $state(false);

    let modal = $state<ModalData>({
        show: false,
        mensagem: "",
        url: null,
    });

    async function handleSubmit(e: Event) {
        e.preventDefault();
        processing = true;
        try {
            await login({ email, password });
        } catch (err: any) {
            modal = {
                show: true,
                mensagem: err.message || "Erro ao realizar login.",
                url: null,
            };
        } finally {
            processing = false;
        }
    }
</script>

<svelte:head>
    <title>Conecte-se - PAULA VIAGENS</title>
</svelte:head>

<div
    class="flex h-screen w-screen items-center justify-center bg-linear-to-br from-[#e4f3ff] via-[#ffffff] to-[#e4f3ff] bg-cover bg-fixed bg-center"
>
    <div
        class="flex w-full max-w-5xl flex-col items-center justify-center gap-8 p-4 md:flex-row"
    >
        <div
            class="z-10 w-full max-w-md rounded-xl bg-white/95 p-10 text-center shadow-[0_10px_25px_rgba(0,0,0,0.4)] backdrop-blur-sm"
        >
            <h1 class="mb-8 text-3xl font-bold text-[#333]">Conecte-se</h1>

            <form onsubmit={handleSubmit} class="mb-5 text-left">
                <label for="email" class="mb-2 block font-bold text-[#555]"
                    >E-mail</label
                >
                <input
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 text-base transition duration-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)] focus:outline-none"
                    id="email"
                    type="email"
                    autoComplete="username"
                    bind:value={email}
                    required
                    maxLength={100}
                />

                <label
                    for="password"
                    class="mb-2 block font-bold text-[#555]">Senha</label
                >
                <input
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 text-base transition duration-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)] focus:outline-none"
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    bind:value={password}
                    required
                />
                
                <div class="mt-1 mb-4 flex justify-end">
                    <a
                        href="/auth/forgot-password"
                        class="text-xs font-bold text-[#007bff] hover:underline"
                    >
                        Esqueceu sua senha?
                    </a>
                </div>

                <button
                    class="w-full rounded-lg bg-[#2071b3] py-3 text-lg font-bold text-white transition duration-300 hover:bg-[#1a5b8e] active:scale-[0.98] {processing
                        ? 'cursor-not-allowed opacity-70'
                        : 'cursor-pointer'}"
                    type="submit"
                    disabled={processing}
                >
                    {processing ? "Entrando..." : "Entrar"}
                </button>
            </form>

            <p class="mt-6 text-sm text-[#666]">
                Não possui uma conta?
                <a
                    href="/auth/register"
                    class="ml-1 font-bold text-[#007bff] no-underline hover:underline"
                >
                    Cadastre-se
                </a>
            </p>

            <p class="mt-6 text-sm text-[#666]">
                Voltar para a
                <a
                    href="/"
                    class="ml-1 font-bold text-[#007bff] no-underline hover:underline"
                >
                    Tela Inicial
                </a>
            </p>
        </div>

        <AuthLogo />
    </div>

    <Modal modalData={modal} onClose={() => (modal.show = false)} />
</div>
