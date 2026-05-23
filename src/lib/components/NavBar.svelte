<script lang="ts">
    import {
        History,
        MapPin,
        User as UserIcon,
        ShieldUser,
        ChevronDown,
        LogOut,
        PackageSearch,
        MailCheck,
        CircleArrowRight,
    } from 'lucide-svelte';
    import Image from './Image.svelte';
    import { auth, logout } from '$lib/auth';

    let dropdownOpen = $state(false);

    function toggleDropdown() {
        dropdownOpen = !dropdownOpen;
    }

    function closeDropdown() {
        dropdownOpen = false;
    }
</script>

<header class="bg-[#ff944d] px-8 pt-3 pb-1 shadow-md">
    <div class="mx-auto flex max-w-7xl items-center justify-between">
        <a href="/" class="pl-0 font-bold text-white">
            <div class="flex flex-col items-start">
                <Image
                    name="logo"
                    alt="Link para a landingpage"
                    style="w-25 select-none"
                />
            </div>
        </a>
        <nav class="flex gap-6 pr-0 pl-0 text-lg">
            <a
                href="/buscar"
                class="flex items-center space-x-2 font-bold text-white hover:text-[#2071b3]"
            >
                <PackageSearch size={20} />
                <span>Buscar Pacotes</span>
            </a>
            <a
                href="/contato"
                class="flex items-center space-x-2 font-bold text-white hover:text-[#2071b3]"
            >
                <MailCheck size={20} />
                <span>Contato</span>
            </a>

            {#if $auth.user}
                <div class="group relative flex items-center">
                    <button 
                        class="flex items-center space-x-2 py-2 font-bold text-white transition-colors hover:text-[#2071b3] focus:outline-none"
                        onclick={toggleDropdown}
                    >
                        {#if $auth.user.role === 'ADMINISTRADOR'}
                            <ShieldUser size={20} />
                        {:else}
                            <UserIcon size={20} />
                        {/if}
                        <span>
                            {$auth.user.nome} {$auth.user.sobre_nome}
                        </span>
                        <ChevronDown color="white" size={20} />
                    </button>

                    <div class="dropdown-menu" class:open={dropdownOpen}>
                        <div class="mb-1 border-b border-gray-50 px-4 py-2">
                            <p class="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                Sua Conta
                            </p>
                        </div>

                        {#if $auth.user.role === 'ADMINISTRADOR'}
                            <a
                                href="/admin/dashboard"
                                class="flex items-center space-x-3 px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                onclick={closeDropdown}
                            >
                                <ShieldUser size={18} />
                                <span>Administração</span>
                            </a>
                        {/if}

                        <a
                            href="/usuario/viagens"
                            class="flex items-center space-x-3 px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                            onclick={closeDropdown}
                        >
                            <MapPin size={18} />
                            <span>Minhas Viagens</span>
                        </a>

                        <a
                            href="/usuario/historico"
                            class="flex items-center space-x-3 px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                            onclick={closeDropdown}
                        >
                            <History size={18} />
                            <span>Histórico de Compra</span>
                        </a>

                        <a
                            href="/usuario/perfil"
                            class="flex items-center space-x-3 px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                            onclick={closeDropdown}
                        >
                            <UserIcon size={18} />
                            <span>Editar Perfil</span>
                        </a>

                        <div class="mt-1 border-t border-gray-50 pt-1">
                            <button
                                class="flex w-full items-center space-x-3 px-4 py-3 text-left text-sm font-bold text-red-500 transition-colors hover:bg-red-50"
                                onclick={() => { logout(); closeDropdown(); }}
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            {:else}
                <a
                    href="/auth/login"
                    class="flex items-center space-x-2 font-bold text-white hover:text-[#2071b3]"
                >
                    <CircleArrowRight size={20} />
                    <span>Conecte-se</span>
                </a>
            {/if}
        </nav>
    </div>
</header>

<style>
    .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 50;
        width: 14rem;
        transform-origin: top;
        border-radius: 0.75rem;
        border-width: 1px;
        --tw-border-opacity: 1;
        border-color: rgb(243 244 246 / var(--tw-border-opacity));
        --tw-bg-opacity: 1;
        background-color: rgb(255 255 255 / var(--tw-bg-opacity));
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        --tw-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
        --tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms;
        visibility: hidden;
        opacity: 0;
        --tw-scale-x: 0.95;
        --tw-scale-y: 0.95;
        transform: translate(var(--tw-translate-x, 0), var(--tw-translate-y, 0)) rotate(var(--tw-rotate, 0)) skewX(var(--tw-skew-x, 0)) skewY(var(--tw-skew-y, 0)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
    }

    .dropdown-menu.open {
        visibility: visible;
        opacity: 1;
        --tw-scale-x: 1;
        --tw-scale-y: 1;
        transform: translate(var(--tw-translate-x, 0), var(--tw-translate-y, 0)) rotate(var(--tw-rotate, 0)) skewX(var(--tw-skew-x, 0)) skewY(var(--tw-skew-y, 0)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
    }
</style>
