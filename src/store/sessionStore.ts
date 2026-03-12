import api from "#/lib/api";
import { Navigate } from "@tanstack/react-router";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserInfo {
  id: string;
  nomeCompleto: string;
  email: string;
  perfil: string;
  accessToken: string;
  expiracaoEmSegundos: number;
}

type LoginParams = {
  email: string;
  senha: string;
};

type UserState = {
  usuario: UserInfo | null;
  isLoged: boolean;
  isLoading: boolean;
  error: string | null;
};

type UserActions = {
  login: (creds: LoginParams) => Promise<{ success: boolean; error?: string }>;
  logout: (shouldRedirect?: boolean) => Promise<void>;
  checkSession: () => Promise<boolean>;
  clearError: () => void;
};

export const useSession = create<UserState & UserActions>()(
  persist(
    (set) => ({
      usuario: null,
      isLoged: false,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      login: async ({ email, senha }) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post("auth/entrar", { email, senha });

          const dadosUsuario = response.data.dados;

          set({
            usuario: dadosUsuario,
            isLoged: true,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } catch (error: any) {
          const mensagemErro =
            error.response?.data?.mensagem || "Falha ao realizar login";

          set({
            usuario: null,
            isLoged: false,
            isLoading: false,
            error: mensagemErro,
          });

          return { success: false, error: mensagemErro };
        }
      },

      logout: async (shouldRedirect = true) => {
        set({ isLoading: true });
        try {
          await api.post("auth/sair", {});
        } catch (error) {
          console.error("Erro ao notificar logout ao servidor", error);
        } finally {
          set({
            usuario: null,
            isLoged: false,
            isLoading: false,
            error: null,
          });

          if (shouldRedirect) {
            Navigate({ to: "/" });
          }
        }
      },

      checkSession: async () => {
        set({ isLoading: true });
        try {
          const response = await api.post("auth/renovar-token", {});

          const data = response.data;

          if (data && !data.erro) {
            set({
              usuario: data.dados,
              isLoged: true,
              isLoading: false,
            });
            return true;
          } else {
            throw new Error("Sessão inválida");
          }
        } catch (error) {
          set({
            usuario: null,
            isLoged: false,
            isLoading: false,
          });
          return false;
        }
      },
    }),
    {
      name: "session-store",
    },
  ),
);
