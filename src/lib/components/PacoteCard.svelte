<script lang="ts">
    import { LocateFixed, Banknote } from 'lucide-svelte';
    import type { Pacote } from '$lib/types/pacote';

    interface Props {
        pacote: Pacote;
    }

    let { pacote }: Props = $props();

    const formatarValor = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valor);
    };

    const destino = $derived(
        pacote.ofertas?.[0]?.hotel?.cidade?.nome || 'Destino Desconhecido'
    );
    const fotoUrl = $derived(pacote.fotos_do_pacote?.foto_capa || '/assets/images/placeholder.jpg');
</script>

<div class="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl">
    <div class="relative h-48 overflow-hidden">
        <img
            src={fotoUrl}
            alt={pacote.nome}
            class="h-full w-full object-cover transition-transform hover:scale-105"
        />
        {#if pacote.ofertas?.[0]?.status === 'CONCLUIDO'}
            <div class="absolute top-2 right-2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-80">
                Encerrado
            </div>
        {/if}
    </div>
    <div class="flex flex-1 flex-col p-5">
        <h3 class="mb-1 line-clamp-1 text-lg font-bold text-gray-900">
            {pacote.nome}
        </h3>
        <p class="mb-2 flex items-center text-sm text-gray-500">
            <LocateFixed size={16} class="mr-1" />
            {destino}
        </p>
        <p class="mb-4 line-clamp-2 flex-1 text-sm text-gray-600">
            {pacote.descricao}
        </p>
        <div class="block items-end justify-between border-t border-gray-100 pt-4">
            <div>
                <p class="flex items-center text-xs text-gray-400 uppercase">
                    <Banknote size={16} class="mr-1" /> A partir de
                </p>
                <p class="text-xl font-bold text-blue-600">
                    {formatarValor(pacote.ofertas[0]?.preco || 0)}
                </p>
            </div>
            <a
                href="/pacote/{pacote.nome}"
                class="mt-2 block w-full rounded-lg bg-blue-50 py-2 text-center text-sm font-bold text-blue-600 hover:bg-blue-100"
            >
                Detalhes
            </a>
        </div>
    </div>
</div>
