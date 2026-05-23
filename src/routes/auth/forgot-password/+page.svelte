<script lang="ts">
    import AuthLogo from "$lib/components/auth/AuthLogo.svelte";
    import Modal, { type ModalData } from "$lib/components/Modal.svelte";
    import { apiFetch } from "$lib/api";

    let email = $state("");
    let processing = $state(false);
    let status = $state("");
    let errors = $state<Record<string, string>>({});

    let modal = $state<ModalData>({
        show: false,
        mensagem: "",
        url: null,
    });

    async function handleSubmit(e: Event) {
        e.preventDefault();
        processing = true;
        errors = {};
        
        try {
            await apiFetch("/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email }),
            });
            status = "Um link de recuperação foi enviado para o seu e-mail.";
            modal = {
                show: true,
                mensagem: status,
                url: null,
            };
        } catch (err: any) {
            errors = err.errors || {};
            modal = {
                show: true,
                mensagem: err.message || "Erro ao enviar e-mail de recuperação.",
                url: null,
            };
        } finally {
            processing = false;
        }
    }
</script>

<svelte:head>
    <title>Esqueci minha senha - PAULA VIAGENS</title>
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
            <h1 class="mb-6 text-3xl font-bold text-[#333]">
                Recuperar Senha
            </h1>

            <p class="mb-8 text-sm text-gray-600">
                Esqueceu sua senha? Sem problemas. Basta nos informar seu endereço de e-mail e enviaremos um link de redefinição de senha.
            </p>

            {#if status}
                <div class="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            {/if}

            <form onsubmit={handleSubmit} class="text-left">
                <label
                    for="email"
                    class="mb-2 block font-bold text-[#555]"
                >
                    E-mail
                </label>
                <input
                    class="w-full rounded-lg border px-4 py-3 text-base transition duration-300 focus:outline-none {errors.email
                        ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)]'
                        : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'}"
                    id="email"
                    type="email"
                    name="email"
                    bind:value={email}
                    autoComplete="username"
                    required
                />
                {#if errors.email}
                    <p class="mt-1 text-xs text-red-500">{errors.email}</p>
                {/if}

                <button
                    class="mt-6 w-full rounded-lg bg-[#2071b3] py-3 text-lg font-bold text-white transition duration-300 hover:bg-[#1a5b8e] active:scale-[0.98] {processing
                        ? 'cursor-not-allowed opacity-70'
                        : 'cursor-pointer'}"
                    type="submit"
                    disabled={processing}
                >
                    {processing ? "Enviando..." : "Enviar Link"}
                </button>
            </form>

            <div class="mt-8 flex flex-col gap-4">
                <a
                    href="/auth/login"
                    class="text-sm font-bold text-gray-500 hover:text-gray-700 hover:underline"
                >
                    Voltar para o Login
                </a>
            </div>
        </div>

        <AuthLogo />
    </div>

    <Modal modalData={modal} onClose={() => (modal.show = false)} />
</div>
