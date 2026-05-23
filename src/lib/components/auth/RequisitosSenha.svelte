<script lang="ts">
    interface Props {
        senha: string;
    }

    let { senha }: Props = $props();

    const requisitos = $derived([
        { label: 'Mínimo de 8 caracteres', valido: senha.length >= 8 },
        { label: 'Uma letra maiúscula', valido: /[A-Z]/.test(senha) },
        { label: 'Uma letra minúscula', valido: /[a-z]/.test(senha) },
        { label: 'Um número', valido: /\d/.test(senha) },
        {
            label: 'Um caractere especial',
            valido: /[@$!%*?&#\-_]/.test(senha),
        },
    ]);
</script>

{#if senha.length > 0}
    <div class="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-left">
        <p class="mb-2 text-xs font-semibold text-gray-500">
            Requisitos da senha:
        </p>
        <ul class="space-y-1 text-xs">
            {#each requisitos as req}
                <li
                    class="flex items-center gap-2 {req.valido ? 'font-medium text-green-600' : 'text-gray-400'}"
                >
                    <span
                        class="flex h-4 w-4 items-center justify-center rounded-full text-[10px] {req.valido ? 'bg-green-100' : 'bg-gray-200'}"
                    >
                        {req.valido ? '✓' : '•'}
                    </span>
                    {req.label}
                </li>
            {/each}
        </ul>
    </div>
{/if}
