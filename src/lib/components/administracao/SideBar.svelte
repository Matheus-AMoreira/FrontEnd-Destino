<script lang="ts">
    import { page } from '$app/state';
    import {
        LayoutDashboard,
        MapPinned,
        Camera,
        Hotel,
        Truck,
        Users,
        ChevronDown,
        Tag,
    } from 'lucide-svelte';
    import Image from '../Image.svelte';

    let isAdminOpen = $state(true);

    const isActive = (path: string) => {
        const url = page.url.pathname;
        if (path === '/admin/dashboard') {
            return url === path;
        }
        return url === path || url.startsWith(`${path}/`);
    };

    const linkClass = (path: string, isSubItem = false) => {
        const active = isActive(path);
        return `
            flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors mb-1
            ${isSubItem ? 'text-sm pl-8' : ''}
            ${
                active
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
            }
        `;
    };
</script>

<aside class="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-white shadow-lg">
    <div class="flex justify-center border-b border-gray-200 p-6">
        <a href="/">
            <Image
                name="logo_cor"
                alt="Paula viagens logo"
                style="max-h-full max-w-full rounded-xl object-contain p-2"
            />
        </a>
    </div>

    <nav class="flex-1 overflow-y-auto p-4">
        <div class="space-y-1">
            <a
                href="/admin/dashboard"
                class={linkClass('/admin/dashboard')}
            >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
            </a>

            <div>
                <button
                    onclick={() => (isAdminOpen = !isAdminOpen)}
                    class="flex w-full items-center justify-between rounded-lg px-4 py-2 font-bold text-gray-800 hover:bg-gray-50"
                >
                    <span class="text-xs tracking-wider uppercase">
                        Opções
                    </span>
                    <ChevronDown
                        size={16}
                        class="transform transition-transform {isAdminOpen ? 'rotate-180' : ''}"
                    />
                </button>

                {#if isAdminOpen}
                    <div class="mt-1 space-y-1">
                        <a
                            href="/admin/pacote"
                            class={linkClass('/admin/pacote', true)}
                        >
                            <MapPinned size={18} />
                            <span>Pacotes de Viagem</span>
                        </a>
                        <a
                            href="/admin/pacotedefoto"
                            class={linkClass('/admin/pacotedefoto', true)}
                        >
                            <Camera size={18} />
                            <span>Pacotes de Fotos</span>
                        </a>

                        <a
                            href="/admin/hotel"
                            class={linkClass('/admin/hotel', true)}
                        >
                            <Hotel size={18} />
                            <span>Hotéis</span>
                        </a>

                        <a
                            href="/admin/transporte"
                            class={linkClass('/admin/transporte', true)}
                        >
                            <Truck size={18} />
                            <span>Transporte</span>
                        </a>
                        <a
                            href="/admin/oferta"
                            class={linkClass('/admin/oferta', true)}
                        >
                            <Tag size={18} />
                            <span>Ofertas</span>
                        </a>
                        <a
                            href="/admin/usuario"
                            class={linkClass('/admin/usuario', true)}
                        >
                            <Users size={18} />
                            <span>Usuários</span>
                        </a>
                    </div>
                {/if}
            </div>
        </div>
    </nav>

    <div class="border-t p-4 text-center text-xs text-gray-400">
        Versão 2.0.0
    </div>
</aside>
