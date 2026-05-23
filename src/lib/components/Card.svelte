<script lang="ts">
    import Image from './Image.svelte';

    interface Props {
        title: string;
        description: string;
        imageUrl: string;
        detalharHref: string;
    }

    let { title, description, imageUrl, detalharHref }: Props = $props();
</script>

<div class="m-1 flex w-full transform flex-col overflow-hidden rounded-xl border-2 border-gray-300 bg-white shadow-xl transition hover:scale-[1.02] sm:max-w-sm">
    {#if imageUrl}
        <Image
            name={imageUrl}
            alt="Viagem para {title}"
            style="h-48 w-full object-cover"
        />
    {/if}

    <div class="flex flex-col justify-between p-5">
        <div>
            <h3 class="mb-2 text-xl font-bold text-gray-800">
                {title}
            </h3>
            <p class="mb-4 line-clamp-2 h-10 text-sm text-gray-600">
                {description}
            </p>
        </div>

        <a
            href={detalharHref}
            class="mt-4 w-full cursor-pointer rounded-lg bg-blue-600 px-6 py-2.5 text-center text-white shadow-md transition duration-300 hover:bg-blue-700"
        >
            Saiba Mais...
        </a>
    </div>
</div>
