<script lang="ts">
    import { getImageUrl } from '$lib/assets';

    interface Props {
        name: string;
        alt?: string;
        style?: string;
    }

    let { name, alt, style }: Props = $props();

    let src = $derived(getImageUrl(name));
</script>

<img {src} alt={alt || name || "Image"} class={style} loading="lazy" />
