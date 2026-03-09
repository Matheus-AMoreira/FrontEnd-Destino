import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import api from "#/lib/api";
import AuthLogo from "@/components/auth/AuthLogo";
import CampoInput from "@/components/auth/CampoInput";
import CustomModal, { type Modal } from "@/components/CustomModal";
import { z } from "zod";
import { formatarCPF, formatarTelefone } from "@/utils/auth/FormValidation";
import { type RegistroUser } from "@/utils/auth/authFunctions";

export const Route = createFileRoute("/(auth)/cadastro")({
  component: Cadastro,
});

export default function Cadastro() {
  const [usuario, setUsuario] = useState<RegistroUser>({
    nome: "",
    sobreNome: "",
    cpf: "",
    telefone: "",
    email: "",
    senha: "",
  });

  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cadastroSucesso, setCadastroSucesso] = useState(false);
  const [formValido, setFormValido] = useState(false);
  const [loading, setLoading] = useState(false);

  const [erros, setErros] = useState({
    nome: false,
    sobreNome: false,
    cpf: false,
    telefone: false,
    email: false,
    senha: false,
    confirmarSenha: false,
  });

  const [modal, setModal] = useState<Modal>({
    show: false,
    mensagem: "",
    url: null,
  });

  const schemaCadastro = z
    .object({
      nome: z
        .string()
        .min(3, "Mínimo 3 caracteres")
        .regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]*$/, "Apenas letras permitidas"),
      sobreNome: z
        .string()
        .min(3, "Mínimo 3 caracteres")
        .regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]*$/, "Apenas letras permitidas"),
      cpf: z.string().refine((val) => {
        const cpfLimpo = val.replace(/\D/g, "");
        return cpfLimpo.length === 11;
      }, "CPF deve ter 11 dígitos"),
      telefone: z.string().refine((val) => {
        const telLimpo = val.replace(/\D/g, "");
        return telLimpo.length >= 10 && telLimpo.length <= 11;
      }, "Telefone deve ter 10 ou 11 dígitos"),
      email: z.string().email("E-mail inválido"),
      senha: z
        .string()
        .min(8, "Mínimo 8 caracteres")
        .regex(/[A-Z]/, "Uma letra maiúscula")
        .regex(/[a-z]/, "Uma letra minúscula")
        .regex(/\d/, "Um número")
        .regex(/[@$!%*?&#\-_]/, "Um caractére especial"),
      confirmarSenha: z.string().min(1, "Confirme a senha"),
    })
    .refine((data) => data.senha === data.confirmarSenha, {
      message: "As senhas não coincidem",
      path: ["confirmarSenha"],
    });

  // Lógica para verificar requisitos individuais da senha para a UI
  const requisitosSenha = [
    { label: "Mínimo de 8 caracteres", valido: usuario.senha.length >= 8 },
    { label: "Uma letra maiúscula", valido: /[A-Z]/.test(usuario.senha) },
    { label: "Uma letra minúscula", valido: /[a-z]/.test(usuario.senha) },
    { label: "Um número", valido: /\d/.test(usuario.senha) },
    {
      label: "Um caractere especial (@$!%*?&#-_)",
      valido: /[@$!%*?&#\-_]/.test(usuario.senha),
    },
  ];

  const handleChange = (
    campo: keyof RegistroUser | "confirmarSenha",
    valor: string,
  ) => {
    let valorFinal = valor;

    // Maintain formatting utility overrides if applicable
    if (campo === "cpf") valorFinal = formatarCPF(valor);
    if (campo === "telefone") valorFinal = formatarTelefone(valor);
    if (campo === "nome" || campo === "sobreNome") {
      valorFinal = valor.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, ""); // Apenas letras
    }

    // Update local state early
    if (campo === "confirmarSenha") {
      setConfirmarSenha(valorFinal);
    } else {
      setUsuario((prev) => ({ ...prev, [campo]: valorFinal }));
    }
  };

  useEffect(() => {
    const dataToValidate = {
      ...usuario,
      confirmarSenha,
    };

    const resultado = schemaCadastro.safeParse(dataToValidate);

    if (resultado.success) {
      setFormValido(true);
      setErros({
        nome: false,
        sobreNome: false,
        cpf: false,
        telefone: false,
        email: false,
        senha: false,
        confirmarSenha: false,
      });
    } else {
      setFormValido(false);
      // Map Zod errors to boolean fields for Input visibility
      const invalidFields = resultado.error.format();
      setErros({
        nome: !!invalidFields.nome,
        sobreNome: !!invalidFields.sobreNome,
        cpf: !!invalidFields.cpf,
        telefone: !!invalidFields.telefone,
        email: !!invalidFields.email,
        senha: !!invalidFields.senha,
        confirmarSenha: !!invalidFields.confirmarSenha,
      });
    }
  }, [usuario, confirmarSenha]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!formValido) return;

    setLoading(true);

    const usuarioParaEnvio = {
      nome: usuario.nome,
      sobreNome: usuario.sobreNome,
      email: usuario.email,
      senha: usuario.senha,
      cpf: usuario.cpf.replace(/\D/g, ""), // Backend Jackson now parses strings
      telefone: usuario.telefone.replace(/\D/g, ""), // Backend Jackson now parses strings
    };

    try {
      setLoading(true);

      await api.post("/auth/cadastrar", usuarioParaEnvio);

      setCadastroSucesso(true);
      setModal({
        show: true,
        mensagem:
          "Cadastro efetuado com sucesso!\n Aguarde o email de confirmação.",
        url: "/",
      });
      reset();
    } catch (error: any) {
      console.error(error);
      const mensagemErro =
        error.response?.data?.mensagem ||
        "Erro de conexão. Verifique sua internet.";
      setModal({
        show: true,
        mensagem: mensagemErro,
        url: null,
      });
      setCadastroSucesso(false);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setUsuario({
      nome: "",
      sobreNome: "",
      cpf: "",
      telefone: "",
      email: "",
      senha: "",
    });
    setConfirmarSenha("");
    setErros({
      nome: false,
      sobreNome: false,
      cpf: false,
      telefone: false,
      email: false,
      senha: false,
      confirmarSenha: false,
    });
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-linear-to-br from-[#fff6ea] via-[#ffffff] to-[#fff6ea] overflow-y-auto py-8">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl gap-6 px-4">
        <div className="bg-white/95 p-6 rounded-xl shadow-2xl w-full max-w-md text-center z-10 backdrop-blur-sm border border-gray-100">
          <h1 className="text-[#333] mb-6 text-2xl font-bold">Cadastre-se</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-left">
              <CampoInput
                label="Nome"
                type="text"
                value={usuario.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                required
                minLength={3}
                maxLength={20}
                isError={erros.nome && usuario.nome.length > 0}
                isSuccess={cadastroSucesso}
                placeholder="Nome"
              />
              <CampoInput
                label="Sobrenome"
                type="text"
                value={usuario.sobreNome}
                onChange={(e) => handleChange("sobreNome", e.target.value)}
                required
                minLength={3}
                maxLength={20}
                isError={erros.sobreNome && usuario.sobreNome.length > 0}
                isSuccess={cadastroSucesso}
                placeholder="Sobrenome"
              />

              <CampoInput
                label="CPF"
                type="text"
                value={usuario.cpf}
                onChange={(e) => handleChange("cpf", e.target.value)}
                required
                maxLength={14}
                isError={erros.cpf && usuario.cpf.length > 0}
                isSuccess={cadastroSucesso}
                placeholder="000.000.000-00"
              />
              <CampoInput
                label="Telefone"
                type="tel"
                value={usuario.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
                required
                maxLength={15}
                isError={erros.telefone && usuario.telefone.length > 0}
                isSuccess={cadastroSucesso}
                placeholder="(00) 00000-0000"
              />

              <div className="col-span-2">
                <CampoInput
                  label="E-mail"
                  type="email"
                  value={usuario.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  isError={erros.email && usuario.email.length > 0}
                  isSuccess={cadastroSucesso}
                  placeholder="exemplo@email.com"
                />
              </div>

              <div className="col-span-2">
                <CampoInput
                  label="Senha"
                  type="password"
                  value={usuario.senha}
                  onChange={(e) => handleChange("senha", e.target.value)}
                  required
                  isError={erros.senha && usuario.senha.length > 0}
                  isSuccess={cadastroSucesso}
                  placeholder="Senha"
                />
              </div>

              <div className="col-span-2">
                <CampoInput
                  label="Confirmar Senha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) =>
                    handleChange("confirmarSenha", e.target.value)
                  }
                  required
                  isError={erros.confirmarSenha && confirmarSenha.length > 0}
                  isSuccess={cadastroSucesso}
                  placeholder="Repita a senha"
                />
              </div>

              {usuario.senha.length > 0 && (
                <div className="col-span-2 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    Requisitos da senha:
                  </p>
                  <ul className="text-xs space-y-1">
                    {requisitosSenha.map((req, index) => (
                      <li
                        key={index}
                        className={`flex items-center gap-2 ${
                          req.valido
                            ? "text-green-600 font-medium"
                            : "text-gray-400"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 flex items-center justify-center rounded-full text-[10px] ${
                            req.valido ? "bg-green-100" : "bg-gray-200"
                          }`}
                        >
                          {req.valido ? "✓" : "•"}
                        </span>
                        {req.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`
                w-full py-3 rounded-md text-sm font-bold mt-4 transition-all duration-300 shadow-md
                ${
                  formValido
                    ? "bg-[#ff7300] hover:bg-[#cc5c00] text-white active:scale-[0.98] cursor-pointer hover:shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
              disabled={!formValido || loading}
            >
              {loading ? "Processando..." : "CADASTRAR"}
            </button>
          </form>

          <p className="mt-6 text-sm text-[#666]">
            Já possui uma conta?
            <Link
              to="/entrar"
              className="text-[#007bff] no-underline font-semibold hover:underline ml-1"
            >
              Faça o Login
            </Link>
          </p>
          <p className="mt-6 text-sm text-[#666]">
            Voltar para a
            <Link
              to="/"
              className="text-[#007bff] no-underline font-bold hover:underline ml-1"
            >
              Tela Inicial
            </Link>
          </p>
        </div>

        <AuthLogo />
      </div>

      {modal.show && <CustomModal modalData={modal} setModal={setModal} />}
    </div>
  );
}
