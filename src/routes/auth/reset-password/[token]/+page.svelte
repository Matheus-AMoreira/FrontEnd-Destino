<script lang="ts">
    import { page } from "$app/state";
    import AuthLogo from "$lib/components/auth/AuthLogo.svelte";
    import Modal, { type ModalData } from "$lib/components/Modal.svelte";
    import { apiFetch } from "$lib/api";

    const token = page.params.token || "";
    const emailParam = page.url.searchParams.get("email") || "";

    let email = $state(emailParam);
    let password = $state("");
    let password_confirmation = $state("");
    let processing = $state(false);
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
            await apiFetch("/password/reset", {
                method: "POST",
                body: JSON.stringify({
                    token,
                    email,
                    password,
                    password_confirmation,
                }),
            });
            modal = {
                show: true,
                mensagem: "Sua senha foi redefinida com sucesso!",
                url: "/auth/login",
            };
        } catch (err: any) {
            errors = err.errors || {};
            modal = {
                show: true,
                mensagem: err.message || "Erro ao redefinir senha.",
                url: null,
            };
        } finally {
            processing = false;
        }
    }
</script>

<svelte:head>
    <title>Redefinir Senha - PAULA VIAGENS</title>
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
            <h1 class="mb-8 text-3xl font-bold text-[#333]">
                Nova Senha
            </h1>

            <form onsubmit={handleSubmit} class="text-left">
                <div class="mb-5">
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
                        <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    {/if}
                </div>

                <div class="mb-5">
                    <label
                        for="password"
                        class="mb-2 block font-bold text-[#555]"
                    >
                        Senha
                    </label>
                    <input
                        class="w-full rounded-lg border px-4 py-3 text-base transition duration-300 focus:outline-none {errors.password
                            ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)]'
                            : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'}"
                        id="password"
                        type="password"
                        name="password"
                        bind:value={password}
                        autoComplete="new-password"
                        required
                    />
                    {#if errors.password}
                        <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                    {/if}
                </div>

                <div class="mb-5">
                    <label
                        for="password_confirmation"
                        class="mb-2 block font-bold text-[#555]"
                    >
                        Confirmar Senha
                    </label>
                    <input
                        class="w-full rounded-lg border px-4 py-3 text-base transition duration-300 focus:outline-none {errors.password_confirmation
                            ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)]'
                            : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'}"
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        bind:value={password_confirmation}
                        autoComplete="new-password"
                        required
                    />
                    {#if errors.password_confirmation}
                        <p className="mt-1 text-xs text-red-500">
                            {errors.password_confirmation}
                        </p>
                    {/if}
                </div>

                <button
                    class="mt-6 w-full rounded-lg bg-[#2071b3] py-3 text-lg font-bold text-white transition duration-300 hover:bg-[#1a5b8e] active:scale-[0.98] {processing
                        ? 'cursor-not-allowed opacity-70'
                        : 'cursor-pointer'}"
                    type="submit"
                    disabled={processing}
                >
                    {processing ? "Redefinindo..." : "Redefinir Senha"}
                </button>
            </form>
        </div>

        <AuthLogo />
    </div>

    <Modal modalData={modal} onClose={() => (modal.show = false)} />
</div>
