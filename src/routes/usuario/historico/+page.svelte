<script lang="ts">
    import ViagensPage from '../viagens/+page.svelte';
    let { data } = $props();
</script>

<ViagensPage {data} />
