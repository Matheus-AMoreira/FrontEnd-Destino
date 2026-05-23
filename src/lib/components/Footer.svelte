<script lang="ts">
    import {
        Mail,
        MailCheck,
        MapPin,
        MapPinned,
        Phone,
        UserCheck,
    } from 'lucide-svelte';
    import Icon from './Icon.svelte';
    import Image from './Image.svelte';
</script>

<footer class="w-full bg-[#ff944d] px-8 py-10 text-blue-900">
    <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 text-lg md:grid-cols-4">
        <div class="flex flex-col items-start">
            <Image
                name="logo_cor"
                alt="Link para a landingpage"
                style="mb-4 w-65 pt-4 pl-15 select-none"
            />
        </div>

        <div>
            <h3 class="mb-4 flex items-center space-x-2 text-xl font-bold text-blue-700">
                <MapPinned size={24} />
                <span>Navegação</span>
            </h3>
            <ul class="space-y-2">
                <li>
                    <a
                        href="/"
                        class="text-white drop-shadow-md transition hover:text-[#2071b3]"
                    >
                        Início
                    </a>
                </li>
                <li>
                    <a
                        href="/buscar"
                        class="text-white drop-shadow-md transition hover:text-[#2071b3]"
                    >
                        Pacotes
                    </a>
                </li>
                <li>
                    <a
                        href="/auth/login"
                        class="text-white drop-shadow-md transition hover:text-[#2071b3]"
                    >
                        Login
                    </a>
                </li>
                <li>
                    <a
                        href="/auth/register"
                        class="text-white drop-shadow-md transition hover:text-[#2071b3]"
                    >
                        Cadastro
                    </a>
                </li>
            </ul>
        </div>

        <div>
            <h3 class="mb-4 flex items-center space-x-2 text-xl font-bold text-blue-700">
                <MailCheck size={24} />
                <span>Contato</span>
            </h3>
            <ul class="space-y-2 text-white drop-shadow-md">
                <li class="flex items-center space-x-2">
                    <Phone size={20} />
                    <span>(11) 4002-8922</span>
                </li>
                <li class="flex items-center space-x-2">
                    <Mail size={20} />
                    <span>contato@destinoviagens.com</span>
                </li>
                <li class="flex items-center space-x-2">
                    <MapPin size={20} />
                    <span>São Paulo - Lorena</span>
                </li>
            </ul>
        </div>

        <div>
            <h3 class="mb-4 flex items-center space-x-2 text-xl font-bold text-blue-700">
                <UserCheck size={24} />
                <span>Siga-nos</span>
            </h3>
            <div class="flex space-x-4">
                <a
                    href="/"
                    class="flex items-center space-x-2 text-white drop-shadow-md transition hover:text-[#2071b3]"
                >
                    <Icon
                        name="facebook_white"
                        alt="facebook link"
                        size="24px"
                    />
                    <span>Facebook</span>
                </a>
                <a
                    href="/"
                    class="flex items-center space-x-2 text-white drop-shadow-md transition hover:text-[#2071b3]"
                >
                    <Icon
                        name="instagram_white"
                        alt="instagram link"
                        size="24px"
                    />
                    <span>Instagram</span>
                </a>
            </div>
        </div>
    </div>
</footer>
