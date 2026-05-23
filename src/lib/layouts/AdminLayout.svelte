<script lang="ts">
    import Sidebar from '../components/administracao/SideBar.svelte';
    import GuestLayout from './GuestLayout.svelte';

    interface Props {
        children?: any;
        title: string;
    }

    let { children, title }: Props = $props();
</script>

<GuestLayout {title}>
    <div class="flex flex-1 bg-gray-50/50">
        <Sidebar />
        <main class="flex-1 overflow-y-auto p-8">
            {@render children()}
        </main>
    </div>
</GuestLayout>
