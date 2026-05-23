<script lang="ts">
    import "./layout.css";
    import favicon from "$lib/assets/images/logo_cor.png";

    import { initAuth } from "$lib/auth";

    let { children, data } = $props();

    // Sincroniza o estado do store com os dados do servidor
    $effect(() => {
        initAuth(data.user);
    });
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
