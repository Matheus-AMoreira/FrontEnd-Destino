<script lang="ts">
    import { goto } from '$app/navigation';

    export interface ModalData {
        show: boolean;
        mensagem: string;
        url: string | null;
    }

    interface Props {
        modalData: ModalData;
        onClose: () => void;
    }

    let { modalData, onClose }: Props = $props();

    function handleClose() {
        onClose();

        if (modalData.url) {
            goto(modalData.url);
        }
    }
</script>

{#if modalData.show}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onclick={handleClose}
    >
        <div 
            class="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl"
            onclick={(e) => e.stopPropagation()}
        >
            <div class="mb-4 text-center">
                <p class="text-lg font-medium whitespace-pre-line text-gray-800">
                    {modalData.mensagem}
                </p>
            </div>
            <button
                onclick={handleClose}
                class="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700"
            >
                OK
            </button>
        </div>
    </div>
{/if}
