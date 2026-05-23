import type { Handle } from '@sveltejs/kit';
import { apiFetch } from '$lib/api';
import type { User } from '$lib/types/auth';

export const handle: Handle = async ({ event, resolve }) => {
    const accessToken = event.cookies.get('access_token');

    if (accessToken) {
        try {
            const user = await apiFetch<User>('/auth/me', {}, event.fetch);
            event.locals.user = user;
        } catch (error) {
            console.error('Erro ao carregar usuário no hook:', error);
            event.locals.user = null;
        }
    } else {
        event.locals.user = null;
    }

    return await resolve(event);
};
