import api from "#/lib/api";

export interface Usuario {
  id: string;
  nome: string;
  sobreNome: string;
  cpf: string;
  email: string;
  telefone: string;
  perfil?: string;
  valido?: boolean;
  atualização: string;
  cadastro: string;
  senha: string;
}

export interface RegistroUser {
  nome: string;
  sobreNome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
}

interface RegistrationResponse {
  error: boolean;
  mensagem: string;
}

export const cadastrarUsuario = async (
  usuario: RegistroUser | null
): Promise<RegistrationResponse> => {
  if (usuario) {
    try {
      const response = await api.post("api/auth/singup", usuario);
      return response.data;
    } catch (error: any) {
      return { error: true, mensagem: error.response?.data?.mensagem || "Erro ao cadastrar" };
    }
  }
  return { error: true, mensagem: "Usuário inválido" };
};

export const logout = async (): Promise<string> => {
  try {
    const response = await api.post("api/auth/logout");
    return response.data;
  } catch (error: unknown) {
    return "erro";
  }
};

export interface InvalidUsersResponse {
  error: boolean;
  mensagem: string;
  users: Usuario[] | null;
}

export const listInvalidUsers = async (): Promise<InvalidUsersResponse> => {
  try {
    const response = await api.get("/auth/usuarios/invalidos");
    const result: Usuario[] = response.data;

    if (result && result.length > 0) {
      return {
        error: false,
        mensagem: "Usuários encontrados!",
        users: result,
      };
    }
    return {
      error: false,
      mensagem: "Nenhum usuário encontrado para validação!",
      users: [],
    };
  } catch (error) {
    return {
      error: true,
      mensagem: "Não foi possivel chamar a API",
      users: null,
    };
  }
};

export interface ValidarUsuarioResponse {
  error: boolean;
  mensagem: string;
}

export const ValidarUsuario = async (
  userId: string
): Promise<ValidarUsuarioResponse> => {
  try {
    const response = await api.patch(`/auth/usuarios/validar/${userId}`);
    return response.data;
  } catch (error: unknown) {
    return { error: true, mensagem: "Erro inesperado ou API inacessível!" };
  }
};
