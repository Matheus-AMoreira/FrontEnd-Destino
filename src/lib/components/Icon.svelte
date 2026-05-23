<script lang="ts">
    import { getIconUrl } from '$lib/assets';

    interface Props {
        name: string;
        alt?: string;
        size?: string;
    }

    let { name, alt, size = '24px' }: Props = $props();

    let src = $derived(getIconUrl(name));
</script>

{#if src}
    <img
        {src}
        alt={alt || name || 'Icon'}
        style="width: {size}; height: {size};"
        loading="lazy"
    />
{/if}
