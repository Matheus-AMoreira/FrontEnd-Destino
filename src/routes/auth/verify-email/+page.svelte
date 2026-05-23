<script lang="ts">
    import GuestLayout from '$lib/layouts/GuestLayout.svelte';
    import { apiFetch } from '$lib/api';
    import { auth } from '$lib/auth';
    import { goto } from '$app/navigation';

    let processing = $state(false);
    let status = $state('');

    async function submit(e: Event) {
        e.preventDefault();
        processing = true;
        try {
            await apiFetch('/auth/verification-notification', { method: 'POST' });
            status = 'verification-link-sent';
        } catch (error: any) {
            alert(error.message || 'Erro ao enviar notificação.');
        } finally {
            processing = false;
        }
    }

    async function handleLogout() {
        try {
            await apiFetch('/auth/logout', { method: 'POST' });
            auth.logout();
            goto('/auth/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    }
</script>

<GuestLayout title="Verificação de E-mail">
    <div class="flex flex-1 items-center justify-center p-4 min-h-[60vh]">
        <div class="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl shadow-blue-100 border border-gray-100">
            <div class="mb-6 text-sm text-gray-600 leading-relaxed font-medium">
                Obrigado por se cadastrar! Antes de começar, você poderia verificar seu endereço de e-mail clicando no link que acabamos de enviar para você? Se você não recebeu o e-mail, teremos o prazer de lhe enviar outro.
            </div>

            {#if status === 'verification-link-sent'}
                <div class="mb-6 text-sm font-bold text-green-600 bg-green-50 p-4 rounded-2xl border border-green-100">
                    Um novo link de verificação foi enviado para o endereço de e-mail fornecido durante o registro.
                </div>
            {/if}

            <form onsubmit={submit}>
                <div class="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="submit"
                        class="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white uppercase tracking-widest shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                        disabled={processing}
                    >
                        {processing ? 'Enviando...' : 'Reenviar E-mail'}
                    </button>

                    <button
                        type="button"
                        onclick={handleLogout}
                        class="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
                    >
                        Sair
                    </button>
                </div>
            </form>
        </div>
    </div>
</GuestLayout>
