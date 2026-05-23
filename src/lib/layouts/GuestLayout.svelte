<script lang="ts">
    import type { Snippet } from 'svelte';
    import Footer from '../components/Footer.svelte';
    import Navbar from '../components/NavBar.svelte';

    interface Props {
        children: Snippet;
        title?: string;
    }

    let { children, title }: Props = $props();
</script>

<svelte:head>
    <title>{title ? `${title} - PAULA VIAGENS` : 'PAULA VIAGENS'}</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-linear-to-br from-[#e4f3ff] via-[#ffffff] to-[#e4f3ff]">
    <Navbar />
    <main class="flex flex-1 flex-col">
        {@render children()}
    </main>
    <Footer />
</div>
